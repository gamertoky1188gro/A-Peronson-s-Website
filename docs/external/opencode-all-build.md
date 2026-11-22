==> ./client/effect.mdx <==
---
title: "Effect client"
description: "Call the OpenCode HTTP API from Effect with @opencode/client/effect, which returns typed Effects and Streams."
---

`@opencode/client/effect` is the Effect-native client for the OpenCode HTTP API. It returns typed Effects and Streams
and decodes responses into OpenCode schema values.

```sh
bun add @opencode/client effect@4.0.1
```

## Create a client

Create a client with the server URL, then call methods grouped by API resource.

```ts
import { AbsolutePath, Location, OpenCode } from "@opencode/client/effect"
import { Effect } from "effect"
import { FetchHttpClient } from "effect/http"

const program = Effect.gen(function* () {
  const client = yield* OpenCode.make({ baseUrl: "http://localhost:4096" })
  const session = yield* client.session.create({
    location: Location.Ref.make({ directory: AbsolutePath.make("/workspace") }),
  })
  yield* client.session.prompt({
    sessionID: session.id,
    text: "Review the current changes",
  })
  return session
})

const session = await Effect.runPromise(program.pipe(Effect.provide(FetchHttpClient.layer)))
```

## Headers and requests

Configure default headers on the supplied `HttpClient`. Native operations use
normal Effect interruption for cancellation. RPC methods additionally accept
per-call location, header, and signal options.

{/* prettier-ignore */}
```ts
import { HttpClient, HttpClientRequest } from "effect/http"

const httpClient = yield* HttpClient.HttpClient
const client = yield* OpenCode.make({ baseUrl: "https://opencode.example.com" }).pipe(
  Effect.provideService(
    HttpClient.HttpClient,
    HttpClient.mapRequest(httpClient, (request) =>
      HttpClientRequest.setHeaders(request, { authorization: `Bearer ${process.env.OPENCODE_TOKEN}` }),
    ),
  ),
)

const sessions = yield* client.session.list()
```

## Stream events

Streaming operations such as `event.subscribe()` and `experimental.session.log()` return Effect Streams.

{/* prettier-ignore */}
```ts
import { Effect, Stream } from "effect"

yield* client.event
  .subscribe()
  .pipe(Stream.runForEach((event) => Effect.logInfo("OpenCode event", { type: event.type })))
```

Native and RPC event Streams share one lazy connection per client. Constructing
a Stream does not connect; consuming it does. Stopping one consumer leaves others
running, and the last consumer leaving closes the source. Source EOF or failure
ends current subscriptions without automatic retry or replay. Late native consumers
receive the current connection marker before live events.

## Plugin RPC

Use the same shared contract as Promise clients and server plugins:

{/* prettier-ignore */}
```ts
import { Acme } from "opencode-acme-plugin/rpc"

const acme = client.rpc(Acme)
const result = yield* acme.search({ query: "hello" }, { location: { directory: "/workspace" } })

yield* acme.events
  .subscribe("updated")
  .pipe(
    Stream.runForEach((event) =>
      Effect.logInfo("Plugin event", { type: event.type, location: event.location, text: event.data.text }),
    ),
  )
```

Method arguments and results are inferred from the contract. The second optional
argument holds `location`, `signal`, and `headers`; omitted location uses the
normal request defaults. Calls are interrupted with their consuming Effect.
Method error maps are inferred in the Effect error channel. Declared errors are
decoded through their data schemas. The typed subclient removes the generic HTTP
RPC error wrapper; reserved `rpc.*` types identify framework failures.

RPC events are typed Streams, not callback-style `on` listeners. They receive the
RPC's events from all locations, each with required `location` and a normal
prefixed type such as `rpc.acme.updated`. This differs from server-plugin handles,
which are fixed to their own location. See [Effect plugin RPC](/build/plugins/effect/rpc) for
definitions, schemas, registration, and live subscription semantics.

## Local background service

The Node-only `@opencode/client/effect/service` entrypoint discovers, starts, authenticates, and stops the local
background service as Effects.

```sh
bun add @effect/platform-node@4.0.1
```

Create an authenticated client for the ensured service.

```ts
import { NodeFileSystem } from "@effect/platform-node"
import { OpenCode } from "@opencode/client/effect"
import { Service } from "@opencode/client/effect/service"
import { Effect } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/http"

const program = Effect.gen(function* () {
  const endpoint = yield* Service.ensure()
  const httpClient = yield* HttpClient.HttpClient
  const client = yield* OpenCode.make({ baseUrl: endpoint.url }).pipe(
    Effect.provideService(
      HttpClient.HttpClient,
      HttpClient.mapRequest(httpClient, (request) =>
        HttpClientRequest.setHeaders(request, Service.headers(endpoint) ?? {}),
      ),
    ),
  )
  return yield* client.server.info()
})

const health = await Effect.runPromise(
  program.pipe(Effect.provide(FetchHttpClient.layer), Effect.provide(NodeFileSystem.layer)),
)
```

Discover without starting, or stop the exact registered service.

{/* prettier-ignore */}
```ts
const endpoint = yield* Service.discover()
yield* Service.stop()
```

==> ./client/index.mdx <==
---
title: "JavaScript"
description: "Connect your application to an OpenCode server with @opencode/client, the TypeScript client for the OpenCode HTTP API."
---

`@opencode/client` is the TypeScript client for the OpenCode HTTP
API. Use it when your application connects to an OpenCode server over the
network. Its native types and methods are generated from the same contract as the
[API reference](/api). Plugin RPC types come from imported RPC definitions.

## Install

```sh
bun add @opencode/client
```

## Create a client

Create a client with the server URL, then call methods grouped by API resource:

```ts
import { OpenCode } from "@opencode/client"

const client = OpenCode.make({
  baseUrl: "http://localhost:4096",
})

const session = await client.session.create({
  location: { directory: "/workspace" },
})

await client.session.prompt({
  sessionID: session.id,
  text: "Review the current changes",
})
```

## Headers and requests

Pass default authentication or application headers to `OpenCode.make` with
`headers`. You can also supply a custom `fetch` implementation. Each operation
accepts request options as its final argument for an `AbortSignal` or
per-request headers. Event subscriptions are the exception: they accept only
subscriber-local cancellation and use the base client's headers.

```ts
const client = OpenCode.make({
  baseUrl: "https://opencode.example.com",
  headers: {
    authorization: `Bearer ${process.env.OPENCODE_TOKEN}`,
  },
})

await client.session.list(undefined, {
  signal: AbortSignal.timeout(10_000),
})
```

## Stream events

Streaming endpoints return async iterables:

```ts
for await (const event of client.event.subscribe()) {
  console.log(event.type)
}
```

Native and RPC event subscribers share one lazy connection per client. Client,
handle, and iterable creation open no event connection; consumption starts it.
Breaking iteration or aborting a subscriber ends only that iterator. The last
subscriber leaving closes the connection. The shared source waits for active
subscribers to accept each event; consumers should buffer before performing slow work.

Subscriptions are live-only, with no replay or automatic reconnection. A source
failure ends current subscriptions; subscribe again after recovery. A late native
subscriber receives the current `server.connected` marker, not past business events.

Pass `types` to receive only some event types. The events are typed to match, and
`server.connected` always comes through so a filtered subscriber still knows when to resync.
Filtering happens on the shared connection, inside the client.

```ts
for await (const event of client.event.subscribe({ types: ["config.updated"] })) {
  // event.type is "config.updated" | "server.connected"
}
```

## Plugin RPC

Import a plugin's shared contract and pass it to `client.rpc`:

```ts
import { OpenCode } from "@opencode/client"
import { Acme } from "opencode-acme-plugin/rpc"

const acme = client.rpc(Acme)
const result = await acme.search(
  { query: "hello" },
  { location: { directory: "/workspace" }, signal: AbortSignal.timeout(10_000) },
)

const unsubscribe = acme.events.on("updated", (event) => {
  console.log(event.type, event.location.directory, event.data.text)
})
```

The second optional method argument holds `location`, `signal`, and `headers`,
separate from the plugin-defined input. Omitted location follows native request
defaults: base location headers, then the server's working directory. No location
is selected when constructing the subclient.

Methods infer arguments and results from the definition. Schema parsing belongs
to the contract boundary; callers send the accepted input representation, while
handlers receive parsed values. The Promise client accepts Standard Schema or
plain JSON Schema definitions and does
not run schema parsers locally: the server returns already parsed and transformed
output. Effect Schema definitions require the Effect client.

Declared method errors reject like errors from other Promise client endpoints,
and caught errors remain untyped. Generic HTTP RPC error wrappers are removed by
the typed subclient. Reserved `rpc.*` framework failures remain plain RPC failures,
while unrelated authentication, transport, and protocol errors keep their normal
client representations.

RPC subscriptions use local names and receive that RPC's events across all
locations. Inspect the required `event.location` to filter them. `events.subscribe`
matches the native async iterable API:

```ts
for await (const event of acme.events.subscribe("updated")) {
  console.log(event.data.text)
}
```

`events.on` is a convenience wrapper over the same source. It returns unsubscribe;
async callbacks are awaited sequentially. Callback or source failures are logged
and end that listener. Native and typed subscriptions receive the same normal
`rpc.<rpcID>.<event>` envelope with direct object event data. Live subscriptions
do not replay missed events.

The server plugin must be configured and implement the RPC; importing a
definition does not register it. See [plugin RPC](/build/plugins/rpc) for the
definition and registration API. Any HTTP client can also invoke the generic
`POST /api/rpc/{rpcID}/{method}` route with `{ "input": ... }` and receive
`{ "output": ... }`. Omitted input/output fields represent no value.

## Local background service

The main client entrypoints are browser-compatible and do not include local
process management. In a Node application, import the native Promise service
API from `@opencode/client/service`.

- `Service.discover()` returns a healthy registered endpoint without starting
  a process.
- `Service.ensure()` returns a compatible service, starting one when needed.
- `Service.stop()` stops the exact registered service instance.
- `Service.headers(endpoint)` creates the authentication headers for a client.

```ts
import { OpenCode } from "@opencode/client"
import { Service } from "@opencode/client/service"

const endpoint = await Service.ensure()
const client = OpenCode.make({
  baseUrl: endpoint.url,
  headers: Service.headers(endpoint),
})

const info = await client.server.info()
```

`Service.ensure()` accepts an optional registration file, version, service
command, and `onStart` callback. `version` accepts either an exact value or a
compatibility predicate:

```ts
const endpoint = await Service.ensure({
  file: "/var/run/opencode/service.json",
  version: (version) => version.startsWith("2."),
  command: ["opencode", "serve", "--service"],
  onStart(reason, previousVersion) {
    console.log(reason, previousVersion)
  },
})
```

Omit these options to use the standard registration path and
`opencode serve --service` command.

==> ./index.mdx <==
---
title: "Build on OpenCode"
description: "Build on OpenCode with plugins, the TypeScript client for its HTTP API, or the SDK that embeds it in your application."
---

OpenCode is used by millions every day. Build on top of it to create your own
applications, integrations, and agent experiences without starting from
scratch.

We also offer Effect APIs for [plugins](/build/plugins/effect),
[clients](/build/client/effect), and [embedded apps](/build/sdk/effect).

<CardGroup cols={1}>
  <Card title="Extend OpenCode" href="/build/plugins">
    Build plugins that add tools, integrations, commands, agents, and custom behavior while keeping the rest of OpenCode
    intact.
  </Card>
  <Card title="Run it as a server" href="/build/client">
    Connect to OpenCode with the same client used by the TUI and desktop app, then build any interface, workflow, or
    agent experience around it.
  </Card>
  <Card title="Embed it" href="/build/sdk">
    Embed OpenCode directly into your application and build a completely custom agent, interface, or developer product
    around it.
  </Card>
</CardGroup>

==> ./plugins/cli.mdx <==
---
title: "Building TUI plugins"
description: "Build the TUI part of an OpenCode plugin for the terminal UI using @opencode/plugin/tui."
---

TUI plugins extend the terminal UI with commands, routes, slots, Markdown renderers, notifications, and local state. A
TUI plugin is the `./tui` part of a [plugin package](/build/plugins), usually beside a [server
part](/build/plugins/server).

```ts title="src/tui.tsx"
import { Plugin } from "@opencode/plugin/tui"

export default Plugin.define({
  id: "acme.cli",
  setup(context) {
    context.ui.toast.show({ message: "TUI plugin loaded", variant: "success" })
  },
})
```

Import `@opencode/plugin/tui` directly. OpenCode resolves this import at runtime, so local TUI plugins do not need an
absolute path to an OpenCode checkout.

## Context

`setup` receives configuration, app metadata, the current location, the OpenCode client, cached data, theme tokens, the
OpenTUI renderer, and the UI APIs documented below.

```ts
setup(context) {
  const compact = context.options.compact === true
  const location = context.location ?? context.data.location.default()
  const version = context.app.version
  const channel = context.app.channel
  const client = context.client
  const renderer = context.renderer
  const theme = context.theme
}
```

Return a cleanup function for resources owned by the plugin.

```ts
setup(context) {
  const stop = context.data.on("session.execution.succeeded", () => {})
  return () => stop()
}
```

## Client

`context.client` is the generated OpenCode client and can call the connected server, including a remote server.

```ts
const response = await context.client.plugin.list({
  location: context.location ?? context.data.location.default(),
})
const plugins = response.data
```

## Events

Use `data.on` for one typed event or `data.listen` for every server event; both return an unsubscribe function.

```ts
const stopPermission = context.data.on("permission.asked", (event) => {
  context.ui.toast.show({ message: `Permission ${event.data.id}` })
})
const stopAll = context.data.listen(({ details }) => console.log(details.type))

return () => {
  stopPermission()
  stopAll()
}
```

## Sessions

Session data exposes list, lookup, hierarchy, cost, status, synchronization, and invalidation.

```ts
const sessions = context.data.session.list()
const session = context.data.session.get(sessionID)
const rootID = context.data.session.root(sessionID)
const familyIDs = context.data.session.family(sessionID)
const cost = context.data.session.cost(sessionID)
const status = context.data.session.status(sessionID)
await context.data.session.sync(sessionID)
context.data.session.invalidate(sessionID)
```

Pending inbox items and messages have list, lookup, sync, and invalidate APIs.

```ts
await context.data.session.pending.sync(sessionID)
const pending = context.data.session.pending.list(sessionID)
context.data.session.pending.invalidate(sessionID)

await context.data.session.message.sync(sessionID)
const messages = context.data.session.message.list(sessionID)
const message = context.data.session.message.get(sessionID, messageID)
context.data.session.message.invalidate(sessionID)
```

Permission requests can be read and refreshed for a session.

```ts
await context.data.session.permission.sync(sessionID)
const requests = context.data.session.permission.list(sessionID) ?? []
context.data.session.permission.invalidate(sessionID)
```

Forms can be listed, refreshed, replied to, or cancelled at a location.

```ts
import type { SessionFormCancelInput, SessionFormReplyInput } from "@opencode/client"

async function handleForm(reply: SessionFormReplyInput, cancel: SessionFormCancelInput) {
  const location = context.location
  await context.data.session.form.sync(sessionID, location)
  const forms = context.data.session.form.list(sessionID, location) ?? []
  await context.data.session.form.reply(reply, location)
  await context.data.session.form.cancel(cancel, location)
  context.data.session.form.invalidate(sessionID, location)
}
```

## Projects and shells

Projects and saved permissions support list, lookup, sync, and invalidate operations.

```ts
await context.data.project.sync()
const projects = context.data.project.list()
const project = context.data.project.get(projectID)
context.data.project.invalidate()

await context.data.project.permission.sync(projectID)
const saved = context.data.project.permission.list(projectID) ?? []
context.data.project.permission.invalidate(projectID)
```

Shell data supports location-scoped list, lookup, sync, and invalidate operations.

```ts
await context.data.shell.sync(context.location)
const shells = context.data.shell.list(context.location)
const shell = context.data.shell.get(shellID)
context.data.shell.invalidate(context.location)
```

## Location data

Location state exposes the default location and refresh controls.

```ts
const location = context.data.location.default()
await context.data.location.sync(location)
context.data.location.invalidate(location)
```

Version-control state exposes repository information at a location.

```ts
await context.data.location.vcs.sync(context.location)
const vcs = context.data.location.vcs.info(context.location)
const branch = vcs?.branch.current
context.data.location.vcs.invalidate(context.location)
```

Agents, commands, integrations, models, providers, references, skills, and MCP data share `list`, `sync`, and
`invalidate` methods.

```ts
const location = context.location
await Promise.all([
  context.data.location.agent.sync(location),
  context.data.location.command.sync(location),
  context.data.location.integration.sync(location),
  context.data.location.model.sync(location),
  context.data.location.provider.sync(location),
  context.data.location.reference.sync(location),
  context.data.location.skill.sync(location),
  context.data.location.mcp.server.sync(location),
  context.data.location.mcp.resource.sync(location),
])

const agents = context.data.location.agent.list(location) ?? []
const commands = context.data.location.command.list(location) ?? []
const integrations = context.data.location.integration.list(location) ?? []
const models = context.data.location.model.list(location) ?? []
const providers = context.data.location.provider.list(location) ?? []
const references = context.data.location.reference.list(location) ?? []
const skills = context.data.location.skill.list(location) ?? []
const servers = context.data.location.mcp.server.list(location) ?? []
const resources = context.data.location.mcp.resource.list(location) ?? []

context.data.location.model.invalidate(location)
```

## Attention

Attention requests can show a system notification, play a configured sound, or do both based on terminal focus.

```ts
const result = await context.attention.notify({
  title: "OpenCode",
  message: "Session done",
  notification: { when: "blurred" },
  sound: { name: "done", volume: 0.5, when: "always" },
})
console.log(result.ok, result.notification, result.sound, result.skipped)
```

## Theme and renderer

Use semantic theme tokens with OpenTUI elements and pass `context.renderer` to renderer-specific helpers.

```tsx
const Status = () => <text fg={context.theme.text.base}>Ready</text>
const renderer = context.renderer
```

An OpenTUI resource that the renderer draws needs `context.renderer.nativeScene` as its owner. For example, `<markdown>`
and `<code>` need a `SyntaxStyle`. Destroy the resource when the renderer is idle, after the last frame that draws it.

```tsx
import { SyntaxStyle } from "@opentui/core"

const style = SyntaxStyle.fromStyles({ default: { fg: context.theme.text.base } }, context.renderer.nativeScene)
context.ui.slot({ append: "home.footer", render: () => <markdown content="Ready" syntaxStyle={style} /> })
return () => context.renderer.idle().then(() => style.destroy())
```

To read the layout style of a renderable, call the method with the Yoga Node getter's name, such as
`box.getPadding(Yoga.Edge.Bottom)` or `box.getMaxWidth()`. Host renderables are not part of the plugin API. Their
structure and styles can change in any release.

### Plugins built for OpenTUI 0.5

OpenCode runs plugins with its own OpenTUI. Since OpenTUI 0.6:

- `SyntaxStyle.create()`, `SyntaxStyle.fromStyles()`, `SyntaxStyle.fromTheme()`, `TextBuffer.create()`, and
  `EditBuffer.create()` take an owner as their last argument. `OptimizedBuffer.create()` takes it in the `owner` option.
  Pass `context.renderer.nativeScene`. OpenTUI 0.5 ignores the extra argument, so the plugin still runs on older
  OpenCode releases.
- `generateSyntax()` from `@opencode/theme/tui` takes the owner as its second argument:
  `generateSyntax(context.theme, context.renderer.nativeScene)`. Older `@opencode/theme` versions build the style
  without an owner, so update the package too.
- `getLayoutNode()` is removed. Replace `getLayoutNode().getMaxWidth()` and the other style getters with the
  renderable method of the same name, on OpenTUI 0.6.5 or later. Replace `getComputedLayout()` and the other computed
  position and size getters with `getLayout()`, and `markDirty()` with `invalidateIntrinsicSize()`. Computed padding,
  margin, and border have no replacement, and `getPadding(edge)` reads only the padding set for that edge. To restore a
  style that a getter reports as unset (`Unit.Undefined`), assign `undefined` to the property, on OpenTUI 0.6.6 or
  later.

The [OpenTUI 0.6.0 release notes](https://opentui.com/docs/releases/0.6.0) list every change.

## Solid components

Use `usePlugin` to access the current context inside JSX rendered by a route, dialog, or slot.

```tsx
import { usePlugin } from "@opencode/plugin/tui"

function Status() {
  const context = usePlugin()
  return <text fg={context.theme.text.base}>{context.app.version}</text>
}
```

## Markdown

Register a fenced-code renderer by language; the returned function unregisters it.

```ts
const unregister = context.markdown.registerCodeBlockRenderer("acme", (_token, render) => render.defaultRender())
return unregister
```

## Commands and keymaps

Register palette, slash, and keyboard commands in a reactive keymap layer.

```ts
context.keymap.layer(() => ({
  mode: "global",
  priority: 10,
  commands: [
    {
      id: "acme.status",
      title: "Show Acme status",
      group: "Acme",
      bind: "ctrl+g",
      palette: true,
      slash: { name: "acme", aliases: ["status"], arguments: true },
      enabled: () => true,
      suggested: true,
      run: async (input) => context.ui.toast.show({ message: input ?? "Ready" }),
    },
  ],
  bindings: ["acme.status"],
}))
```

Call `layer` from `setup`, including after an `await`, or from a component. Each layer is removed at the first of these:

- The plugin is disabled, reloaded, or fails setup.
- The component or reactive computation that created it, such as a slot, route, or dialog, is disposed.

The layer factory must be pure. OpenCode evaluates it once without dependency tracking to validate the initial command shape, then reactively. Initial command-shape errors, such as a palette command without an ID, throw from `layer()`. OpenTUI handles binding-parse errors. Errors from later reactive updates follow Solid's error handling.

```ts
async setup(context) {
  const settings = await loadSettings()
  context.keymap.layer(() => ({
    mode: "global",
    commands: [{ id: "acme.sync", title: "Sync Acme", palette: true, run: () => sync(settings) }],
  }))
}
```

A layer may target one OpenTUI renderable and can return `false` from a command to continue keyboard dispatch.

```ts
context.keymap.layer(() => ({
  target: () => panel,
  commands: [{ bind: "escape", run: (_input, event) => (event ? false : undefined) }],
}))
```

Dispatch commands, inspect shortcuts and command state, or push a temporary input mode.

```ts
context.keymap.dispatch("acme.status", "verbose")
const shortcuts = context.keymap.shortcuts("acme.status")
const commands = context.keymap.commands()
const pending = context.keymap.pending()
const active = context.keymap.active()
const currentMode = context.keymap.mode.current()
const popMode = context.keymap.mode.push("acme-search")
popMode()
```

## Storage

Durable storage persists JSON across restarts and synchronizes across TUI instances.

```ts
const [settings, updateSettings] = context.storage.store("settings", {
  initial: { compact: false },
})
await updateSettings((draft) => {
  draft.compact = true
})
```

Memory storage survives plugin reloads but is discarded when the TUI exits.

```ts
const [state, updateState] = context.storage.memory("state", {
  initial: { count: 0 },
})
updateState((draft) => {
  draft.count++
})
```

## Dialogs and toasts

Use promise-based dialogs for alerts, confirmations, text input, and selection.

```ts
await context.ui.dialog.alert({ title: "Acme", message: "Ready" })
const confirmed = await context.ui.dialog.confirm({
  title: "Continue?",
  message: "Run the Acme action?",
  label: { confirm: "Run", cancel: "Cancel" },
})
const name = await context.ui.dialog.prompt({ title: "Name", placeholder: "release" })
const mode = await context.ui.dialog.select({
  title: "Mode",
  current: "safe",
  options: [
    { title: "Safe", value: "safe", description: "Ask before changes" },
    { title: "Fast", value: "fast", disabled: false, category: "Advanced" },
  ],
})
```

### Select search

Pass `search` to own matching and result order. It runs for every query, including the empty one, and receives only enabled options. Results are listed in the returned order, with each category shown inline.

```ts
const project = await context.ui.dialog.select({
  title: "Projects",
  options: [
    { title: "Alpha", value: "alpha", category: "Recent" },
    { title: "Beta", value: "beta", category: "Pinned" },
  ],
  search: (query, options) =>
    options
      .filter((option) => option.title.toLowerCase().includes(query.toLowerCase()))
      .toSorted((left, right) => right.title.localeCompare(left.title)),
})
```

### Select actions

Actions appear in the footer and run from their keyboard binding, a click, or Tab focus followed by Enter. By default they receive the selected value and are unavailable without a selection. Use `selection: "none"` for actions that need no selection.

```ts
await context.ui.dialog.select({
  title: "Projects",
  options: [{ title: "Alpha", value: "alpha" }],
  actions: [
    { bind: "ctrl+o", title: "Inspect", onTrigger: (value) => context.ui.toast.show({ message: value }) },
    { bind: "ctrl+a", title: "Close", side: "right", selection: "none", onTrigger: () => context.ui.dialog.clear() },
  ],
})
```

- An action does not close the dialog or settle the promise.
- Enter or clicking an option resolves the selected value.
- Escape, `clear()`, or showing another dialog resolves `undefined`.
- Do not bind `ctrl+n` or `ctrl+p`. The dialog reserves them for navigation, and its own bindings take precedence.

Custom JSX dialogs can set their size and close themselves.

```tsx
context.ui.dialog.set({ size: "large", centered: true })
context.ui.dialog.show(
  () => (
    <box>
      <text>Acme</text>
    </box>
  ),
  () => console.log("closed"),
)
context.ui.dialog.clear()
```

Toasts support title, message, variant, and duration.

```ts
context.ui.toast.show({
  title: "Acme",
  message: "Saved",
  variant: "success",
  duration: 3000,
})
```

## Routes and tabs

Register a JSX route, inspect the current route, and navigate to home, a session, or the plugin page.

```tsx
const unregister = context.ui.router.register({
  name: "dashboard",
  render: ({ data }) => <text>{String(data?.title ?? "Acme")}</text>,
})
const current = context.ui.router.current()
context.ui.router.navigate({ type: "plugin", name: "dashboard", data: { title: "Status" } })
context.ui.router.navigate({ type: "session", sessionID })
context.ui.router.navigate({ type: "home" })
return unregister
```

Tabs can be listed, opened, focused, moved, and closed when session tabs are enabled. `open` leaves focus unchanged;
`focus` opens the tab when needed.

```ts
if (context.ui.tabs.enabled()) {
  context.ui.tabs.open(backgroundSessionID)
  context.ui.tabs.focus(sessionID)
  const tabs = context.ui.tabs.list()
  context.ui.tabs.move(backgroundSessionID, tabs.length - 1)
  context.ui.tabs.close(sessionID)
  context.ui.tabs.close()
}
```

## Model

Read the prompt's selected model and change its variant. `current()` and `variant.list()` are reactive when read in a
Solid computation. A `variant` of `undefined` is the model default.

```ts
const selected = context.ui.model.current()
const variants = context.ui.model.variant.list()
context.ui.model.variant.set("high")
context.ui.model.variant.set(undefined)
```

`variant.set` returns `false` when no model is selected or the model has no such variant. Bind it to a command to
replace the built-in variant cycle, for example to skip the model default:

```ts
context.keymap.layer(() => ({
  commands: [
    {
      id: "acme.variant.cycle",
      title: "Cycle variants",
      bind: "tab",
      run() {
        const variants = context.ui.model.variant.list()
        if (variants.length === 0) return
        const index = variants.indexOf(context.ui.model.current()?.variant ?? "")
        context.ui.model.variant.set(variants[(index + 1) % variants.length])
      },
    },
  ],
}))
```

## Slots

Slots insert or replace JSX at `app`, `home.footer`, `home.footer.status`, `prompt.footer`, `prompt.footer.status`,
`prompt.footer.file`, `session.composer.top`, `sidebar.content`, or `sidebar.footer`.

```tsx
return context.ui.slot({
  append: "sidebar.content",
  render: ({ sessionID }) => <text>{context.data.session.get(sessionID)?.title}</text>,
})
```

Use `prepend`, `append`, `before`, `after`, or `replace` for placement.

```tsx
context.ui.slot({ prepend: "home.footer", render: () => <text>Before footer content</text> })
context.ui.slot({ append: "home.footer", render: () => <text>After footer content</text> })
context.ui.slot({ before: "home.footer", render: () => <text>Before footer slot</text> })
context.ui.slot({ after: "home.footer", render: () => <text>After footer slot</text> })
context.ui.slot({ replace: "home.footer", render: () => <text>New footer</text> })
```

Use `home.footer.status` to add content to the built-in footer row without replacing it. Status contributions appear
after OpenCode's health indicators and before the version.

```tsx
context.ui.slot({ append: "home.footer.status", render: () => <text>SYNCED</text> })
```

### Session panels

Register a contribution to `session.panel`, then open the panel from a command. The host owns sizing, focus, and
full-screen presentation; the plugin owns its contents. The selected name is passed to every contribution as
`panel.name`, and each contribution decides whether to render.

```tsx
import { Show } from "solid-js"

context.ui.slot({
  append: "session.panel",
  render: (panel) => (
    <Show when={panel.name === "acme.review"}>
      <ReviewPanel panel={panel} />
    </Show>
  ),
})

context.ui.slot({
  append: "app",
  render: () => {
    context.keymap.layer(() => ({
      mode: "global",
      commands: [
        {
          id: "acme.review",
          title: "Open review",
          slash: { name: "review" },
          run: () => {
            context.ui.panel.open("acme.review")
          },
        },
      ],
    }))
    return null
  },
})
```

- Opening outside a session returns `false`.
- This is an ordinary slot: all five placements and the existing replacement ordering rules apply.
- Use `append` for independently selectable contributions so they can coexist. `replace` still takes over the slot.
- Names are shared selection values, not registered claims. Use a plugin-prefixed name such as `acme.review` to avoid collisions. Opening a name with no matching renderer leaves the slot empty.
- Changing presentation preserves the mounted contributions. Closing the panel disposes them; disabling a plugin removes its contributions through normal slot cleanup.
- Its keyboard layers and input modes are active only while the panel owns input.

The slot receives reactive `name`, `sessionID`, `width`, `presentation`, and `focused` properties, plus `focus`,
`close`, and `toggleFullscreen` actions. The host keeps narrow terminals full-screen; `toggleFullscreen` has no effect
until there is enough room for a side panel.

```tsx
import type { PanelInput } from "@opencode/plugin/tui/context"
import { usePlugin } from "@opencode/plugin/tui"

function ReviewPanel(props: { panel: PanelInput }) {
  const context = usePlugin()
  context.keymap.layer(() => ({
    commands: [
      {
        id: "acme.review.fullscreen",
        bind: "f",
        run: props.panel.toggleFullscreen,
      },
    ],
  }))
  return <text>Reviewing {props.panel.sessionID}</text>
}
```

You can request full-screen presentation initially, inspect your active panel, or close it without affecting another
plugin's panel.

```ts
context.ui.panel.open("acme.review", { presentation: "fullscreen" })
const current = context.ui.panel.current()
context.ui.panel.close()
```

## Formatting

Format filesystem paths for display, including home-directory abbreviation.

```ts
const displayPath = context.ui.format.path(context.location?.directory ?? "/home/me/project")
```

## Publish and load

Expose the TUI plugin through `./tui`; add OpenTUI peers when the plugin renders JSX.

```json title="package.json"
{
  "name": "opencode-acme-plugin",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./tui": "./src/tui.tsx"
  },
  "dependencies": {
    "@opencode/plugin": "latest"
  },
  "peerDependencies": {
    "@opentui/core": ">=0.6.6",
    "@opentui/solid": ">=0.6.6",
    "solid-js": ">=1.9.0"
  }
}
```

Export `./tui` beside a [server part](/build/plugins/server) or [GUI part](/build/plugins/gui) for automatic loading.

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "acme.server",
  setup() {},
})
```

Configure a TUI-only package in [`cli.json`](/cli/plugins) so it remains active against remote servers.

```json title="cli.json"
{
  "plugins": ["opencode-acme-plugin"]
}
```

==> ./plugins/effect.mdx <==
---
title: "Effect plugins"
description: "Write server plugins with the Effect-native plugin API."
---

`@opencode/plugin/effect` is the Effect-native version of the OpenCode plugin API. Its context operations return
Effects or Streams, callbacks return Effects, and plugin lifetime is represented by `Scope`.

OpenCode provides `effect` (including exported `effect/*` subpaths) and `@opencode/plugin` at runtime when loading
plugins and their `node_modules` dependencies. Install them as peer/dev dependencies for local type-checking and testing
rather than bundling them into your plugin.

```sh
bun add --peer @opencode/plugin effect@4.0.1
```

Export an Effect plugin from `.opencode/plugins/` to load it automatically.

```ts title=".opencode/plugins/concise/index.ts"
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "example",
  effect: (ctx) =>
    Effect.gen(function* () {
      const storage = ctx.storage
      yield* storage.set("loaded", true)
    }),
})
```

Published packages and plugin directories outside `.opencode/plugins/` use the same `plugins` configuration as other server
plugins.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "opencode-acme-effect-plugin",
    "opencode-acme-effect-plugin@1.2.0",
    "@acme/opencode-effect-plugin",
    "./plugins/local-effect",
    {
      "package": "@acme/opencode-effect-plugin",
      "options": { "agent": "reviewer", "strict": true },
    },
  ],
}
```

See [Configure plugins](/plugins) for enablement, package resolution, and configuration precedence.

```ts title="plugins/local-effect/index.ts"
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "local-effect",
  effect: (ctx) =>
    Effect.gen(function* () {
      yield* Effect.logInfo("Effect plugin loaded", { version: ctx.app.version })
    }),
})
```

## Lifecycle

The `effect` runs when the plugin loads. Its scope closes when the plugin reloads or unloads, so registrations, scoped
fibers, and finalizers are released together.

```ts
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "lifecycle",
  effect: (ctx) =>
    Effect.gen(function* () {
      yield* Effect.logInfo("loaded", { version: ctx.app.version })
      yield* Effect.addFinalizer(() => Effect.logInfo("unloaded"))
    }),
})
```

Use scoped fibers for background work. The plugin scope interrupts the fiber during cleanup.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const storage = ctx.storage
    yield* Effect.repeat(
      storage.set("heartbeat", { time: Date.now() }),
      { schedule: Schedule.spaced("1 minute") },
    ).pipe(Effect.forkScoped)
  }),
```

### Context

The context exposes the Effect client for the connected OpenCode server plus plugin-only transforms, hooks, storage,
reloads, and options. It does not expose OpenCode's private Core services.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const plugins = ctx.plugin
    const active = yield* plugins.list().pipe(Effect.orDie)
    yield* Effect.logInfo("active plugins", { count: active.data.length })
  }),
```

The plugin definition and complete context are declared as follows.

```ts
interface Context {
  readonly app: App
  readonly location: Location.Info
  readonly options: PluginOptions
  readonly agent: AgentDomain
  readonly aisdk: AISDKDomain
  readonly command: CommandDomain
  readonly event: EventDomain
  readonly experimental: {
    readonly terminal: Pick<ExperimentalApi<unknown>["persistentPty"], "read">
    readonly generate: GenerateApi<unknown>
  }
  readonly integration: IntegrationDomain
  readonly mcp: MCPDomain
  readonly model: ModelDomain
  /** @deprecated Use `experimental.generate.text`. */
  readonly generate: Pick<ExperimentalGenerateApi<unknown>, "text">
  readonly permission: PermissionDomain
  readonly plugin: Pick<PluginApi<unknown>, "list">
  readonly provider: ProviderDomain
  readonly reference: ReferenceDomain
  readonly rpc: RpcDomain
  readonly session: SessionDomain
  readonly shell: ShellDomain
  readonly skill: SkillDomain
  readonly storage: StorageDomain
  readonly tool: ToolDomain
  readonly vcs: VcsDomain
  readonly websearch: WebSearchDomain
  readonly worktree: WorktreeDomain
}

interface Plugin<R = Scope.Scope> {
  readonly id: string
  readonly effect: (context: Context) => Effect.Effect<void, never, R>
}
```

### Options

Pass options with the object form in `opencode.json(c)`.

```jsonc title="opencode.jsonc"
{
  "plugins": [
    {
      "package": "./plugins/company-effect",
      "options": { "strict": true },
    },
  ],
}
```

Read options from `ctx.options`. Narrow unknown values before use.

```ts title="plugins/company-effect/index.ts"
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "company",
  effect: (ctx) =>
    Effect.gen(function* () {
      const strict = ctx.options.strict === true
      yield* Effect.logInfo("company plugin configured", { strict })
    }),
})
```

## Transforms

Transforms synchronously edit state through an editor. OpenCode applies transforms in registration order within each
domain. Sources contribute providers and immutable model definitions first; model transforms then edit the active
providers' candidates. Yielding the registration keeps it in the plugin scope.

```ts title="plugins/models-effect/index.ts"
import { Model, Plugin, Provider } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "company.models",
  effect: (ctx) =>
    Effect.gen(function* () {
      const providerID = Provider.ID.make("acme")
      const models = [{ ...Model.Info.default(providerID, Model.ID.make("reasoner")), name: "Acme Reasoner" }]
      yield* ctx.provider.transform((editor) => {
        editor.add({
          info: {
            ...Provider.Info.empty(providerID),
            name: "Acme",
            activation: "enabled",
            package: "@opencode/ai/providers/openai-compatible",
            settings: { baseURL: "http://127.0.0.1:8000/v1" },
          },
          models,
        })
      })
    }),
})
```

A model transform can enforce policy across the complete active-provider candidate collection.

```ts title="plugins/model-budget-effect/index.ts"
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.model.transform((editor) => {
      editor
        .list()
        .filter((model) => model.cost.some((tier) => tier.output > 20))
        .forEach((model) => {
          editor.remove(model.providerID, model.id)
        })
    })
  }),
```

Call `reload` when external state used by a transform changes. Here, `loadFromSource()` returns
`{ info: Provider.Info, models: readonly Model.Info[] }` entries; provider reloads also invalidate the entire model result.

```ts title="plugins/models-effect/index.ts"
effect: (ctx) =>
  Effect.gen(function* () {
    const provider = ctx.provider
    const source = { providers: yield* loadFromSource() }

    yield* provider.transform((editor) => {
      source.providers.forEach((provider) => editor.add(provider))
    })

    yield* Effect.repeat(
      Effect.gen(function* () {
        source.providers = yield* loadFromSource()
        yield* provider.reload()
      }),
      { schedule: Schedule.spaced("1 minute") },
    ).pipe(Effect.forkScoped)
  }),
```

## API

### Agent

Read all agents or fetch one by ID. Client responses include the resolved location and schema data.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const agent = ctx.agent
    const agents = yield* agent.list().pipe(Effect.orDie)
    const build = yield* agent.get({ agentID: Agent.ID.make("build") }).pipe(Effect.orDie)
    yield* Effect.logInfo("agents", { count: agents.data.length, build: build.data.name })
  }),
```

Transform or reload agents.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const agent = ctx.agent
    yield* agent.transform((editor) => {
      editor.default("build")
      editor.update("build", (item) => (item.description = "Builds features and fixes bugs"))
      editor.remove("legacy")
    })
    yield* agent.reload()
  }),
```

Schema: [`Agent.Info`](/api#schema-Agent.Info).

```ts
interface AgentEditor {
  list(): readonly Types.DeepMutable<Agent.Info>[]
  get(id: string): Types.DeepMutable<Agent.Info> | undefined
  default(id: string | undefined): void
  update(id: string, update: (agent: Types.DeepMutable<Agent.Info>) => void): void
  remove(id: string): void
}

interface AgentDomain extends AgentApi<unknown> {
  readonly transform: Transform<AgentEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Providers

Read available providers or inspect one provider's metadata by ID.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const provider = ctx.provider
    const providers = yield* provider.list().pipe(Effect.orDie)
    const anthropic = yield* provider.get({ providerID: Provider.ID.make("anthropic") }).pipe(Effect.orDie)
    yield* Effect.logInfo("providers", {
      providers: providers.data.length,
      anthropic: anthropic.data.name,
    })
  }),
```

Provider transforms edit provider settings and source definitions. Editor reads include inactive providers and expose
immutable definitions; `models.update` edits an owned copy of a source model.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.provider.transform((editor) => {
      editor.update("anthropic", (provider) => {
        provider.headers = { ...provider.headers, "x-company": "engineering" }
      })
      editor.models.update("anthropic", "claude-sonnet-5-5", (model) => (model.name = "Team Sonnet"))
      editor.models.remove("anthropic", "legacy-model")
      editor.remove("legacy-provider")
    })
  }),
```

Replace a source inventory with `models.set`, then reload after its captured definitions change.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const provider = ctx.provider
    const source = { models: yield* loadModels() }
    yield* provider.transform((editor) => editor.models.set("acme", source.models))
    source.models = yield* loadModels()
    yield* provider.reload()
  }),
```

For account-specific discovery, pass the connection used to load the inventory as `sourceConnection`. OpenCode excludes
that provider while another connection is selected, until your plugin publishes its refreshed inventory.

{/* prettier-ignore */}
```ts
const connection = yield* ctx.integration.connection.active("acme")
if (!connection) return
const inventory = yield* loadInventory(connection)
yield* ctx.provider.transform((editor) => {
  editor.add({ info: inventory.provider, models: inventory.models, sourceConnection: connection })
})
```

Schemas: [`Provider.Info`](/api#schema-Provider.Info), [`Model.Info`](/api#schema-Model.Info).

```ts
interface ProviderRecord {
  readonly provider: Provider.Info
  readonly models: ReadonlyMap<string, Model.Info>
  readonly sourceConnection?: ConnectionInfo
}

interface ProviderEditor {
  list(): readonly ProviderRecord[]
  get(providerID: string): ProviderRecord | undefined
  add(input: { info: Provider.Info; models: readonly Model.Info[]; sourceConnection?: ConnectionInfo }): void
  update(providerID: string, update: (provider: Types.DeepMutable<Provider.Info>) => void): void
  remove(providerID: string): void
  readonly models: {
    set(providerID: string, models: readonly Model.Info[]): void
    update(providerID: string, modelID: string, update: (model: Types.DeepMutable<Model.Info>) => void): void
    remove(providerID: string, modelID: string): void
  }
}

interface ProviderDomain extends ProviderApi<unknown> {
  readonly transform: Transform<ProviderEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Models

Read available models and the default selection.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const model = ctx.model
    const models = yield* model.list().pipe(Effect.orDie)
    const selected = yield* model.default().pipe(Effect.orDie)
    yield* Effect.logInfo("models", { count: models.data.length, selected: selected.data?.name })
  }),
```

Model transforms edit the entire active-provider candidate collection. Disabled candidates remain editable until all
transforms finish; `update` can add a model only under an available provider.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.model.transform((editor) => {
      editor.list("anthropic").forEach((model) => {
        editor.update(model.providerID, model.id, (draft) => {
          draft.enabled = draft.capabilities.tools
        })
      })
      editor.default.set("anthropic", "claude-sonnet-5-5")
      editor.remove("anthropic", "legacy-model")
    })
  }),
```

Callbacks edit raw model overrides. Provider defaults are merged once when OpenCode commits the result; unchanged reads
reuse that result. `editor.provider` reads immutable source definitions, including inactive templates, rather than
model-transform output.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const model = ctx.model
    yield* model.transform((editor) => {
      const source = editor.provider.get("anthropic")?.models.get("claude-sonnet-5-5")
      if (!source) return
      editor.update("anthropic", source.id, (draft) => {
        draft.limit.context = Math.min(draft.limit.context, source.limit.context)
      })
    })
    yield* model.reload()
  }),
```

Schema: [`Model.Info`](/api#schema-Model.Info).

```ts
interface ModelEditor {
  list(providerID?: string): readonly Types.DeepMutable<Model.Info>[]
  get(providerID: string, modelID: string): Types.DeepMutable<Model.Info> | undefined
  update(providerID: string, modelID: string, update: (model: Types.DeepMutable<Model.Info>) => void): void
  remove(providerID: string, modelID: string): void
  readonly default: {
    get(): { providerID: string; modelID: string } | undefined
    set(providerID: string, modelID: string): void
  }
  readonly provider: {
    list(): readonly ProviderRecord[]
    get(providerID: string): ProviderRecord | undefined
  }
}

interface ModelDomain extends ModelApi<unknown> {
  readonly transform: Transform<ModelEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Commands

Read commands available at the current location.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const command = ctx.command
    const commands = yield* command.list().pipe(Effect.orDie)
    yield* Effect.logInfo("commands", { names: commands.data.map((item) => item.name) })
  }),
```

The current command transform is add-only. An executor receives the session, prompt attachments, and delivery mode.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const command = ctx.command
    const session = ctx.session
    yield* command.transform((editor) => {
      editor.add({
        name: "security-review",
        description: "Review changes for security issues",
        execute: (input) =>
          session.prompt({
            ...input.prompt,
            sessionID: input.sessionID,
            text: `Review these changes for security issues.\n\n${input.prompt.text}`,
            delivery: input.delivery,
          }).pipe(Effect.asVoid),
      })
    })
    yield* command.reload()
  }),
```

Schemas: [`Command.Info`](/api#schema-Command.Info),
[`Session.Inbox.Delivery`](/api#schema-Session.Inbox.Delivery).

```ts
interface CommandInvocation {
  readonly sessionID: Session.ID
  readonly prompt: PromptInput.Prompt
  readonly delivery: SessionInbox.Delivery
}

interface CommandDefinition {
  readonly name: string
  readonly description?: string
  readonly execute: (input: CommandInvocation) => Effect.Effect<void, unknown>
}

interface CommandEditor {
  add(definition: CommandDefinition): void
}

interface CommandDomain extends Pick<CommandApi<unknown>, "list"> {
  readonly transform: Transform<CommandEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Integrations

Read integrations and resolve the active credential when one exists.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const integration = ctx.integration
    const integrations = yield* integration.list().pipe(Effect.orDie)
    const github = yield* integration.get({ integrationID: Integration.ID.make("github") }).pipe(Effect.orDie)
    const connection = yield* integration.connection.active("github")
    const credential = connection ? yield* integration.connection.resolve(connection).pipe(Effect.orDie) : undefined
    yield* Effect.logInfo("integration", {
      count: integrations.data.length,
      github: github.data.name,
      credential: credential?.type,
    })
  }),
```

Connect with a key or drive an OAuth attempt through the connected API.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const integration = ctx.integration
    const token = yield* Config.Redacted("GITHUB_TOKEN").pipe(Effect.orDie)
    yield* integration.connect
      .key({ integrationID: Integration.ID.make("github"), key: Redacted.value(token) })
      .pipe(Effect.orDie)

    const attempt = yield* integration.oauth
      .connect({
        integrationID: Integration.ID.make("acme"),
        methodID: Integration.MethodID.make("oauth"),
      })
      .pipe(Effect.orDie)
    const status = yield* integration.oauth
      .status({
        integrationID: Integration.ID.make("acme"),
        attemptID: attempt.data.attemptID,
      })
      .pipe(Effect.orDie)
    yield* Effect.logInfo("OAuth status", { status: status.data })
  }),
```

Transform integrations and authentication methods. OAuth method callbacks are Effects and may acquire scoped
resources.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const integration = ctx.integration
    yield* integration.transform((editor) => {
      editor.update("acme", (item) => (item.name = "Acme"))
      editor.method.update({
        integrationID: "acme",
        method: { id: "device", type: "oauth", label: "Sign in with Acme" },
        authorize: () =>
          Effect.succeed({
            mode: "code",
            url: "https://acme.example/device",
            instructions: "Enter the displayed code",
            callback: (code) => exchangeCode(code),
          }),
      })
    })
    yield* integration.reload()
  }),
```

Schemas: [`Integration.Info`](/api#schema-Integration.Info), [`Integration.Method`](/api#schema-Integration.Method),
[`Connection.Info`](/api#schema-Connection.Info), [`Form.Answer`](/api#schema-Form.Answer).

```ts
type IntegrationOAuthAuthorization = {
  readonly url: string
  readonly instructions: string
  readonly expiresAt?: number
} & (
  | { readonly mode: "auto"; readonly callback: Effect.Effect<Credential.OAuth, unknown> }
  | { readonly mode: "code"; readonly callback: (code: string) => Effect.Effect<Credential.OAuth, unknown> }
)

type IntegrationOAuthMethodRegistration = {
  readonly integrationID: string
  readonly method: IntegrationOAuthMethod
  readonly authorize: (answer: Form.Answer) => Effect.Effect<IntegrationOAuthAuthorization, unknown, Scope.Scope>
  readonly refresh?: (credential: Credential.OAuth) => Effect.Effect<Credential.OAuth, unknown>
  readonly label?: (credential: Credential.OAuth) => string | undefined
}

interface IntegrationEditor {
  list(): readonly IntegrationRef[]
  get(id: string): IntegrationRef | undefined
  update(id: string, update: (integration: IntegrationRef) => void): void
  remove(id: string): void
  readonly method: {
    list(integrationID: string): readonly IntegrationMethod[]
    update(input: IntegrationMethodRegistration): void
    remove(integrationID: string, method: IntegrationMethod): void
  }
}

interface IntegrationDomain extends Omit<IntegrationApi<unknown>, "wellknown"> {
  readonly transform: Transform<IntegrationEditor>
  readonly reload: () => Effect.Effect<void>
  readonly connection: {
    readonly active: (integrationID: string) => Effect.Effect<ConnectionInfo | undefined>
    readonly resolve: (connection: ConnectionInfo) => Effect.Effect<Credential.Value | undefined, unknown>
  }
}
```

### MCP

List MCP servers and their current connection state.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const mcp = ctx.mcp
    const servers = yield* mcp.list().pipe(Effect.orDie)
    yield* Effect.logInfo("MCP servers", { count: servers.data.length })
  }),
```

Plugins manage MCP servers only through transforms. Use `editor.set` to add or replace a server, `editor.update` to
change its configuration, and `editor.remove` to remove it. Inspect configuration with `editor.list` and `editor.get`.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const mcp = ctx.mcp
    yield* mcp.transform((editor) => {
      const servers = editor.list()
      const docs = editor.get("docs")
      editor.set("docs", { type: "remote", url: "https://mcp.example.com" })
      editor.update("docs", (server) => (server.disabled = false))
      editor.remove("legacy")
    })
  }),
```

Set `disabled: true` in a transform to disable a server and disconnect it, or `disabled: false` to enable it and allow
OpenCode to connect. OpenCode reconciles server lifecycle from the transformed configuration.

Call `reload()` after external state used by a transform changes to reapply transforms and reconcile the servers.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const mcp = ctx.mcp
    yield* mcp.reload()
  }),
```

Schemas: [`Mcp.Server`](/api#schema-Mcp.Server), [`Mcp.LocalConfigEncoded`](/api#schema-Mcp.LocalConfigEncoded),
[`Mcp.RemoteConfigEncoded`](/api#schema-Mcp.RemoteConfigEncoded).

```ts
interface MCPEditor {
  list(): readonly [string, Types.DeepMutable<Mcp.ServerConfig>][]
  get(name: string): Types.DeepMutable<Mcp.ServerConfig> | undefined
  set(name: string, config: Mcp.ServerConfig): void
  update(name: string, update: (config: Types.DeepMutable<Mcp.ServerConfig>) => void): void
  remove(name: string): void
}

interface MCPDomain extends Pick<McpApi<unknown>, "list"> {
  readonly transform: Transform<MCPEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Plugins

List active, failed, and resolved plugins at the current location.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const plugin = ctx.plugin
    const plugins = yield* plugin.list().pipe(Effect.orDie)
    yield* Effect.forEach(plugins.data, (item) => Effect.logInfo("plugin", item), { discard: true })
  }),
```

Filter the schema values in an Effect pipeline when only active plugins matter.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const plugin = ctx.plugin
    const active = yield* plugin.list().pipe(
      Effect.orDie,
      Effect.map((result) => result.data.filter((item) => item.state.status === "active")),
    )
    yield* Effect.logInfo("active plugin count", { count: active.length })
  }),
```

Schemas: [`Plugin.Info`](/api#schema-Plugin.Info), [`Plugin.Source`](/api#schema-Plugin.Source).

```ts
interface PluginApi<E = never> {
  readonly list: PluginListOperation<E>
}

interface Context {
  readonly plugin: PluginApi<unknown>
}
```

### References

Read references available at the current location.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const reference = ctx.reference
    const references = yield* reference.list().pipe(Effect.orDie)
    yield* Effect.logInfo("references", { count: references.data.length })
  }),
```

Add or remove local and Git references, then reload after external state changes. `get(name)` returns the current configured
source, or `undefined` when the name is absent.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const reference = ctx.reference
    yield* reference.transform((editor) => {
      editor.add("handbook", { type: "local", path: "/workspace/docs/handbook" })
      editor.add("standards", { type: "git", repository: "https://github.com/acme/standards", branch: "main" })
      const handbook = editor.get("handbook")
      editor.remove("legacy")
    })
    yield* reference.reload()
  }),
```

Schemas: [`Reference.Info`](/api#schema-Reference.Info), [`Reference.LocalSource`](/api#schema-Reference.LocalSource),
[`Reference.GitSource`](/api#schema-Reference.GitSource).

```ts
interface ReferenceEditor {
  add(name: string, source: ReferenceLocalSource | ReferenceGitSource): void
  remove(name: string): void
  list(): readonly (readonly [string, ReferenceLocalSource | ReferenceGitSource])[]
  get(name: string): ReferenceLocalSource | ReferenceGitSource | undefined
}

interface ReferenceDomain extends ReferenceApi<unknown> {
  readonly transform: Transform<ReferenceEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Sessions

Create or read a session, then select the agent and model used by later work.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    const created = yield* session.create({ title: "Review" }).pipe(Effect.orDie)
    const current = yield* session.get({ sessionID: created.id }).pipe(Effect.orDie)
    yield* session.switchAgent({ sessionID: current.id, agent: Agent.ID.make("build") }).pipe(Effect.orDie)
    yield* session
      .switchModel({
        sessionID: current.id,
        model: { providerID: Provider.ID.make("anthropic"), id: Model.ID.make("claude-sonnet-5-5") },
      })
      .pipe(Effect.orDie)
  }),
```

Send prompts, transient generation requests, commands, or synthetic messages.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    const created = yield* session.create({ title: "Automation" }).pipe(Effect.orDie)
    yield* session.prompt({ sessionID: created.id, text: "Review the current changes" }).pipe(Effect.orDie)
    const summary = yield* session
      .generate({ sessionID: created.id, prompt: "Summarize this project" })
      .pipe(Effect.orDie)
    yield* session.command({ sessionID: created.id, name: "review", text: "--staged" }).pipe(Effect.orDie)
    yield* session
      .synthetic({ sessionID: created.id, text: `Summary generated: ${summary.text}`, resume: false })
      .pipe(Effect.orDie)
  }),
```

List sessions a page at a time. To get the next page, pass `cursor.next` back as `cursor`. The cursor remembers your
filters, so you don't need to repeat them.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const page = yield* ctx.session.list({ directory: ctx.location.directory, limit: 20 }).pipe(Effect.orDie)
    const next = page.cursor.next
      ? yield* ctx.session.list({ cursor: page.cursor.next, limit: 20 }).pipe(Effect.orDie)
      : undefined
  }),
```

Remove a temporary session with `remove`. Removal stops active execution and recursively deletes child sessions.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const created = yield* ctx.session.create({ title: "Temporary worker" }).pipe(Effect.orDie)
    yield* ctx.session.remove({ sessionID: created.id }).pipe(Effect.orDie)
  }),
```

Request compaction with `compact`. It returns the admitted inbox item, not a completed summary; compaction runs at
the next step boundary by default. Pass `delivery: "queue"` to preserve queue order instead.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const created = yield* ctx.session.create({ title: "Review" }).pipe(Effect.orDie)
    const compaction = yield* ctx.session.compact({ sessionID: created.id }).pipe(Effect.orDie)
  }),
```

Attach, list, or remove keyed session instruction entries with `instructions.entry`. Entries render as `<context key="...">` blocks in the session's instructions, and updates or removals are announced at the next step boundary without queuing a message turn.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const created = yield* ctx.session.create({ title: "Review" }).pipe(Effect.orDie)
    yield* ctx.session.instructions.entry
      .put({ sessionID: created.id, key: "deploy-target", value: "production" })
      .pipe(Effect.orDie)
    const entries = yield* ctx.session.instructions.entry.list({ sessionID: created.id }).pipe(Effect.orDie)
    yield* ctx.session.instructions.entry.remove({ sessionID: created.id, key: "deploy-target" }).pipe(Effect.orDie)
  }),
```

Schemas: [`Session.Info`](/api#schema-Session.Info), [`Model.Ref`](/api#schema-Model.Ref),
[`Session.Inbox.User`](/api#schema-Session.Inbox.User),
[`Session.Inbox.Synthetic`](/api#schema-Session.Inbox.Synthetic),
[`InstructionEntry.Info`](/api#schema-InstructionEntry.Info).

```ts
type SessionDomain = Pick<
  SessionApi<unknown>,
  | "list"
  | "create"
  | "get"
  | "remove"
  | "switchAgent"
  | "switchModel"
  | "prompt"
  | "generate"
  | "command"
  | "compact"
  | "synthetic"
  | "interrupt"
  | "update"
  | "move"
  | "wait"
  | "context"
  | "instructions"
>
```

### Skills

Read skills at the current location.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const skill = ctx.skill
    const skills = yield* skill.list().pipe(Effect.orDie)
    yield* Effect.logInfo("skills", { ids: skills.data.map((item) => item.id) })
  }),
```

Transform and reload skills. Use the re-exported Effect schema constructors for branded values. `get(id)` returns the
current editor entry, or `undefined` when the skill is absent.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const skill = ctx.skill
    yield* skill.transform((editor) => {
      editor.add(Skill.Info.make({
        id: Skill.ID.make("review"),
        name: Skill.Name.make("Review"),
        description: "Review the current changes",
        path: Skill.Info.fields.path.make("/workspace/.opencode/skills/review/SKILL.md"),
        content: "Review the current changes for correctness and missing tests.",
      }))
      const review = editor.get("review")
      editor.update("review", (item) => (item.autoinvoke = true))
      editor.remove("legacy")
    })
    yield* skill.reload()
  }),
```

Schema: [`Skill.Info`](/api#schema-Skill.Info).

```ts
interface SkillEditor {
  list(): readonly Types.DeepMutable<Skill.Info>[]
  get(id: string): Types.DeepMutable<Skill.Info> | undefined
  add(skill: Skill.Info): void
  update(id: string, update: (skill: Types.DeepMutable<Skill.Info>) => void): void
  remove(id: string): void
}

interface SkillDomain extends SkillApi<unknown> {
  readonly transform: Transform<SkillEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Storage

Store, read, and remove durable JSON values scoped to the plugin ID.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const storage = ctx.storage
    yield* storage.set("settings", { strict: true })
    const settings = yield* storage.get("settings")
    yield* Effect.logInfo("settings", { settings })
    yield* storage.remove("settings")
  }),
```

Scan keys by prefix with cursor pagination.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const storage = ctx.storage
    const first = yield* storage.scan({ prefix: "cache/", limit: 100 })
    const second = first.next
      ? yield* storage.scan({ prefix: "cache/", after: first.next, limit: 100 })
      : { entries: [] }
    yield* Effect.logInfo("cache entries", { count: first.entries.length + second.entries.length })
  }),
```

Storage accepts Effect's JSON type and returns Effects directly.

```ts
interface StorageDomain {
  readonly get: (key: string) => Effect.Effect<Schema.Json | undefined>
  readonly set: (key: string, value: Schema.Json) => Effect.Effect<void>
  readonly remove: (key: string) => Effect.Effect<void>
  readonly scan: (options: StorageScanOptions) => Effect.Effect<StorageScanResult>
}
```

### Tools

Register typed tools with Effect `Schema`. The executor receives decoded input and returns an Effect containing typed
output, display content, or metadata.

The editor supports `add`, `update`, and `remove`. The transform callback is synchronous: it must not return an Effect or Promise. Load
external data before registering or reloading. OpenCode replays active transforms in registration order on a fresh
editor; for the same effective tool name, a later valid registration overrides an earlier one.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const tool = ctx.tool
    yield* tool.transform((editor) => {
      editor.namespace({
        name: "acme",
        description: "Customer account tools",
      })
      editor.add({
        name: "greeting",
        description: "Create a greeting",
        input: Schema.Struct({ name: Schema.String }),
        output: Schema.Struct({ greeting: Schema.String }),
        options: { namespace: "acme", codemode: true },
        execute: ({ name }, context) =>
          Effect.gen(function* () {
            yield* context.progress({ status: "greeting" })
            return { output: { greeting: `Hello ${name}!` } }
          }),
      })
    })
  }),
```

Call `yield* ctx.tool.reload()` after changing source data captured by the callback. Reload replays active transforms
without changing their order; it does not rerun the plugin effect.

Effect tools accept the same [freeform input declaration](/build/plugins/server#freeform-tool-input) as Promise tools. If the model does not advertise that format, the tool keeps its normal object input.

Tools have an `id` containing their effective name, and `get()` returns `undefined` when that ID is not present. Use
`update` and `remove` with the effective tool name, including its namespace (`acme_greeting` above). Dots in
namespaces and unsupported characters in tool names become `_`. Missing names are ignored; creating a tool requires
`add` with a complete definition. Updates preserve the name and namespace. Assign new schemas or options to replace
them rather than mutating nested values. Invalid updates are logged and leave the previous definition intact.

{/* prettier-ignore */}
```ts
yield* ctx.tool.transform((editor) => {
  editor.update("acme_greeting", (tool) => {
    tool.description = "Greet the user by name"
  })
  editor.remove("acme_obsolete")
})
```

Updates and removals replay in order with additions, including after MCP catalog refreshes.

`transform` returns a scoped registration. Run `yield* registration.dispose` to remove its transform and rebuild
from the remaining transforms, revealing any earlier definition it overrode. Disposal is idempotent, and closing
the plugin scope also disposes its registrations.

Each model request captures a tool snapshot. Reload and disposal affect future snapshots, not the definitions or
executors already captured by an existing request. Executors that close over mutable plugin data still observe
that data; capture a value inside the transform when it must remain tied to that definition.

Schemas: [`Tool.Content`](/api#schema-Tool.Content), [`Tool.TextContent`](/api#schema-Tool.TextContent),
[`Tool.FileContent`](/api#schema-Tool.FileContent).

```ts
interface ToolEditor {
  list(): readonly (Tool.Info & { readonly id: string })[]
  get(id: string): (Tool.Info & { readonly id: string }) | undefined
  namespace(namespace: { name: string; description: string }): void
  add<Input extends Tool.ValueSchema<any>, Output extends Tool.ValueSchema<any> | undefined>(
    tool: Tool.Info<Input, Output>,
  ): void
  update(id: string, update: (tool: Types.Mutable<Tool.Info>) => void): void
  remove(id: string): void
}

interface ToolDomain {
  readonly list: () => Effect.Effect<readonly (Tool.Info & { readonly id: string })[]>
  readonly transform: Transform<ToolEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### VCS

Read repository information, working-copy status, or file diffs.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const vcs = ctx.vcs
    const info = yield* vcs.get().pipe(Effect.orDie)
    const branches = yield* vcs.branch.list({ search: "feature", limit: 10 }).pipe(Effect.orDie)
    const changes = yield* vcs.status().pipe(Effect.orDie)
    const diff = yield* vcs.diff({ mode: "working", context: 3 }).pipe(Effect.orDie)
    yield* Effect.logInfo("vcs", { branch: info.data.branch.current, files: changes.data.length })
  }),
```

Register a location-scoped provider through a scoped transform. Providers matching the detected repository type are
selected automatically; use `editor.default.set` to select a different provider.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const vcs = ctx.vcs
    yield* vcs.transform((editor) => {
      editor.add({
        id: "custom",
        name: "Custom VCS",
        info: () => Effect.succeed({ branch: { current: "feature", default: "main" } }),
        branches: (input) => readBranches(input),
        status: (scope) => readStatus(scope.worktree),
        diff: (input) => readDiff(input),
      })
      editor.default.set("custom")
    })
  }),
```

Provider callbacks receive the current location, working-copy root, canonical project root, and optional repository
store. Diff callbacks also receive the selected mode, requested context, and output byte budget. Repository discovery
continues to use OpenCode's built-in Git and Mercurial detectors.

Providers can optionally implement `init(scope)` to create a repository in `scope.worktree`. Initialization selects
the provider by ID (Git by default), not by the detected repository type. Register a provider with `init` even when
the location has no repository yet; OpenCode checks that the directory exists and has no repository before calling
it, then rediscovers the project. New repository formats still need discovery support beyond this callback.

Schemas: [`Vcs.Info`](/api#schema-Vcs.Info), [`Vcs.FileStatus`](/api#schema-Vcs.FileStatus),
[`FileDiff.Info`](/api#schema-FileDiff.Info).

```ts
interface VcsEditor {
  add(definition: VcsDefinition): void
  readonly default: {
    get(): string | undefined
    set(selection: string): void
  }
}

interface VcsDomain extends Omit<VcsApi<unknown>, "init"> {
  readonly transform: Transform<VcsEditor>
  readonly reload: () => Effect.Effect<void>
}

interface VcsDefinition {
  readonly init?: (scope: VcsScope) => Effect.Effect<void, unknown>
  // Existing info, branches, status, and diff callbacks are required.
}
```

### Websearch

List providers or run a query through the selected provider.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const websearch = ctx.websearch
    const providers = yield* websearch.providers().pipe(Effect.orDie)
    const results = yield* websearch
      .query({ query: "OpenCode plugins", providerID: WebSearch.ID.make("internal") })
      .pipe(Effect.orDie)
    yield* Effect.logInfo("websearch", { providers: providers.data.length, results: results.data.results.length })
  }),
```

Register an Effect executor and select the default provider. Set the default to `false` to disable websearch.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const websearch = ctx.websearch
    yield* websearch.transform((editor) => {
      editor.add({
        id: "internal",
        name: "Internal search",
        execute: ({ query }) => searchInternal(query),
      })
      editor.default.set("internal")
    })
    yield* websearch.reload()
  }),
```

Schemas: [`WebSearch.Provider`](/api#schema-WebSearch.Provider),
[`WebSearch.Result`](/api#schema-WebSearch.Result).

```ts
interface WebSearchDefinition {
  readonly id: string
  readonly name: string
  readonly execute: (input: WebSearch.ProviderInput) => Effect.Effect<readonly WebSearch.Result[], unknown>
}

interface WebSearchEditor {
  add(definition: WebSearchDefinition): void
  readonly default: {
    get(): string | false | undefined
    set(selection: string | false): void
  }
}

interface WebSearchDomain extends WebsearchApi<unknown> {
  readonly transform: Transform<WebSearchEditor>
  readonly reload: () => Effect.Effect<void>
}
```

### Events

The public server event subscription is an Effect `Stream`. Fork its consumer in the plugin scope for automatic
interruption.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const event = ctx.event
    yield* event.subscribe().pipe(
      Stream.tap((item) => Effect.logDebug("OpenCode event", { type: item.type })),
      Stream.runDrain,
      Effect.forkScoped,
    )
  }),
```

Pass `types` to receive only the event types you need. The stream is typed to match, so no type guard is needed.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const event = ctx.event
    yield* event.subscribe({ types: ["config.updated"] }).pipe(
      Stream.runForEach(() => Effect.logInfo("configuration changed")),
      Effect.forkScoped,
    )
  }),
```

Schema: [`V2EventEncoded`](/api#schema-V2EventEncoded).

```ts
type EventType = Exclude<OpenCodeEvent["type"], "server.connected">

interface EventDomain {
  readonly subscribe: <Type extends EventType = EventType>(input?: {
    readonly types?: ReadonlyArray<Type>
  }) => Stream.Stream<Extract<OpenCodeEvent, { type: Type }>, unknown>
}
```

## Hooks

Hooks intercept live operations. Multiple plugins can register the same hook; OpenCode runs them in plugin order so
later hooks see earlier changes. Registrations remain active for the plugin scope.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    yield* session.hook("context", () => Effect.void)
  }),
```

### Sessions

Modify assembled system instructions, messages, or tools immediately before model dispatch. `context` runs for the
agent loop; `compaction`, `generate`, and `title` run for those auxiliary requests. `compaction` and `title` accept a
`result` that skips the model call.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    yield* session.hook("context", (event) =>
      Effect.sync(() => {
        event.system.push({ type: "text", text: "Keep the review focused on correctness." })
        delete event.tools.write
      }),
    )
    yield* session.hook("compaction", (event) =>
      Effect.map(summarize(event.messages), (summary) => {
        event.result = { summary }
      }),
    )
  }),
```

Messages in the `context`, `compaction`, and `generate` hooks carry their stored message's `metadata`, read-only
(for example, what a `prompt` hook set). It is not sent to the model.

The `system` part that holds OpenCode's instructions also lists each source in `metadata.experimental.instructions` as
`{ key, text }`, such as `core/date` or `core/environment`, so a hook can tell the sources apart. The list is a copy:
editing the part's `text` does not update it. This is experimental and may change.

Modify model request settings and optionally scope the hook to one provider. The event carries the same `kind` as
the HTTP hooks below.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    yield* session.hook(
      "model.request",
      (event) => Effect.sync(() => (event.headers["x-plugin"] = "review")),
      { providerID: "anthropic" },
    )
  }),
```

Modify native provider requests or responses. Their bodies are one-shot streams; clone or replace a body before reading
it. Both hooks run for every request a session issues; `event.kind` is `"primary"`, `"compaction"`, `"title"`, or
`"generate"` depending on which flow issued it.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const session = ctx.session
    yield* session.hook("http.request", (event) =>
      Effect.sync(() => {
        event.request.headers.set("x-session-id", event.sessionID)
        if (event.kind === "title") event.request.headers.set("x-priority", "background")
      }),
    )
    yield* session.hook("http.response", (event) =>
      Effect.sync(() => {
        event.response = new Response(event.response.body, {
          status: event.response.status,
          headers: { ...Object.fromEntries(event.response.headers), "x-plugin": "review" },
        })
      }),
    )
  }),
```

Providers that stream over a WebSocket reuse one connection per session, so the HTTP hooks never see that traffic. The
experimental `experimental.ws.handshake` hook runs once per model call before the connection is selected and exposes the
connection `url` and `headers`; changing either reopens the socket. HTTP hooks still run for any request a WebSocket
route falls back to.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.session.hook(
      "experimental.ws.handshake",
      (event) =>
        Effect.gen(function* () {
          event.headers.authorization = `Bearer ${yield* mintToken(event.url)}`
          delete event.headers["api-key"]
        }),
      { providerID: "azure" },
    )
  }),
```

`experimental.ws.send` and `experimental.ws.receive` expose the frames themselves: `send` runs after the provider
driver builds an outbound frame, `receive` runs on each inbound frame before the driver observes it. Whatever `frame` holds when the hook returns is what crosses the wire or reaches the driver;
OpenCode does not validate it.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.session.hook(
      "experimental.ws.send",
      (event) =>
        Effect.sync(() => {
          const body = JSON.parse(event.frame)
          if (body.type === "response.create") body.metadata = { ...body.metadata, session: event.sessionID }
          event.frame = JSON.stringify(body)
        }),
      { providerID: "openai" },
    )
  }),
```

Override the retry decision for a provider failure or replace its delay in milliseconds. The hook runs after OpenCode
classifies the failure and proposes its policy, but before any retry is scheduled. It does not expose how OpenCode
internally performs the next attempt.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    yield* ctx.session.hook("retry", (event) =>
      Effect.sync(() => {
        if (event.error.status === 429) {
          event.decision = { retry: true, delay: 10_000 }
          return
        }
        if (event.error.type === "provider.invalid-request" && event.attempt === 2) {
          event.decision = { retry: true, delay: 0 }
          return
        }
        if (event.attempt >= 3) event.decision = { retry: false }
      }),
    )
  }),
```

The initial `decision` is OpenCode's policy, so hooks may make a normally terminal provider failure retryable or veto a
proposed retry. Multiple hooks run in registration order and later hooks see the current decision. The built-in maximum
attempt count remains a hard limit. `attempt` is the physical attempt being proposed; the initial request is attempt `1`,
so the first retry is attempt `2`. Invalid delays (`NaN`, infinity, or negative values) fall back to the computed delay.
Context-overflow recovery remains separate because it compacts the conversation instead of retrying the same request.

#### Reference

```ts
interface SessionHooks {
  readonly context: SessionContext
  readonly compaction: SessionCompaction
  readonly generate: SessionGenerate
  readonly title: SessionTitle
  readonly "model.request": SessionModelRequest
  readonly "http.request": SessionHttpRequest
  readonly "http.response": SessionHttpResponse
  readonly "experimental.ws.handshake": SessionWebSocketHandshake
  readonly "experimental.ws.send": SessionWebSocketSend
  readonly "experimental.ws.receive": SessionWebSocketReceive
  readonly retry: SessionRetry
}

type RetryDecision = { retry: false } | { retry: true; delay: number }

interface SessionRetry {
  readonly sessionID: string
  readonly agent: string
  readonly model: { providerID: string; id: string; variant?: string }
  readonly error: { type: string; message: string; status?: number }
  readonly attempt: number
  decision: RetryDecision
}

interface SessionHookDomain {
  readonly hook: ModelHooks<SessionHooks>
}
```

### Shell

Modify shell commands, working directories, timeouts, executables, or environment variables before execution.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const shell = ctx.shell
    yield* shell.hook("create.before", (event) =>
      Effect.sync(() => {
        if (event.command === "npm") event.command = "bun"
        event.timeout = Math.min(event.timeout, 60_000)
        event.env.COMPANY_ENV = "development"
      }),
    )
  }),
```

#### Reference

```ts
interface ShellCreateBefore {
  command: string
  cwd: string
  timeout: number
  shell: string
  env: Record<string, string | undefined>
}

interface ShellHooks {
  readonly "create.before": ShellCreateBefore
}

interface ShellHookDomain {
  readonly hook: Hooks<ShellHooks>
}
```

### Tools

Before hooks may replace input or fail with `Tool.Error`.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const tool = ctx.tool
    yield* tool.hook("execute.before", (event) =>
      event.tool === "write"
        ? Effect.fail(new Tool.Error({ message: "Writes are disabled" }))
        : Effect.logDebug("tool input", { tool: event.tool, input: event.input }),
    )
  }),
```

After hooks may inspect or replace successful results and failures.

```ts
effect: (ctx) =>
  Effect.gen(function* () {
    const tool = ctx.tool
    yield* tool.hook("execute.after", (event) => {
      if (event.status === "error") return Effect.logWarning("tool failed", { message: event.error.message })
      return Effect.sync(() => {
        event.result = { ...event.result, metadata: { observed: true } }
      })
    })
  }),
```

#### Reference

```ts
interface ToolHooks {
  readonly "execute.before": ToolExecuteBefore
  readonly "execute.after": ToolExecuteAfter
}

interface ToolFailures extends Record<keyof ToolHooks, unknown> {
  readonly "execute.before": Tool.Error
  readonly "execute.after": never
}

interface ToolHookDomain {
  readonly hook: Hooks<ToolHooks, ToolFailures>
}
```

The shared registration types show which operations require the plugin scope.

```ts
interface Registration {
  readonly dispose: Effect.Effect<void>
}

type Hooks<Spec, Failures extends Record<keyof Spec, unknown> = Record<keyof Spec, never>> = <Name extends keyof Spec>(
  name: Name,
  callback: (input: Spec[Name]) => Effect.Effect<void, Failures[Name]>,
) => Effect.Effect<Registration, never, Scope.Scope>

type Transform<Input> = (callback: (input: Input) => void) => Effect.Effect<Registration, never, Scope.Scope>
```

## Publish

A package plugin uses the same default export as a local Effect plugin. Export the Effect implementation from the main
entrypoint and declare `effect` as a `peerDependency`. Under `devDependencies`, pin the version `@opencode/plugin` uses
so development installs only one copy.

```json title="package.json"
{
  "name": "opencode-acme-effect-plugin",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@opencode/plugin": "latest"
  },
  "peerDependencies": {
    "effect": "^4.0.1"
  },
  "devDependencies": {
    "effect": "4.0.1"
  }
}
```

OpenCode redirects imports of `effect`, exported `effect/*` subpaths, and `@opencode/plugin` (including imports from
dependencies in the plugin's `node_modules`) to the host's runtime instances so fibers, loggers, and `Schema` parsers
share one runtime copy.

- Do not bundle `effect` into the published plugin artifact. If you build with a bundler, mark `effect` and `effect/*`
  external.
- Plugins and their `node_modules` dependencies always execute against the host OpenCode release's `effect` instance.
  Use `effect` APIs and module paths compatible with the OpenCode release you target; dependencies built on another
  `effect` major (such as Effect 3) also receive the host's `effect` and are not supported.
- Only public `effect` subpaths are provided. A plugin that imports one of Effect's private `internal` modules fails to
  load with an error naming the path.
- The compiled OpenCode binary does not include the Scalar and Swagger UI assets used by Effect's HTTP API docs pages;
  serving those pages from a plugin shows a notice instead.

The package entrypoint exports `Plugin.define` with an `effect` function.

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

export default Plugin.define({
  id: "acme.published",
  effect: (ctx) =>
    Effect.gen(function* () {
      const storage = ctx.storage
      yield* storage.set("installed", true)
    }),
})
```

Use versions compatible with the OpenCode release you target and test the installed package rather than only a
workspace-linked copy.

```sh
bun pm pack
bun add ./opencode-acme-effect-plugin-1.0.0.tgz
```

==> ./plugins/effect/rpc.mdx <==
---
title: "Effect plugin RPC"
description: "Expose an Effect plugin's methods and events as typed Effects and Streams."
---

Effect plugins can expose methods and events that return typed Effects and
Streams.

## Define

Use `Rpc.define` with Effect Schema to define the RPC.

```ts title="src/rpc.ts"
import { Rpc } from "@opencode/plugin/rpc"
import { Schema } from "effect"

export const Acme = Rpc.define({
  id: "acme",
  methods: {
    search: {
      input: Schema.Struct({ query: Schema.String }),
      output: Schema.Struct({ text: Schema.String }),
      errors: {
        not_found: Schema.Struct({ query: Schema.String }),
      },
    },
  },
  events: {
    updated: {
      schema: Schema.Struct({ itemID: Schema.String, text: Schema.String }),
    },
  },
})
```

### Validation

Effect Schema validates values and infers their TypeScript types.

```ts
input: Schema.Struct({ query: Schema.String })
```

JSON Schema and Standard Schema are also supported.

### Input and output

Use `input` for the method argument and `output` for its return value. Leave
either one out when there is no value.

```ts
search: {
  input: Schema.Struct({ query: Schema.String }),
  output: Schema.Struct({ text: Schema.String }),
}
```

### Errors

Add expected failures to `errors`. Each key becomes the error's `type`.

```ts
errors: {
  not_found: Schema.Struct({ query: Schema.String }),
}
```

### Events

Add events to the top-level `events` map. Event data must be an object.

```ts
events: {
  updated: {
    schema: Schema.Struct({ itemID: Schema.String, text: Schema.String }),
  },
}
```

## Implement

Register the implementation from the plugin Effect:

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"
import { Acme } from "./rpc.js"

export default Plugin.define({
  id: "acme-effect-plugin",
  effect: (ctx) =>
    Effect.gen(function* () {
      const registration = yield* ctx.rpc.register(Acme, {
        search: ({ query }, context) =>
          findText(query).pipe(
            Effect.flatMap((text) =>
              text
                ? Effect.succeed({ text })
                : Effect.fail(context.error("not_found", "Result not found", { query })),
            ),
          ),
      })

      const acme = ctx.rpc(Acme)
      const result = yield* acme.search({ query: "hello" })

      yield* registration.events.emit("updated", { itemID: "item-1", text: result.text })
    }).pipe(Effect.orDie),
})
```

The error map becomes the error type of each method Effect. Use
`context.error(...)` to create a declared error.

## Call

Once the RPC is registered, it can be called over HTTP or from another plugin.

### HTTP

Create the Effect client, then create the RPC subclient:

```ts
import { OpenCode } from "@opencode/client/effect"
import { Effect } from "effect"
import { FetchHttpClient } from "effect/http"
import { Acme } from "opencode-acme-plugin/rpc"

const program = Effect.gen(function* () {
  const client = yield* OpenCode.make({ baseUrl: "http://localhost:4096" })
  const acme = client.rpc(Acme)
  return yield* acme.search({ query: "hello" })
})

const result = await Effect.runPromise(program.pipe(Effect.provide(FetchHttpClient.layer)))
```

### Plugin

Another Effect plugin can create a local subclient from its context:

```ts
import { Effect } from "effect"

effect: (ctx) =>
  Effect.gen(function* () {
    const acme = ctx.rpc(Acme)
    const result = yield* acme.search({ query: "hello" })
    yield* Effect.logInfo(result.text)
  }).pipe(Effect.orDie)
```

### Subscribe

RPC events are Streams. Subscribe by event name and run the Stream in a scoped
fiber:

{/* prettier-ignore */}
```ts
import { Effect, Stream } from "effect"

const acme = ctx.rpc(Acme)

yield* acme.events.subscribe("updated").pipe(
  Stream.runForEach((event) => Effect.logInfo(event.data.text)),
  Effect.forkScoped,
)
```

Subscriptions are live only and close when Stream consumption stops.

==> ./plugins/gui/index.mdx <==
---
title: "GUI"
description: "Build the GUI part of an OpenCode plugin for OpenCode Desktop with @opencode/plugin/gui."
---

A GUI plugin adds panels, commands, settings pages, and native integrations to OpenCode Desktop with the GUI plugin SDK,
`@opencode/plugin/gui`. It is the `./gui-experimental` part of a [plugin package](/build/plugins), alone or beside a
[server part](/build/plugins/server) and a [TUI part](/build/plugins/cli).

<Callout type="note">
  The GUI plugin API is experimental and may change between releases. The `-experimental` export name says so in your
  package.
</Callout>

The `./gui-experimental` file default-exports `Plugin.define`, like the server and TUI parts:

```tsx title="src/gui.tsx"
import { Command, Plugin } from "@opencode/plugin/gui"
import { Acme } from "./rpc"

export default Plugin.define({
  i18n: { en: { "command.open": "Open Acme" } },
  setup(ctx) {
    ctx.add(Command, () => ({
      id: "open",
      title: ctx.t("command.open"),
      run: () => void ctx.client.rpc(Acme).open({}),
    }))
  },
  main(ctx) {
    ctx.log.write("info", "acme started")
  },
})
```

A GUI plugin can run in two processes:

- **`setup`** runs in every desktop app window. It contributes panels, commands, settings pages, slots, server sources,
  link handlers, and styles. See [The window](#the-window).
- **`main`** runs once, in the Electron main process. It provides typed `Ipc` contracts, native menu items,
  `WebContentsView` embeds, and Node and Electron integrations. See [The main process](#the-main-process).

## Package

A plugin package can ship server, TUI, and GUI code from one npm package. Add one `./gui-experimental` export beside
`./tui`, and OpenCode Desktop loads it for each plugin on its own background server.

```json title="package.json"
{
  "name": "opencode-acme-plugin",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./tui": "./src/tui.tsx",
    "./gui-experimental": "./dist/gui-experimental.cjs"
  },
  "dependencies": {
    "@opencode/plugin": "latest"
  },
  "devDependencies": {
    "solid-js": "^1.9.0",
    "vite": "^7.0.0",
    "vite-plugin-solid": "^2.11.0"
  }
}
```

Users install it like any other plugin; there is no separate GUI install step.

```jsonc title="opencode.jsonc"
{
  "plugins": ["opencode-acme-plugin"],
}
```

The GUI declares no id: it takes the plugin's, the server part's `id` or, for a package without a server part, the
package name (a local directory without a `name` uses the directory name). Read it as `ctx.id`.

### One file, two processes

Each process evaluates the whole `./gui-experimental` file and reads its default export. Windows run `setup`, and the
desktop app's main process runs `main`.

```tsx title="src/gui.tsx"
import { shell } from "electron"
import { Plugin } from "@opencode/plugin/gui"

export default Plugin.define({
  setup(ctx) {
    // Window code: Solid components, ctx.layout, ctx.add(Command, …).
  },
  main(ctx) {
    // Main code: electron, Node built-ins, ctx.windows.
    ctx.windows.on("open", () => shell.beep())
  },
})
```

Because both processes evaluate the same file, each one stands in inert placeholders for the other process's modules:

- **In a window,** `electron` and Node built-ins are inert placeholders.
- **In the main process,** Solid and the window-only modules are inert placeholders.

A placeholder accepts any property read, call, or construction at module scope, such as Solid's hoisted templates or a
bundler's hoisted `require` calls. Keep each process's code inside its own setup: code that runs in the wrong process
gets placeholders instead of working values.

`Plugin.define` and the contract helpers come from one SDK in both processes. In the main process,
`@opencode/plugin/gui` resolves to the main SDK, which exports the same `Plugin`, `Store`, `Ipc`, `Contract`, and
`Registry`. One definition serves both processes. Its window-only exports, such as `Command`, `bindPlugin`, and
`createKeyed`, are `undefined` in the main process, so use them only inside `setup`.

## Build the bundle

`./gui-experimental` must be one prebuilt CommonJS file. Build it with the Vite preset from `@opencode/plugin/gui/vite`:

```ts title="vite.config.ts"
import { defineConfig } from "vite"
import { gui } from "@opencode/plugin/gui/vite"

export default defineConfig({ plugins: [gui()] })
```

```bash
vite build
```

The preset does the following:

- Compiles Solid JSX with `vite-plugin-solid`.
- Emits one CommonJS file and inlines every dynamic `import()`, because the app cannot load a second chunk.
- Keeps the app's [shared modules](#shared-modules), Electron, and Node built-ins external, and bundles every other
  dependency.
- Fails the build on any other `effect/*`, `solid-js/*`, or `@opencode/*` module. The app does not provide it, and a
  bundled copy would not share the app's instance.

```text
effect/Schema is not a module the OpenCode app provides to plugin GUIs: effect, @opencode/plugin/gui, …
```

Import from the shared entry instead, for example `import { Schema } from "effect"`.

### Preset options

Pass options to `gui()` to change the entry or the output file.

```ts title="vite.config.ts"
export default defineConfig({ plugins: [gui({ entry: "src/desktop.tsx", outFile: "dist/desktop.cjs" })] })
```

- `entry` is the file that default-exports `Plugin.define`. It defaults to `src/gui.tsx`.
- `outFile` is the bundle that the `./gui-experimental` export points to. It defaults to `dist/gui-experimental.cjs`.

#### Reference

```ts
function gui(options?: GuiOptions): Plugin[]

interface GuiOptions {
  entry?: string
  outFile?: string
}
```

### Dependencies

Add the build tools as devDependencies. The app provides `@opencode/plugin/gui` at runtime, so the bundle only needs its
types from the `@opencode/plugin` dependency.

```bash
bun add -d vite vite-plugin-solid solid-js
```

For the Electron and Node types in `main`, also add `electron` and `@types/node`:

```bash
bun add -d electron @types/node
```

### Shared modules

Each process provides these modules to the bundle. Requiring a module that neither process provides fails the plugin's
GUI.

```ts
import { Schema } from "effect" // Both processes
import { createSignal } from "solid-js" // Windows; an inert placeholder in the main process
import { readFile } from "node:fs/promises" // The main process; an inert placeholder in windows
```

- **Both processes:** `effect`, `@opencode/plugin/gui`, `@opencode/plugin/gui/main`, `@opencode/plugin/rpc`,
  `@opencode/schema/rpc`, `@opencode/client`, and `@opencode/client/effect`.
- **Windows only:** `solid-js`, `solid-js/web`, `solid-js/store`, `@opencode/client/solid`, and
  `@opencode/plugin/gui/{file,review,browser}`. The main process gets inert placeholders.
- **Main process only:** `electron` and Node built-ins such as `node:fs`. Windows get inert placeholders.

## Where GUI entries load

OpenCode Desktop loads GUI entries from its own background server, which already loads the plugins from your config, so
they never add a new source of code. Configure the plugin in the global `opencode.json(c)` to make its GUI available in
every window.

<Callout type="note">
  The TUI reads its plugins from `cli.json`, but the desktop app reads only `opencode.json(c)`. A package that shipped
  only a TUI part, and that users list in `cli.json`, must also be listed in `opencode.json(c)` once it adds
  `./gui-experimental`.
</Callout>

The desktop app's main process lists the plugins and reads their bundles from its own server, with a credential that
only it holds, and sends windows the same set. A window cannot supply main-process code.

A plugin whose server part fails to load has no GUI.

## Reload and updates

Load the plugin from its local directory and rebuild on every change:

```bash
vite build --watch
```

- A local directory whose `package.json` has a `name` and `exports` resolves `./gui-experimental` through them. Without
  them, it loads `gui-experimental.cjs` (or `.js`) at its root. The entry must be `.cjs` or `.js`; any other file is
  ignored.
- Each rebuild reloads the plugin's GUI in every window and in the main process. The server entry does not restart.
- An installed package's GUI changes only with its version.
- Changing the plugin's `options` in `opencode.json(c)` reloads the plugin.
- `opencode plugin update` replaces a package's GUI once the update finishes.
- [**Settings > Extensions > Plugins**](/plugins#desktop) lists the plugin with a switch that turns its GUI off. To
  remove it, remove it from `opencode.json(c)` or run `opencode plugin remove <package>`.

<Callout type="note">
  The app's own plugins reserve their ids. If your plugin's id is one of them, nests under one with a `.`, has one
  nested under it, or is in the `opencode` namespace, its GUI does not load, and **Settings > Extensions > Plugins**
  lists it as not loaded.
</Callout>

## Define the GUI plugin

`Plugin.define` declares the systems the plugin runs on, its stored window state, its icons, and its copy. The host
reads these declarations before either setup runs.

```ts title="src/gui/definition.ts"
import { Schema } from "effect"
import { Plugin, Store } from "@opencode/plugin/gui"

export const definition = Plugin.define({
  os: ["macos", "linux"],
  stores: {
    prefs: Store.global(Schema.Struct({ enabled: Schema.Boolean }), { enabled: true }),
  },
  i18n: {
    en: { title: "Acme", "command.open": "Open Acme" },
    de: { title: "Acme", "command.open": "Acme öffnen" },
  },
})
```

- The host gives the plugin its id, `ctx.id`: the server part's `id`, or the package name for a package without a
  server part (the directory name for a local directory without a `name`). It prefixes every id the plugin creates: commands (`<id>.<command>`), panel keys (`<id>:<tab>`), stored
  keys (`plugin.<id>.<key>`), and the ids of the [contracts and Ipcs](#contracts-and-tokens) it provides.
- `os` limits the plugin to some operating systems. Omit it to run on every OS. A plugin whose `os` leaves out this
  system does not run, and **Settings > Extensions > Plugins** keeps its row with "Not available on this system."
- `stores` declares [stored state](#stored-state) for windows. Read it as `ctx.stores.<key>`.
- `icons` declares the plugin's [own icons](#icons), each an SVG file's text. Read an icon's name as
  `ctx.icons.<name>`.
- `i18n` holds copy by locale. Write every locale inline; English fills every key a locale lacks. Read it with
  `ctx.t(key, params)` and `ctx.plural(key, count)`. In a window, `ctx.t` also reads the app's shared keys, such as `common.*`. In `main`, a missing key returns the key.
- Define `setup`, `main`, or both. A GUI without either fails to load.
- Without setups, `Plugin.define` returns the declarations as a `Plugin.Declarations`, so setups in other files can be
  typed from them. `Plugin.Definition` is the type of the full definition.
- A plugin does not declare the contracts it provides or uses. It provides and reads them at runtime; see
  [Contracts and tokens](#contracts-and-tokens).

#### Reference

```ts
interface Declarations {
  os?: ("macos" | "windows" | "linux")[]
  stores?: Record<string, StoreDeclaration>
  icons?: Record<string, string>
  i18n?: { en: Messages; [locale: string]: Messages }
}

interface Definition extends Declarations {
  setup?(ctx: SetupContext<this>): Cleanup | void
  main?(ctx: MainContext): Cleanup | void | Promise<Cleanup | void>
}

type Messages = Record<string, string>

type Cleanup = () => void | Promise<void>
```

### Split across files

A small GUI plugin fits in `src/gui.tsx`. For a larger one, declare the plugin in `definition.ts`, put shared tokens in
`contract.ts`, write each setup in its own file, and combine them in `src/gui.tsx`.

```text
src/
├── index.ts            Server part: Plugin.define from @opencode/plugin
├── rpc.ts              RPC contract between the server part and its clients
├── gui.tsx             ./gui-experimental entry: export default Plugin.define({ ...definition, setup, main })
└── gui/
    ├── definition.ts   Plugin.define: os, stores, icons, i18n
    ├── contract.ts     Tokens other code may import: Ipc, Contract, Registry
    ├── window.tsx      Window setup: Plugin.Setup<typeof definition>
    ├── main.ts         Main setup: Plugin.MainSetup (desktop only)
    ├── page.tsx        Components that panels and pages render
    ├── icons/logo.svg  The plugin's own icons
    └── i18n/en.ts      English copy
```

The whole `./gui-experimental` file evaluates when a window boots, so keep module scope and `setup` light. Register
contributions there and do expensive work inside components, `createKeyed`, or `createLatest`.

For a larger plugin, declare the plugin first, type each setup from the declarations, then define the plugin with them.

```ts title="src/gui/definition.ts"
import { Schema } from "effect"
import { Plugin, Store } from "@opencode/plugin/gui"

export const definition = Plugin.define({
  stores: { notes: Store.global(Schema.Struct({ count: Schema.Number }), { count: 0 }) },
})
```

```tsx title="src/gui/window.tsx"
import type { Plugin } from "@opencode/plugin/gui"
import { Notes } from "./contract"
import type { definition } from "./definition"

export const setup: Plugin.Setup<typeof definition> = (ctx) => {
  ctx.provide(Notes, { count: () => ctx.stores.notes.value.count })
}
```

```ts title="src/gui/main.ts"
import type { Plugin } from "@opencode/plugin/gui"

export const main: Plugin.MainSetup = (ctx) => {
  ctx.log.write("info", "acme started")
}
```

```tsx title="src/gui.tsx"
import { Plugin } from "@opencode/plugin/gui"
import { definition } from "./gui/definition"
import { main } from "./gui/main"
import { setup } from "./gui/window"

export default Plugin.define({ ...definition, setup, main })
```

- `Plugin.Setup<typeof definition>` is the type of a window setup. It types `ctx.stores` from the declared stores and
  `ctx.icons` from the declared icons.
- `Plugin.MainSetup` is the type of a main setup, and `Plugin.Cleanup` the type of the cleanup function either setup
  may return.
- Import registries, tokens, and helpers such as `Command`, `SettingsPage`, `Panel`, `Slot`, `Contract`, `Ipc`,
  `Registry`, `Store`, `createKeyed`, `usePlugin`, and `bindPlugin` from `@opencode/plugin/gui`.
- Import main-only registries such as `MenubarItem` from `@opencode/plugin/gui/main`.

## Shared context

Both setups receive the plugin's options, a client for the OpenCode server, and app metadata, like the server and TUI
parts.

### Options

`ctx.options` holds the `options` from the plugin's `opencode.json(c)` entry: the same values the server part gets.

```jsonc title="opencode.jsonc"
{
  "plugins": [{ "package": "opencode-acme-plugin", "options": { "team": "core" } }],
}
```

```ts
setup(ctx) {
  const team = ctx.options.team
}
```

- Changing the options reloads the plugin.

### Server client

`ctx.client` is the OpenCode client of the server that runs the plugin: the desktop app's own server. Use it to call
your server part through its [RPC](/build/plugins/rpc).

```ts
import { Command } from "@opencode/plugin/gui"
import { Acme } from "./rpc"

ctx.add(Command, () => ({
  id: "search",
  title: ctx.t("command.search"),
  run: async () => {
    const result = await ctx.client.rpc(Acme).search({ query: "todo" })
    console.log(result)
  },
}))
```

- Read `ctx.client` where you call it. It changes after that server restarts.
- While the server is unreachable, every call rejects.

### App metadata

`ctx.app` describes the running app.

```ts
if (!ctx.app.packaged) console.log(`Acme on ${ctx.app.name} ${ctx.app.version} (${ctx.app.channel})`)
```

- `name` is `"opencode"`, as in a server plugin's `ctx.app.name`.
- `platform` is `"desktop"` in the Electron app and in `main`, and `"web"` in a browser tab.
- `packaged` is `true` when the desktop app runs packaged. It is always `false` on the web.
- Server plugins get `name`, `version`, and `channel`; TUI plugins get `version` and `channel`.

#### Reference

```ts
interface App {
  name: string
  version: string
  channel: "local" | "dev" | "beta" | "prod"
  platform: "web" | "desktop"
  packaged: boolean
}
```

## Contracts and tokens

Tokens let GUI plugins talk across processes and to each other without importing each other's runtime code. Put every
token in `contract.ts`. A token holds only its kind and id, plus the schemas of an `Ipc`, so other plugins can import it
without your runtime code.

- `ctx.provide(token, impl)` provides one of your own tokens: a `Contract` from the window setup, or an `Ipc` from
  `main`.
- `ctx.use(token)` follows a contract or an `Ipc` that another plugin provides. It returns a
  [`Live`](#live-dependencies-and-failure-handling) accessor.
- `ctx.main(ipc)` returns a client for an `Ipc` that your own `main` provides.

A plugin provides only tokens whose id is its own id or starts with it, as `<id>.<name>`. `ctx.provide` throws for any
other id, and `ctx.main` throws for an `Ipc` outside your id. The examples on this page use the plugin id `acme`, so
their token ids start with `acme.`.

```ts
Contract.define<AcmeBadge, "acme.badge">("acme.badge") // Plugin acme can provide it.
Contract.define<AcmeBadge, "badge">("badge") // ctx.provide throws in plugin acme.
```

### Contracts

Use `Contract.define` when one plugin's window setup exposes an API or a Solid component to other plugins' window
setups.

```ts title="src/gui/contract.ts"
import type { JSX } from "solid-js"
import { Contract } from "@opencode/plugin/gui"

export interface AcmeBadge {
  Badge(props: { readonly label: string }): JSX.Element
  count(): number
}

export const AcmeBadge = Contract.define<AcmeBadge, "acme.badge">("acme.badge")
```

Provide it from the window setup with `ctx.provide`. When the contract holds a component, wrap it with `bindPlugin`
during setup. Then `usePlugin()` inside it reads the provider's context, not the consumer's.

```tsx title="src/gui.tsx"
import { bindPlugin, Plugin } from "@opencode/plugin/gui"
import { AcmeBadge } from "./gui/contract"

export default Plugin.define({
  i18n: { en: { title: "Acme" } },
  setup(ctx) {
    ctx.provide(AcmeBadge, {
      Badge: bindPlugin((props: { readonly label: string }) => (
        <span>
          {ctx.t("title")}: {props.label}
        </span>
      )),
      count: () => 42,
    })
  },
})
```

- Annotate the props of a component you wrap with `bindPlugin`, as in `bindPlugin((props: FileTreeProps) => ...)`.
  TypeScript cannot infer them inside `ctx.provide`.
- Leave data methods, such as `count`, unwrapped.
- `ctx.provide` returns a function that withdraws the contract early. The host also withdraws it with the current owner,
  else when the plugin stops.

### Use another plugin's contract

Export `contract.ts` from your package, for example as `./contract`, so other plugins can import its tokens. Another
plugin follows the contract with `ctx.use(token)`. The accessor's value changes as the provider starts, stops, and
restarts, so read it where you use it.

```tsx title="src/gui.tsx"
import { Plugin, Slot } from "@opencode/plugin/gui"
import { AcmeBadge } from "opencode-acme-plugin/contract"

export default Plugin.define({
  setup(ctx) {
    const badge = ctx.use(AcmeBadge)

    const count = () => {
      const live = badge()

      return live.status === "active" ? live.value.count() : 0
    }

    ctx.add(Slot, { at: "window.bottom", render: () => <span>{count()}</span> })
  },
})
```

- `ctx.use` returns the same accessor for every call with the token.
- The consumer keeps working while the provider is off. See
  [Live dependencies and failure handling](#live-dependencies-and-failure-handling).

### IPC between main and windows

Use `Ipc.define` with Effect `Schema` codecs to define a typed bridge between `main` and `setup`. `main` implements it
with `ctx.provide`, and the window calls it through `ctx.main`.

```ts title="src/gui/contract.ts"
import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const KeepAwake = Ipc.define({
  id: "acme.awake",
  methods: {
    screenActive: { output: Schema.Boolean },
    setScreenActive: { input: Schema.Boolean },
  },
})
```

```ts
const awake = ctx.main(KeepAwake)

await awake.setScreenActive(true)
```

- Other plugins follow your `Ipc` with `ctx.use(KeepAwake)`, like a contract.
- See [Define and provide an Ipc](#define-and-provide-an-ipc) for state, events, and the provider.

### Registries your plugin owns

Use `Registry.define` for a list your plugin owns. Other plugins contribute items with `ctx.add`, and your plugin reads
them with `ctx.list`.

```ts title="src/gui/contract.ts"
import { Registry } from "@opencode/plugin/gui"

export interface Exporter {
  readonly id: string
  readonly title: string
  run(text: string): void
}

export const Exporter = Registry.define<Exporter>("acme.exporter")
```

```tsx
// Another plugin contributes an item.
ctx.add(Exporter, () => ({ id: "gist", title: ctx.t("exporter.gist"), run: (text) => upload(text) }))

// The owner lists every contribution. Reactive: read it in render or in a memo.
const exporters = () => ctx.list(Exporter)
```

## The window

A plugin's `setup` runs in every desktop app window. Pass it to `Plugin.define` from `@opencode/plugin/gui` in the
plugin's [`./gui-experimental` file](#define-the-gui-plugin). `setup` is synchronous and may return a
cleanup function; see [Lifetimes and cleanup](#lifetimes-and-cleanup).

```tsx title="src/gui.tsx"
import { Command, Plugin } from "@opencode/plugin/gui"

export default Plugin.define({
  i18n: { en: { open: "Open Acme" } },
  setup(ctx) {
    ctx.add(Command, () => ({
      id: "open",
      title: ctx.t("open"),
      run: () => ctx.system.openExternal("https://acme.example"),
    }))
  },
})
```

## Components

Inside Solid components, call `usePlugin<typeof definition>()` for the same context object that `setup` receives. Type
it from the declarations in their own file ([split across files](#split-across-files)), so the
component and the definition do not import each other.

```tsx title="src/gui/window.tsx"
import { Slot, usePlugin, type Plugin } from "@opencode/plugin/gui"
import type { definition } from "./definition"

function StatusLabel() {
  const ctx = usePlugin<typeof definition>()

  return <span>{ctx.t("title")}</span>
}

export const setup: Plugin.Setup<typeof definition> = (ctx) => {
  ctx.add(Slot, { at: "window.bottom", render: () => <StatusLabel /> })
}
```

`usePlugin` throws outside a plugin contribution. In a component that another plugin renders, it returns that plugin's
context, so wrap a component you provide on a contract with `bindPlugin`; see [Contracts](#contracts).

## Icons

Every `icon` field of the SDK, and `ctx.ui.Icon`, takes an `IconName`: the name of one of the app's own icons, or of
an icon your plugin declares. Any other string fails to compile.

```ts
ctx.add(TitlebarItem, () => ({ id: "sync", label: ctx.t("sync"), icon: "server", run: () => sync() }))
```

### Declare your own icons

For artwork the app does not have, such as your product's mark, keep the SVG file in your package and declare it in
`icons`. Import the file with `?raw`, which the `gui()` preset bundles as text.

```ts title="src/gui/definition.ts"
import { Plugin } from "@opencode/plugin/gui"
import logo from "./icons/logo.svg?raw"

export const definition = Plugin.define({
  icons: { logo },
})
```

Then pass the icon's name from `ctx.icons` wherever an `IconName` goes.

```tsx title="src/gui/window.tsx"
import { ComposerPill, Slot, type Plugin } from "@opencode/plugin/gui"
import type { definition } from "./definition"

export const setup: Plugin.Setup<typeof definition> = (ctx) => {
  ctx.add(ComposerPill, {
    id: "sync",
    show: () => ({ label: ctx.t("synced"), icon: ctx.icons.logo, tone: "success" }),
  })

  ctx.add(Slot, { at: "window.bottom", render: () => <ctx.ui.Icon name={ctx.icons.logo} size="small" /> })
}
```

- `ctx.icons` has one name for each icon you declare. A name you did not declare fails to compile.
- The host registers your icons before `setup` runs and withdraws them when the plugin goes away.
- A value that is not an SVG document fails the plugin when it starts.
- For the `?raw` import to type-check, add `"vite/client"` to `types` in your `tsconfig.json`.

### Draw an icon

The host draws your icon as it draws its own: at the size and in the color of the place that shows it.

```xml title="src/gui/icons/logo.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
  <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
  <path d="M5 8.5 7 10.5 11 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

- The `viewBox` frames the drawing, or the `width` and `height` when there is none. The host scales it to 14, 16 or
  20 pixels, so draw on a 16-pixel grid.
- Draw with `currentColor`. The icon then takes the color of its place, such as a pill's `tone` or a menu row's muted
  icon color.
- An `id` in the drawing belongs to the whole window. Keep ids unique, or leave them out.

### Animate an icon

An icon can move, for example to show that work is in progress. Use SVG animation elements, such as `animate` and
`animateTransform`, inside the file.

```xml title="src/gui/icons/working.svg"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
  <circle cx="8" cy="8" r="6.5" stroke="currentColor" />
  <circle cx="8" cy="8" r="2" fill="currentColor">
    <animate attributeName="r" values="2;4.5;2" dur="2.4s" repeatCount="indefinite" />
  </circle>
</svg>
```

- Every place that shows the icon moves in step.
- The animation goes on while the host renders the place again, such as when a pill's `show` runs again.
- Under the user's reduced motion setting, the host holds every icon on its first frame. Make the first frame the
  resting drawing.
- An icon that no place shows costs nothing.

### Stored icon names

An icon's name is a string, `<plugin id>:<name>`, so the host stores it like the name of one of its own icons. A
[composer note or quote](#attach-to-the-composer) keeps it with the draft and the sent message, and a
[closed tab](#reopen-closed-tabs) keeps it with the session's layout.

```ts
ctx.screen.current()?.composer.attach({
  type: "note",
  origin: ctx.id,
  commentID: crypto.randomUUID(),
  label: "button#submit",
  icon: ctx.icons.logo,
  subject: 'element <button id="submit">Save</button>',
  comment: "",
})
```

- While your plugin is not active, the icon draws nothing and keeps its size.
- Read the name from `ctx.icons` where you use it. A name written by hand fails to compile.

#### Reference

```ts
type IconName = AppIconName | PluginIconName

// One of the app's own icons, such as "folder", "github" or "terminal".
type AppIconName = string

// The name of an icon the plugin declared, from ctx.icons.
type PluginIconName = string

interface Declarations {
  icons?: Record<string, string>
}

interface SetupContext<D> extends Context {
  icons: Record<string, PluginIconName>
}
```

## Registries

Pass a registry token and an item to `ctx.add` to contribute to the window shell. Pass the item as a function,
`() => item | undefined`, when it follows reactive state such as the language. The host runs the function again when
what it reads changes. Return `undefined` to withdraw the item until the function returns one again.

```ts
ctx.add(Command, () => ({ id: "open", title: ctx.t("command.open"), run: () => open() }))
```

- Read labels with `ctx.t` inside the function. A label read once, in a fixed item, keeps the language it was read in.
- When the item has a field of a literal type, such as `hidden: true`, a `section`, an `icon`, or a menu name, annotate
  the function's return type: `(): Command => ({ ... })`. Without it, TypeScript widens the field to `string` or
  `boolean`, and no overload matches.
- Pass a fixed item when it never changes, such as a [style](#styles).
- The host keeps some objects stable: the tabs a panel returns from `list`, and items with a `render`, such as panels
  and settings pages. Read their labels from getters, such as `get title() { return ctx.t("title") }`.
- `ctx.add` returns a function that withdraws the item early.

### Commands

`Command` adds an action to the command palette, **Settings > Shortcuts**, and optionally the composer's `/` menu. The
host publishes the command as `<plugin id>.<command id>`.

```ts
import { Command } from "@opencode/plugin/gui"

ctx.add(
  Command,
  (): Command => ({
    id: "toggle",
    title: ctx.t("command.toggle"),
    keywords: "notes scratch",
    group: ctx.t("command.category.view"),
    section: "terminal",
    bind: "ctrl+`",
    slash: { name: "notes", after: "open" },
    featured: true,
    enabled: !!ctx.sessions.current(),
    run: () => {
      const session = ctx.sessions.current()

      if (session) ctx.layout.toggle(`${ctx.id}:main`, session)
    },
  }),
)
```

- `title` is the palette label, `description` its second line, and `group` its category, as translated text.
- `keywords` holds extra words the palette matches, separated by spaces.
- `section` is the **Settings > Shortcuts** section. It defaults to `general`.
- `bind` is the default keybind, for example `mod+shift+t`. Users can change it.
- `slash` also offers the command in the `/` menu. With `arguments: true`, the text after the name goes to
  `run(input)`.
- `hidden` keeps the command out of the palette, but its keybind still works.
- `suggested` also lists the command under **Suggested** while it is enabled. `featured` lists it when the palette opens
  without a query.
- `enabled: false` takes the command out of the palette and turns its keybind off. It is reactive.
- `scope` is a CSS selector that keyboard focus must be inside for the binding to apply. With `editable`, the binding
  also fires while a text field has focus.
- To run a command from your own code, use `ctx.commands.run`; see [Run commands](#run-commands).

From a keybind, `run` can return `false` to decline the key. The event then goes on to its target, as if the command
had no keybind. This command continues the session when the user presses Enter in an empty prompt, and leaves every
other Enter to the prompt:

```ts
ctx.add(Command, () => ({
  id: "continue",
  title: ctx.t("command.continue"),
  bind: "enter",
  editable: true,
  hidden: true,
  run: () => {
    const composer = ctx.screen.current()?.composer
    const session = ctx.sessions.current()

    if (!composer?.focused() || composer.text().trim() || !session) return false
    void session.server.client.session.prompt({ sessionID: session.id, text: ctx.t("continue") })
  },
}))
```

- Return `false` synchronously; a promise handles the key.
- `false` from the palette or a slash command does nothing more.

#### Reference

```ts
interface Command {
  id: string
  title: string
  description?: string
  keywords?: string
  group?: string
  section?: "general" | "session" | "navigation" | "model" | "terminal" | "prompt"
  bind?: string
  slash?: { name: string; arguments?: true; after?: string }
  hidden?: true
  suggested?: boolean
  featured?: true
  enabled?: boolean
  scope?: string
  editable?: true
  run(input?: string): void | false | Promise<void>
}
```

### Panels

`Panel` contributes tabs to a session's side region (`region: "side"`). The user can drag a tab to a bottom pane below
the timeline.

```tsx
import { Panel, type PanelTab } from "@opencode/plugin/gui"

const mainTab: PanelTab = {
  id: "main",
  get title() {
    return ctx.t("panel.title")
  },
  closable: "compact",
  fallback: true,
}

ctx.add(Panel, {
  id: "main",
  region: "side",
  mobile: {
    get title() {
      return ctx.t("panel.title")
    },
    order: 45,
    kind: "menu",
    icon: "file-tree",
  },
  list: (input) => (input.open.includes("main") ? [mainTab] : []),
  render: (props) => <NotesView session={props.session} screen={props.screen} tab={props.tab} />,
})
```

All panel callbacks (`list`, `render`, `focus`, `enter`, `close`, `closed`, `restore`, `normalize`) receive a single
input object:

- Read `props.session` and `props.tab` as reactive getters where you use them. Never destructure them at the top of
  `render`: when the user switches from session A to session B, the panel stays mounted and `props.session` updates in
  place.
- `props.screen` is the constant owning `SessionScreen` (`file`, `comment`, `composer`). Its actions always target the
  session that is routed.
- Return the same `PanelTab` object from `list` while a tab is unchanged, so the host does not remount its trigger.
  Read its labels from getters, so they follow the language without a new object.

A panel's callbacks:

- `list` returns the tabs to show. `input.open` holds this plugin's tab ids stored in the session. It is reactive.
- `render` renders a tab's content once.
- `focus` runs when a tab is selected. `restored` is `true` for the selection the region mounts with.
- `enter` runs when the user opens the side region on the tab with its toggle, once the tab is on screen. Move keyboard
  focus to the tab's own target, such as a text field. When focus is still outside the region, the host focuses the
  region.
- `close` runs after the host removes a tab.
- `closed` and `restore` let the user reopen a closed tab; see [Reopen closed tabs](#reopen-closed-tabs).
- `normalize` returns the canonical form of a stored tab id that can be stored more than one way.

A panel's options:

- `mobile` adds a narrow-screen view of the panel. With `cached: true`, the view stays mounted while the user shows
  another view. By default, the view mounts each time it shows.
- `wide` asks for the wider session minimum while the side region is open.
- `width` gives the panel a side region width of its own; see [Panel width](#panel-width).
- `transient` panels' tabs are not restored.

#### Panel width

By default, every tab in the side region shares the conversation's width. Set `width` when your panel needs less room
than a review or a browser, or more. Pass CSS pixels, or `"narrow"` for the narrowest the region goes.

```ts
ctx.add(Panel, {
  id: "quota",
  region: "side",
  width: "narrow",
  list: (input) => (input.open.includes("quota") ? [tab] : []),
  render: () => <Quota />,
})
```

- The width applies while the side pane shows one of the panel's tabs. Other tabs keep the conversation's width.
- When the user drags the divider on one of the panel's tabs, the host keeps that width for the panel, app-wide, in place
  of `width`.
- The host keeps the conversation at its minimum width and the region at least `"narrow"`.
- `ctx.layout.side.width(panel)` reads the stored width, and `ctx.layout.side.resize(panel, width)` stores one, as a drag
  does. A stored width applies even to a panel without `width`.

A tab's options:

- `id` is the tab id; its host key is `<plugin id>:<id>`. `title` is its accessible name, and `label` renders custom
  trigger content.
- `pinned` tabs are listed without being opened, come first, and are never closed or dragged.
- `draggable` lets the user reorder the tab. It defaults to `true`.
- `closable` sets the close button's look: `"compact"`, `"hover"`, or `false` for none.
- `transient` marks a launcher tab, such as **Open file**, that the next preview replaces.
- `fallback` opts into fallback selection when the stored selection is missing.
- Tabs in one `group` share one render that stays mounted.
- `missing` strikes the tab through, for example for a file that no longer exists.
- `hidden` keeps a restored tab listed and selectable but not drawn, while its content is not known yet.
- `file` is the workspace path the tab shows, listed as one of the session's open files.
- `tabbable` puts the tab panel in the tab order, for content without focusable elements.

#### Reference

```ts
interface Panel {
  id: string
  region: "side"
  mobile?: MobileView
  wide?: boolean
  width?: number | "narrow"
  transient?: boolean
  list(input: { session: MountedSession; screen: SessionScreen; open: string[] }): PanelTab[]
  render(props: PanelProps): JSX.Element
  focus?(input: PanelProps & { restored: boolean }): void
  enter?(input: PanelProps): void
  close?(input: PanelProps): void
  closed?(input: PanelProps): ClosedPanelTab | false | undefined
  restore?(input: { session: MountedSession; screen: SessionScreen; id: string; data?: string }): void
  normalize?(input: { id: string; session: MountedSession; screen: SessionScreen }): string
}

interface PanelProps {
  tab: PanelTab
  session: MountedSession
  screen: SessionScreen
}

interface PanelTab {
  id: string
  title: string
  label?(state: { active: boolean; preview: boolean; session: MountedSession }): JSX.Element
  pinned?: boolean
  draggable?: boolean
  closable?: "compact" | "hover" | false
  transient?: boolean
  fallback?: boolean
  group?: string
  missing?: boolean
  hidden?: boolean
  file?: string
  tabbable?: boolean
}

interface MobileView {
  title: string
  order: number
  kind: "tab" | "menu" | "drawer"
  icon?: IconName
  cached?: boolean
}
```

### Reopen closed tabs

The host keeps an entry for each side tab the user closes. While focus is in the side region, ⌘⇧T reopens the newest
one. The side region's **New tab** view lists closed tabs that show a `file` under **Recently closed**. Add `closed` and
`restore` to control how a tab reads there and how it comes back.

```tsx
ctx.add(Panel, {
  id: "page",
  region: "side",
  list: (input) => input.open.map(pageTab),
  render: (props) => <PageView tab={props.tab} />,
  closed: (input) => {
    const url = pages.get(input.tab.id)

    return url ? { icon: "globe", detail: new URL(url).host, data: url } : false
  },
  restore: (input) => {
    if (input.data) openPage(input.session, input.data)
  },
})
```

- `closed` runs as the user closes a tab. Capture what reopening needs now: return how the row reads and the `data`
  that `restore` needs, or `false` when the tab cannot come back.
- `title` defaults to the tab's title, and `icon` to the panel's mobile icon. A tab with a `file` shows its file icon,
  and its folder as `detail`.
- The host stores the entry, so keep `data` small, such as a URL.
- `restore` receives the closed tab's `id` and the `data` that `closed` returned. Without `restore`, the host opens the
  same key again.
- Without `closed`, a tab that is not `transient` lists under its title and reopens under the same key.

#### Reference

```ts
interface ClosedPanelTab {
  title?: string
  icon?: IconName
  detail?: string
  data?: string
}
```

### Settings pages

`SettingsPage` contributes a page to **Settings**, a section on a host page (`page: "general"` or `page: "servers"`), or
rows in the host's General section (`page: "general", section: "general"`).

```tsx
import { SettingsPage } from "@opencode/plugin/gui"
import { AcmeSettings } from "./settings"

ctx.add(SettingsPage, {
  id: "acme",
  icon: "server",
  get title() {
    return ctx.t("title")
  },
  get entries() {
    return [{ id: "sync", title: ctx.t("settings.sync"), keywords: "sync remote" }]
  },
  render: (input) => <AcmeSettings highlight={input.target} />,
})
```

- `id` is the page's settings tab value (`/settings?tab=<id>`) and the argument to `ctx.layout.settings`.
- `page` adds a section to a host page instead of a page. With `section: "general"`, it adds rows to that page's General
  section.
- `title` and `icon` are a page's navigation label and icon.
- `entries` is search metadata, indexed without mounting the page. When search reveals an entry, `render` receives its
  id as `target`.
- A settings page has a `render`, so the host keeps it stable. Read its labels and entries from getters.

Render the page with the app's settings components, so it looks like the app's own pages and search can reveal its
rows:

```tsx
const ui = ctx.ui

const AcmeSettings = () => (
  <ui.SettingsLayout title={ctx.t("title")} description={ctx.t("description")}>
    <ui.SettingsSection title={ctx.t("settings.section")}>
      <ui.SettingsRow id="sync" title={ctx.t("settings.sync")} description={ctx.t("settings.sync.description")}>
        <ui.Switch label={ctx.t("settings.sync")} hideLabel checked={sync()} onChange={setSync} />
      </ui.SettingsRow>
    </ui.SettingsSection>
  </ui.SettingsLayout>
)
```

- A page of your own renders `SettingsLayout`, a section on a host page (`page`) renders `SettingsSection`, and rows
  in a host section (`section`) render `SettingsRow`s.
- A row's `id` is the `SettingEntry.id` that reveals it: search scrolls to the row and highlights it.
- See [Settings components](#settings-components) for their props.

#### Reference

```ts
interface SettingsPage {
  id: string
  page?: "general" | "servers"
  section?: "general"
  title: string
  icon?: IconName
  entries?: SettingEntry[]
  render(input: { target?: string }): JSX.Element
}

interface SettingEntry {
  id: string
  title: string
  description?: string
  keywords?: string
}
```

### Slots

`Slot` renders UI into one of four window slots.

```tsx
import { Slot } from "@opencode/plugin/gui"

ctx.add(Slot, {
  at: "session.header",
  order: 10,
  render: (input) => <UsageRing session={input.session} active={input.active} />,
})
```

- `window.bottom` is a full-width strip at the bottom of the window, above toasts.
- `session.header` is the session timeline's title row. A cached timeline stays mounted while hidden, with `active`
  `false`.
- `session.location.menu` adds items to the project menu, after its location details.
- `session.panel.end` holds actions at the trailing end of the side region's tab strip.
- `order` sorts the items in one slot.

`session.location.menu` receives `shown`, which is `true` while the project menu is open. Subscribe to location data
only while it is `true`:

```tsx
ctx.add(Slot, {
  at: "session.location.menu",
  render: (input) => <BranchStatus session={input.session} screen={input.screen} shown={input.shown} />,
})
```

The project menu is a host menu: render its rows with `ctx.ui.MenuItem`, `MenuSub`, `MenuGroup`, and `MenuSeparator`,
so they navigate with the keyboard and close the menu like the host's rows. See [Menu rows](#menu-rows).

```tsx
ctx.add(Slot, {
  at: "session.location.menu",
  render: (input) => <ctx.ui.MenuItem label={ctx.t("usage")} icon="status" onSelect={() => openUsage(input.session)} />,
})
```

#### Reference

```ts
type Slot = {
  [At in keyof SlotMap]: { at: At; order?: number; render(input: SlotMap[At]): JSX.Element }
}[keyof SlotMap]

interface SlotMap {
  "window.bottom": Record<string, never>
  "session.header": { screen: SessionScreen; session: MountedSession; active: boolean }
  "session.location.menu": { screen: SessionScreen; session: MountedSession; shown: boolean }
  "session.panel.end": { screen: SessionScreen; session: MountedSession }
}
```

### Menu items

`MenuItem` adds an entry to the side panel's **+** menu (`"session.panel"`), the **Add server** menu (`"server.add"`),
or each server's row menu in Settings (`"server.row"`).

```ts
import { MenuItem } from "@opencode/plugin/gui"

ctx.add(MenuItem, (): MenuItem => {
  const session = ctx.sessions.current()

  return {
    menu: "session.panel",
    id: "open",
    title: ctx.t("menu.open"),
    icon: "folder",
    keybind: `${ctx.id}.open`,
    opened: !!session && ctx.layout.state(`${ctx.id}:main`, session) !== "closed",
    run: () => {
      if (session) ctx.layout.open(`${ctx.id}:main`, session)
    },
  }
})
```

- `order` sorts the items in ascending order. It defaults to `0`.
- A `server.row` item's `run` receives the row's server key. `when` lists the item only on some rows, and `enabled`
  shows it disabled on others.

A `session.panel` item is also a launcher. When the user opens the side region with no tabs, or clicks **+** while no
item is `primary`, the host shows a **New tab** view that lists the launchers.

- `icon` is the item's icon, and `keybind` a published command id whose shortcut the item shows.
- `description` is a short muted detail after the title in a launcher row, such as a count.
- `opened: true` means the tab the item opens is already open. Launcher lists leave the item out, and the **+** menu
  still lists it.
- `primary: true` makes **+** run the item directly instead of showing the launchers. The first primary item in `order`
  wins. Opening the side region with no tabs still shows the **New tab** view, which lists the items that are not
  primary and not open.
- `ctx.layout.side.menu()` lists every plugin's `session.panel` items, for a launcher of your own; see
  [Layout](#layout).

#### Reference

```ts
type MenuItem = SessionPanelMenuItem | ServerAddMenuItem | ServerRowMenuItem

interface SessionPanelMenuItem {
  menu: "session.panel"
  id: string
  title: string
  order?: number
  icon?: IconName
  keybind?: string
  description?: string
  opened?: boolean
  primary?: true
  run(): void
}

interface ServerAddMenuItem {
  menu: "server.add"
  id: string
  title: string
  order?: number
  run(): void
}

interface ServerRowMenuItem {
  menu: "server.row"
  id: string
  title: string
  order?: number
  when?(server: string): boolean
  enabled?(server: string): boolean
  run(server: string): void
}
```

### Titlebar items

`TitlebarItem` renders a pill button in the window titlebar or tabs footer. Its label shows on hover.

```ts
import { TitlebarItem } from "@opencode/plugin/gui"

ctx.add(TitlebarItem, (): TitlebarItem | undefined =>
  syncing() ? { id: "sync", label: ctx.t("syncing"), icon: "server", busy: true, run: () => sync() } : undefined,
)
```

- `title` is the accessible name when it differs from `label`.
- `busy` shows a spinner and disables the pill. `pressed` shows it pressed.
- `run` runs on click. Omit it for an item that only shows.

#### Reference

```ts
interface TitlebarItem {
  id: string
  label: string
  title?: string
  icon?: IconName
  busy?: boolean
  pressed?: boolean
  run?(): void
}
```

### Composer pills

`ComposerPill` adds a pill to the row above a session's composer, beside the app's background work and todo pills.
Use it for status that belongs to the session the user is working in, such as the pull requests of its branch. Pills
float over the timeline, so a pill that comes or goes never resizes the composer. The row follows the user's background
activity alignment, and it does not show in a subagent's session.

`show` returns the pill for one session, or `undefined` to show none there. The host runs it for each mounted
composer, and again when what it reads changes. This plugin lists the open pull requests of each session's directory
through its server part's [RPC](/build/plugins/rpc), and shows them as one pill:

```tsx
import { createStore } from "solid-js/store"
import { ComposerPill, createKeyed } from "@opencode/plugin/gui"
import { GitHub, type Pull } from "./rpc"

const [pulls, setPulls] = createStore<Record<string, readonly Pull[]>>({})

createKeyed(
  () => ctx.sessions.current()?.directory,
  (directory) =>
    void ctx.client
      .rpc(GitHub)
      .pulls({ directory })
      .then((list) => setPulls(directory, list)),
)

ctx.add(ComposerPill, {
  id: "pulls",
  show: (input) => {
    const list = pulls[input.session.directory] ?? []

    if (list.length === 0) return undefined

    return {
      icon: "github",
      label: ctx.plural("pulls", list.length),
      tone: list.some((pull) => pull.checks === "failure") ? "danger" : undefined,
      title: ctx.t("pulls.title"),
      rows: list.map((pull) => ({
        id: String(pull.number),
        label: `#${pull.number} ${pull.title}`,
        icon: pull.checks === "failure" ? "circle-x" : "circle-check",
        tone: pull.checks === "failure" ? "danger" : "success",
        detail: pull.branch,
        run: () => ctx.system.openExternal(pull.url),
      })),
    }
  },
})
```

- `label` is the pill's text and truncates when long. `icon` is optional.
- `tone` colors the icon: `"success"`, `"warning"` or `"danger"`.
- For a glyph the app does not have, such as a status mark that moves, [declare your own icon](#icons) and pass
  `ctx.icons.<name>`. It takes the `tone` like any icon, and its animation goes on while `show` runs again.
- `rows` make the pill open a menu under the heading `title`, or `label` without one. Each row has its own `icon`,
  `tone` and muted `detail`, and runs `run` when picked; a row without `run` only shows.
- Without `rows`, the pill runs `run` on click.
- `title` is also the pill's accessible name when it differs from `label`.
- `order` sorts your pills among other plugins' pills, lowest first. The app's own pills come first.
- A `show` that throws fails only your plugin's contribution.

#### Reference

```ts
interface ComposerPill {
  id: string
  order?: number
  show(input: ComposerPillProps): ComposerPillView | undefined
}

interface ComposerPillProps {
  session: MountedSession
  screen: SessionScreen
}

interface ComposerPillView {
  label: string
  icon?: IconName
  tone?: ComposerPillTone
  title?: string
  rows?: ComposerPillRow[]
  run?(): void
}

interface ComposerPillRow {
  id: string
  label: string
  icon?: IconName
  tone?: ComposerPillTone
  detail?: string
  run?(): void
}

type ComposerPillTone = "success" | "warning" | "danger"
```

### Code blocks

`CodeBlock` renders the fenced code blocks of the languages you list as your own UI, in place of the highlighted code.
Use it for content that reads better drawn than as source, such as a ` ```csv ` table or a ` ```latex `
formula:

```tsx
import { For } from "solid-js"
import { CodeBlock } from "@opencode/plugin/gui"

ctx.add(CodeBlock, {
  languages: ["csv"],
  render: (props) => {
    const rows = props.code.split("\n").map((line) => line.split(","))

    if (rows.length < 2) return undefined

    return (
      <table>
        <tbody>
          <For each={rows}>
            {(row) => (
              <tr>
                <For each={row}>{(cell) => <td>{cell}</td>}</For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    )
  },
})
```

- `languages` are compared with the first word of the fence's info string, lowercased: ` ```CSV title="Q3" `
  matches `csv`. The host resolves no aliases, so list each name you accept.
- `render` receives the block's `code`, its `language` and the `session` that shows it. Return `undefined` or `null` to
  keep the highlighted code, for example when the source does not parse.
- A render that throws records the error under your plugin, and the block shows its code. Your other contributions
  keep working.
- When several plugins list a language, the first contributed renders it. Your renderer also replaces the app's own
  Mermaid diagram when you list `mermaid`.

#### Streaming

The host renders a block only once its closing fence arrives. While the block streams, and in a message that stopped
mid-block, the user sees the highlighted code; then your UI replaces it in place. Your render never sees half a block.

#### Where it applies

| Surface                                                        | Code block content |
| -------------------------------------------------------------- | ------------------ |
| Timeline: assistant text and tool output                       | Yes                |
| Side panels on the session screen, e.g. the Markdown preview   | Yes                |
| `ctx.ui.Markdown` rendered on the session screen               | Yes                |
| `ctx.ui.Code`, and Markdown inside your own `CodeBlock` render | No                 |
| Settings pages, dialogs and other surfaces off the screen      | No                 |

#### Layout and performance

- Blocks of languages no plugin lists cost nothing; only a block of a listed language renders your UI, and only while
  its timeline row is on screen.
- The block grows and shrinks with your UI. Give asynchronous content a minimum height, so the timeline shifts less
  when it arrives.
- The block keeps its Copy button, which copies the source, and your `CodeBlockAction` buttons over its top end corner.

### Code block actions

`CodeBlockAction` adds a button beside the Copy button of the code blocks of the languages you list. `run` receives the
same block a `CodeBlock` render receives:

```ts
import { CodeBlockAction } from "@opencode/plugin/gui"

ctx.add(CodeBlockAction, {
  id: "run",
  languages: ["sh", "bash", "shell", "zsh"],
  icon: "terminal",
  get title() {
    return ctx.t("run")
  },
  run: (input) => runInTerminal(input.code, input.session),
})
```

- The button shows once the block's closing fence arrives, so it never acts on half a command.
- Buttons reveal with Copy on hover or keyboard focus, before it, in ascending `order`.
- Read `title` from a getter so it follows the locale.
- A `run` that throws or rejects is logged under your plugin and changes nothing else.

#### Reference

```ts
interface CodeBlock {
  languages: string[]
  render(props: CodeBlockProps): JSX.Element | undefined
}

interface CodeBlockAction {
  id: string
  languages: string[]
  icon: IconName
  title: string
  order?: number
  run(input: CodeBlockProps): void | Promise<void>
}

interface CodeBlockProps {
  code: string
  language: string
  session?: MountedSession
}
```

### Link handlers

`LinkHandler` opens local file or custom links that users click in messages or composer chips. The handler with the
highest `priority` whose `match` returns true opens the link.

```ts
import { LinkHandler } from "@opencode/plugin/gui"

ctx.add(LinkHandler, {
  priority: 10,
  match: (link) => link.href.endsWith(".acme"),
  open: (link) => openAcmeFile(link.href, link.session),
  exists: (link) => acmeFileExists(link.href),
})
```

- `href` is the target: a path, a URL, or a `file://` link.
- `origin` is the plugin that produced the linked item.
- `exact` means the path is a known workspace file, not a guess from text.
- A `background` link must not switch the narrow-screen view.
- `base` is the workspace-relative directory the link was written in.
- Without `exists`, `ctx.links.exists` answers `false`, so text never looks like a link the handler cannot open.

#### Reference

```ts
interface LinkHandler {
  priority?: number
  match(link: Link): boolean
  open(link: Link): void
  exists?(link: Link): boolean | Promise<boolean>
}

interface Link {
  href: string
  origin?: string
  exact?: boolean
  background?: boolean
  base?: string
  session?: SessionRef
}
```

### Servers

`Server` contributes a list of server connections, such as servers your plugin starts on other machines.

```ts
import { Server } from "@opencode/plugin/gui"

ctx.add(
  Server,
  (): Server => ({
    ready: loaded(),
    entries: machines().map((machine) => ({
      id: machine.id,
      name: machine.name,
      label: "Acme",
      state: machine.url ? "ready" : "starting",
      http: machine.url ? { url: machine.url } : undefined,
    })),
  }),
)
```

- Startup waits for every source to be `ready`. A ready source's entries are its complete inventory.
- `order` sorts the sources in ascending order.
- Each entry's key is `<plugin id>:<id>`. `label` is a short badge beside its `name`.
- `auth` means the server waits for the user to sign in, and `incompatible` that it runs a version this app does not
  support.
- `listed: false` keeps the entry out of the app's server list. Settings still shows it.
- `http` is the endpoint, once the server is `ready`.
- `reconnect` resolves a dropped endpoint again, `connect` prepares a server that is not ready, and `remove` runs before
  the entry is removed.
- `row` renders the server's settings row, and `cover` covers the routed session while the server is not ready.
- A `row` receives the host's status `Indicator`, the latest `health()` check, and the row's `server.row` menu `Items`.
  Its `remove()` runs the entry's `remove`, then closes the server's tabs.

#### Reference

```ts
interface Server {
  ready: boolean
  order?: number
  entries: ServerEntry[]
}

interface ServerEntry {
  id: string
  name: string
  label?: string
  state: "stopped" | "starting" | "auth" | "ready" | "failed" | "incompatible"
  listed?: boolean
  http?: { url: string; password?: string }
  reconnect?(signal: AbortSignal): Promise<{ url: string; password?: string }>
  connect?(): Promise<boolean>
  remove?(): Promise<void>
  row?(row: ServerRow): JSX.Element
  cover?(input: { tab: string }): JSX.Element
}

interface ServerRow {
  key: string
  health(): ServerHealth | undefined
  Indicator(props: { health?: ServerHealth; connecting?: boolean; auth?: boolean }): JSX.Element
  remove(): Promise<void>
  Items(): JSX.Element
}

interface ServerHealth {
  healthy: boolean
  version?: string
  incompatible?: boolean
  checking?: boolean
}
```

### Styles

`Style` injects a CSS string into the document while the contribution is active.

```ts
import { Style } from "@opencode/plugin/gui"
import css from "./panel.css?inline"

ctx.add(Style, css)
```

### Themes

`Theme` adds a color theme to Settings › Appearance › Theme. It takes the same format as the app's own theme files, so
a theme file imports as it is.

```ts
import { Theme } from "@opencode/plugin/gui"
import midnight from "./midnight.json"

ctx.add(Theme, midnight)
```

A theme file names itself and gives a light and a dark variant. Each variant starts from a `palette` or from `seeds`,
never both, and can pin single tokens with `overrides`.

```json
{
  "$schema": "https://opencode.ai/desktop-theme.json",
  "name": "Midnight",
  "id": "midnight",
  "light": {
    "palette": {
      "neutral": "#eceff4",
      "ink": "#2e3440",
      "primary": "#5e81ac",
      "success": "#8fbcbb",
      "warning": "#d08770",
      "error": "#bf616a",
      "info": "#81a1c1"
    }
  },
  "dark": {
    "palette": {
      "neutral": "#1b1f27",
      "ink": "#e5e9f0",
      "primary": "#88c0d0",
      "success": "#a3be8c",
      "warning": "#d08770",
      "error": "#bf616a",
      "info": "#81a1c1"
    },
    "overrides": { "syntax-keyword": "#88c0d0" }
  }
}
```

- The picker lists plugin themes among the app's themes, alphabetically by `name`.
- The host keys each theme as `<plugin id>:<theme id>`, so it never replaces an app theme or another plugin's.
- Withdrawing the theme, or disabling the plugin, takes it out of the picker. A user who picked it keeps the choice: the
  window shows the default theme until the theme returns.
- At startup, the window shows the colors cached from the last run until the plugin contributes the theme again.

## Host APIs

Host APIs are properties of `ctx`. None of them throw before the app interface mounts: reads return their documented
defaults, and early writes, such as `ctx.layout.open`, `ctx.dialogs.open`, and store updates, wait and apply in call
order once the first route renders.

```ts
ctx.add(Command, () => ({
  id: "copy-directory",
  title: ctx.t("command.copyDirectory"),
  run: () => {
    const session = ctx.sessions.current()

    if (session) void ctx.system.copy(session.directory)
  },
}))
```

The sections below cover each API. `ctx.options`, `ctx.client`, and `ctx.app` are the
[shared context](#shared-context), `ctx.provide`, `ctx.use`, and `ctx.main` work with
[contracts and tokens](#contracts-and-tokens), `ctx.stores` holds the stores the plugin
[declares](#define-the-gui-plugin), and `ctx.icons` holds the names of the [icons](#icons) it declares.

#### Reference

```ts
interface SetupContext<D> extends Context {
  stores: Record<string, Persisted<unknown> | ((session: SessionRef) => Persisted<unknown>)>
  icons: Record<string, PluginIconName>
}

interface Context {
  id: string
  options: PluginOptions
  client: OpenCodeClient
  app: App
  signal: AbortSignal
  add<T>(registry: Registry<T>, item: () => T | undefined): Cleanup
  add<T>(registry: Registry<T>, item: T): Cleanup
  list<T>(registry: Registry<T>): T[]
  provide<T>(token: Contract<T>, impl: T): Cleanup
  use<T>(token: Contract<T>): () => Live<T>
  use<S extends IpcSpec>(token: Ipc<S>): () => Live<IpcClient<S>>
  main<S extends IpcSpec>(token: Ipc<S>): IpcClient<S>
  t(key: string, params?: Record<string, string | number | boolean>): string
  plural(key: string, count: number, params?: Record<string, string | number | boolean>): string
  layout: Layout
  sessions: Sessions
  screen: Screen
  servers: Servers
  storage: Storage
  dialogs: Dialogs
  toast: Toasts
  attention: Attention
  tabs: Tabs
  keybinds: Keybinds
  commands: Commands
  links: Links
  embeds: Embeds
  ui: Ui
  system: System
  desktop: Desktop | undefined
  locale: Locale
  appearance: Appearance
  router: Router
  workspaces: Workspaces
}
```

### Layout

`ctx.layout.open(key, session, options?)` opens a panel tab by its key, `<plugin id>:<tab id>`. It works for sessions
that are not mounted.

```ts
const session = ctx.sessions.current()

if (session) ctx.layout.open(`${ctx.id}:main`, session, { tab: "select", background: true })
```

- `tab: "open"`, the default, selects the tab in the preview slot. `"preview"` makes it the new preview, `"append"` adds
  it without selecting it, and `"select"` adds and selects it, keeping the preview.
- `background: true` keeps the current view on narrow screens and opens the side region, for an action the user did
  not start from the panel.
- `close(key, session)` removes the tab and calls its panel's `close`. `toggle(key, session)` closes a visible tab, else
  opens it.
- `hide(key, session)` hides the pane that shows a visible tab, without closing the tab: the side region, or the bottom
  pane for a tab the user moved there. Opening the tab again shows its pane.
- `state(key, session)` is `"closed"` when the tab is not in the strip, `"open"` when it is but its pane shows another
  tab, `"active"` when its pane shows it but the pane is hidden (the side region is closed, or the bottom pane is
  hidden), and `"visible"` when it is on screen.
- `stored(session)` is this plugin's tab ids stored in the session's side strip.
- `ready()` is `true` once the stored layout has loaded, and `narrow()` while the viewport is under 768px.
- `side.opened(session)` is `true` while the side region is open, and `side.toggle(session)` opens or closes it.
- `side.menu()` lists every plugin's `session.panel` [menu items](#menu-items) in `order`, for a launcher of your own.
- `side.width(panel)` and `side.resize(panel, width)` read and store the side region width of one of your panels; see
  [Panel width](#panel-width).
- `sidebar.opened()` is the inner sidebar preference that every side panel shares.
- `scroll` stores scroll offsets per session and key.
- `settings(page?)` opens Settings. `project(server, title)` opens a project's directory picker and a new draft.
- `draft({ server, directory, prompt })` opens a new draft session in its own tab, with the prompt filled in for the
  user to review and send.

```ts
const session = ctx.sessions.current()
const launchers = () => ctx.layout.side.menu().filter((item) => !item.primary && !item.opened)

if (session) {
  ctx.layout.draft({ server: session.server.id, directory: session.directory, prompt: ctx.t("setup.prompt") })
}
```

#### Reference

```ts
interface Layout {
  open(key: string, session: SessionRef, options?: OpenOptions): void
  close(key: string, session: SessionRef): void
  toggle(key: string, session: SessionRef): void
  hide(key: string, session: SessionRef): void
  state(key: string, session: SessionRef): PanelState
  stored(session: SessionRef): string[]
  ready(): boolean
  narrow(): boolean
  side: {
    opened(session: SessionRef): boolean
    toggle(session: SessionRef): void
    menu(): SessionPanelMenuItem[]
    width(panel: string): number | undefined
    resize(panel: string, width: number): void
  }
  sidebar: {
    opened(): boolean
  }
  scroll: {
    get(session: SessionRef, key: string): { x: number; y: number } | undefined
    set(session: SessionRef, key: string, value: { x: number; y: number }): void
  }
  settings(page?: string): void
  project(server: string, title: string): void
  draft(input: { server: string; directory: string; prompt: string }): void
}

type PanelState = "closed" | "open" | "active" | "visible"

interface OpenOptions {
  tab?: "open" | "preview" | "append" | "select"
  background?: boolean
}
```

### Sessions and the session screen

`ctx.sessions.current()` is the routed session, and `ctx.screen.current()` is its screen. Both are `undefined` on Home
and on a draft. Read them where you act, never once in `setup`.

```ts
const session = ctx.sessions.current()
const file = ctx.screen.current()?.file

if (session && file) void file.sync("README.md")
```

- `key` is `<server id>\n<session id>`, unique across servers. Key per-session state by it.
- `tab` is the key of the shell tab that owns the session. `pending` is `true` while the server still creates it.
- `directory` is the session's workspace directory, and `local` is `true` when that is the project root.
- `listedProject` is the sidebar project the session belongs to.
- `visit` is a new object each time the session is routed.
- `background` lists the session's running subagents and shell commands.
- `ctx.sessions.list()` returns the sessions of the open shell tabs.
- The screen's `file` reads the workspace's files, and `comment` holds the line comments of the next prompt.
  `composer` is the next prompt: its text, attached parts, and model; see
  [Attach to the composer](#attach-to-the-composer).
- `file.sync(path)` loads a file and asks the server to watch it for changes. Call `file.unwatch(path)` when the file's
  tab closes.

#### Reference

```ts
interface Sessions {
  list(): SessionRef[]
  current(): MountedSession | undefined
}

interface SessionRef {
  key: string
  id: string
  tab: string
  server: ServerRef
  pending: boolean
  location: LocationRef | undefined
}

interface MountedSession extends SessionRef {
  visit: object
  project: Project | undefined
  listedProject: { worktree: string; name?: string; icon?: Project["icon"] } | undefined
  directory: string
  local: boolean
  background: BackgroundTask[]
}

interface Screen {
  current(): SessionScreen | undefined
}

interface SessionScreen {
  file: Files
  comment: Comments
  composer: Composer
}

interface Files {
  root: string
  ready(): boolean
  resolve(path: string): string
  absolute(path: string): boolean
  get(path: string): FileState | undefined
  missing(path: string): boolean
  sync(path: string, options?: { force?: boolean; silent?: boolean }): Promise<void>
  unwatch(path: string): void
  exists(path: string): Promise<boolean>
  search(query: string, options?: { kind?: "file" | "any"; limit?: number; signal?: AbortSignal }): Promise<string[]>
  selection: {
    get(path: string): LineRange | null | undefined
    set(path: string, range: LineRange | null): void
  }
  scroll: {
    get(path: string): { top?: number; left?: number }
    set(path: string, value: { top?: number; left?: number }): void
  }
  tree: {
    list(path: string): FileNode[]
    state(path: string): { expanded: boolean; loaded?: boolean; loading?: boolean; error?: string } | undefined
    sync(path: string, options?: { force?: boolean }): Promise<void>
    expand(path: string, options?: { list?: boolean }): void
    collapse(path: string): void
  }
}

interface Comments {
  list(file?: string): Comment[]
  add(input: Omit<Comment, "id" | "time">): Comment
  update(id: string, comment: string): void
  remove(id: string): void
  focus: {
    current(): { file: string; id: string } | null
    set(value: { file: string; id: string } | null): void
  }
  active: {
    current(): { file: string; id: string } | null
    set(value: { file: string; id: string } | null): void
  }
}
```

### Attach to the composer

Use `ctx.screen.current()?.composer` in an event handler or command to attach a file, a note, or a quote to the user's
next prompt.

```ts
const composer = ctx.screen.current()?.composer

composer?.attach({
  type: "note",
  origin: ctx.id,
  commentID: crypto.randomUUID(),
  label: "button#submit",
  icon: "globe",
  subject: 'element <button id="submit">Save</button>',
  comment: "Make this button primary and disable it while saving.",
  href: "http://localhost:3000/settings",
})
```

- `attach` leaves keyboard focus where it is. Call `focus()` to move it to the prompt.
- `update(commentID, { comment?, preview? })` changes an attached part; a note or a quote takes only a new `comment`.
- `detach(commentID)` removes an attached part.
- A note's `live` replaces its `subject` and `href` while the note stays in this app process, for references only this
  process can resolve, such as a page element. A stored draft drops it, and so does a sent message that a revert or a
  fork restores.

A quote is text the user quoted from something your plugin shows, such as log output, with an optional comment. It
renders like a quote from the session timeline, under the source's icon and label. Check `quotable()` first: it is
`false` in a subagent's session, which has no composer, and while the composer runs shell commands.

```ts
const composer = ctx.screen.current()?.composer

if (composer?.quotable()) {
  const commentID = crypto.randomUUID()

  composer.attach({
    type: "quote",
    commentID,
    text: selection,
    source: { label: ctx.t("source.label"), icon: "console", subject: "the Acme log" },
  })
  composer.focus(commentID)
}
```

- `source.subject` names the source for the model, for example `the terminal`. It is not localized.
- Omit `comment` to let the user add one from the chip.
- `focus(commentID)` opens the comment editor of an attached quote. While the composer is not shown, such as on a narrow
  screen that shows a panel, the editor opens once the composer shows.
- The model reads `The user quoted the following from <subject>:`, then the text with each line prefixed with `> `,
  then the comment, if any.

#### Reference

```ts
interface ComposerFile {
  type: "file"
  path: string
  selection?: { startLine: number; endLine: number; startChar: number; endChar: number }
  preview?: string
  comment?: string
  commentID?: string
  commentOrigin?: "review" | "file"
}

interface ComposerNote {
  type: "note"
  origin: string
  commentID: string
  label: string
  icon: IconName
  subject: string
  comment: string
  href?: string
  live?: { subject: string; href?: string }
}

interface ComposerQuote {
  type: "quote"
  commentID: string
  text: string
  comment?: string
  source: { label: string; icon: IconName; subject: string }
}
```

### Read and write the prompt

Read what the user typed with `text()`, and whether they are typing with `focused()`:

```ts
const composer = ctx.screen.current()?.composer
const empty = !composer?.text().trim()
```

- `text()` is the prompt as plain text: a mention reads as its `@` text, and attachments and attached parts are left
  out. In shell mode, it is the shell command. It is `""` until the session's draft loads, and in a subagent's session,
  which has no composer. It is reactive.
- `focused()` is `true` while keyboard focus is in the prompt. It is not reactive, so read it where you act, such as in
  a command's `run`.

`insert(text)` types text into the prompt for the user to review and send. Nothing on the composer sends the prompt.

```ts
const composer = ctx.screen.current()?.composer

composer?.insert(`Explain ${path}`)
composer?.focus()
```

- `insert` adds the text at the cursor the user last left in the prompt, else at the end, and moves the cursor after
  it. It does not replace selected text.
- The text is not parsed: `@path` stays text, not a mention.
- `setText(text)` replaces the prompt's text, mentions included. Attachments and attached parts stay. `setText("")`
  clears the text.
- Both leave keyboard focus where it is. Call `focus()` to move it to the prompt.
- A write made before the session's stored draft loads (`insert`, `setText`, `attach`, `update`, or `detach`) waits for
  it. It then applies to the session that was routed when you called it, in call order. It never replaces the stored
  draft.
- In a subagent's session, which has no composer, the writes do nothing.

### Choose the model

`model()` is the model the next prompt is sent with, and `setModel` selects one as the model picker does:

```ts
const composer = ctx.screen.current()?.composer

if (composer && !composer.setModel({ providerID: "anthropic", modelID: "claude-sonnet-4-5", variant: "high" })) {
  ctx.toast.show({ variant: "error", title: ctx.t("model.unavailable") })
}
```

- `model()` is the user's choice for the routed session, else the agent's default, else the app's default. It is
  `undefined` while the model catalog loads, when no connected provider offers the model, and in a subagent's session.
  It is reactive.
- `setModel` makes the model the session's choice and its first recent model. Without `variant`, the model keeps the
  variant the picker would show for it.
- `setVariant(variant)` selects a variant of the current model. `undefined` selects the model's default variant.
- `setModel` returns `false`, and changes nothing, while the catalog loads, when no connected provider offers the
  model, or when the model has no such variant.
- `setVariant` returns `false`, and changes nothing, when there is no current model or the model has no such variant.
- Both return `false` in a subagent's session.

#### Reference

```ts
interface Composer {
  text(): string
  insert(text: string): void
  setText(text: string): void
  model(): ComposerModel | undefined
  setModel(model: ComposerModel): boolean
  setVariant(variant: string | undefined): boolean
  attach(part: ComposerFile | ComposerNote | ComposerQuote): void
  quotable(): boolean
  focus(commentID?: string): void
  update(id: string, patch: { comment?: string; preview?: string }): void
  detach(id: string): void
  focused(): boolean
}

interface ComposerModel {
  providerID: string
  modelID: string
  variant?: string
}
```

### Servers and server events

`ctx.servers.get(id)` returns a live `ServerRef`. The desktop app's own server, which runs your plugin, has the id
`"sidecar"`. React to its events with `data.on`:

```ts
import { onCleanup } from "solid-js"
import { createKeyed } from "@opencode/plugin/gui"

createKeyed(
  () => ctx.servers.get("sidecar")?.data,
  (data) => onCleanup(data.on("session.created", (event) => console.log(event))),
)
```

- `id` is the host key: `"sidecar"`, an http URL, or `<plugin id>:<id>` for a [contributed server](#servers).
- `data` is the server's synced data, such as sessions and projects, and `on(type, handler)` for its events. It is
  reactive.
- `builtin` is `true` for the app's own server.
- `compatible` is `true` when the server's version works with this app, and `connected` while its event connection is
  up.
- `password` is the HTTP basic password the user configured, if any.
- Read `client`, `data`, and `url` from the live `ServerRef` each time: a restarted server gets a new client under the
  same id.
- `ctx.servers.list()` returns the ids of the servers the app lists.

#### Reference

```ts
interface Servers {
  list(): string[]
  get(id: string): ServerRef | undefined
}

interface ServerRef {
  id: string
  name: string
  url: string
  password?: string
  client: OpenCodeClient
  data: Data
  local: boolean
  builtin: boolean
  compatible: boolean
  connected: boolean
}
```

### Dialogs

`ctx.dialogs.open(render, { replace? })` opens a dialog above the open ones and returns a handle whose `close()` closes
it. The dialog also closes when its owning scope ends.

```tsx
const handle = ctx.dialogs.open((dialog) => <ConfirmDialog onDone={dialog.close} />)
```

- `replace: true` closes every open dialog first, including the host's and other plugins' dialogs.
- `ctx.dialogs.active()` is `true` while any dialog is open.
- Render the content in `ctx.ui.Dialog` for the app's dialog frame; see [App components](#app-components).

### Ask the user

`confirm`, `alert`, `prompt`, and `select` ask in the app's own dialogs, so your plugin needs no dialog UI of its own.
Each returns a promise of the answer.

```ts
const ok = await ctx.dialogs.confirm({ title: ctx.t("end.title"), confirm: ctx.t("end"), danger: true })
```

- `confirm` resolves `true` only when the user confirms. `danger` styles the confirm button as destructive and starts
  focus on Cancel.
- Each dialog opens as `open` does, and closes with the owner that asked, else with your plugin.
- Cancelling, pressing Escape, clicking outside, a replacing dialog, or the owner ending resolves `false` from `confirm`
  and `undefined` from `prompt` and `select`.

`alert` tells the user something they must acknowledge, with one button. It resolves once the dialog closes, however it
closes:

```ts
await ctx.dialogs.alert({ title: ctx.t("export.done"), description: path })
```

`prompt` asks for one line of text. Its initial `value` is selected, so typing replaces it. It never resolves an empty
string: submitting does nothing while the field is empty. `secret: true` hides what the user types, for a password or a
token:

```ts
const token = await ctx.dialogs.prompt({ title: ctx.t("token.title"), placeholder: "ghp_…", secret: true })
```

`select` lists options in a searchable list, like the command palette, and resolves the picked option's `value`:

```ts
const url = await ctx.dialogs.select({
  title: ctx.t("links.title"),
  options: links.map((link) => ({ title: link.title, description: link.url, value: link.url, group: link.host })),
})

if (url) ctx.system.openExternal(url)
```

- Search matches each option's `title` and `description`.
- Options with the same `group` list together under that heading.
- `current` is the value of the option to highlight first.

#### Reference

```ts
interface Dialogs {
  open(render: (dialog: DialogHandle) => JSX.Element, options?: { replace?: boolean }): DialogHandle
  confirm(options: ConfirmOptions): Promise<boolean>
  alert(options: AlertOptions): Promise<void>
  prompt(options: PromptOptions): Promise<string | undefined>
  select<T>(options: SelectOptions<T>): Promise<T | undefined>
  active(): boolean
}

interface DialogHandle {
  close(): void
}

interface ConfirmOptions {
  title: string
  description?: string
  confirm?: string
  cancel?: string
  danger?: boolean
}

interface AlertOptions {
  title: string
  description?: string
  ok?: string
}

interface PromptOptions {
  title: string
  description?: string
  placeholder?: string
  value?: string
  secret?: boolean
  submit?: string
}

interface SelectOptions<T> {
  title: string
  placeholder?: string
  options: { title: string; value: T; description?: string; group?: string }[]
  current?: T
}
```

### App components

A plugin bundle cannot import `@opencode/ui`, so `ctx.ui` gives it the app's own components. They render in the
user's theme, fonts, and language, so your plugin's UI looks and behaves like the app's.

```tsx
import { Show } from "solid-js"
import { createLatest, Panel } from "@opencode/plugin/gui"

const ui = ctx.ui
const summary = createLatest(
  () => ctx.sessions.current()?.directory,
  (directory, signal) => fetchSummary(directory, signal),
)

ctx.add(Panel, {
  id: "summary",
  region: "side",
  list: () => [summaryTab],
  render: () => (
    <div>
      <ui.Tooltip value={ctx.t("copy")}>
        <ui.IconButton icon="copy" label={ctx.t("copy")} onClick={() => void ctx.system.copy(summary.latest ?? "")} />
      </ui.Tooltip>
      <Show when={summary.latest} fallback={<ui.Loader size="large" />}>
        {(text) => <ui.Markdown text={text()} />}
      </Show>
    </div>
  ),
})
```

- `Icon`, `Button`, and `IconButton` take any `IconName`, as every `icon` field of the SDK does: one of the app's
  icons, or one of [your own](#icons) from `ctx.icons`. An `IconButton`'s `label` is its accessible name; wrap it in
  `Tooltip` to show it on hover.
- `busy` on a button replaces its icon with the loading indicator and disables it until it is `false` again.
- Use `Loader` for every loading state that is not the AI working, such as a pane, a search, or a connection that
  loads.
- `Menu` opens a list of `items`: actions, `{ type: "separator" }`, and `{ type: "group", label, items }`.
- `Switch` and `TextInput` keep no state: pass the value from `onChange` or `onInput` back to `checked` or `value`.
- `Keybind` shows keys as chips, such as `ctx.keybinds.keybind(command)`.
- `Markdown` renders as the timeline renders a message, and `Code` shows a highlighted, read-only code block. Both fill
  in shortly after they mount.

`Dialog` is the app's dialog frame: a title, content, and buttons. Render it from `ctx.dialogs.open`; elsewhere it
renders nothing useful.

```tsx
const ui = ctx.ui

ctx.dialogs.open((dialog) => (
  <ui.Dialog
    title={ctx.t("rename.title")}
    footer={
      <ui.Button variant="contrast" onClick={dialog.close}>
        {ctx.t("done")}
      </ui.Button>
    }
  >
    <ui.TextInput label={ctx.t("rename.label")} value={name()} onInput={setName} onSubmit={dialog.close} autofocus />
  </ui.Dialog>
))
```

- `size` is `"fit"` by default: 480px wide and as tall as its content. `"normal"`, `"large"`, and `"x-large"` are fixed
  sizes.
- Escape and a click outside close the dialog. `closable: false` hides the header's close button.

#### Menu rows

`MenuItem`, `MenuSub`, `MenuGroup`, and `MenuSeparator` are rows for a menu the host renders, such as the
`session.location.menu` slot. They navigate with the keyboard, show the host's muted icons and shortcut chips, and close
the menu on a pick.

```tsx
import { For } from "solid-js"

const ui = ctx.ui

ctx.add(Slot, {
  at: "session.location.menu",
  render: (input) => (
    <>
      <ui.MenuItem
        label={ctx.t("usage")}
        icon="status"
        keys={["Ctrl", "U"]}
        onSelect={() => openUsage(input.session)}
      />
      <ui.MenuSub label={ctx.t("openIn")} icon="outline-share">
        <For each={apps()}>{(app) => <ui.MenuItem label={app.name} onSelect={() => launch(app, input.session)} />}</For>
      </ui.MenuSub>
    </>
  ),
})
```

- `MenuItem` takes the same fields as an entry of `Menu`'s `items`.
- `MenuSub` opens its children in a submenu beside the row. `onOpenChange` tells you when, so you can load its rows
  only while it is open.
- `MenuGroup` puts rows under a heading, and `MenuSeparator` draws a line between rows.
- `MenuItem`, `MenuSub`, and `MenuGroup` throw outside a menu: the host records the error and renders nothing of that
  contribution.

#### Selects

`Select` picks one of a list of choices, as the app's settings rows pick a language. Its value is a string; the type of
`options` narrows it.

```tsx
const [period, setPeriod] = createSignal<"day" | "month">("day")

<ui.Select
  label={ctx.t("period")}
  options={[
    { value: "day", label: ctx.t("period.day") },
    { value: "month", label: ctx.t("period.month") },
  ]}
  value={period()}
  onChange={setPeriod}
/>
```

- `label` is the select's accessible name; the selected option's `label` is what it shows.
- A `value` that no option has shows `placeholder`. Picking the selected choice again does not call `onChange`.

#### Settings components

`SettingsLayout`, `SettingsSection`, and `SettingsRow` render a [settings page](#settings-pages) the way the app renders
its own: the page header, sections with headings over bordered lists, and rows with a title, a description, and a
control at the end.

```tsx
<ui.SettingsLayout title={ctx.t("title")} description={ctx.t("description")} actions={<HelpButton />}>
  <ui.SettingsSection title={ctx.t("section.display")} footer={<Show when={error()}>{ctx.t("error")}</Show>}>
    <ui.SettingsRow id="acme-period" title={ctx.t("period")} description={ctx.t("period.description")}>
      <ui.Select label={ctx.t("period")} options={periods()} value={period()} onChange={setPeriod} />
    </ui.SettingsRow>
  </ui.SettingsSection>
</ui.SettingsLayout>
```

- Use `SettingsLayout` for a page of your own, `SettingsSection` for a section on a host page, and `SettingsRow` alone
  for rows in a host section. Rows line up with the host's rows in every case.
- `id` on a row is the `SettingEntry.id` that reveals it. Search that reveals the page's own id highlights the header.
- `actions` sits at the end of the title row. A section's `footer` sits under its list, outside the border.
- They take their look from the Settings screen's styles, so render them from a `SettingsPage`.

#### Reference

```ts
interface Ui {
  Icon(props: UiIconProps): JSX.Element
  Button(props: UiButtonProps): JSX.Element
  IconButton(props: UiIconButtonProps): JSX.Element
  Tooltip(props: UiTooltipProps): JSX.Element
  Menu(props: UiMenuProps): JSX.Element
  MenuItem(props: UiMenuItem): JSX.Element
  MenuSeparator(): JSX.Element
  MenuGroup(props: UiMenuGroupProps): JSX.Element
  MenuSub(props: UiMenuSubProps): JSX.Element
  Loader(props: UiLoaderProps): JSX.Element
  Dialog(props: UiDialogProps): JSX.Element
  Switch(props: UiSwitchProps): JSX.Element
  TextInput(props: UiTextInputProps): JSX.Element
  Select<T extends string>(props: UiSelectProps<T>): JSX.Element
  Keybind(props: UiKeybindProps): JSX.Element
  Markdown(props: UiMarkdownProps): JSX.Element
  Code(props: UiCodeProps): JSX.Element
  SettingsLayout(props: UiSettingsLayoutProps): JSX.Element
  SettingsSection(props: UiSettingsSectionProps): JSX.Element
  SettingsRow(props: UiSettingsRowProps): JSX.Element
}

interface UiIconProps {
  name: IconName
  size?: "small" | "normal" | "large"
  class?: string
}

interface UiButtonProps {
  children: JSX.Element
  onClick?: (event: MouseEvent) => void
  variant?: "neutral" | "contrast" | "ghost" | "ghost-muted" | "danger"
  size?: "small" | "normal" | "large"
  icon?: IconName
  disabled?: boolean
  busy?: boolean
  type?: "button" | "submit"
  autofocus?: boolean
  class?: string
}

interface UiIconButtonProps {
  icon: IconName
  label: string
  onClick?: (event: MouseEvent) => void
  variant?: "neutral" | "ghost" | "ghost-muted"
  size?: "small" | "normal" | "large"
  disabled?: boolean
  pressed?: boolean
  busy?: boolean
  class?: string
}

interface UiTooltipProps {
  value: JSX.Element
  keys?: string[]
  placement?: "top" | "bottom" | "left" | "right"
  children: JSX.Element
}

interface UiMenuProps {
  label: string
  items: UiMenuEntry[]
  trigger?: "icon" | "button"
  icon?: IconName
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end"
  disabled?: boolean
}

type UiMenuEntry = UiMenuItem | UiMenuSeparator | UiMenuGroup

interface UiMenuItem {
  type?: "item"
  label: string
  icon?: IconName
  keys?: string[]
  disabled?: boolean
  onSelect(): void
}

interface UiMenuSeparator {
  type: "separator"
}

interface UiMenuGroup {
  type: "group"
  label: string
  items: UiMenuItem[]
}

interface UiMenuGroupProps {
  label: string
  children: JSX.Element
}

interface UiMenuSubProps {
  label: string
  icon?: IconName
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
  children: JSX.Element
}

interface UiLoaderProps {
  size?: "small" | "normal" | "large"
  class?: string
}

interface UiDialogProps {
  title: string
  description?: string
  children?: JSX.Element
  footer?: JSX.Element
  size?: "fit" | "normal" | "large" | "x-large"
  closable?: boolean
}

interface UiSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  hideLabel?: boolean
  description?: string
  disabled?: boolean
}

interface UiTextInputProps {
  value: string
  onInput: (value: string) => void
  label: string
  placeholder?: string
  onSubmit?: (value: string) => void
  type?: "text" | "password" | "search" | "url"
  size?: "normal" | "large"
  disabled?: boolean
  invalid?: boolean
  autofocus?: boolean
  class?: string
}

interface UiKeybindProps {
  keys: string[]
  class?: string
}

interface UiMarkdownProps {
  text: string
  class?: string
}

interface UiCodeProps {
  content: string
  language?: string
  class?: string
}

interface UiSelectProps<T extends string> {
  options: UiSelectOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  placement?: "bottom-start" | "bottom-end" | "top-start" | "top-end"
  class?: string
}

interface UiSelectOption<T extends string> {
  value: T
  label: string
}

interface UiSettingsLayoutProps {
  title: string
  description?: string
  actions?: JSX.Element
  children: JSX.Element
}

interface UiSettingsSectionProps {
  title?: string
  children: JSX.Element
  footer?: JSX.Element
}

interface UiSettingsRowProps {
  title: JSX.Element
  description?: JSX.Element
  id?: string
  children?: JSX.Element
}
```

### Toasts

`ctx.toast.show` shows a short message in the corner of the window and returns a handle whose `dismiss()` closes it.

```ts
ctx.toast.show({ variant: "success", title: ctx.t("invite.copied") })
```

- `variant` is `"default"`, `"success"`, `"error"`, or `"loading"`. A `success` toast shows a check icon unless you set
  `icon`.
- `duration` is how long the toast shows, in milliseconds. It defaults to 5 seconds.
- `persistent: true` keeps the toast until the user or `dismiss()` closes it, and ignores `duration`.
- A toast equal to one still showing replaces it instead of stacking a copy.
- Your plugin's toasts close when it stops, so no button outlives the code it runs. A toast does not close with the
  component or `createKeyed` run that showed it.

Show a `loading` toast while work runs, and dismiss it when the work ends:

```ts
const saving = ctx.toast.show({ variant: "loading", title: ctx.t("saving"), persistent: true })
await save()
saving.dismiss()
```

`actions` adds buttons. A click runs the action and closes the toast:

```ts
ctx.toast.show({
  variant: "error",
  title: ctx.t("sync.failed"),
  actions: [{ label: ctx.t("retry"), run: () => void sync() }],
})
```

#### Reference

```ts
interface Toasts {
  show(options: ToastOptions): ToastHandle
}

interface ToastHandle {
  dismiss(): void
}

interface ToastOptions {
  title: string
  description?: string
  variant?: "default" | "success" | "error" | "loading"
  icon?: IconName
  duration?: number
  persistent?: boolean
  actions?: ToastAction[]
}

interface ToastAction {
  label: string
  run(): void
}
```

### Notifications

`ctx.attention.notify` gets the user's attention while they look elsewhere: a system notification and a sound, with
the same rules as the app's own notifications.

```ts
const session = ctx.sessions.current()

if (session) {
  void ctx.attention.notify({
    title: ctx.t("tests.done"),
    message: ctx.t("tests.summary", { failed: 0 }),
    session: { server: session.server.id, id: session.id },
    id: run.id,
  })
}
```

- The system notification shows only while no app window has focus. The sound plays either way.
- Both follow **Settings > Notifications**. `variant: "default"` follows the **Agent** rows, and `variant: "error"` the
  **Errors** rows. Desktop notifications for both are off by default; their sounds are on.
- `sound: false` never plays a sound.
- Clicking the notification brings the app forward and opens `session`, when you give one.
- Each app window runs its own copy of your plugin. Pass an `id` of the event, such as a run's id, so only the first
  window to send it notifies and plays the sound. Without `id`, every call notifies.
- Before the app interface mounts, `notify` waits for it.

`notify` never rejects. It resolves what it did: `notification` is `true` when the app asked the system to show the
notification, and `sound` is `true` when the sound started.

```ts
const result = await ctx.attention.notify({ title: ctx.t("deploy.failed"), variant: "error" })

if (!result.notification) ctx.toast.show({ variant: "error", title: ctx.t("deploy.failed") })
```

- `notification` is `false` when the user turned it off, an app window has focus, or another window already sent
  `id`. The system can still hide a notification the app asked it to show, for example when the user denied a
  browser's permission.

#### Reference

```ts
interface Attention {
  notify(options: NotifyOptions): Promise<NotifyResult>
}

interface NotifyOptions {
  title: string
  message?: string
  variant?: "default" | "error"
  session?: { server: string; id: string }
  sound?: boolean
  id?: string
}

interface NotifyResult {
  notification: boolean
  sound: boolean
}
```

### Usage data

A session's token, cost and plan figures are in its server's data, the same reactive store the app reads for the
header's "28k · $0.28". Read them there rather than from opencode's database.

```ts
import { lastAssistantWithUsage } from "@opencode/client/solid"

const data = session.server.data
const info = () => data.session.get(session.id)

const tokens = () => info()?.tokens // this session's tokens by kind
const cost = () => data.session.cost(session.id) // USD, with subagent sessions
const step = () => lastAssistantWithUsage(data.session.message.list(session.id), info()?.revert?.messageID)
const limits = () => (session.location ? data.location.usage.limits(session.location) : undefined)
```

- `step()` is the assistant step whose tokens fill the context window now, as the app's context ring uses. Compare its
  `tokens` with the model's `limit.context` from `data.location.model.list`.
- `limits()` holds the OpenCode Console budgets and Go plan allowance once `data.location.usage.sync(location)` has
  loaded them. It is `null` when the server reports none.

### Tabs

`ctx.tabs` reads and changes the shell's tab strip: the sessions and drafts open as tabs. This moves a session's tab to
the front when its run finishes:

```ts
import { onCleanup } from "solid-js"
import { createKeyed } from "@opencode/plugin/gui"

createKeyed(
  () => ctx.servers.get("sidecar")?.data,
  (data) =>
    onCleanup(
      data.on("session.execution.succeeded", (event) => {
        const tab = ctx.tabs.list().find((item) => item.session?.id === event.data.sessionID)

        if (tab) ctx.tabs.move(tab.key, 0)
      }),
    ),
)
```

- `list()` returns the open tabs in strip order. It is reactive. A tab's `session` is `undefined` for a draft, and
  `active` is `true` for the tab on screen.
- `open({ server, id }, { focus? })` opens a session as a tab at the end of the strip, in the background unless `focus`
  is `true`. A session that is already open keeps its tab, as does a subagent that its parent's tab shows.
- `focus(key)` shows a tab, `move(key, index)` moves it, and `close(key)` closes it as the user does.
- A key that no open tab has does nothing. Writes made before the app interface mounts wait for it.

#### Reference

```ts
interface Tabs {
  list(): ShellTab[]
  open(session: { server: string; id: string }, options?: { focus?: boolean }): void
  focus(key: string): void
  move(key: string, index: number): void
  close(key: string): void
}

interface ShellTab {
  key: string
  session: SessionRef | undefined
  active: boolean
}
```

### Keybinds

`ctx.keybinds` reads the user's shortcut for a published command id.

```ts
const label = ctx.keybinds.keybind(`${ctx.id}.open`)
const chord = ctx.keybinds.keys("mod+k")
const pressed = (event: KeyboardEvent) => ctx.keybinds.matches(`${ctx.id}.open`, event)
```

- `keybind(command)` returns the display parts of the command's effective keybind, for example `["Ctrl", "K"]`. It is
  empty when the command is unbound.
- `keys(bind)` returns the display parts of a chord the app does not own, such as one a page handles itself.
- `matches(command, event)` is `true` when the event matches the command's effective keybind.

#### Reference

```ts
interface Keybinds {
  keybind(command: string): string[]
  keys(bind: string): string[]
  matches(command: string, event: KeyboardEvent): boolean
}
```

### Run commands

`ctx.commands.run(id)` runs a command as choosing it in the command palette does. It returns `false` when the command
cannot run:

```ts
if (!ctx.commands.run("terminal.toggle")) ctx.toast.show({ title: ctx.t("terminal.unavailable") })
```

- `id` is a published plugin command, `<plugin id>.<command id>`, of any plugin, or one of the app's own commands,
  such as `command.palette`.
- The app's command ids are not a stable API and can change between releases.
- `run` returns `false` when no enabled command has the id. A listed but disabled command does not run.
- Before the app interface mounts, no command is registered, so `run` returns `false`.
- `run` does not wait for a command's async work.

#### Reference

```ts
interface Commands {
  run(id: string): boolean
}
```

### System and environment

`ctx.system` works on every platform. `ctx.desktop` adds desktop-only abilities and is `undefined` on the web.

```ts
const show = async (path: string) => {
  if (ctx.desktop && (await ctx.desktop.reveal(path))) return
  await ctx.system.copy(path)
}
```

- `system.save` shows a save dialog on desktop and downloads on the web. It returns `false` when the user cancels the
  dialog.
- `system.openExternal` opens a URL in the system browser. For links inside the app, use `ctx.links.open`, which routes
  a `Link` to its [link handler](#link-handlers).
- `desktop.launch(path, app?)` opens a path with an app, or with the default app. `desktop.reveal(path)` shows it in the
  file manager.
- `ctx.embeds` renders a main-process web view in a window; see
  [Embedded web views](#embedded-web-views).
- `ctx.locale` reads the interface language and its writing direction. `ctx.appearance.font("mono")` is the CSS font
  family of the user's terminal font.
- `ctx.router` reads the current route path and whether a route transition is in progress.
- `ctx.workspaces.on("remove", handler)` runs when the user removes a workspace directory from a server, so you can
  clean up stores scoped to it.

`desktop.pick(options)` asks the user for files or folders with the system's open dialog, and resolves their absolute
paths:

```ts
const [folder] = (await ctx.desktop?.pick({ directory: true, title: ctx.t("pick.folder") })) ?? []

if (folder) await ctx.client.rpc(Acme).index({ directory: folder })
```

- `directory: true` picks folders instead of files, and `multiple: true` lets the user pick more than one.
- `extensions` limits the files offered, without the dot, such as `["json"]`. Folders ignore it.
- `title` is the dialog's title. Not every system shows it.
- The paths are empty when the user cancels. `pick` rejects when the dialog cannot open.
- `pick` is desktop only: a browser never tells the page where a picked file is.

`ctx.appearance.mode()` is the color scheme the interface shows, `"light"` or `"dark"`. It is reactive:

```ts
const background = () => (ctx.appearance.mode() === "dark" ? "#000" : "#fff")
```

- It follows the user's choice in **Settings > Appearance**, with **System** resolved to the system's current scheme.
- Before the app interface mounts, it is the system's scheme.

#### Reference

```ts
interface System {
  copy(text: string): Promise<void>
  save(file: { name: string; content: string }): Promise<boolean>
  openExternal(url: string): void
}

interface Desktop {
  os: "macos" | "windows" | "linux"
  zoom(): number
  launch(path: string, app?: string): Promise<void>
  reveal(path: string): Promise<boolean>
  installed(app: string): Promise<boolean>
  pick(options?: PickOptions): Promise<string[]>
}

interface PickOptions {
  directory?: boolean
  multiple?: boolean
  title?: string
  extensions?: string[]
}

interface Links {
  open(link: Link): boolean
  exists(link: Link): boolean | Promise<boolean>
}

interface Locale {
  locale(): string
  direction(): "ltr" | "rtl"
}

interface Appearance {
  font(kind: "mono"): string
  mode(): "light" | "dark"
}

interface Router {
  path(): string
  routing(): boolean
}

interface Workspaces {
  on(event: "remove", handler: (value: { server: string; directory: string }) => void): Cleanup
}
```

## Stored state

Desktop windows load stored state over IPC, while the web reads `localStorage` at once. Declare stores in
`Plugin.define({ stores })`, so the host loads them for you.

- **`Store.global`** keeps one value for the app. It loads before `setup` runs, so `ctx.stores.name.value` is never
  `undefined`.
- **`Store.session`** keeps one value per session. It loads when the session mounts; `ctx.stores.name(session).value`
  is `undefined` until then.

Declared stores are for windows. `main` opens its state with `ctx.storage.store`, which reads synchronously; see
[Main context](#main-context).

Mutate a value in place with `update(draft => …)`, which must return nothing, or replace it with `set(next)`:

```ts
const enabled = ctx.stores.prefs.value.enabled

ctx.stores.prefs.update((draft) => {
  draft.enabled = !draft.enabled
})
```

- `ready()` is `true` once the value has loaded. Writes made before then wait and apply in call order.
- `from` names other stored keys to import the value from once, while the store holds none, such as the key of a
  store you renamed: `"plugin.acme.settings"`. Pass a list to try several keys, newest first. The other key keeps its
  copy until the store is removed.

```ts
stores: {
  prefs: Store.global(Prefs, { enabled: true }, ["plugin.acme.settings.v2", "plugin.acme.settings"]),
}
```

#### Reference

```ts
const Store: {
  global(schema: Schema, initial: T, from?: string | string[]): StoreDeclaration
  session(schema: Schema, initial: T, from?: string | string[]): StoreDeclaration
}

interface Persisted<T, V = T | undefined> {
  value: V
  ready(): boolean
  update(mutate: (draft: T) => undefined): void
  set(next: T): void
}
```

### Runtime stores

`ctx.storage.store(key, options)` opens a store for a key known only at runtime. `scope` keeps one value per server,
directory, or session.

```tsx
import { Schema } from "effect"
import { usePlugin, type MountedSession } from "@opencode/plugin/gui"
import type { definition } from "./definition"

function DraftView(props: { readonly session: MountedSession }) {
  const ctx = usePlugin<typeof definition>()

  const draft = ctx.storage.store("draft", {
    schema: Schema.Struct({ text: Schema.String }),
    initial: { text: "" },
    scope: { server: props.session.server.id, directory: props.session.directory },
  })

  return <p>{draft.value?.text}</p>
}
```

- `scope: "global"`, the default, keeps one value for the app.
- `scope: { server, directory? }` keeps one value per server, or per workspace directory on it.
- `scope: { session }` keeps one value per session, opened again when the session moves to a new directory.
- A runtime store's `value` is `undefined` until it loads.
- `ctx.storage.memory(key, { initial })` keeps window-local state that survives plugin reloads but not window reloads.
- `ctx.storage.remove(key, { scope, from })` deletes the value, so the key reads as `initial` again.

#### Reference

```ts
interface Storage {
  store(key: string, options: StoreOptions): Persisted<T>
  memory(key: string, options: { initial: T }): [Store<T>, (mutation: (draft: T) => void) => void]
  remove(key: string, options?: { scope?: StorageScope; from?: string | string[] }): void
}

interface StoreOptions {
  schema: Schema
  initial: T
  scope?: StorageScope
  from?: string | string[]
}

type StorageScope = "global" | { server: string; directory?: string } | { session: SessionRef }
```

## Reactive primitives

Prefer these helpers to raw `createEffect`, `createRenderEffect`, and `createComputed`. They follow a plugin's lifetime
and its dependencies' restarts, which hand-written effects tend to get wrong.

### createKeyed

`createKeyed(source, fn, { otherwise?, equals? })` runs `fn` in a fresh owner for each key: each active generation of a
`ctx.use` accessor, or each value of a plain accessor. Anything registered inside `fn` ends with that run.

```tsx
import { onCleanup } from "solid-js"
import { createKeyed, usePlugin, type SessionScreen } from "@opencode/plugin/gui"
import { Changes } from "@opencode/plugin/gui/review"

function ChangedFiles(props: { readonly screen: SessionScreen }) {
  const ctx = usePlugin()

  // Each active generation of Changes keeps this view's changes loaded; the watch ends with it.
  createKeyed(ctx.use(Changes), (changes) => onCleanup(changes.watch(props.screen, "files")))

  return <FileMarkers screen={props.screen} />
}
```

- `otherwise` runs while the source has no key: a `Live` accessor that is not active, or a plain accessor whose value
  is `undefined`, `null`, or `false`.
- `equals` decides whether a plain accessor's new value is the same key, so `fn` does not run again. Use it when the
  source builds a new object each time. A `Live` accessor always keys by generation.

#### Reference

```ts
function createKeyed<T>(
  source: () => Live<T> | T,
  fn: (value: T) => void,
  options?: { otherwise?(): void; equals?(previous: T, next: T): boolean },
): void
```

### createLatest

`createLatest(source, (value, signal) => promise)` fetches whenever `source` changes, aborts stale requests, and never
suspends.

```ts
const summary = createLatest(
  () => ctx.sessions.current()?.directory,
  (directory, signal) => fetchSummary(directory, signal),
)
const text = () => summary.latest ?? ""
```

- `latest` is the last result, kept while a newer request runs. It is `undefined` before the first.
- `loading` is `true` while a request for the current value is in flight.
- `error` is the current request's rejection, if any.

#### Reference

```ts
function createLatest<S, T>(
  source: () => Live<S> | S,
  fetch: (value: S, signal: AbortSignal) => Promise<T>,
): { latest: T | undefined; loading: boolean; error: unknown }
```

### createVisitState

`createVisitState(initial)` creates a `[value, setValue]` signal that resets whenever the user leaves the session and
returns.

```ts
const [expanded, setExpanded] = createVisitState(false)
```

#### Reference

```ts
function createVisitState<T>(initial: T): [value: () => T, set: (next: T) => void]
```

### usePanel and useDrawer

`usePanel()` reads the surrounding panel frame, and throws outside a panel render. `useDrawer()` returns the mobile
drawer around a contribution, or `undefined` outside one.

```ts
const panel = usePanel()
const drawer = useDrawer()
const compact = () => panel.placement() === "mobile"
const close = () => drawer?.close()
```

- `placement()` is `"side"` in the side region and `"mobile"` in a narrow-screen view.
- `visible()` is `true` while the region is open and this tab is selected. `present()` stays `true` while the region
  animates closed.
- `reserve()` asks you to leave room at the end of a header for the host's region toggle.
- `sidebar` is the inner sidebar preference that every side panel shares. A panel with a sidebar renders its own
  toggle.
- `drawer.open(view)` shows content in place of the drawer's view, with a back control.

#### Reference

```ts
function usePanel(): PanelFrame
function useDrawer(): { close(): void; open(view: DrawerView): void } | undefined

interface PanelFrame {
  visible(): boolean
  present(): boolean
  placement(): "side" | "mobile"
  reserve(): boolean
  animate(): boolean
  open(): string[]
  sidebar: {
    opened(): boolean
    width(): number
    transition(): boolean
    resize(width: number): void
    toggle(): void
  }
}

interface DrawerView {
  title: string
  content: JSX.Element
  trigger: HTMLElement
}
```

## App contracts

The app provides these contracts to every plugin. Follow one with `ctx.use(token)`, and handle it while it is not
`active`, as for any other plugin's contract. For example, `Browser` is `inactive` on the web.

### Files

`@opencode/plugin/gui/file` exports the app's file tree and **Open in** button, and the `FileViewer` registry.

```tsx
import { bindPlugin } from "@opencode/plugin/gui"
import { FileViewer, type FileViewerProps } from "@opencode/plugin/gui/file"

// A viewer for a kind of file the file view does not render itself.
ctx.add(FileViewer, {
  kinds: ["document"],
  View: bindPlugin((props: FileViewerProps) => <AcmeDoc bytes={props.bytes} onError={props.onError} />),
})
```

- **`FileTree`** is a contract. `Tree` and `List` render a virtualized tree or list of workspace files with change
  markers. Read it with `ctx.use(FileTree)`. A tree's `labels` adds text after a folder's name, such as how many
  entries it has.
- **`OpenInApp`** is a contract. `Button` is the desktop **Open in** button for a session's workspace.
- **`FileViewer`** is a registry. A viewer lists the `kinds` it renders, can reject bytes with `problem`, and renders a
  `View` that reports `onDetails` and `onError`.

#### Reference

```ts
interface FileTree {
  Tree(props: FileTreeProps): JSX.Element
  List(props: FileListProps): JSX.Element
}

interface FileTreeProps {
  screen: SessionScreen
  session: MountedSession
  allowed: string[]
  kinds?: Map<string, ChangeKind>
  labels?: Map<string, string>
  active?: string
  onFileClick(path: string): void
}

interface FileListProps {
  screen: SessionScreen
  session: MountedSession
  files: string[]
  kinds?: Map<string, ChangeKind>
  active?: string
  highlighted?: string
  onFileClick(path: string): void
}

interface OpenInApp {
  Button(props: { screen: SessionScreen; session: MountedSession }): JSX.Element
}

interface FileViewer {
  kinds: ArtifactKind[]
  problem?(bytes: Uint8Array): string | undefined
  View: Component<FileViewerProps>
}

interface FileViewerProps {
  bytes: Uint8Array
  onDetails(details: string[]): void
  onError(reason?: string): void
}
```

### Review changes

`@opencode/plugin/gui/review` exports `Changes`, the app's view of a session's changes, and `ChangeKind`
(`"add"`, `"del"`, or `"mix"`).

```ts
import { Changes } from "@opencode/plugin/gui/review"

const changes = ctx.use(Changes)

const count = () => {
  const live = changes()
  const session = ctx.sessions.current()

  return live.status === "active" && session ? live.value.diffs(session).length : 0
}
```

- `diffs(session)` is the current review mode's diffs, and `ready(session)` is `true` once they have loaded. Both are
  reactive. Only the routed session has changes; other sessions read as empty.
- `kinds(session)` maps each changed file and directory to its `ChangeKind`.
- `active(session)` is the file the review panel shows.
- `details(session)` is the session directory's uncommitted changes, whatever the review mode.
- `focus(session, path)` shows a file in the review panel, and `open(session)` shows all changes.
- `watch(screen, source)` keeps the changes of a view loaded while it shows them, across the view's session switches.
  Pass the owning screen from the panel or slot input. It returns a function that stops watching; see
  [createKeyed](#createkeyed).
- A `tree` watch is a persistent change list: opening the side region refreshes it. A `details` watch loads
  `details(session)`.

#### Reference

```ts
interface Changes {
  diffs(session: SessionRef): FileDiffInfo[]
  ready(session: SessionRef): boolean
  kinds(session: SessionRef): Map<string, ChangeKind>
  active(session: SessionRef): string | undefined
  details(session: SessionRef): FileDiffInfo[] | undefined
  focus(session: SessionRef, path: string): void
  open(session: SessionRef): void
  watch(screen: SessionScreen, source: "tree" | "files" | "details"): () => void
}

type ChangeKind = "add" | "del" | "mix"
```

### Browser

`@opencode/plugin/gui/browser` exports `Browser`, the desktop browser pane of a session.

```ts
import { Browser } from "@opencode/plugin/gui/browser"

const session = ctx.sessions.current()
const live = ctx.use(Browser)()
const url = "http://localhost:3000"

if (session && live.status === "active" && live.value.canOpen(session, url)) live.value.open(session, url)
```

- `attached(session)` is `true` when the session has a browser pane.
- `canOpen(session, path?)` is `true` when a workspace file or an http(s) URL can open in the pane.
- `open(session, url)` opens a URL as a browser tab in the session's side panel.
- `openFile(session, path)` opens a workspace file as a `file://` tab.

#### Reference

```ts
interface Browser {
  attached(session: SessionRef): boolean
  canOpen(session: SessionRef, path?: string): boolean
  open(session: SessionRef, url: string): void
  openFile(session: SessionRef, path: string): void
}
```

## The main process

On OpenCode Desktop, a plugin's `main` setup runs once in the Electron main process as an app-wide singleton. It has
full access to Node.js built-ins, `electron`, and the main host APIs. Pass it to `Plugin.define` in the plugin's
[`./gui-experimental` file](#define-the-gui-plugin), beside the window `setup` or on its own.

```tsx title="src/gui.tsx"
import { Schema } from "effect"
import { powerSaveBlocker } from "electron"
import { Plugin } from "@opencode/plugin/gui"
import { KeepAwake } from "./gui/contract"

export default Plugin.define({
  main(ctx) {
    const stored = ctx.storage.store("keepScreenActive", { schema: Schema.Boolean, initial: false })
    let blockerId: number | undefined

    const release = () => {
      if (blockerId === undefined) return
      powerSaveBlocker.stop(blockerId)
      blockerId = undefined
    }

    const setActive = (enabled: boolean) => {
      if (enabled && blockerId === undefined) blockerId = powerSaveBlocker.start("prevent-display-sleep")
      if (!enabled) release()
      stored.set(enabled)
    }

    if (stored.value) setActive(true)

    ctx.provide(KeepAwake, {
      screenActive: () => blockerId !== undefined && powerSaveBlocker.isStarted(blockerId),
      setScreenActive: (enabled) => setActive(enabled),
    })

    return release
  },
})
```

In a window, `electron` is an inert placeholder, so the import is safe in the shared `./gui-experimental` file. See
[One file, two processes](#one-file-two-processes).

## Main context

`main` receives a `MainContext`. Unlike the window `setup`, `main` may be `async`, and it may return, or resolve to, a
cleanup function.

```ts
main(ctx) {
  ctx.log.write("info", "acme started", { version: ctx.app.version })
}
```

- `ctx.options`, `ctx.client`, and `ctx.app` are the [shared context](#shared-context). In `main`,
  `ctx.app.platform` is always `"desktop"`.
- `ctx.storage.store(key, { schema, initial })` opens a store synchronously in the plugin's namespace. Its `value` is
  always defined, and each `set` or `update` reaches the database before it returns. `ctx.storage.remove(key)` deletes
  the value.
- `ctx.signal` aborts when the plugin is disabled, reloaded, or removed, or the app quits. `ctx.onCleanup(fn)` runs `fn`
  then; see [Lifetimes and cleanup](#lifetimes-and-cleanup).
- `ctx.provide` implements an `Ipc` under the plugin's id; see [Define and provide an Ipc](#define-and-provide-an-ipc).
- `ctx.add` contributes to main-process registries such as [`MenubarItem`](#native-app-menu).
- `ctx.windows` lists the app's windows and reports when one opens or closes.
- `ctx.embeds` places a `WebContentsView` in a window's layout; see [Embedded web views](#embedded-web-views).
- `ctx.serverEndpoints.get(id)` returns a server's URL and credentials. The desktop app's own server is `"sidecar"`.
- `ctx.cli` describes the OpenCode CLI the desktop app runs.
- `ctx.log.write` writes to the desktop log file.

#### Reference

`@opencode/plugin/gui/main` exports `MainStorage` and `MainEmbeds` below as `Storage` and `Embeds`.

```ts
interface MainContext {
  id: string
  options: PluginOptions
  client: OpenCodeClient
  app: App
  signal: AbortSignal
  onCleanup(fn: Cleanup): void
  storage: MainStorage
  provide<S extends IpcSpec>(token: Ipc<S>, impl: IpcImpl<S>): IpcProvider<S>
  add<T>(registry: Registry<T>, item: () => T | undefined): Cleanup
  add<T>(registry: Registry<T>, item: T): Cleanup
  list<T>(registry: Registry<T>): T[]
  t(key: string, params?: Record<string, string | number | boolean>): string
  plural(key: string, count: number, params?: Record<string, string | number | boolean>): string
  windows: Windows
  embeds: MainEmbeds
  serverEndpoints: { get(id: string): ServerEndpoint | undefined }
  cli: { version: string; command: string[]; binary?: string; development: boolean }
  log: { write(level: "debug" | "info" | "warn" | "error", message: string, data?: Record<string, unknown>): void }
}

interface MainStorage {
  store(key: string, options: { schema: Schema; initial: T }): Persisted<T, T>
  remove(key: string): void
}

interface Windows {
  get(id: number): BrowserWindow | undefined
  list(): BrowserWindow[]
  focused(): BrowserWindow | undefined
  on(event: "open" | "close", handler: (window: BrowserWindow) => void): Cleanup
}

interface ServerEndpoint {
  id: string
  url: string
  headers: Record<string, string>
  sameMachine: boolean
  password?: string
}
```

## Define and provide an Ipc

An `Ipc` spec can declare per-window `state`, callable `methods`, and pushed `events`. Effect `Schema` validates and
encodes every value that crosses the bridge.

```ts title="src/gui/contract.ts"
import { Schema } from "effect"
import { Ipc } from "@opencode/plugin/gui"

export const Counter = Ipc.define({
  id: "acme.counter",
  state: Schema.Struct({ count: Schema.Number }),
  methods: {
    increment: {
      input: Schema.Number,
      output: Schema.Number,
    },
    reset: {},
  },
  events: {
    overflow: Schema.Struct({ limit: Schema.Number }),
  },
})
```

- The id is your plugin's id or starts with it, as `acme.counter`. `ctx.provide` in `main` and `ctx.main` in a window
  throw for any other id.
- Omit `input` for a method that takes no argument, and `output` for a method that returns nothing.

#### Reference

```ts
interface IpcSpec {
  id: string
  state?: Schema
  methods: Record<string, { input?: Schema; output?: Schema }>
  events?: Record<string, Schema>
}
```

### Implement the provider in main

Each method receives the decoded input and a `Caller` (`{ window, signal }`). Call `provider.changed(window?)` when
`state` changes to push the new snapshot to subscribed windows, or `provider.emit(name, payload, window?)` to send an
event.

```ts title="src/gui/main.ts"
import type { Plugin } from "@opencode/plugin/gui"
import { Counter } from "./contract"

export const main: Plugin.MainSetup = (ctx) => {
  const counts = new Map<number, number>()

  const provider = ctx.provide(Counter, {
    state: (window: number) => ({ count: counts.get(window) ?? 0 }),
    increment: (step, caller) => {
      const next = (counts.get(caller.window) ?? 0) + step
      counts.set(caller.window, next)
      provider.changed(caller.window)

      if (next > 100) provider.emit("overflow", { limit: 100 }, caller.window)

      return next
    },
    reset: (_input, caller) => {
      counts.set(caller.window, 0)
      provider.changed(caller.window)
    },
  })
}
```

- A spec with `state` also needs `state(window)` in the implementation. Main reads it when a window subscribes and on
  every `changed`.
- A method that throws rejects the window's call.
- `changed` and `emit` reach every window when you omit `window`.
- `dispose()` withdraws the `Ipc` early. Windows see it `pending`, and `ctx.main` calls wait, until the plugin provides
  it again or stops. The host also withdraws it when the plugin stops.

#### Reference

```ts
type IpcImpl<S extends IpcSpec> = {
  [Name in keyof S["methods"]]: (input: Input<Name>, caller: Caller) => Output<Name> | Promise<Output<Name>>
} & { state(window: number): State }

interface Caller {
  window: number
  signal: AbortSignal
}

interface IpcProvider<S extends IpcSpec> {
  changed(window?: number): void
  emit(name: keyof S["events"], data: EventData, window?: number): void
  dispose(): void
}
```

### Use the Ipc in a window

In a window, `ctx.main(Counter)` returns the client of the `Ipc` your `main` provides. A method without an `input`
schema takes only optional `{ signal }` call options. Do not pass `undefined` as its first argument.

```tsx title="src/gui/window.tsx"
import { Command, type Plugin } from "@opencode/plugin/gui"
import { Counter } from "./contract"
import type { definition } from "./definition"

export const setup: Plugin.Setup<typeof definition> = (ctx) => {
  const counter = ctx.main(Counter)

  // Follows main across restarts; removed when the plugin stops.
  counter.on("overflow", (data) => console.log(`Counter exceeded ${data.limit}`))

  ctx.add(Command, () => ({
    id: "increment",
    title: ctx.t("command.increment"),
    enabled: ctx.app.platform === "desktop",
    run: async () => {
      await counter.increment(1, { signal: ctx.signal })
      await counter.reset({ signal: ctx.signal })
    },
  }))
}
```

- A call waits while `main` starts. It rejects when `main` cannot answer: on the web, while the plugin's `main` is off
  or failed, or when the method throws. Catch the rejection where the user needs feedback.
- `state()` and `on()` follow `main` across restarts. A listener ends with the current owner, else with the plugin.
- `ctx.main` returns the same client for every call with the token.

Read this window's `state` with `client.state()`. It is `undefined` until the first snapshot arrives, and updates each
time `main` calls `changed`.

```tsx
const count = () => ctx.main(Counter).state()?.count ?? 0
```

#### Reference

```ts
type IpcClient<S extends IpcSpec> = {
  [Name in keyof S["methods"]]: S["methods"][Name] extends { input: Schema }
    ? (input: Input<Name>, options?: { signal?: AbortSignal }) => Promise<Output<Name>>
    : (options?: { signal?: AbortSignal }) => Promise<Output<Name>>
} & {
  state(): State | undefined
  on(name: keyof S["events"], listener: (data: EventData) => void): Cleanup
}
```

Define the plugin with both setups in `src/gui.tsx`: `Plugin.define({ ...definition, setup, main })`.

### Other plugins

Another plugin follows your `Ipc` with `ctx.use(Counter)`, as it follows a contract. While it is `active`, its value is
the same `IpcClient`.

```ts
const counter = ctx.use(Counter)

const count = () => {
  const live = counter()

  return live.status === "active" ? (live.value.state()?.count ?? 0) : 0
}
```

- Every `Ipc` is `inactive` on the web, where no main process runs.

## Native app menu

`main` adds items to the native menus (the macOS app menu, File, Edit, View, Go, Window, and Help) and to the in-app
menu on Windows and Linux with `MenubarItem` from `@opencode/plugin/gui/main`:

```ts
import { MenubarItem } from "@opencode/plugin/gui/main"

ctx.add(
  MenubarItem,
  (): MenubarItem => ({
    menu: "help",
    id: "diagnostics",
    after: "logs.export",
    label: ctx.t("menu.diagnostics"),
    enabled: () => true,
    run: (focusedWindow) => {
      focusedWindow?.webContents.focus()
    },
  }),
)
```

- `after` names the item it follows: one of this plugin's items by its id, or a built-in item by its command, else its
  action, else its role, for example `logs.export`, `edit.copy`, or `about`. When nothing matches, the item goes at the
  end of the menu.
- `app` items appear only on macOS.
- `run` receives the focused window, if any.
- Main reads the function each time it builds the menu, so the label follows the language.

#### Reference

```ts
interface MenubarItem {
  menu: "app" | "file" | "edit" | "view" | "go" | "window" | "help"
  id: string
  label: string
  after?: string
  enabled?(): boolean
  run(window: BrowserWindow | undefined): void
}
```

## Embedded web views

To embed an isolated `WebContentsView` in a panel, create it in `main` and render its box from the window.

```ts title="src/gui/main.ts"
import { type BrowserWindow, WebContentsView } from "electron"
import type { Plugin } from "@opencode/plugin/gui"

export const main: Plugin.MainSetup = (ctx) => {
  const attach = (window: BrowserWindow) => {
    const view = new WebContentsView()
    const embed = ctx.embeds.create(view, window)
    void view.webContents.loadURL("https://acme.example")
    embed.show(true)
    // Send embed.id to the window over your Ipc.
  }
  ctx.windows.list().forEach(attach)
  ctx.windows.on("open", attach)
}
```

```tsx title="src/gui/pane.tsx"
<ctx.embeds.View id={embedId} visible radius={8} />
```

- `"open"` fires only for windows that open later, so attach to `ctx.windows.list()` first.
- A window passes the embed's `id` to `ctx.embeds.View` and `ctx.embeds.capture`.
- `show(visible)` is the page's side of visibility: the view shows only while the window lays it out and `show(true)`
  holds.
- `on("visible", handler)` runs when the view goes on or off screen, including when the window paints a still in its
  place.
- `capture()` returns a still of the page, or `undefined` while it is hidden.
- `dispose()` removes the view from the window, but does not close its page; call `view.webContents.close()` when
  you are done with it. The host also disposes the embed when the plugin goes away.
- In the window, `View` fills its box with the embed. The host keeps the view's bounds, zoom, rounded corners, and
  dialog occlusion in step, and hides it while the window is hidden or a dialog is open.
- `frozen` paints a still in place of the live view, so DOM content can float above it. `radius` rounds the bottom
  corners, and `background` is the color the corners show.
- `page` is what the embed shows, such as its URL. While a panel moves, the host paints a still of the embed in its
  place, and drops a still taken while `page` had another value.
- The window's `capture(id)` returns a JPEG still, or `undefined` while the embed is hidden and always on the web.

#### Reference

```ts
interface MainEmbeds {
  create(view: WebContentsView, window: BrowserWindow): Embed
}

interface Embed {
  id: string
  show(visible: boolean): void
  on(event: "visible", handler: (visible: boolean) => void): Cleanup
  capture(): Promise<NativeImage | undefined>
  dispose(): void
}

interface Embeds {
  View(props: EmbedProps): JSX.Element
  capture(id: string): Promise<Uint8Array | undefined>
}

interface EmbedProps {
  id: string | undefined
  visible: boolean
  frozen?: boolean
  page?: string
  radius?: number
  background?: string
  class?: string
  children?: JSX.Element
}
```

## Live dependencies and failure handling

`ctx.use(token)` returns an accessor of a reactive `Live<T>`: the state of the plugin that provides the token. Your
plugin keeps running while that provider is off, so handle the states that are not `active`. No control should be dead,
and no spinner should run forever.

```ts
import { Browser } from "@opencode/plugin/gui/browser"

const browser = ctx.use(Browser)

ctx.add(Command, () => {
  const live = browser()
  const session = ctx.sessions.current()

  return {
    id: "preview",
    title: ctx.t("command.preview"),
    enabled: live.status === "active" && !!session,
    run: () => {
      if (live.status === "active" && session) live.value.open(session, "http://localhost:3000")
    },
  }
})
```

- **`pending`:** the provider has not started yet, for example while its plugin loads or restarts. Show a loading
  state, or hide optional controls.
- **`active`:** the provider runs, and `value` is its contract or `Ipc` client. `generation` counts activations, so a
  provider that restarts comes back with a new one.
- **`inactive`, `disabled`:** the provider is turned off, absent, or not available on this platform, as every
  `Ipc` is on the web. Show an unavailable state, or omit the control.
- **`inactive`, `failed`:** the provider's setup threw an error. Show an unavailable state.
- Your own `main` has no `Live` state. Calls through [`ctx.main`](#use-the-ipc-in-a-window) wait while it starts, and
  reject when it cannot answer.

#### Reference

```ts
type Live<T> =
  | { status: "pending" }
  | { status: "active"; value: T; generation: number }
  | { status: "inactive"; reason: "disabled" | "failed" }
```

## Lifetimes and cleanup

Everything registered through `ctx` (`ctx.add`, `ctx.provide`, `ctx.dialogs.open`, `ctx.embeds.create`, and `Ipc`
event listeners) is withdrawn when its owning scope ends:

- Inside a component or a `createKeyed` callback, registrations end when that component or `createKeyed` run disposes.
- At the top level of `setup`, registrations end when the plugin is disabled, reloaded, or removed, or its window
  closes.
- In `main`, registrations end when the plugin is disabled, reloaded, or removed, or the app quits. An embed also ends
  when its window closes.

For other resources, such as timers or sockets, return a cleanup function from the setup. It runs at the same time.

- **Window `setup`** cannot be `async`, because it runs under a Solid owner. Return a cleanup function, or use
  `onCleanup` or `ctx.signal`.
- **`main`** may be `async`. Return, or resolve to, a cleanup function, or use `ctx.onCleanup(fn)`.

### Window setup

Window `setup` must be synchronous. Start asynchronous work inside `createKeyed` or `createLatest`.

```tsx title="src/gui.tsx"
import { Command, createKeyed, Plugin } from "@opencode/plugin/gui"
import { Changes } from "@opencode/plugin/gui/review"

export default Plugin.define({
  i18n: { en: { changes: "Show changes" } },
  setup(ctx) {
    // Runs once per active generation of Changes; the command is withdrawn with it.
    createKeyed(ctx.use(Changes), (changes) => {
      ctx.add(Command, () => ({
        id: "changes",
        title: ctx.t("changes"),
        run: () => {
          const session = ctx.sessions.current()

          if (session) changes.open(session)
        },
      }))
    })

    const timer = setInterval(() => console.log("still here"), 60_000)

    return () => clearInterval(timer)
  },
})
```

### Main setup

`main` may be `async`. Return, or resolve to, a cleanup function for resources it opens, or register it with
`ctx.onCleanup(fn)`.

```ts
async main(ctx) {
  const socket = await connect(ctx.options)

  ctx.onCleanup(() => socket.close())
}
```

- `ctx.onCleanup` runs its functions when the plugin is disabled, reloaded, or removed, or the app quits, last
  registered first. It runs a function at once when the plugin is already gone.
- After an `await`, return if `ctx.signal` aborted, before you register or change anything.
- An `async` cleanup delays quitting until it settles, for at most 3 seconds.

==> ./plugins/index.mdx <==
---
title: "Building plugins"
description: "Build an OpenCode plugin: one package with a server part, a TUI part, a GUI part, or any combination."
---

Plugins modify OpenCode's behavior and add new features. A plugin is one package with a server part, a TUI part, a GUI
part, or any combination.

```ts title=".opencode/plugins/example/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  async setup(ctx) {
    await ctx.storage.set("loaded", true)
  },
})
```

Migrating an existing OpenCode 1 plugin? Follow the [V1 plugin migration guide](/build/plugins/migrate-v1).

## Parts

Each part is an export of the package. Every part's SDK comes from the one `@opencode/plugin` dependency.

```json title="package.json"
{
  "name": "opencode-acme-plugin",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./tui": "./src/tui.tsx",
    "./gui-experimental": "./dist/gui-experimental.cjs",
    "./rpc": "./src/rpc.ts"
  },
  "files": ["src", "dist"],
  "dependencies": {
    "@opencode/plugin": "latest"
  }
}
```

- **Server** (`.` or `./server`) runs in the OpenCode server with `@opencode/plugin`. It adds tools, hooks,
  integrations, commands, and agents. See [Server](/build/plugins/server), or [Effect plugins](/build/plugins/effect)
  for the Effect API.
- **TUI** (`./tui`) runs in the terminal UI with `@opencode/plugin/tui`. See [TUI](/build/plugins/cli).
- **GUI** (`./gui-experimental`) runs its `setup` in every OpenCode Desktop window and its `main` in the desktop app's
  main process, with `@opencode/plugin/gui`. See [GUI](/build/plugins/gui).
- **RPC** (`./rpc`) is a typed contract that the server part implements and the other parts and clients call. See
  [RPC](/build/plugins/rpc).

The plugin's `id` comes from its server part's `Plugin.define`. A package with a GUI part and no server part takes its
package name (or a local directory's name) as its `id`. A TUI part declares its own `id`; a GUI part declares none and
takes the plugin's.

## Load

Plugins under `.opencode/plugins/` load automatically, like the local example above. To load published packages or
plugin directories from other locations, add them to `plugins` in `opencode.json(c)`:

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    "opencode-acme-plugin",
    "opencode-acme-plugin@1.2.0",
    "@acme/opencode-plugin",
    "./plugins/local",
    "../shared/plugin",
    "/absolute/path/plugin",
    "file:///home/me/plugins/local",
    {
      "package": "@acme/opencode-plugin",
      "options": {
        "agent": "reviewer",
        "strict": true,
      },
    },
  ],
}
```

- One entry loads every part. The TUI loads the TUI parts of the plugins its server loads, and OpenCode Desktop loads
  the GUI parts of the plugins in your global `opencode.json(c)`.
- A package with only a TUI part goes in [`cli.json`](/cli/plugins) instead.
- A local plugin directory with a `package.json` `name` and `exports` loads its parts through them, like the published
  package. Without them, it uses file names at its root: `server` (else `index`), `tui`, and `rpc` with a `.ts`,
  `.tsx`, or `.js` extension, and `gui-experimental.cjs` (or `.js`).
- See [Configure plugins](/plugins) for more loading and configuration options.

## Publish

A published plugin is an npm package with the `package.json` above. Its parts use the same default exports as a local
plugin.

```bash
npm publish
```

- Export `./rpc` when other plugins and clients should import your [RPC contract](/build/plugins/rpc) without loading
  your implementation.
- Build the GUI bundle before you publish, and include it through `files`. See
  [Build the bundle](/build/plugins/gui#build-the-bundle).
- Use versions compatible with the OpenCode release you target, and test the installed package, not only a
  workspace-linked copy. Publish a compatible plugin update when you adopt a newer API contract.

<CardGroup cols={2}>
  <Card title="Server" href="/build/plugins/server">
    Add tools, hooks, integrations, commands, and agents in the OpenCode server.
  </Card>
  <Card title="TUI" href="/build/plugins/cli">
    Add commands, routes, slots, and Markdown renderers to the terminal UI.
  </Card>
  <Card title="GUI" href="/build/plugins/gui">
    Add panels, commands, settings pages, and native integrations to OpenCode Desktop.
  </Card>
  <Card title="RPC" href="/build/plugins/rpc">
    Expose typed methods and events from the server part to the other parts and to clients.
  </Card>
</CardGroup>

==> ./plugins/migrate-v1.mdx <==
---
title: "Migrate plugins from V1"
description: "Port a V1 plugin's tools and hooks to the V2 plugin API."
---

Plugin configuration can be normalized automatically, but plugin implementation code must be ported. V1 plugin functions
return one object containing tools and hooks. A V2 plugin default-exports a definition with an `id` and `setup(ctx)`;
`setup` registers hooks, transforms, tools, and subscriptions through the context.

<Callout type="warning">
  V1 plugin implementations do not run in V2. Moving a file or renaming its config entry is not enough.
</Callout>

## Migrate plugin configuration

Rename `plugin` to `plugins`. Replace a package-and-options tuple with an object:

```jsonc
// V1
{
  "plugin": [
    "opencode-example-plugin",
    ["./plugin/local.ts", { "enabled": true }]
  ]
}

// V2
{
  "plugins": [
    "opencode-example-plugin",
    {
      "package": "./plugin/local",
      "options": { "enabled": true }
    }
  ]
}
```

V2 discovers local plugins from both `.opencode/plugin/` and `.opencode/plugins/`; use `.opencode/plugins/` for V2 files.
Configured local paths must name directories. For the example above, move the ported implementation to
`./plugin/local/index.ts`; a configured `./plugin/local.ts` file is skipped with a warning in the log.
Keep supporting modules beside the plugin when moving it. Local plugins and package plugins use the same implementation
API.

## Replace the entrypoint

Change the package import, replace the exported plugin function with `Plugin.define`, and move initialization into
`setup`.

```ts title="V1"
import type { Plugin } from "@opencode-ai/plugin"

export const ExamplePlugin: Plugin = async ({ directory, project, client }) => {
  await client.app.log({
    body: { service: "example", level: "info", message: `Loaded for ${project.id}` },
  })

  return {
    // V1 tools and hooks
  }
}
```

```ts title="V2"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  async setup(ctx) {
    await ctx.storage.set("last-project", ctx.location.project.id)
    console.log(`Loaded for ${ctx.location.directory}`)
  },
})
```

Every V2 plugin needs a stable `id`. Plugin storage is scoped by this ID, and the ID also identifies the plugin in status
and diagnostics. Published plugins should depend on a version of `@opencode/plugin` compatible with the OpenCode release
they target.

## Migrate the context

The V2 context is both an OpenCode client and the plugin API. Most operations are grouped by domain instead of
living on a separate `client` property.

| V1                                      | V2                                                                  |
| --------------------------------------- | ------------------------------------------------------------------- |
| `directory`                             | `ctx.location.directory`                                            |
| `project`                               | `ctx.location.project`                                              |
| `client`                                | Domain methods such as `ctx.session`, `ctx.permission`, `ctx.agent` |
| plugin options argument                 | `ctx.options`                                                       |
| returned `dispose()` hook               | cleanup function returned by `setup`                                |
| returned `event` hook                   | `ctx.event.subscribe()`                                             |
| returned config, model, or tool changes | a domain `transform(...)`                                           |
| `$` Bun shell helper                    | import and manage the process API your plugin uses                  |

`ctx.location` describes the location where this plugin instance loaded. It is not the location of every session or event
the plugin may observe. Read the session or event data when that distinction matters.

The context exposes many more domains than the table lists, including catalogs, commands, integrations, MCP servers,
references, skills, storage, VCS, worktrees, and web search. See the [complete plugin context](/build/plugins/server#api).

## Register hooks in `setup`

V1 returns hooks by string key. V2 registers each hook on the domain that owns the operation. The callback receives one
mutable event instead of separate `input` and `output` objects.

```ts title="V1"
import type { Plugin } from "@opencode-ai/plugin"

export const GuardPlugin: Plugin = async () => ({
  "tool.execute.before": async (input, output) => {
    if (input.tool === "read" && output.args.filePath.includes(".env")) {
      throw new Error("Do not read .env files")
    }
  },
  "shell.env": async (_input, output) => {
    output.env.COMPANY_ENV = "development"
  },
})
```

```ts title="V2"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company.guard",
  async setup(ctx) {
    await ctx.tool.hook("execute.before", (event) => {
      const input = event.input as { filePath?: string }
      if (event.tool === "read" && input.filePath?.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    })

    await ctx.shell.hook("create.before", (event) => {
      event.env.COMPANY_ENV = "development"
    })
  },
})
```

Registrations stay active for the plugin's lifetime and are disposed when it unloads. Retain the returned registration
only when the plugin needs to remove that particular hook or transform earlier with `registration.dispose()`.

Use this table to find the closest V2 API for each V1 hook:

| V1 hook                                | V2 API                                                       |
| -------------------------------------- | ------------------------------------------------------------ |
| `event`                                | `ctx.event.subscribe()`                                      |
| `dispose`                              | cleanup function returned by `setup`                         |
| `config`                               | transforms on the affected domains                           |
| `tool` map                             | `ctx.tool.transform(...)`                                    |
| `auth`                                 | `ctx.integration.transform(...)` and integration APIs        |
| `provider`                             | `ctx.provider.transform(...)` and `ctx.model.transform(...)` |
| `chat.message`                         | `ctx.session.hook("prompt", ...)`                            |
| `chat.params`                          | `ctx.session.hook("context", ...)`                           |
| `chat.headers`                         | `ctx.session.hook("model.request", ...)` or `"http.request"` |
| `permission.ask`                       | `ctx.permission.hook("evaluate", ...)`                       |
| `command.execute.before`               | command transforms or the prompt hook, depending on intent   |
| `tool.execute.before`                  | `ctx.tool.hook("execute.before", ...)`                       |
| `tool.execute.after`                   | `ctx.tool.hook("execute.after", ...)`                        |
| `shell.env`                            | `ctx.shell.hook("create.before", ...)`                       |
| `tool.definition`                      | `ctx.tool.transform(...)`                                    |
| `experimental.chat.system.transform`   | `ctx.session.hook("context", ...)` and edit `event.system`   |
| `experimental.chat.messages.transform` | `ctx.session.hook("context", ...)` and edit `event.messages` |
| `experimental.session.compacting`      | `ctx.session.hook("compaction", ...)`                        |

These are migration destinations, not always exact renames. In particular, the V2 `prompt` hook runs before durable
prompt admission, while `context` runs immediately before an agent model request. Register `context`, `compaction`,
`generate`, and `title` separately if a transformation must apply to every model request kind.

There is no direct V2 hook corresponding to every experimental V1 hook. Re-evaluate plugins that use
`experimental.compaction.autocontinue`, `experimental.provider.small_model`, or `experimental.text.complete` against the
V2 session, provider, model, and event APIs rather than preserving an internal lifecycle assumption.

`command.execute.before` also has no one-to-one global hook. Register a command with `ctx.command.transform` when the
plugin owns that command. Use the prompt hook when the real intent is to modify prompts submitted by commands and other
prompt sources.

## Migrate request hooks

V2 separates prompt admission, model-visible context, semantic model options, and native HTTP. Choose the narrowest
layer your plugin needs.

```ts title="V1"
import type { Plugin } from "@opencode-ai/plugin"

export const RequestPlugin: Plugin = async () => ({
  "chat.params": async (_input, output) => {
    output.temperature = 0.2
    output.maxOutputTokens = 8_000
  },
  "chat.headers": async (_input, output) => {
    output.headers["x-plugin"] = "review"
  },
  "experimental.chat.system.transform": async (_input, output) => {
    output.system.push("Focus on correctness.")
  },
})
```

```ts title="V2"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "review-request",
  async setup(ctx) {
    await ctx.session.hook("context", (event) => {
      event.system.push({ type: "text", text: "Focus on correctness." })
      event.options.temperature = 0.2
      event.options.maxTokens = 8_000
    })

    await ctx.session.hook("model.request", (event) => {
      event.headers["x-plugin"] = "review"
    })
  },
})
```

Use semantic provider options in `event.options`. Use `model.request` for model request headers and raw request settings,
and use `http.request` or `http.response` only when the plugin needs the native provider HTTP exchange. Provider-specific
hooks can pass `{ providerID: "..." }` as the third argument to `ctx.session.hook`.

## Migrate custom tools

V1 returns a `tool` map built with the old `tool()` helper. V2 registers tool definitions through a synchronous
`ctx.tool.transform` editor. Tool schemas use JSON Schema, and execution returns structured content.

```ts title="V1"
import { tool } from "@opencode-ai/plugin"

export const ToolsPlugin = async () => ({
  tool: {
    greeting: tool({
      description: "Create a greeting",
      args: { name: tool.schema.string() },
      async execute(args) {
        return `Hello ${args.name}!`
      },
    }),
  },
})
```

```ts title="V2"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "greeting",
  async setup(ctx) {
    await ctx.tool.transform((editor) => {
      editor.add({
        name: "greeting",
        description: "Create a greeting",
        input: {
          type: "object",
          properties: { name: { type: "string" } },
          required: ["name"],
          additionalProperties: false,
        },
        async execute(input) {
          return { content: `Hello ${(input as { name: string }).name}!` }
        },
      })
    })
  },
})
```

Transforms are replayable state edits. Keep their callback synchronous, cheap, and free of one-time side effects. Load
external data before registration, capture it in the callback, and call the domain's `reload()` method when that data
changes. A later plugin transform sees earlier changes and may update, replace, or remove them.

The same transform pattern replaces V1 `config` and `provider` hooks, but V2 does not expose one mutable global config
object. Register the change with the domain that owns it: `ctx.agent`, `ctx.provider`, `ctx.model`, `ctx.command`,
`ctx.integration`, `ctx.mcp`, `ctx.reference`, `ctx.skill`, `ctx.tool`, `ctx.vcs`, `ctx.websearch`, or `ctx.worktree`.
Authentication methods belong to integrations; provider transforms contribute source definitions and provider settings,
while model transforms apply restrictions and overrides to the complete active-provider model collection.

```ts
await ctx.provider.transform((editor) => {
  editor.update("anthropic", (provider) => {
    provider.headers = { ...provider.headers, "x-company": "engineering" }
  })
})

await ctx.model.transform((editor) => {
  editor.list("anthropic").forEach((model) => {
    if (!model.capabilities.tools) editor.remove(model.providerID, model.id)
  })
})
```

## Migrate events and cleanup

V1's `event` callback becomes an async subscription to the public server event stream. Abort it from the cleanup function
returned by `setup`.

```ts title="V2"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "notifications",
  setup(ctx) {
    const controller = new AbortController()

    void (async () => {
      for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
        if (event.type === "session.idle") console.log("Session completed")
      }
    })()

    return () => controller.abort()
  },
})
```

Use the cleanup function for timers, subprocesses, sockets, and other resources the plugin owns. Hook and transform
registrations are scoped to the plugin and are cleaned up automatically.

## Migrate options and persistent state

Read options from `ctx.options`. Use `ctx.storage` instead of inventing a global file when state belongs to a plugin; its
JSON values are durable and scoped to the plugin.

```ts
const strict = ctx.options.strict === true
await ctx.storage.set("settings", { strict })
const settings = await ctx.storage.get("settings")
```

## Support V1 and V2 from one package

A package can temporarily expose both implementations from one default export. V1 calls `server()` and V2 calls
`setup()`. The APIs remain separate; this shape does not translate hooks automatically.

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin"

export default {
  ...Plugin.define({
    id: "example",
    async setup(ctx) {
      await ctx.tool.hook("execute.before", () => {
        console.log("A tool is about to run")
      })
    },
  }),
  async server() {
    return {
      "tool.execute.before": async () => {
        console.log("A tool is about to run")
      },
    }
  },
}
```

V1 object entrypoints are supported in OpenCode `1.18.29` and newer. If you support older V1 releases, use separate
package versions or entrypoints and test the oldest release you claim to support. Remove the V1 implementation after your
support window ends.

## Verify a ported plugin

For each plugin:

1. Confirm its ID and source appear in the active plugin list.
2. Exercise every registered hook, transform, tool, command, and event subscription.
3. Verify cleanup by reloading or removing the plugin.
4. Test plugin options and persisted state with a clean project.
5. For a published package, test the installed package rather than only a workspace-linked copy.

See [Server](/build/plugins/server) for the full Promise API, [Effect plugins](/build/plugins/effect) for the Effect
entrypoint, [plugin RPC](/build/plugins/rpc) for custom methods and events, and [TUI plugins](/build/plugins/cli) for
the terminal UI.

==> ./plugins/rpc.mdx <==
---
title: "Plugin RPC"
description: "Expose a plugin's custom methods and events to other plugins and clients."
---

Plugins can expose custom methods and events that run on the server and can be
called by other plugins or clients.

## Define

Use `Rpc.define` to list the RPC's methods, errors, and events.

```ts title="src/rpc.ts"
import { Rpc } from "@opencode/plugin/rpc"

export const Acme = Rpc.define({
  id: "acme",
  methods: {
    search: {
      input: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
        additionalProperties: false,
      },
      output: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
        additionalProperties: false,
      },
      errors: {
        not_found: {
          type: "object",
          properties: { query: { type: "string" } },
          required: ["query"],
          additionalProperties: false,
        },
      },
    },
  },
  events: {
    updated: {
      schema: {
        type: "object",
        properties: {
          itemID: { type: "string" },
          text: { type: "string" },
        },
        required: ["itemID", "text"],
        additionalProperties: false,
      },
    },
  },
})
```

### Validation

An RPC definition describes the shapes of input and output of methods, events
and errors. It supports two schema formats:

- JSON Schema, simple and requires no dependencies.
- Any Standard Schema compliant validator
  - Zod
  - Valibot
  - ArkType

### Input and output

Each method can define an `input` schema for its argument and an `output` schema
for its return value. Leave either one out if the method does not accept or
return a value.

```ts
search: {
  input: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
  },
  output: {
    type: "object",
    properties: { text: { type: "string" } },
    required: ["text"],
  },
}
```

JSON Schema values are `unknown` in TypeScript, so narrow them before use.
Standard Schema infers the input and output types.

### Errors

Add an `errors` map to a method for expected failures. Each key becomes the
error's `type`, and its schema defines the error's `data`.

```ts
errors: {
  not_found: {
    type: "object",
    properties: { query: { type: "string" } },
    required: ["query"],
    additionalProperties: false,
  },
}
```

Error names beginning with `rpc.` are reserved by OpenCode.

### Events

Add events to the top-level `events` map. Each event has a schema for the data
sent to subscribers.

Event data must be an object. Use an empty object schema when there is no data:

```ts
events: {
  refreshed: {
    schema: { type: "object", additionalProperties: false },
  },
}
```

Scalars, arrays, `null`, and `undefined` are not valid event data.

## Implement

Register the implementation inside `setup`:

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin"
import { Acme } from "./rpc.js"

export default Plugin.define({
  id: "acme-plugin",
  async setup(ctx) {
    const registration = await ctx.rpc.register(Acme, {
      search: async (input, context) => {
        const { query } = input as { query: string }
        const text = await findText(query, { signal: context.signal })
        if (!text) return context.error("not_found", "Result not found", { query })
        return { text }
      },
    })

    const acme = ctx.rpc(Acme)
    const result = await acme.search({ query: "hello" })

    await registration.events.emit("updated", { itemID: "item-1", text: "ready" })
  },
})
```

After registering the RPC, the same plugin can call it through `ctx.rpc(Acme)`.

The second argument includes `signal` for cancellation and `context.error(...)`
for declared errors. You can return or throw the error.

One plugin can register more than one RPC. Disposing the registration removes it.

## Call

Once the RPC is registered, it can be called over HTTP or from another plugin.

### HTTP

Create an OpenCode client, then use `client.rpc` to create a subclient for the
RPC:

```ts
import { OpenCode } from "@opencode/client"
import { Acme } from "opencode-acme-plugin/rpc"

const client = OpenCode.make({
  baseUrl: "http://localhost:4096",
})

const acme = client.rpc(Acme)
const result = await acme.search({ query: "hello" })
```

### Plugin

Plugins already have an OpenCode client. For example, a TUI plugin can create
the same RPC subclient from `context.client`:

```ts title="src/tui.ts"
import { Plugin } from "@opencode/plugin/tui"
import { Acme } from "opencode-acme-plugin/rpc"

export default Plugin.define({
  id: "acme-tui",
  async setup(context) {
    const acme = context.client.rpc(Acme)
    const result = await acme.search({ query: "hello" })
    console.log(result)
  },
})
```

A [GUI plugin](/build/plugins/gui) reads the client of the desktop app's own server from `ctx.client`:

```tsx title="src/gui.tsx"
import { Command, Plugin } from "@opencode/plugin/gui"
import { Acme } from "opencode-acme-plugin/rpc"

export default Plugin.define({
  setup(ctx) {
    ctx.add(Command, {
      id: "search",
      title: "Search Acme",
      run: async () => {
        const result = await ctx.client.rpc(Acme).search({ query: "hello" })
        console.log(result)
      },
    })
  },
})
```

Read `ctx.client` where you call it: it changes after the server restarts. While the server is unreachable, every call
rejects.

### Subscribe

Use `events.on` for a callback and unsubscribe when the listener is no longer
needed:

```ts
const unsubscribe = acme.events.on("updated", (event) => {
  console.log(event.type, event.location.directory, event.data.text)
})

unsubscribe()
```

For an async iterable, use `events.subscribe("updated")`:

```ts
for await (const event of acme.events.subscribe("updated")) {
  console.log(event.data.text)
}
```

Event subscriptions are live only, so disconnected subscribers miss events.

- Subscribe with the local name, such as `updated`.
- The received type is prefixed, such as `rpc.acme.updated`.
- Each event includes `data` and `location`.
- Plugin unload closes its subscriptions.

External clients receive events from every location, so check `event.location`
when needed. The server plugin still needs to be configured and running.

==> ./plugins/server.mdx <==
---
title: "Server"
description: "Build the server part of an OpenCode plugin: tools, hooks, integrations, commands, and agents."
---

The server part of a plugin runs in the OpenCode server. It modifies OpenCode's behavior and adds features: tools,
hooks, integrations, commands, and agents. See the [Overview](/build/plugins) for how a plugin package is laid out,
loaded, and published.

```ts title=".opencode/plugins/example/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  async setup(ctx) {
    await ctx.storage.set("loaded", true)
  },
})
```

## Lifecycle

`setup` runs when the plugin loads. It may return a cleanup function that runs when the plugin unloads.

```ts
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "example",
  setup(ctx) {
    console.log(`loaded in OpenCode ${ctx.app.version}`)
    return () => console.log("unloaded")
  },
})
```

### Context

The plugin context is essentially an [OpenCode server client](/build/client).
Its read and action methods use the same inputs and responses as the client. It
adds plugin-only methods for transforms, runtime hooks, reloads, registrations,
and plugin options.

```ts
setup(ctx) {
  console.log(ctx.app.version)
}
```

`ctx.location` describes the location where this plugin instance is loaded. It
includes `directory`, optional `workspaceID`, and `project` metadata (`id`,
`directory`, and `canonical`). It is available in both Promise and Effect plugins.
This is the plugin instance's location, not the location of every session it can
access or event it receives.

```ts
setup(ctx) {
  console.log(ctx.location.directory)
  console.log(ctx.location.project.canonical)
}
```

### Options

Pass plugin options with the object form in `opencode.json(c)`.

```jsonc title="opencode.jsonc"
{
  "plugins": [
    {
      "package": "./plugins/company",
      "options": {
        "strict": true,
      },
    },
  ],
}
```

Read those values from `ctx.options` during `setup`.

```ts title="plugins/company/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company",
  setup(ctx) {
    const strict = ctx.options.strict === true
  },
})
```

## Transforms

Transforms are synchronous edits to OpenCode's domain state, and each builds on earlier registrations in its domain.
Registry reads such as `ctx.model.list()` reflect every registration so far, including during plugin setup;
startup batching only coalesces update notifications and never delays what a read returns. Resource status APIs still
report the state of running resources: a registered definition does not mean its connection or other resource work has
completed.

Sources contribute providers and immutable model definitions through `ctx.provider.transform`.

```ts title="plugins/models/index.ts"
import { Model, Plugin, Provider } from "@opencode/plugin"

export default Plugin.define({
  id: "company.models",
  async setup(ctx) {
    const providerID = Provider.ID.make("acme")
    const models = [{ ...Model.Info.default(providerID, Model.ID.make("reasoner")), name: "Acme Reasoner" }]
    await ctx.provider.transform((editor) => {
      editor.add({
        info: {
          ...Provider.Info.empty(providerID),
          name: "Acme",
          activation: "enabled",
          package: "@opencode/ai/providers/openai-compatible",
          settings: { baseURL: "http://127.0.0.1:8000/v1" },
        },
        models,
      })
    })

    const available = await ctx.model.list()
  },
})
```

Any registration, removal, or `reload()` marks the registry changed; the next read rebuilds it by replaying every
active transform in registration order onto a fresh value. Keep transforms cheap and repeatable. A value you have
already read is never modified by later rebuilds.

After provider transforms and availability are resolved, OpenCode materializes the active providers' models and replays
every model transform in order. A model policy can inspect the whole candidate collection, including newly refreshed
sources.

```ts title="plugins/model-budget/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company.model-budget",
  async setup(ctx) {
    await ctx.model.transform((editor) => {
      editor
        .list()
        .filter((model) => model.cost.some((tier) => tier.output > 20))
        .forEach((model) => {
          editor.remove(model.providerID, model.id)
        })
    })
  },
})
```

Captured inputs are not watched automatically. Load external data before the synchronous callback, then call
`reload()` after those inputs change. Here, `loadFromSource()` returns
`{ info: Provider.Info, models: readonly Model.Info[] }` entries.

```ts title="plugins/models/index.ts"
import { Plugin } from "@opencode/plugin"

export default Plugin.define({
  id: "company.models",
  async setup(ctx) {
    const source = { providers: await loadFromSource() }

    await ctx.provider.transform((editor) => {
      source.providers.forEach((provider) => editor.add(provider))
    })

    const refresh = async () => {
      source.providers = await loadFromSource()
      await ctx.provider.reload()
    }

    const timer = setInterval(() => void refresh().catch(console.error), 60_000)
    return () => clearInterval(timer)
  },
})
```

Provider changes invalidate the whole active model result, so the output-price policy still filters the refreshed models.
Use `ctx.model.reload()` when only an input captured by a model transform changes.

## API

### Agent

Read all agents or fetch one by ID.

```ts
const agents = await ctx.agent.list()
const build = await ctx.agent.get({ agentID: "build" })
```

Register a transform to inspect, update, remove, or select the default agent.

```ts
await ctx.agent.transform((editor) => {
  const agents = editor.list()
  const build = editor.get("build")

  editor.default("build")
  editor.update("build", (agent) => {
    agent.description = "Builds features and fixes bugs"
  })
  editor.remove("legacy")
})
```

Reload agents after external state used by a transform changes.

```ts
await ctx.agent.reload()
```

#### Reference

Schema: [`Agent.Info`](/api#schema-Agent.Info)

```ts
interface AgentContext {
  list(input?: AgentListInput, requestOptions?: RequestOptions): Promise<AgentListOutput>
  get(input: AgentGetInput, requestOptions?: RequestOptions): Promise<AgentGetOutput>
  transform(callback: (editor: AgentEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface AgentEditor {
  list(): readonly AgentInfo[]
  get(id: string): AgentInfo | undefined
  default(id: string | undefined): void
  update(id: string, update: (agent: AgentInfo) => void): void
  remove(id: string): void
}

interface Registration {
  dispose(): Promise<void>
}
```

### Providers

Read available providers or inspect one provider's metadata by ID.

```ts
const providers = await ctx.provider.list()
const provider = await ctx.provider.get({ providerID: "anthropic" })
```

Provider transforms edit provider settings and source definitions. Editor reads include inactive providers and expose
immutable definitions; `models.update` edits an owned copy of a source model.

```ts
await ctx.provider.transform((editor) => {
  editor.update("anthropic", (provider) => {
    provider.headers = { ...provider.headers, "x-company": "engineering" }
  })
  editor.models.update("anthropic", "claude-sonnet-5-5", (model) => {
    model.name = "Team Sonnet"
  })
  editor.models.remove("anthropic", "legacy-model")
  editor.remove("legacy-provider")
})
```

Replace a provider's source inventory with `models.set`, then reload after the captured definitions change.

```ts
const source = { models: await loadModels() }
await ctx.provider.transform((editor) => {
  editor.models.set("acme", source.models)
})

source.models = await loadModels()
await ctx.provider.reload()
```

For account-specific discovery, pass the connection used to load the inventory as `sourceConnection`. OpenCode excludes
that provider while another connection is selected, until your plugin publishes its refreshed inventory.

```ts
const connection = await ctx.integration.connection.active("acme")
if (!connection) return
const inventory = await loadInventory(connection)
await ctx.provider.transform((editor) => {
  editor.add({ info: inventory.provider, models: inventory.models, sourceConnection: connection })
})
```

#### Reference

Schemas: [`Provider.Info`](/api#schema-Provider.Info), [`Model.Info`](/api#schema-Model.Info)

```ts
interface ProviderDomain extends ProviderApi {
  transform(callback: (editor: ProviderEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ProviderRecord {
  readonly provider: Provider.Info
  readonly models: ReadonlyMap<string, Model.Info>
  readonly sourceConnection?: ConnectionInfo
}

interface ProviderEditor {
  list(): readonly ProviderRecord[]
  get(providerID: string): ProviderRecord | undefined
  add(input: { info: Provider.Info; models: readonly Model.Info[]; sourceConnection?: ConnectionInfo }): void
  update(providerID: string, update: (provider: DeepMutable<Provider.Info>) => void): void
  remove(providerID: string): void
  readonly models: {
    set(providerID: string, models: readonly Model.Info[]): void
    update(providerID: string, modelID: string, update: (model: DeepMutable<Model.Info>) => void): void
    remove(providerID: string, modelID: string): void
  }
}
```

### Models

Read available models and the default selection.

```ts
const models = await ctx.model.list()
const selected = await ctx.model.default()
```

Model transforms edit the entire active-provider candidate collection. Disabled candidates remain editable until all
transforms finish; `update` can add a model only under an available provider.

```ts
await ctx.model.transform((editor) => {
  editor.list("anthropic").forEach((model) => {
    editor.update(model.providerID, model.id, (draft) => {
      draft.enabled = draft.capabilities.tools
    })
  })
  editor.default.set("anthropic", "claude-sonnet-5-5")
  editor.remove("anthropic", "legacy-model")
})
```

Callbacks edit raw model overrides. Provider defaults are merged once when OpenCode commits the result; unchanged reads
reuse that result. `editor.provider` exposes immutable source definitions, including inactive templates, rather than
model-transform output.

```ts
await ctx.model.transform((editor) => {
  const source = editor.provider.get("anthropic")?.models.get("claude-sonnet-5-5")
  if (!source) return
  editor.update("anthropic", source.id, (model) => {
    model.limit.context = Math.min(model.limit.context, source.limit.context)
  })
})

await ctx.model.reload()
```

#### Reference

Schema: [`Model.Info`](/api#schema-Model.Info)

```ts
interface ModelDomain extends ModelApi {
  transform(callback: (editor: ModelEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ModelEditor {
  list(providerID?: string): readonly DeepMutable<Model.Info>[]
  get(providerID: string, modelID: string): DeepMutable<Model.Info> | undefined
  update(providerID: string, modelID: string, update: (model: DeepMutable<Model.Info>) => void): void
  remove(providerID: string, modelID: string): void
  readonly default: {
    get(): { providerID: string; modelID: string } | undefined
    set(providerID: string, modelID: string): void
  }
  readonly provider: {
    list(): readonly ProviderRecord[]
    get(providerID: string): ProviderRecord | undefined
  }
}
```

### Commands

Read the commands available at a location.

```ts
const commands = await ctx.command.list()
```

Register commands with a transform. The executor receives the session, prompt attachments, and requested delivery mode.

```ts
await ctx.command.transform((editor) => {
  editor.add({
    name: "security-review",
    description: "Review changes for security issues",
    execute: async ({ sessionID, prompt, delivery }) => {
      await ctx.session.prompt({
        ...prompt,
        sessionID,
        text: `Review these changes for security issues.\n\n${prompt.text}`,
        delivery,
      })
    },
  })
})
```

Reload commands after external state used by a transform changes.

```ts
await ctx.command.reload()
```

#### Reference

Schemas: [`Command.Info`](/api#schema-Command.Info),
[`Session.Inbox.Delivery`](/api#schema-Session.Inbox.Delivery)

```ts
interface CommandContext {
  list(input?: CommandListInput, requestOptions?: RequestOptions): Promise<CommandListOutput>
  transform(callback: (editor: CommandEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface CommandEditor {
  add(definition: CommandDefinition): void
}

interface CommandDefinition {
  name: string
  description?: string
  execute(input: CommandInvocation): Promise<void>
}

interface CommandInvocation {
  sessionID: string
  prompt: PromptInput
  delivery: "steer" | "queue"
}
```

### Integrations

Read integrations and inspect active credentials.

```ts
const integrations = await ctx.integration.list()
const github = await ctx.integration.get({ integrationID: "github" })
const connection = await ctx.integration.connection.active("github")
const credential = connection ? await ctx.integration.connection.resolve(connection) : undefined
```

Connect integrations with an API key.

```ts
await ctx.integration.connect.key({
  integrationID: "github",
  key: process.env.GITHUB_TOKEN!,
})
```

Start, inspect, complete, or cancel an OAuth connection attempt.

```ts
const attempt = await ctx.integration.oauth.connect({ integrationID: "github", methodID: "oauth" })
const status = await ctx.integration.oauth.status({ integrationID: "github", attemptID: attempt.data.attemptID })
await ctx.integration.oauth.complete({ integrationID: "github", attemptID: attempt.data.attemptID, code })
await ctx.integration.oauth.cancel({ integrationID: "github", attemptID: attempt.data.attemptID })
```

Command-based connections expose the same start, status, and cancel flow.

```ts
const attempt = await ctx.integration.command.connect({ integrationID: "acme", methodID: "cli" })
const status = await ctx.integration.command.status({ integrationID: "acme", attemptID: attempt.data.attemptID })
await ctx.integration.command.cancel({ integrationID: "acme", attemptID: attempt.data.attemptID })
```

Register a transform to inspect integrations and manage their authentication methods.

```ts
await ctx.integration.transform((editor) => {
  const integrations = editor.list()
  const acme = editor.get("acme")

  editor.update("acme", (integration) => {
    integration.name = "Acme"
  })
  editor.method.update({
    integrationID: "acme",
    method: { id: "cli", type: "command", label: "Sign in with Acme CLI", command: ["acme", "login"] },
  })

  const methods = editor.method.list("acme")
  const legacy = methods.find((method) => method.type === "command" && method.id === "legacy")
  if (legacy) editor.method.remove("acme", legacy)
  editor.remove("legacy")
})
```

Reload integrations after external state used by a transform changes.

```ts
await ctx.integration.reload()
```

#### Reference

Schemas: [`Integration.Info`](/api#schema-Integration.Info), [`Integration.Method`](/api#schema-Integration.Method),
[`Connection.Info`](/api#schema-Connection.Info), [`Form.Answer`](/api#schema-Form.Answer)

```ts
interface IntegrationContext {
  list(input?: IntegrationListInput, requestOptions?: RequestOptions): Promise<IntegrationListOutput>
  get(input: IntegrationGetInput, requestOptions?: RequestOptions): Promise<IntegrationGetOutput>
  connect: {
    key(input: IntegrationConnectKeyInput, requestOptions?: RequestOptions): Promise<void>
  }
  oauth: {
    connect(
      input: IntegrationOauthConnectInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationOauthConnectOutput>
    status(input: IntegrationOauthStatusInput, requestOptions?: RequestOptions): Promise<IntegrationOauthStatusOutput>
    complete(input: IntegrationOauthCompleteInput, requestOptions?: RequestOptions): Promise<void>
    cancel(input: IntegrationOauthCancelInput, requestOptions?: RequestOptions): Promise<void>
  }
  command: {
    connect(
      input: IntegrationCommandConnectInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationCommandConnectOutput>
    status(
      input: IntegrationCommandStatusInput,
      requestOptions?: RequestOptions,
    ): Promise<IntegrationCommandStatusOutput>
    cancel(input: IntegrationCommandCancelInput, requestOptions?: RequestOptions): Promise<void>
  }
  transform(callback: (editor: IntegrationEditor) => void): Promise<Registration>
  reload(): Promise<void>
  connection: {
    active(integrationID: string): Promise<ConnectionInfo | undefined>
    resolve(connection: ConnectionInfo): Promise<CredentialValue | undefined>
  }
}

interface IntegrationEditor {
  list(): readonly IntegrationRef[]
  get(id: string): IntegrationRef | undefined
  update(id: string, update: (integration: IntegrationRef) => void): void
  remove(id: string): void
  method: {
    list(integrationID: string): readonly IntegrationMethod[]
    update(input: IntegrationMethodRegistration): void
    remove(integrationID: string, method: IntegrationMethod): void
  }
}
```

### Credentials

Make a saved credential the active one for its integration.

```ts
await ctx.credential.activate({ credentialID })
```

#### Reference

```ts
interface CredentialContext {
  activate(input: CredentialActivateInput, requestOptions?: RequestOptions): Promise<void>
}
```

### MCP

List MCP servers and their current connection state.

```ts
const servers = await ctx.mcp.list()
```

Plugins manage MCP servers only through transforms. Use `editor.set` to add or replace a server, `editor.update` to
change its configuration, and `editor.remove` to remove it. Inspect configuration with `editor.list` and `editor.get`.

```ts
await ctx.mcp.transform((editor) => {
  const servers = editor.list()
  const docs = editor.get("docs")
  editor.set("docs", { type: "remote", url: "https://mcp.example.com" })
  editor.update("docs", (server) => {
    server.disabled = false
  })
  editor.remove("legacy")
})
```

Set `disabled: true` in a transform to disable a server and disconnect it, or `disabled: false` to enable it and allow
OpenCode to connect. OpenCode reconciles server lifecycle from the transformed configuration.

Call `reload()` after external state used by a transform changes to reapply transforms and reconcile the servers.

```ts
await ctx.mcp.reload()
```

#### Reference

Schemas: [`Mcp.Server`](/api#schema-Mcp.Server), [`Mcp.LocalConfigEncoded`](/api#schema-Mcp.LocalConfigEncoded),
[`Mcp.RemoteConfigEncoded`](/api#schema-Mcp.RemoteConfigEncoded)

```ts
interface MCPContext {
  list(input?: McpListInput, requestOptions?: RequestOptions): Promise<McpListOutput>
  transform(callback: (editor: MCPEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface MCPEditor {
  list(): readonly (readonly [string, McpServerConfig])[]
  get(name: string): McpServerConfig | undefined
  set(name: string, config: McpServerConfig): void
  update(name: string, update: (config: McpServerConfig) => void): void
  remove(name: string): void
}
```

### Plugins

List the plugins currently active for a location.

```ts
const plugins = await ctx.plugin.list()
```

#### Reference

Schemas: [`Plugin.Info`](/api#schema-Plugin.Info), [`Plugin.Source`](/api#schema-Plugin.Source)

```ts
interface PluginContext {
  list(input?: PluginListInput, requestOptions?: RequestOptions): Promise<PluginListOutput>
}
```

### References

Read the references available at a location.

```ts
const references = await ctx.reference.list()
```

Register a transform to inspect, add, or remove local and Git references. `get(name)` returns the current configured source,
or `undefined` when the name is absent.

```ts
await ctx.reference.transform((editor) => {
  const references = editor.list()
  editor.add("handbook", { type: "local", path: "/workspace/docs/handbook" })
  editor.add("standards", { type: "git", repository: "https://github.com/acme/standards", branch: "main" })
  const handbook = editor.get("handbook")
  editor.remove("legacy")
})
```

Reload references after external state used by a transform changes.

```ts
await ctx.reference.reload()
```

#### Reference

Schemas: [`Reference.Info`](/api#schema-Reference.Info), [`Reference.LocalSource`](/api#schema-Reference.LocalSource),
[`Reference.GitSource`](/api#schema-Reference.GitSource)

```ts
interface ReferenceContext {
  list(input?: ReferenceListInput, requestOptions?: RequestOptions): Promise<ReferenceListOutput>
  transform(callback: (editor: ReferenceEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ReferenceEditor {
  list(): readonly (readonly [string, ReferenceLocalSource | ReferenceGitSource])[]
  get(name: string): ReferenceLocalSource | ReferenceGitSource | undefined
  add(name: string, source: ReferenceLocalSource | ReferenceGitSource): void
  remove(name: string): void
}
```

### Generate (experimental)

Generate with a selected model without creating a session, invoking tools, or adding to session history. These APIs
may change. `ctx.generate.text` still works but is deprecated in favor of `ctx.experimental.generate.text`.

```ts
const review = await ctx.experimental.generate.text({
  model: { providerID: "anthropic", id: "claude-sonnet-5-5" },
  prompt: "Review this proposed action.",
})

const { images } = await ctx.experimental.generate.image({
  model: { providerID: "openai", id: "gpt-image-1-mini" },
  prompt: "A watercolor fox in the snow",
  aspect: "16:9",
})

const { answers } = await ctx.experimental.generate.decisions({
  model: { providerID: "opencode", id: "jev-1.13" },
  input: [{ type: "text", text: "I was charged twice, please refund one." }],
  questions: [{ type: "predicate", name: "refund", instructions: "Is this a refund request?" }],
})
```

### Permissions

Ask for permission before performing an action. `assert` evaluates the session's [permission rules](/permissions),
including saved approvals, and prompts the user when a rule resolves to `ask`. It resolves once the action is allowed.

```ts
execute: async (input, context) => {
  await ctx.permission.assert({
    sessionID: context.sessionID,
    agent: context.agent,
    source: { type: "tool", messageID: context.messageID, id: context.id },
    action: "deploy",
    resources: [input.environment],
    save: [input.environment],
  })
  return { content: await deploy(input.environment) }
}
```

- `action` and `resources` are matched against the rules. Any `deny` blocks the action; otherwise any `ask` prompts.
- `save` lists the patterns stored when the user chooses to always allow.
- `agent` selects whose rules apply and defaults to the session's agent. `source` attaches the prompt to a tool call.
- `metadata` passes extra detail to permission prompts and `evaluate` hooks.

A deny rule or a rejection with feedback rejects with a `Tool.Error` that carries the reason, so the model sees it and
continues. A plain rejection ends the current step. Let these errors propagate rather than returning them as tool
output.

Inspect or resolve pending permission requests.

```ts
const pending = await ctx.permission.list({ sessionID })
const request = await ctx.permission.get({ sessionID, requestID })
await ctx.permission.reply({ sessionID, requestID, decision: "once" })
```

Replace the session-scoped permission rules. They are evaluated after the agent's rules, and the
last matching rule wins. Child sessions inherit the rules in effect when they are created.

```ts
await ctx.session.update({
  sessionID,
  permissions: [{ action: "edit", resource: "/path/to/original/checkout/**", effect: "deny" }],
})
```

### Sessions

Create or read a session.

```ts
const created = await ctx.session.create({ title: "Review" })
const session = await ctx.session.get({ sessionID })
const messages = await ctx.session.context({ sessionID })
```

List sessions a page at a time. To get the next page, pass `cursor.next` back as `cursor`. The cursor remembers your
filters, so you don't need to repeat them.

```ts
const page = await ctx.session.list({ directory: ctx.location.directory, limit: 20 })
const next = page.cursor.next ? await ctx.session.list({ cursor: page.cursor.next, limit: 20 }) : undefined
```

Change the agent or model used by subsequent requests.

```ts
await ctx.session.switchAgent({ sessionID, agent: "build" })
await ctx.session.switchModel({ sessionID, model: { providerID: "anthropic", id: "claude-sonnet-5-5" } })
```

Send user prompts, transient generation requests, commands, or synthetic messages.

```ts
const prompt = await ctx.session.prompt({ sessionID, text: "Review the current changes" })
const generated = await ctx.session.generate({ sessionID, prompt: "Summarize this project" })
await ctx.session.command({ sessionID, name: "review", text: "--staged" })
const synthetic = await ctx.session.synthetic({ sessionID, text: "Deployment completed" })
```

`generate` returns the `text` along with the call's `tokens` and `cost`, in the same shape an assistant message
reports them.

Rename, interrupt, or wait for a session.

```ts
await ctx.session.update({ sessionID, title: "Review" })
await ctx.session.interrupt({ sessionID, resume: false })
await ctx.session.wait({ sessionID })
```

Remove a temporary session with `remove`. Removal stops active execution and recursively deletes child sessions.

```ts
await ctx.session.remove({ sessionID })
```

Request compaction with `compact`. It returns the admitted inbox item, not a completed summary; compaction runs at
the next step boundary by default. Pass `delivery: "queue"` to preserve queue order instead.

```ts
const compaction = await ctx.session.compact({ sessionID })
```

Attach, list, or remove keyed session instruction entries with `instructions.entry`. Entries render as `<context key="...">` blocks in the session's instructions, and updates or removals are announced at the next step boundary without queuing a message turn.

```ts
await ctx.session.instructions.entry.put({ sessionID, key: "deploy-target", value: "production" })
const entries = await ctx.session.instructions.entry.list({ sessionID })
await ctx.session.instructions.entry.remove({ sessionID, key: "deploy-target" })
```

#### Reference

Schemas: [`Session.Info`](/api#schema-Session.Info), [`Model.Ref`](/api#schema-Model.Ref),
[`Session.Inbox.User`](/api#schema-Session.Inbox.User), [`Session.Inbox.Synthetic`](/api#schema-Session.Inbox.Synthetic),
[`InstructionEntry.Info`](/api#schema-InstructionEntry.Info)

```ts
interface SessionContext {
  create(input?: SessionCreateInput, requestOptions?: RequestOptions): Promise<SessionInfo>
  get(input: SessionGetInput, requestOptions?: RequestOptions): Promise<SessionInfo>
  remove(input: SessionRemoveInput, requestOptions?: RequestOptions): Promise<void>
  context(input: SessionContextInput, requestOptions?: RequestOptions): Promise<readonly SessionMessageInfo[]>
  instructions: {
    entry: {
      list(
        input: ExperimentalSessionInstructionsEntryListInput,
        requestOptions?: RequestOptions,
      ): Promise<readonly InstructionEntryInfo[]>
      put(input: ExperimentalSessionInstructionsEntryPutInput, requestOptions?: RequestOptions): Promise<void>
      remove(input: ExperimentalSessionInstructionsEntryRemoveInput, requestOptions?: RequestOptions): Promise<void>
    }
  }
  switchAgent(input: SessionSwitchAgentInput, requestOptions?: RequestOptions): Promise<void>
  switchModel(input: SessionSwitchModelInput, requestOptions?: RequestOptions): Promise<void>
  update(input: SessionUpdateInput, requestOptions?: RequestOptions): Promise<void>
  move(input: SessionMoveInput, requestOptions?: RequestOptions): Promise<void>
  prompt(input: SessionPromptInput, requestOptions?: RequestOptions): Promise<SessionInboxUser>
  generate(input: SessionGenerateInput, requestOptions?: RequestOptions): Promise<{ text: string }>
  command(input: SessionCommandInput, requestOptions?: RequestOptions): Promise<void>
  compact(input: SessionCompactInput, requestOptions?: RequestOptions): Promise<SessionInboxCompaction>
  synthetic(input: SessionSyntheticInput, requestOptions?: RequestOptions): Promise<SessionInboxSynthetic>
  interrupt(input: SessionInterruptInput, requestOptions?: RequestOptions): Promise<{ interrupted: boolean }>
  wait(input: ExperimentalSessionWaitInput, requestOptions?: RequestOptions): Promise<void>
}
```

### Skills

Read the skills available at a location.

```ts
const skills = await ctx.skill.list()
```

Register a transform to inspect, add, update, or remove skills. `get(id)` returns the current editor entry, or `undefined`
when the skill is absent.

```ts
import { Skill } from "@opencode/plugin"

await ctx.skill.transform((editor) => {
  const skills = editor.list()
  editor.add({
    id: Skill.ID.make("review"),
    name: Skill.Name.make("Review"),
    description: "Review the current changes",
    path: Skill.Info.fields.path.make("/workspace/.opencode/skills/review/SKILL.md"),
    content: "Review the current changes for correctness and missing tests.",
  })
  const review = editor.get("review")
  editor.update("review", (skill) => {
    skill.autoinvoke = true
  })
  editor.remove("legacy")
})
```

Reload skills after external state used by a transform changes.

```ts
await ctx.skill.reload()
```

#### Reference

Schema: [`Skill.Info`](/api#schema-Skill.Info)

```ts
interface SkillContext {
  list(input?: SkillListInput, requestOptions?: RequestOptions): Promise<SkillListOutput>
  transform(callback: (editor: SkillEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface SkillEditor {
  list(): readonly SkillInfo[]
  get(id: string): SkillInfo | undefined
  add(skill: SkillInfo): void
  update(id: string, update: (skill: SkillInfo) => void): void
  remove(id: string): void
}
```

### Storage

Store, read, or remove durable JSON values scoped to the plugin.

```ts
await ctx.storage.set("settings", { strict: true })
const settings = await ctx.storage.get("settings")
await ctx.storage.remove("settings")
```

Scan keys by prefix with optional cursor pagination.

```ts
const page = await ctx.storage.scan({ prefix: "cache/", limit: 100 })
const next = page.next
```

#### Reference

```ts
interface StorageContext {
  get(key: string): Promise<Json | undefined>
  set(key: string, value: Json): Promise<void>
  remove(key: string): Promise<void>
  scan(options: StorageScanOptions): Promise<StorageScanResult>
}

interface StorageScanOptions {
  prefix: string
  after?: string
  limit?: number
}

interface StorageScanResult {
  entries: readonly { key: string; value: Json }[]
  next?: string
}
```

### Tools

Read the tools currently registered, after every transform, outside of a transform callback. Each tool has an `id`
containing its effective name.

```ts
const tools = await ctx.tool.list()
const read = tools.find((tool) => tool.id === "read")
```

Register, update, and remove tools with a synchronous transform, including in Promise plugins. Load external data
before registering or reloading. A later valid registration overrides the same effective tool name.

```ts
const registration = await ctx.tool.transform((editor) => {
  editor.namespace({
    name: "acme",
    description: "Customer account tools",
  })
  editor.add({
    name: "greeting",
    description: "Create a greeting",
    input: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
      additionalProperties: false,
    },
    options: { namespace: "acme", codemode: true },
    execute: async (input, context) => {
      await context.progress({ status: "greeting" })
      return { content: `Hello ${(input as { name: string }).name}!` }
    },
  })
})
```

Promise tool executors receive `context.signal`. Pass it to cancellable work such as `fetch` so stopping the Session
also stops the underlying operation.

```ts
execute: async ({ url }, context) => {
  const response = await fetch(url, { signal: context.signal })
  return { content: await response.text() }
}
```

#### Freeform tool input

A direct tool with exactly one required string field can let the model write that string without a JSON wrapper. Set `freeform` to `{ type: "text" }`, `{ type: "regex", pattern }`, or `{ type: "lark", grammar }`.

```ts
editor.add({
  name: "ticket",
  description: "Look up a ticket by ID",
  options: { codemode: false },
  input: Schema.Struct({ id: Schema.String }),
  freeform: { type: "regex", pattern: "OPS-[0-9]+" },
  execute: async ({ id }) => ({ content: await lookup(id) }),
})
```

If the selected model's API lists `regex` in models.dev, the model can write `OPS-42` directly. Otherwise Core omits **only** `freeform`: the model still has the `ticket` tool and calls it with `{"id":"OPS-42"}`. Missing or empty format lists mean no freeform support. The executor receives `{ id }` either way.

Inside Code Mode (`codemode: true`), a freeform tool takes its string directly, as in `await tools.ticket("OPS-42")`. `await tools.ticket({ id: "OPS-42" })` also works.

Call `reload()` after changing source data captured by the callback. Reload replays the active transforms without
changing their order; it does not rerun plugin setup.

```ts
await ctx.tool.reload()
```

Use `list()` and `get()` to inspect tools currently in the editor. Tools have an `id` containing their effective name,
and `get()` returns `undefined` when that ID is not present. Use `update` and `remove` with the effective tool name,
including its namespace (`acme_greeting` above). Dots in
namespaces and unsupported characters in tool names become `_`. Missing names are ignored; creating a tool requires
`add` with a complete definition. Updates preserve the name and namespace. Assign new schemas or options to replace
them rather than mutating nested values. Invalid updates are logged and leave the previous definition intact.

```ts
await ctx.tool.transform((editor) => {
  editor.update("acme_greeting", (tool) => {
    tool.description = "Greet the user by name"
  })
  editor.remove("acme_obsolete")
})
```

Updates and removals replay in order with additions, including after MCP catalog refreshes. Disposing their
registration removes those changes and rebuilds from the remaining transforms.

Dispose a registration to remove its transform and rebuild from the remaining transforms, revealing any earlier
definition it overrode. Disposal is idempotent, and unloading the plugin also disposes its registrations.

```ts
await registration.dispose()
```

Each model request captures a stable, executable tool snapshot. Later transforms, reloads, and disposal affect future
snapshots, not the definitions, Code Mode namespace descriptions, or executors already captured. Executors that close
over mutable plugin data still observe that data; capture a value inside the transform when it must remain tied to
that definition.

#### Reference

Schemas: [`Tool.Content`](/api#schema-Tool.Content), [`Tool.TextContent`](/api#schema-Tool.TextContent),
[`Tool.FileContent`](/api#schema-Tool.FileContent)

```ts
interface ToolContext {
  list(): Promise<readonly (ToolInfo & { readonly id: string })[]>
  transform(callback: (editor: ToolEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface ToolEditor {
  list(): readonly (ToolInfo & { readonly id: string })[]
  get(id: string): (ToolInfo & { readonly id: string }) | undefined
  namespace(namespace: { name: string; description: string }): void
  add(tool: ToolInfo): void
  update(id: string, update: (tool: Types.Mutable<ToolInfo>) => void): void
  remove(id: string): void
}
```

### VCS

Read repository information, working-copy status, or file diffs.

```ts
const info = await ctx.vcs.get()
const branches = await ctx.vcs.branch.list({ search: "feature", limit: 10 })
const changes = await ctx.vcs.status()
const diff = await ctx.vcs.diff({ mode: "working", context: 3 })
```

Register a location-scoped VCS provider with a transform. A provider matching the detected repository type is selected
automatically; use `editor.default.set` to select a different provider.

```ts
await ctx.vcs.transform((editor) => {
  editor.add({
    id: "custom",
    name: "Custom VCS",
    info: async () => ({ branch: { current: "feature", default: "main" } }),
    branches: async (input, { signal }) => readBranches(input, signal),
    status: async (scope, { signal }) => readStatus(scope.worktree, signal),
    diff: async (input, { signal }) => readDiff(input, signal),
  })
  editor.default.set("custom")
})
```

Provider callbacks receive the current location, working-copy root, canonical project root, and optional repository
store. Diff callbacks also receive the selected mode, requested context, and output byte budget. Repository discovery
continues to use OpenCode's built-in Git and Mercurial detectors.

Providers can optionally implement `init(scope, { signal })` to create a repository in `scope.worktree`. Initialization
selects the provider by ID (Git by default), not by the detected repository type. Register a provider with `init` even
when the location has no repository yet; OpenCode checks that the directory exists and has no repository before calling
it, then rediscovers the project. New repository formats still need discovery support beyond this callback.

#### Reference

Schemas: [`Vcs.Info`](/api#schema-Vcs.Info), [`Vcs.FileStatus`](/api#schema-Vcs.FileStatus),
[`FileDiff.Info`](/api#schema-FileDiff.Info)

```ts
interface VcsContext {
  get(input?: VcsGetInput, requestOptions?: RequestOptions): Promise<VcsGetOutput>
  branch: {
    list(input?: VcsBranchListInput, requestOptions?: RequestOptions): Promise<VcsBranchListOutput>
  }
  status(input?: VcsStatusInput, requestOptions?: RequestOptions): Promise<VcsStatusOutput>
  diff(input: VcsDiffInput, requestOptions?: RequestOptions): Promise<VcsDiffOutput>
  transform(callback: (editor: VcsEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface VcsEditor {
  add(definition: VcsDefinition): void
  default: {
    get(): string | undefined
    set(providerID: string): void
  }
}

interface VcsDefinition {
  init?(scope: VcsScope, context: { signal: AbortSignal }): Promise<void>
  // Existing info, branches, status, and diff callbacks are required.
}
```

### Worktrees

Register a local worktree strategy using the normal plugin lifecycle. The implementation module in this example owns
option validation and the backend's `create`, `remove`, and `list` operations.

```ts title="plugins/worktrees/index.ts"
import { Plugin } from "@opencode/plugin"
import { makeStrategy } from "./strategy"

export default Plugin.define({
  id: "company.worktrees",
  async setup(ctx) {
    const strategy = makeStrategy(ctx.options)
    await ctx.worktree.transform((editor) => {
      editor.add(strategy)
    })
  },
})
```

Load the plugin through `plugins` and configure the common destination separately:

```jsonc title="opencode.jsonc"
{
  "worktree": { "directory": "../worktrees" },
  "plugins": [{ "package": "./plugins/worktrees", "options": {} }],
}
```

- Adding a strategy selects it automatically. The last active registration wins; no strategy-selection config is needed.
- Disposing its registration or unloading the plugin restores the previous implementation, ultimately the bundled Git strategy.
- `reload()` replays transforms after captured inputs change; it does not rerun plugin setup.
- Creation failures do not retry through Git. Existing worktrees retain their recorded owner even when the default changes.
- Strategies manage local directories. Remote workspace provisioning is not part of this interface.

#### Operations

The plugin context exposes the same project-based worktree operations as the client. Every operation requires a
`projectID`. `list` reads only saved inventory, including known checkouts of the same project; it does not load
configuration, start plugins, or discover filesystem changes.

```ts
const projectID = ctx.location.project.id
const created = await ctx.worktree.create({ projectID, name: "task" })
const inventory = await ctx.worktree.list({ projectID })
await ctx.worktree.refresh({ projectID })
await ctx.worktree.remove({ projectID, directory: created.directory, force: false })
```

Create loads configuration and plugins from the project's saved `canonical` directory and uses their selected strategy.
It accepts an optional parent `directory`, source `from`, starting `branch`, and `name`.
The source defaults to the canonical checkout, and a `from` override must belong to that project. Choosing a source
does not change the configuration root.
A supplied starting ref must be supported by the selected strategy;
Rift's native snapshot operation, for example, has no ref-selection option.

Create and refresh wait for the canonical checkout's plugins to activate. Calls made during that checkout's plugin
setup see registrations made so far and do not wait for their own activation.

Remove loads the canonical configuration and activates its plugins, then uses the worktree's recorded strategy rather
than the currently selected default. An unavailable recorded owner produces an error. The worktree's destination can
be elsewhere:

```ts
await ctx.worktree.remove({
  directory: "/worktrees/task",
  projectID,
  force: false,
})
```

Missing owners fail removal rather than falling back to Git. A strategy can throw `new Worktree.OperationError({
message: "Uncommitted changes", forceRequired: true })`, importing `Worktree` from `@opencode/plugin`, to request
force confirmation without depending on Core or Git errors.

Refresh loads canonical configuration and asks all available strategies to find worktrees across known checkout roots.
It combines results, preserves recorded ownership, and prunes missing directories. A failed discovery source is logged
while other sources continue. Existing directories remain saved even if no available strategy reports them. Observe
`worktree.updated` and call `list` again to read changed inventory.

```ts
await ctx.worktree.refresh({ projectID })
```

#### Reference

Implementations receive a suggested destination after naming and collision handling. Return the actual directory from
`create`; it may differ when a backend requires its own layout. OpenCode resolves the returned path and uses it for
inventory, startup commands, and the API result. The returned directory must exist.

Strategies choosing another destination handle naming collisions there. OpenCode still creates the suggested parent
directory before calling the strategy. `list` must report only directories the strategy owns, plus any repository roots.

```ts
interface WorktreeDefinition {
  readonly id: string
  create(
    input: { sourceDirectory: string; directory: string; branch?: string },
    context: { signal: AbortSignal },
  ): Promise<{ directory: string }>
  remove(input: { directory: string; force: boolean }, context: { signal: AbortSignal }): Promise<void>
  list(
    sourceDirectory: string,
    context: { signal: AbortSignal },
  ): Promise<readonly { directory: string; type: "root" | "worktree" }[]>
}

interface WorktreeEditor {
  add(definition: WorktreeDefinition): void
}

interface WorktreeDomain extends WorktreeApi {
  transform(callback: (editor: WorktreeEditor) => void): Promise<Registration>
  reload(): Promise<void>
}
```

Promise callbacks must cooperate with `signal` cancellation. Effect callbacks return Effects and use Effect interruption
instead. Registrations remain scoped to the plugin runtime; project operations use the canonical checkout's registry.
Core configuration adapters feed directory settings into that registry.

### Websearch

List websearch providers or run a query through the selected provider.

```ts
const providers = await ctx.websearch.providers()
const results = await ctx.websearch.query({ query: "OpenCode plugins", providerID: "internal" })
```

Register a provider and select the default provider with a transform.

```ts
await ctx.websearch.transform((editor) => {
  editor.add({
    id: "internal",
    name: "Internal search",
    execute: async ({ query }, { signal }) => {
      const response = await fetch(`https://search.example.com?q=${encodeURIComponent(query)}`, { signal })
      const result = (await response.json()) as { url: string; title: string; content: string }
      return [{ url: result.url, title: result.title, content: result.content, time: {} }]
    },
  })
  editor.default.set("internal")
})
```

Disable websearch by selecting `false`, or reload providers after external state changes.

```ts
await ctx.websearch.transform((editor) => editor.default.set(false))
await ctx.websearch.reload()
```

#### Reference

Schemas: [`WebSearch.Provider`](/api#schema-WebSearch.Provider), [`WebSearch.Result`](/api#schema-WebSearch.Result)

```ts
interface WebSearchContext {
  providers(input?: WebsearchProvidersInput, requestOptions?: RequestOptions): Promise<WebsearchProvidersOutput>
  query(input: WebsearchQueryInput, requestOptions?: RequestOptions): Promise<WebsearchQueryOutput>
  transform(callback: (editor: WebSearchEditor) => void): Promise<Registration>
  reload(): Promise<void>
}

interface WebSearchEditor {
  add(provider: WebSearchDefinition): void
  default: {
    get(): string | false | undefined
    set(providerID: string | false): void
  }
}
```

### Events

Subscribe to the connected server's public event stream. Abort the stream during plugin cleanup. Pass `types`, for example `ctx.event.subscribe({ types: ["config.updated"] })`, to receive only those event types; the events are typed to match. Plugins run inside the server, so unlike SDK clients they never receive `server.connected`. Unknown type names are ignored with a warning in the server log.

```ts
const controller = new AbortController()
void (async () => {
  for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
    console.log(event.type)
  }
})()
return () => controller.abort()
```

#### Reference

Schema: [`V2EventEncoded`](/api#schema-V2EventEncoded)

```ts
type EventType = Exclude<OpenCodeEvent["type"], "server.connected">

interface EventContext {
  subscribe<Type extends EventType = EventType>(options?: {
    types?: Type[]
    signal?: AbortSignal
  }): AsyncIterable<Extract<OpenCodeEvent, { type: Type }>>
}
```

## Hooks

Hooks intercept live operations. Register a hook on its domain and dispose the
returned registration when it is no longer needed.

```ts
const registration = await ctx.session.hook("context", () => {})
await registration.dispose()
```

Multiple plugins can register the same hook. OpenCode runs them in plugin order,
so later hooks see changes made by earlier hooks.

### Sessions

Session hooks intercept prompt admission, model calls, native HTTP, and retries.

#### Forks

The `fork` hook runs after OpenCode copies the history and before the fork call returns. `sessionID` identifies the new session.

```ts
await ctx.session.hook("fork", ({ sessionID }) => console.log(sessionID))
```

#### Prompt admission

Intercept incoming user prompts before attachment and skill resolution and durable inbox admission:

```ts
await ctx.session.hook("prompt", (event) => {
  event.prompt.text = event.prompt.text.replaceAll("company-secret", "[redacted]")
  event.prompt.files ??= []
  event.prompt.files.push({ uri: "file:///project/policy.md" })
  event.metadata = { ...event.metadata, source: "company-policy" }
  event.delivery = "queue"
})
```

The hook receives an owned, mutable draft:

- `prompt` contains `text`, `files`, agent mentions in `agents`, and selected `skills`.
- `metadata` contains application-defined admission metadata.
- `delivery` is `"steer"` by default and can be changed to `"queue"`.
- Session and message IDs are readonly; a hook cannot redirect admission.

Files and skills added by a hook follow the normal resolution and validation
path. When rewriting text, update or remove attachment `mention` offsets that no
longer match. Agent mentions do not switch the session's active agent.

Prompt hooks run under these conditions:

- Hooks run in registration order after the session's location plugins are ready.
- Commands that submit through `session.prompt` run the hook.
- Synthetic messages, shell messages, compaction controls, and move controls do not.
- The hook runs once during admission, not before every model call.
- Provider scoping is unavailable because model resolution happens after admission.

Edits become the canonical persisted user input. If preparation fails or is
interrupted, OpenCode does not admit the prompt.

Keep prompt hooks retry-safe. They are not an exactly-once side-effect boundary:

- Retrying an ID already pending or delivered returns the original admission without rerunning hooks.
- Concurrent submissions can run hooks more than once, but only the first successful admission wins.
- Prompt hooks transform input and do not expose a typed rejection API.

#### Model requests

Modify assembled system instructions, messages, tools, or request options immediately before model dispatch. Each
kind of request a session issues has its own hook, so a plugin can treat the agent loop and auxiliary requests
differently:

- `context` runs for the agent loop, including tool-driven continuations.
- `compaction` runs for checkpoint summaries. `messages` is the transcript being summarized; OpenCode appends its
  summary prompt after hooks run. Set `result` to record the compaction yourself and skip the model call; it takes the
  same fields as a completed compaction message.
- `generate` runs for transient `ctx.session.generate` calls.
- `title` runs for title generation. It has no `agent` or `tools`. Set `result` to supply the title yourself.

```ts
await ctx.session.hook("context", (event) => {
  event.system.push({ type: "text", text: "Keep the review focused on correctness." })
  delete event.tools.write
  event.options.temperature = 0.2
  event.options.maxTokens = 8_000
})

await ctx.session.hook("compaction", async (event) => {
  event.result = { summary: await summarize(event.messages) }
})
```

Changes affect only the outgoing model call, not persisted history or configuration. A hook that should apply to
every request must register for each kind.

Messages in the `context`, `compaction`, and `generate` hooks carry their stored message's `metadata`, read-only
(for example, what a `prompt` hook set). It is not sent to the model.

The `system` part that holds OpenCode's instructions also lists each source in `metadata.experimental.instructions` as
`{ key, text }`, such as `core/date` or `core/environment`, so a hook can tell the sources apart. The list is a copy:
editing the part's `text` does not update it. This is experimental and may change.

Request overrides follow these rules:

- `options` starts empty for each model call; it does not contain resolved model settings.
- Typed keys are generation settings; any other key is passed to the selected protocol as a provider option.
- Hooks run in registration order and see overrides made by earlier hooks.
- Request overrides take precedence over model defaults, which take precedence over route defaults.
- Provider option objects merge recursively; arrays and scalar values replace earlier values.
- Deleting an override or setting it to `undefined` falls back to configured defaults rather than removing them.
- Raw HTTP body overlays apply after protocol lowering and can override the resulting fields.

#### Provider options

Provider options use the selected protocol's semantic option names, not raw HTTP body fields. Scope provider-specific
settings to the matching provider. For example, OpenAI Responses uses `reasoningEffort`:

```ts
await ctx.session.hook(
  "context",
  (event) => {
    event.options.reasoningEffort = "high"
  },
  { providerID: "openai" },
)
```

Generation options depend on the selected protocol and model:

- `maxTokens` is the semantic output-token limit.
- Gemini supports `topK`; OpenAI Responses does not expose it.

#### Model resolve

Experimental. Runs whenever a Session resolves the model for a request, before anything is built for it. `model` starts
as the selected model; change it to serve this request with another model from the same provider, including one hidden
from the model picker. The Session keeps its selected model; the request and the assistant message use the new one.
`kind` says which request is resolving, so a router can skip titles or route again after compaction. A model from
another provider fails as unavailable.

```ts
await ctx.session.hook(
  "experimental.model.resolve",
  (event) => {
    if (event.model.id === "auto" && event.kind !== "title")
      event.model = { providerID: event.model.providerID, id: pick(event.sessionID) }
  },
  { providerID: "acme" },
)
```

#### Model request

Modify model request settings and optionally scope the hook to one provider. The event carries the same `kind`
as the HTTP hooks below.

```ts
await ctx.session.hook(
  "model.request",
  (event) => {
    event.headers["x-plugin"] = "review"
  },
  { providerID: "anthropic" },
)
```

#### Native HTTP

Modify native provider requests or responses. Their bodies are one-shot streams; clone or replace a body before reading
it.

Both hooks run for every request a session issues. `event.kind` says which flow issued it: `"primary"` for the agent
loop, `"compaction"` for checkpoint summaries, `"title"` for title generation, and `"generate"` for transient
`ctx.session.generate` calls. Use it instead of the agent ID to tell auxiliary requests apart.

```ts
await ctx.session.hook("http.request", (event) => {
  event.request.headers.set("x-session-id", event.sessionID)
  if (event.kind === "title") event.request.headers.set("x-priority", "background")
})

await ctx.session.hook("http.response", (event) => {
  event.response = new Response(event.response.body, {
    status: event.response.status,
    headers: { ...Object.fromEntries(event.response.headers), "x-plugin": "review" },
  })
})
```

#### Native WebSocket (experimental)

Providers that stream over a WebSocket open one connection per session and reuse it across requests, so
`http.request` and `http.response` never see that traffic. The `experimental.ws.handshake` hook runs once per model
call before the connection is selected. It carries the same `sessionID`, `agent`, `model`, and `kind` as the HTTP
hooks, plus the connection `url` and `headers`. Changing `url` or `headers` changes which socket the request uses, so a
rotated bearer token reopens the connection.

HTTP hooks still run for every HTTP request, including the request a WebSocket route falls back to.

```ts
await ctx.session.hook(
  "experimental.ws.handshake",
  async (event) => {
    event.headers.authorization = `Bearer ${await mintToken(event.url)}`
    delete event.headers["api-key"]
  },
  { providerID: "azure" },
)
```

`experimental.ws.send` and `experimental.ws.receive` expose the frames themselves, the WebSocket counterpart of
editing an HTTP request or response body. `send` runs after the provider driver builds an outbound frame and before it
is written; `receive` runs on each inbound frame before the driver observes it. Both carry the frame as a string and
send whatever `frame` holds when the hook returns.

OpenCode does not validate rewritten frames. The driver tracks state from the provider's replies, so a rewrite that
changes protocol meaning is the plugin's responsibility, just as a rewritten HTTP body is.

```ts
await ctx.session.hook(
  "experimental.ws.send",
  (event) => {
    const body = JSON.parse(event.frame)
    if (body.type === "response.create") body.metadata = { ...body.metadata, session: event.sessionID }
    event.frame = JSON.stringify(body)
  },
  { providerID: "openai" },
)

await ctx.session.hook("experimental.ws.receive", (event) => {
  if (event.frame.includes('"type":"error"')) console.error(event.frame)
})
```

These hooks are experimental and their names or shapes may change.

#### Retry policy

Override the retry decision for a provider failure or replace its delay in milliseconds. The hook runs after OpenCode
classifies the failure and proposes its policy, but before any retry is scheduled. It does not expose how OpenCode
internally performs the next attempt.

```ts
await ctx.session.hook("retry", (event) => {
  if (event.error.status === 429) {
    event.decision = { retry: true, delay: 10_000 }
    return
  }
  if (event.error.type === "provider.invalid-request" && event.attempt === 2) {
    event.decision = { retry: true, delay: 0 }
    return
  }
  if (event.attempt >= 3) event.decision = { retry: false }
})
```

Retry hooks can change OpenCode's initial `decision` by making a terminal failure
retryable or vetoing a proposed retry.

Retry decisions follow these rules:

- Multiple hooks run in registration order, and later hooks see the current decision.
- The built-in maximum attempt count remains a hard limit.
- `attempt` is the physical attempt under consideration. The initial request is `1`, so the first retry is `2`.
- Invalid delays such as `NaN`, infinity, or negative values fall back to the computed delay.
- Context-overflow recovery is separate because it compacts the conversation instead of retrying the same request.

#### Session reference

```ts
import type { SessionPrompt } from "@opencode/plugin/promise/session"

interface SessionHooks {
  prompt: SessionPrompt
  context: SessionContextHook
  compaction: SessionContextHook & { result?: SessionCompactionResult }
  generate: SessionContextHook
  title: SessionRequestHook & { result?: string }
  "experimental.model.resolve": SessionModelResolveHook
  "model.request": SessionModelRequestHook
  "http.request": SessionHttpRequestHook
  "http.response": SessionHttpResponseHook
  "experimental.ws.handshake": SessionWebSocketHandshakeHook
  "experimental.ws.send": SessionWebSocketSendHook
  "experimental.ws.receive": SessionWebSocketReceiveHook
  retry: SessionRetryHook
}

interface SessionModelResolveHook {
  readonly sessionID: string
  readonly agent: string
  readonly kind: "primary" | "compaction" | "title" | "generate"
  model: { providerID: string; id: string; variant?: string }
}

interface SessionWebSocketHandshakeHook {
  readonly sessionID: string
  readonly agent: string
  readonly model: { providerID: string; id: string; variant?: string }
  readonly kind: "primary" | "compaction" | "title" | "generate"
  url: string
  headers: Record<string, string>
}

interface SessionWebSocketSendHook {
  readonly sessionID: string
  readonly agent: string
  readonly model: { providerID: string; id: string; variant?: string }
  readonly kind: "primary" | "compaction" | "title" | "generate"
  frame: string
}

interface SessionWebSocketReceiveHook {
  readonly sessionID: string
  readonly agent: string
  readonly model: { providerID: string; id: string; variant?: string }
  readonly kind: "primary" | "compaction" | "title" | "generate"
  frame: string
}

type RetryDecision = { retry: false } | { retry: true; delay: number }

interface SessionRetryHook {
  readonly sessionID: string
  readonly agent: string
  readonly model: { providerID: string; id: string; variant?: string }
  readonly error: { type: string; message: string; status?: number }
  readonly attempt: number
  decision: RetryDecision
}

interface SessionRequestHook {
  readonly sessionID: string
  readonly model: { providerID: string; id: string; variant?: string }
  system: SystemPart[]
  messages: Message[]
  options: {
    maxTokens?: number
    temperature?: number
    topP?: number
    topK?: number
    frequencyPenalty?: number
    presencePenalty?: number
    seed?: number
    stop?: string[]
  } & Record<string, unknown>
}

interface SessionContextHook extends SessionRequestHook {
  readonly agent: string
  tools: Record<string, { description: string; input: JsonSchema }>
}

interface SessionCompactionResult {
  summary: string
  native?: Record<string, unknown>
  metadata?: Record<string, unknown>
  tokens?: TokenUsage
}

interface SessionHookContext {
  hook<Name extends keyof SessionHooks>(
    name: Name,
    callback: (event: SessionHooks[Name]) => Promise<void> | void,
    options?: Name extends "prompt" ? never : { providerID?: string },
  ): Promise<Registration>
}
```

### Permissions

Review permission decisions after configured rules are evaluated and before an
action runs or a permission prompt is published.

```ts
await ctx.permission.hook("evaluate", async (event) => {
  if (event.action === "read") return

  const messages = await ctx.session.context({ sessionID: event.sessionID })
  const review = await ctx.generate.text({
    model: { providerID: "anthropic", id: "claude-sonnet-5-5" },
    prompt: buildSafetyPrompt({ messages, action: event.action, resources: event.resources }),
  })
  const decision = parseDecision(review.text)

  event.effect = decision.effect
  event.message = decision.reason
})
```

Permission hooks follow these rules:

- Hooks run for `allow` and `ask` decisions.
- An explicit configured `deny` is final and does not invoke the hook.
- A hook may change `effect` to `allow`, `ask`, or `deny`.
- `message` appears in an escalated permission request or becomes the denial reason.

#### Reference

```ts
interface PermissionEvaluation {
  readonly sessionID: string
  readonly agent?: string
  readonly action: string
  readonly resources: readonly string[]
  readonly metadata?: Record<string, unknown>
  readonly source?: { type: "tool"; messageID: string; id: string }
  effect: "allow" | "ask" | "deny"
  message?: string
}
```

### Shell

Modify shell commands, working directories, timeouts, executables, or environment variables before execution.

```ts
await ctx.shell.hook("create.before", (event) => {
  event.timeout = Math.min(event.timeout, 60_000)
  event.env.COMPANY_ENV = "development"
})
```

#### Reference

```ts
interface ShellHookContext {
  hook(name: "create.before", callback: (event: ShellCreateBefore) => Promise<void> | void): Promise<Registration>
}

interface ShellCreateBefore {
  command: string
  cwd: string
  timeout: number
  shell: string
  env: Record<string, string | undefined>
}
```

### Tools

Inspect or replace tool input before execution.

```ts
await ctx.tool.hook("execute.before", (event) => {
  if (event.tool === "read") console.log(event.input)
})
```

Inspect successful results or failures after execution.

```ts
await ctx.tool.hook("execute.after", (event) => {
  if (event.status === "completed") event.result = { ...event.result, metadata: { observed: true } }
  if (event.status === "error") console.error(event.error.message)
})
```

#### Reference

```ts
interface ToolHooks {
  "execute.before": ToolExecuteBefore
  "execute.after": ToolExecuteCompleted | ToolExecuteFailed
}

interface ToolHookContext {
  hook<Name extends keyof ToolHooks>(
    name: Name,
    callback: (event: ToolHooks[Name]) => Promise<void> | void,
  ): Promise<Registration>
}
```

## Support V1

A plugin can support V1 and V2 from the same package entrypoint. Default export
one object with a V1 `server()` function and a V2 `setup()` function:

```ts title="src/index.ts"
import { Plugin } from "@opencode/plugin"

export default {
  ...Plugin.define({
    id: "example",
    async setup(ctx) {
      await ctx.tool.hook("execute.before", () => {
        console.log("A tool is about to run")
      })
    },
  }),
  async server() {
    return {
      "tool.execute.before": async () => {
        console.log("A tool is about to run")
      },
    }
  },
}
```

- V1 calls `server()` and uses the returned hooks.
- V2 reads the default export's `id` and `setup()` (or `effect()` for Effect plugins), ignoring `server()`.
- Keep each implementation on its own API; sharing an export does not translate V1 hooks into V2 hooks.
- Spread `Plugin.define(...)` into the exported object so it type-checks the V2 definition separately from `server()`.

The V1 object form is supported in OpenCode `1.18.29`. Older V1 releases may
expect function exports instead; test the installed package with the oldest V1
release you intend to support and with V2.

==> ./sdk/cloudflare.mdx <==
---
title: "Cloudflare"
description: "Run OpenCode inside a Cloudflare Durable Object with @opencode/sdk/workerd, backed by the object's SQLite storage."
---

Use `@opencode/sdk/workerd` inside a Cloudflare Durable Object. This profile uses the object's SQLite storage,
persists durable events for eviction recovery, and replaces unavailable local filesystem and process services.

```sh
bun add @opencode/sdk
```

Hold one host for the lifetime of the Durable Object instance instead of creating one for every request.

```ts
import { OpenCodeWorkerd } from "@opencode/sdk/workerd"
import myPlugin from "./my-plugin"

export class OpenCodeDO {
  private readonly opencode: Promise<OpenCodeWorkerd.Interface>

  constructor(state: DurableObjectState) {
    this.opencode = state.blockConcurrencyWhile(() =>
      OpenCodeWorkerd.create({
        storage: state.storage,
        config: { default_agent: "build" },
        plugins: [myPlugin],
      }),
    )
  }

  async fetch() {
    const opencode = await this.opencode
    return Response.json(await opencode.server.info())
  }
}
```

`blockConcurrencyWhile` keeps every Durable Object event out until the host is ready and resets the object if
initialization fails. The retained Promise gives request handlers direct access to the same host after startup.

```ts
constructor(state: DurableObjectState) {
  this.opencode = state.blockConcurrencyWhile(() =>
    OpenCodeWorkerd.create({ storage: state.storage }),
  )
}
```

Wrangler selects OpenCode's Workerd-safe implementations through the `workerd` package condition. Cloudflare may evict
a Durable Object without running cleanup, so correctness does not depend on `close()` being called.

```jsonc title="wrangler.jsonc"
{
  "compatibility_flags": ["nodejs_compat"]
}
```

## Route outbound requests

Pass `fetch` to route OpenCode's outbound HTTP requests (OpenCode Console config, model requests, web fetch and
search, well-known config, and remote MCP servers) through a custom handler such as a Service Binding. Agent code in
Code Mode continues to use `globalThis.fetch`.

```ts
OpenCodeWorkerd.create({
  storage: state.storage,
  fetch: (input, init) => {
    const request = new Request(input, init)
    return new URL(request.url).hostname === "console.example.com" ? env.CONSOLE.fetch(request) : fetch(request)
  },
})
```

## Customize

Customize your OpenCode instance by registering plugins bundled with your
Worker. Pass plugins to `OpenCodeWorkerd.create()` to customize agents, models,
tools, and other behavior:

```ts
import { Plugin } from "@opencode/plugin"
import { OpenCodeWorkerd } from "@opencode/sdk/workerd"

const plugin = Plugin.define({
  id: "customize-agent",
  async setup(ctx) {
    await ctx.agent.transform((agents) => {
      agents.update("build", (agent) => {
        agent.description = "Builds features and fixes bugs for our team"
      })
    })
  },
})

await OpenCodeWorkerd.create({
  storage: state.storage,
  config: { default_agent: "build" },
  plugins: [plugin],
})
```

See the [full plugins documentation](/build/plugins/server) for plugin hooks,
transforms, tools, and the complete plugin context.

==> ./sdk/effect.mdx <==
---
title: "Effect SDK"
description: "Host OpenCode in an Effect program with @opencode/sdk/effect, the Effect-native embedded SDK."
---

`@opencode/sdk/effect` is the Effect-native embedded SDK. Operations return typed Effects and Streams, and closing
the owning Scope releases the router, Location services, fibers, and plugin registrations.

```sh
bun add @opencode/sdk effect@4.0.1
```

## Create a host

Create the host inside `Effect.scoped`, then use its generated API groups or the `sessions` alias.

```ts
import { AbsolutePath, Location, OpenCode } from "@opencode/sdk/effect"
import { Effect } from "effect"

const program = Effect.scoped(
  Effect.gen(function* () {
    const opencode = yield* OpenCode.create()
    const session = yield* opencode.sessions.create({
      location: Location.Ref.make({ directory: AbsolutePath.make("/workspace") }),
    })
    yield* opencode.sessions.prompt({
      sessionID: session.id,
      text: "Review the current changes",
    })
    return session
  }),
)

const session = await Effect.runPromise(program)
```

The embedded host uses the same schema values, declared errors, request options, and Streams as
`@opencode/client/effect`.

```ts
const info = yield* opencode.server.info()
const sessions = yield* opencode.sessions.list()
```

## Stream events

Streaming endpoints return Effect `Stream` values. Fork consumers in the host Scope when they should run in the
background.

```ts
import { Effect, Stream } from "effect"

yield* opencode.events.subscribe().pipe(
  Stream.runForEach((event) => Effect.logInfo("OpenCode event", { type: event.type })),
  Effect.forkScoped,
)
```

## Customize

Customize your OpenCode instance by registering Effect plugins. Use the embedded
host to customize agents, models, tools, and other behavior:

```ts
import { Plugin } from "@opencode/plugin/effect"
import { Effect } from "effect"

const plugin = Plugin.define({
  id: "customize-agent",
  effect: (ctx) =>
    Effect.gen(function* () {
      const agent = ctx.agent
      yield* agent.transform((agents) => {
        agents.update("build", (agent) => {
          agent.description = "Builds features and fixes bugs for our team"
        })
      })
    }),
})

yield* opencode.plugin(plugin)
```

See the [full Effect plugins documentation](/build/plugins/effect) for plugin
hooks, transforms, tools, and the complete plugin context.

## Layer

Use `OpenCode.layer()` when the embedded host should be an application service.

```ts
import { OpenCode } from "@opencode/sdk/effect"
import { Effect } from "effect"

const program = Effect.gen(function* () {
  const opencode = yield* OpenCode.Service
  return yield* opencode.server.info()
})

const health = await Effect.runPromise(program.pipe(Effect.provide(OpenCode.layer())))
```

==> ./sdk/index.mdx <==
---
title: "SDK overview"
description: "Host OpenCode inside your application with @opencode/sdk, which serves the API in memory with no HTTP listener."
---

`@opencode/sdk` hosts OpenCode directly inside your application. Unlike the
[network client](/build/client), it assembles the OpenCode server and routes API
calls through its HTTP router in memory. It opens no HTTP listener and adds no
network hop between the client and server.

For Cloudflare Durable Objects, see the [Cloudflare guide](/build/sdk/cloudflare).

Install the SDK:

```sh
bun add @opencode/sdk
```

## Create a host

`OpenCode.create()` returns an explicitly owned host. Use `await using` to
release its router, Location services, fibers, and scoped plugin registrations:

```ts
import { OpenCode } from "@opencode/sdk"

await using opencode = await OpenCode.create()
const session = await opencode.sessions.create({
  location: { directory: "/workspace" },
})

await opencode.sessions.prompt({
  sessionID: session.id,
  text: "Review the current changes",
})
```

Call `await opencode.close()` explicitly when explicit resource management is
not available.

The embedded host uses the same Promise values, declared errors, request
options, and `AsyncIterable` streams as `@opencode/client`. It exposes the
full generated client and adds the convenience aliases `sessions` and `events`
for the session and event groups.

## Worktrees

Worktree operations require a `projectID`. Create and refresh load configuration and plugins from the project's saved
canonical checkout. List reads saved inventory only; remove activates canonical plugins and uses the recorded strategy,
failing if that strategy is unavailable.

```ts
const projectID = session.projectID
const worktree = await opencode.worktree.create({ projectID, name: "task" })
await opencode.worktree.refresh({ projectID })
await opencode.worktree.remove({ projectID, directory: worktree.directory, force: false })
```

Refresh discovers worktrees across known checkout roots using all available strategies. Register a custom strategy
through a [plugin's worktree transform](/build/plugins/server#worktrees).

## Stream events

```ts
for await (const event of opencode.events.subscribe()) {
  console.log(event.type)
}
```

Pass an `AbortSignal` through the generated request options, or leave an
iteration to cancel its response body.

## Customize

Customize your OpenCode instance by registering plugins. Pass plugins to
`OpenCode.create()` to customize agents, models, tools, and other behavior when
the embedded host starts:

```ts
import { Plugin } from "@opencode/plugin"
import { OpenCode } from "@opencode/sdk"

const plugin = Plugin.define({
  id: "customize-agent",
  async setup(ctx) {
    await ctx.agent.transform((agents) => {
      agents.update("build", (agent) => {
        agent.description = "Builds features and fixes bugs for our team"
      })
    })
  },
})

await using opencode = await OpenCode.create({ plugins: [plugin] })
```

Call `await opencode.plugin(plugin)` to register another plugin after startup.

See the [full plugins documentation](/build/plugins/server) for plugin hooks,
transforms, tools, and the complete plugin context.

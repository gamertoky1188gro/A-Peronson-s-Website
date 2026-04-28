import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const Icon = {
  ArrowLeft: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>),
  Check: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>),
  Upload: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 20h16"/></svg>),
  Image: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>),
  Loader: (p) => (<svg {...p} className={p.className+" animate-spin"} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4"/></svg>),
  Plus: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>),
  Play: (p) => (<svg {...p} viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>),
  Refresh: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>),
  Sparkles: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"/></svg>),
  Trash: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/></svg>),
  X: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>)
};

const initialForm = {
  title: "",
  category: "",
  caption: "",
  readme: "",
  ctaText: "",
  ctaUrl: "",
  hashtags: "",
  mentions: "",
  links: "",
  productTags: "",
  location: "",
};

function splitCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return "Just now";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function FeedManagementPage() {
  const fileInputRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [form, setForm] = useState(initialForm);
  const [mediaRows, setMediaRows] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("feed-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
      return;
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("feed-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const loadMine = async () => {
      setLoadingPosts(true);
      setError("");
      try {
const token = localStorage.getItem("jwt") || localStorage.getItem("token");
        const res = await fetch("/api/feed/posts/mine", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });

        if (!res.ok) {
          throw new Error("Failed to load your posts");
        }

        const data = await res.json();
        const rows = Array.isArray(data)
          ? data
          : Array.isArray(data?.posts)
            ? data.posts
            : [];
        setPosts(rows);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load your posts";
        setError(message);
      } finally {
        setLoadingPosts(false);
      }
    };

    loadMine();
  }, []);

  const previewCtaVisible = form.ctaText.trim().length > 0;
  const previewHasText = form.readme.trim().length > 0;

  const previewMeta = useMemo(
    () => ({
      hashtags: splitCommaList(form.hashtags),
      mentions: splitCommaList(form.mentions),
      links: splitCommaList(form.links),
      productTags: splitCommaList(form.productTags),
    }),
    [form.hashtags, form.mentions, form.links, form.productTags],
  );

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openPicker = () => fileInputRef.current?.click();

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      const nextRows = Array.from(files).map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        name: file.name,
        type: file.type || "application/octet-stream",
        url: URL.createObjectURL(file),
      }));

      setMediaRows((prev) => [...prev, ...nextRows]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearForm = () => {
    setForm(initialForm);
    setMediaRows([]);
    setError("");
  };

  const createPost = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (!token) {
      setError("Please log in again. Token missing.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      category: form.category,
      caption: form.caption,
      description_markdown: form.readme,
      cta_text: form.ctaText,
      cta_url: form.ctaUrl,
      hashtags: splitCommaList(form.hashtags),
      mentions: splitCommaList(form.mentions),
      links: splitCommaList(form.links),
      product_tags: splitCommaList(form.productTags),
      location_tag: form.location,
      status: "published",
      media: mediaRows.map((item) => ({
        name: item.name,
        type: item.type,
        url: item.url,
      })),
    };

    try {
      const res = await fetch("/feed/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      const data = await res.json();
      const created = data?.post ?? {
        id: String(Date.now()),
        title: form.title,
        category: form.category,
        caption: form.caption,
        createdAt: new Date().toISOString(),
      };

      setPosts((prev) => [created, ...prev]);
      clearForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Save failed";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (postId) => {
    const token = localStorage.getItem("jwt") || localStorage.getItem("token");
    if (!token) {
      setError("Please log in again. Token missing.");
      return;
    }

    const snapshot = posts;
    setError("");
    setPosts((prev) => prev.filter((post) => post.id !== postId));

    try {
      const res = await fetch(`/feed/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setPosts(snapshot);
      const message = err instanceof Error ? err.message : "Delete failed";
      setError(message);
    }
  };

  const removeMedia = (id) => {
    setMediaRows((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const pageBg = theme === "dark"
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";

  const panelBg = theme === "dark"
    ? "bg-white/5 border-white/10 shadow-[0_20px_80px_-30px_rgba(56,189,248,0.25)]"
    : "bg-white border-slate-200 shadow-[0_20px_80px_-30px_rgba(14,165,233,0.18)]";

  const subtleText = theme === "dark" ? "text-slate-400" : "text-slate-500";
  const mutedBorder = theme === "dark" ? "border-white/10" : "border-slate-200";
  const inputBase = theme === "dark"
    ? "bg-slate-900/60 text-slate-100 placeholder:text-slate-500 border-white/10 focus:border-sky-400"
    : "bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 focus:border-sky-500";

  return (
    <div className={cn("min-h-screen transition-colors duration-300", pageBg)}>
      <div className={cn("border-b backdrop-blur-xl", theme === "dark" ? "border-white/10 bg-slate-950/70" : "border-slate-200 bg-white/80")}> 
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tracking-wide uppercase text-sky-400 border-sky-400/20 bg-sky-400/10">
                <Icon.Sparkles className="h-3.5 w-3.5" />
                Premium feed studio
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Feed Management
                </h1>
                <p className={cn("mt-1 text-sm sm:text-base", subtleText)}>
                  Create and manage your feed posts.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/feed"
                className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Icon.ArrowLeft className="h-4 w-4" />
                Back to Feed
              </a>
              <button
                type="button"
                onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:shadow-lg",
                  panelBg,
                )}
              >
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-red-500/20 p-1.5 text-red-300">
                <Icon.X className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-red-100">Something went wrong</p>
                <p className="mt-1 text-red-200/90">{error}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-6">
            <section className={cn("overflow-hidden rounded-3xl border backdrop-blur-xl", panelBg)}>
              <div className={cn("border-b px-5 py-4", mutedBorder)}>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-500/15 p-2 text-sky-400">
                    <Icon.Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Post Editor</h2>
                    <p className={cn("text-sm", subtleText)}>Compose, enrich, and publish your feed post.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 sm:grid-cols-2">
                <Field label="Title" required>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Title..."
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Category">
                  <input
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    placeholder="Announcements"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Caption" className="sm:col-span-2">
                  <textarea
                    value={form.caption}
                    onChange={(e) => updateField("caption", e.target.value)}
                    placeholder="Short feed caption..."
                    rows={3}
                    className={cn(
                      "w-full resize-none rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="README / Longform" className="sm:col-span-2">
                  <textarea
                    value={form.readme}
                    onChange={(e) => updateField("readme", e.target.value)}
                    placeholder="Write markdown here..."
                    rows={8}
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                      "min-h-[220px]",
                    )}
                  />
                </Field>

                <Field label="CTA Text">
                  <input
                    value={form.ctaText}
                    onChange={(e) => updateField("ctaText", e.target.value)}
                    placeholder="Optional"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="CTA URL">
                  <input
                    value={form.ctaUrl}
                    onChange={(e) => updateField("ctaUrl", e.target.value)}
                    placeholder="https://..."
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Hashtags">
                  <input
                    value={form.hashtags}
                    onChange={(e) => updateField("hashtags", e.target.value)}
                    placeholder="#launch, #update"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Mentions">
                  <input
                    value={form.mentions}
                    onChange={(e) => updateField("mentions", e.target.value)}
                    placeholder="@buyer, @factory"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Links">
                  <input
                    value={form.links}
                    onChange={(e) => updateField("links", e.target.value)}
                    placeholder="https://..."
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Product Tags">
                  <input
                    value={form.productTags}
                    onChange={(e) => updateField("productTags", e.target.value)}
                    placeholder="cotton, denim, etc"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>

                <Field label="Location Tag" className="sm:col-span-2">
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    placeholder="Dhaka, Bangladesh"
                    className={cn(
                      "w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-sky-400/20",
                      inputBase,
                    )}
                  />
                </Field>
              </div>

              <div className={cn("border-t px-5 py-5", mutedBorder)}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-400">
                      Media (images / videos)
                    </h3>
                    <p className={cn("mt-1 text-sm", subtleText)}>
                      Add product shots, announcements, or campaign videos.
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={openPicker}
                    disabled={uploading}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {uploading ? <Icon.Loader className="h-4 w-4 animate-spin" /> : <Icon.Upload className="h-4 w-4" />}
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                <div className="mt-5">
                  {mediaRows.length === 0 ? (
                    <div className={cn("rounded-2xl border border-dashed px-5 py-8 text-center", theme === "dark" ? "border-white/10 bg-slate-950/30" : "border-slate-200 bg-slate-50/70")}>
                      <Icon.Image className={cn("mx-auto h-10 w-10", subtleText)} />
                      <p className="mt-3 text-sm font-medium">No media uploaded yet</p>
                      <p className={cn("mt-1 text-sm", subtleText)}>
                        Choose one or more images/videos to build a richer post.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {mediaRows.map((media) => {
                        const isVideo = media.type.startsWith("video");
                        return (
                          <div
                            key={media.id}
                            className={cn(
                              "group overflow-hidden rounded-3xl border transition hover:-translate-y-1",
                              theme === "dark" ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white",
                            )}
                          >
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-500/20 via-cyan-400/10 to-transparent">
                              {isVideo ? (
                                <>
                                  <video src={media.url} className="h-full w-full object-cover" muted playsInline />
                                  <div className="absolute inset-0 grid place-items-center bg-black/20">
                                    <div className="rounded-full bg-black/40 p-3 text-white backdrop-blur-sm">
                                      <Icon.Play className="h-6 w-6 fill-white" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <img src={media.url} alt={media.name} className="h-full w-full object-cover" />
                              )}
                              <button
                                type="button"
                                onClick={() => removeMedia(media.id)}
                                className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white opacity-100 transition hover:bg-black"
                                aria-label="Remove media"
                              >
                                <Icon.X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="space-y-1 p-3">
                              <div className="text-xs font-medium uppercase tracking-wide text-sky-400">
                                {isVideo ? "Video" : "Image"}
                              </div>
                              <p className="truncate text-sm font-medium">{media.name}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className={cn("flex flex-col gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between", mutedBorder)}>
                <button
                  type="button"
                  onClick={clearForm}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-lg",
                    panelBg,
                  )}
                >
                  <Icon.Refresh className="h-4 w-4" />
                  Clear
                </button>

                <button
                  type="button"
                  onClick={createPost}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:translate-y-[-1px] hover:shadow-xl hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Icon.Loader className="h-4 w-4 animate-spin" /> : <Icon.Check className="h-4 w-4" />}
                  {saving ? "Saving..." : "Save post"}
                </button>
              </div>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <section className={cn("overflow-hidden rounded-3xl border backdrop-blur-xl", panelBg)}>
              <div className={cn("border-b px-5 py-4", mutedBorder)}>
                <h2 className="text-lg font-semibold">Live Preview</h2>
                <p className={cn("text-sm", subtleText)}>Rendered markdown from your README field.</p>
              </div>

              <div className="px-5 py-5">
                {previewHasText ? (
                  <article className={cn("prose max-w-none", theme === "dark" ? "prose-invert prose-headings:text-white prose-a:text-sky-400" : "prose-slate prose-headings:text-slate-900 prose-a:text-sky-600") }>
                    <ReactMarkdown>{form.readme}</ReactMarkdown>
                  </article>
                ) : (
                  <div className={cn("rounded-2xl border border-dashed px-5 py-10 text-center", theme === "dark" ? "border-white/10 bg-slate-950/30" : "border-slate-200 bg-slate-50") }>
                    <Icon.Sparkles className={cn("mx-auto h-10 w-10", subtleText)} />
                    <p className="mt-3 text-sm font-medium">No preview content yet</p>
                    <p className={cn("mt-1 text-sm", subtleText)}>
                      Start writing markdown to see it rendered instantly.
                    </p>
                  </div>
                )}
              </div>

              <div className={cn("border-t px-5 py-5", mutedBorder)}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-400">
                    Content summary
                  </h3>
                  <div className="rounded-full border px-3 py-1 text-xs font-medium text-sky-400 border-sky-400/20 bg-sky-400/10">
                    {mediaRows.length} media
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm">
                  <InfoRow label="CTA" value={previewCtaVisible ? `${form.ctaText}${form.ctaUrl ? ` → ${form.ctaUrl}` : ""}` : "None"} />
                  <InfoRow label="Hashtags" value={previewMeta.hashtags.length ? previewMeta.hashtags.join(", ") : "None"} />
                  <InfoRow label="Mentions" value={previewMeta.mentions.length ? previewMeta.mentions.join(", ") : "None"} />
                  <InfoRow label="Links" value={previewMeta.links.length ? previewMeta.links.join(", ") : "None"} />
                  <InfoRow label="Product tags" value={previewMeta.productTags.length ? previewMeta.productTags.join(", ") : "None"} />
                  <InfoRow label="Location" value={form.location || "None"} />
                </div>
              </div>
            </section>

            <section className={cn("overflow-hidden rounded-3xl border backdrop-blur-xl", panelBg)}>
              <div className={cn("border-b px-5 py-4", mutedBorder)}>
                <h2 className="text-lg font-semibold">Your posts</h2>
                <p className={cn("text-sm", subtleText)}>Fetched from /api/feed/posts/mine</p>
              </div>

              <div className="p-5">
                {loadingPosts ? (
                  <div className="flex items-center justify-center py-10 text-sm text-sky-400">
                    <Icon.Loader className="mr-2 h-4 w-4 animate-spin" />
                    Loading posts...
                  </div>
                ) : posts.length === 0 ? (
                  <div className={cn("rounded-2xl border border-dashed px-5 py-10 text-center", theme === "dark" ? "border-white/10 bg-slate-950/30" : "border-slate-200 bg-slate-50") }>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-400">
                      <Icon.Image className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium">No posts yet</p>
                    <p className={cn("mt-1 text-sm", subtleText)}>
                      Create your first post to populate this list.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <article
                        key={post.id}
                        className={cn(
                          "rounded-3xl border p-4 transition hover:-translate-y-0.5 hover:shadow-xl",
                          theme === "dark" ? "border-white/10 bg-slate-950/40" : "border-slate-200 bg-white",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-semibold">{post.title}</h3>
                            <p className="mt-0.5 text-xs uppercase tracking-wide text-slate-400">
                              {post.category || "Uncategorized"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deletePost(post.id)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/15"
                          >
                            <Icon.Trash className="h-4 w-4" />
                            Delete
                          </button>
                        </div>

                        <p className={cn("mt-3 line-clamp-3 text-sm leading-6", subtleText)}>
                          {post.caption || "No caption provided."}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3 text-xs">
                          <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5", theme === "dark" ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-slate-50 text-slate-600")}>
                            <span className="h-2 w-2 rounded-full bg-sky-400" />
                            Created {formatDate(post.createdAt)}
                          </div>
                          <div className="text-sky-400/90">Published</div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, className, children }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-sky-400">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <span className="text-xs font-semibold uppercase tracking-wide text-sky-400">{label}</span>
      <span className="text-sm text-slate-300 sm:text-right">{value}</span>
    </div>
  );
}
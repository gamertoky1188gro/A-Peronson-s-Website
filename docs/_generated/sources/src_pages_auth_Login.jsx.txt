    1 | /*
    2 |   Route: /login
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Purpose:
   12 |     - Authenticate the user and persist a session (token + user object).
   13 |     - Redirect the user back to the originally requested page (if present),
   14 |       otherwise redirect to the role home route.
   15 | 
   16 |   Key API:
   17 |     - POST /api/auth/login  (via `apiRequest('/auth/login')`)
   18 | 
   19 |   Notes:
   20 |     - Styling is still using legacy `neo-page` / `cyberpunk-card` utilities.
   21 |       (We are only adding comments here; not changing styles/behavior.)
   22 | */
   23 | import React, { useEffect, useState } from 'react'
   24 | import { Link, useLocation, useNavigate } from 'react-router-dom'
   25 | import { apiRequest, getCurrentUser, getRoleHome, saveSession } from '../../lib/auth'
   26 | import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
   27 | 
   28 | export default function Login() {
   29 |   // `navigate` is used after a successful login (or when routing needs to change).
   30 |   const navigate = useNavigate()
   31 |   // `location` holds router state, including the "from" path set by ProtectedRoute when redirecting to /login.
   32 |   const location = useLocation()
   33 |   const existingUser = getCurrentUser()
   34 | 
   35 |   // Form fields (controlled inputs).
   36 |   const [identifier, setIdentifier] = useState('')
   37 |   const [password, setPassword] = useState('')
   38 |   // Whether to persist session in longer-lived storage (implementation handled by `saveSession`).
   39 |   const [rememberMe, setRememberMe] = useState(true)
   40 |   // UX states for the submit button + inline error message.
   41 |   const [loading, setLoading] = useState(false)
   42 |   const [passkeyLoading, setPasskeyLoading] = useState(false)
   43 |   const [enrollLoading, setEnrollLoading] = useState(false)
   44 |   const [suppressRedirect, setSuppressRedirect] = useState(false)
   45 |   const [rememberPasskeyUser, setRememberPasskeyUser] = useState(() => {
   46 |     const raw = localStorage.getItem('remember_passkey_user')
   47 |     return raw ? raw === 'true' : true
   48 |   })
   49 |   const [passkeyHint, setPasskeyHint] = useState(() => {
   50 |     try {
   51 |       const raw = localStorage.getItem('passkey_user_hint')
   52 |       return raw ? JSON.parse(raw) : null
   53 |     } catch {
   54 |       return null
   55 |     }
   56 |   })
   57 |   const [error, setError] = useState('')
   58 | 
   59 |   // If ProtectedRoute sent us here, it passes the blocked path in state so we can return after login.
   60 |   const redirectTo = location.state?.from || null
   61 | 
   62 |   useEffect(() => {
   63 |     if (suppressRedirect) return
   64 |     if (!existingUser?.role) return
   65 |     navigate(getRoleHome(existingUser.role), { replace: true })
   66 |   }, [existingUser?.role, navigate, suppressRedirect])
   67 | 
   68 |   useEffect(() => {
   69 |     localStorage.setItem('remember_passkey_user', rememberPasskeyUser ? 'true' : 'false')
   70 |     if (!rememberPasskeyUser) {
   71 |       localStorage.removeItem('passkey_user_hint')
   72 |       setPasskeyHint(null)
   73 |     }
   74 |   }, [rememberPasskeyUser])
   75 | 
   76 |   const handleBack = () => {
   77 |     if (window.history.length > 1) {
   78 |       navigate(-1)
   79 |       return
   80 |     }
   81 |     navigate('/', { replace: true })
   82 |   }
   83 | 
   84 |   // Submit handler: calls backend auth endpoint, stores the session, and redirects.
   85 |   const handleLogin = async (e) => {
   86 |     e.preventDefault()
   87 |     setError('')
   88 |     setLoading(true)
   89 |     try {
   90 |       // Authenticate (server returns { user, token } on success).
   91 |       // Backend will accept either email or Agent ID (member_id)
   92 |       const data = await apiRequest('/auth/login', {
   93 |         method: 'POST',
   94 |         body: { identifier, password },
   95 |       })
   96 | 
   97 |       // Persist user + token (optionally "remember me") so protected routes can use them.
   98 |       saveSession(data.user, data.token, { remember: rememberMe })
   99 |       // project.md: if onboarding is not completed, route user into the 3-step wizard first.
  100 |       const onboardingCompleted = data?.user?.profile?.onboarding_completed === true || String(data?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
  101 |       navigate(onboardingCompleted ? (redirectTo || getRoleHome(data.user.role)) : '/onboarding', { replace: true })
  102 |     } catch (err) {
  103 |       // Surface backend message for incorrect credentials or other auth failures.
  104 |       setError(err.message)
  105 |     } finally {
  106 |       setLoading(false)
  107 |     }
  108 |   }
  109 | 
  110 |   const handlePasskeyLogin = async () => {
  111 |     if (typeof window === 'undefined' || !window.PublicKeyCredential) {
  112 |       setError('Passkeys are not supported on this device/browser.')
  113 |       return
  114 |     }
  115 |     setError('')
  116 |     setPasskeyLoading(true)
  117 |     try {
  118 |       const optionsRes = await apiRequest('/auth/passkey/login/options', {
  119 |         method: 'POST',
  120 |         body: { identifier: identifier.trim() || undefined },
  121 |       })
  122 |       const assertion = await startAuthentication(optionsRes.options)
  123 |       const data = await apiRequest('/auth/passkey/login/verify', {
  124 |         method: 'POST',
  125 |         body: { identifier: identifier.trim() || undefined, credential: assertion },
  126 |       })
  127 |       if (rememberPasskeyUser) {
  128 |         const hint = {
  129 |           user_name: data?.user?.name || '',
  130 |           user_email: data?.user?.email || '',
  131 |           passkey_name: data?.passkey?.name || '',
  132 |         }
  133 |         localStorage.setItem('passkey_user_hint', JSON.stringify(hint))
  134 |         localStorage.setItem('remember_passkey_user', 'true')
  135 |         setPasskeyHint(hint)
  136 |       } else {
  137 |         localStorage.removeItem('passkey_user_hint')
  138 |         localStorage.setItem('remember_passkey_user', 'false')
  139 |         setPasskeyHint(null)
  140 |       }
  141 |       saveSession(data.user, data.token, { remember: rememberMe })
  142 |       const onboardingCompleted = data?.user?.profile?.onboarding_completed === true || String(data?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
  143 |       navigate(onboardingCompleted ? (redirectTo || getRoleHome(data.user.role)) : '/onboarding', { replace: true })
  144 |     } catch (err) {
  145 |       setError(err.message || 'Passkey login failed')
  146 |     } finally {
  147 |       setPasskeyLoading(false)
  148 |     }
  149 |   }
  150 | 
  151 |   const handlePasskeyEnroll = async () => {
  152 |     if (!identifier.trim() || !password) {
  153 |       setError('Enter your email/Agent ID and password to set up a passkey.')
  154 |       return
  155 |     }
  156 |     if (typeof window === 'undefined' || !window.PublicKeyCredential) {
  157 |       setError('Passkeys are not supported on this device/browser.')
  158 |       return
  159 |     }
  160 |     setError('')
  161 |     setEnrollLoading(true)
  162 |     setSuppressRedirect(true)
  163 |     try {
  164 |       const loginRes = await apiRequest('/auth/login', {
  165 |         method: 'POST',
  166 |         body: { identifier, password },
  167 |       })
  168 |       const optionsRes = await apiRequest('/auth/passkey/registration/options', {
  169 |         method: 'POST',
  170 |         token: loginRes.token,
  171 |       })
  172 |       if (!optionsRes?.options?.challenge) {
  173 |         throw new Error('Passkey setup failed. Please refresh and try again.')
  174 |       }
  175 |       const credential = await startRegistration(optionsRes.options)
  176 |       await apiRequest('/auth/passkey/registration/verify', {
  177 |         method: 'POST',
  178 |         token: loginRes.token,
  179 |         body: { credential },
  180 |       })
  181 |       saveSession(loginRes.user, loginRes.token, { remember: rememberMe })
  182 |       const onboardingCompleted = loginRes?.user?.profile?.onboarding_completed === true || String(loginRes?.user?.profile?.onboarding_completed || '').toLowerCase() === 'true'
  183 |       navigate(onboardingCompleted ? (redirectTo || getRoleHome(loginRes.user.role)) : '/onboarding', { replace: true })
  184 |     } catch (err) {
  185 |       setError(err.message || 'Passkey setup failed')
  186 |     } finally {
  187 |       setEnrollLoading(false)
  188 |       setSuppressRedirect(false)
  189 |     }
  190 |   }
  191 | 
  192 |   return (
  193 |     // Page wrapper: centers the login panel and applies the current "neo/cyberpunk" base style utilities.
  194 |     <div className="min-h-screen neo-page cyberpunk-page bg-white neo-panel cyberpunk-card flex items-center justify-center p-4">
  195 |       {/* Login card container (max width keeps form readable). */}
  196 |       <div className="w-full max-w-md bg-white neo-panel cyberpunk-card rounded-xl p-8">
  197 |         <div className="flex items-center justify-between">
  198 |           <h1 className="text-3xl font-bold">Login</h1>
  199 |           <button type="button" onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900">
  200 |             Back
  201 |           </button>
  202 |         </div>
  203 |         <p className="mt-2 text-sm text-gray-600">Access pages based on your role (Buyer, Factory, Buying House, Admin).</p>
  204 | 
  205 |         {/* Controlled form: React state is the single source of truth for inputs. */}
  206 |         <form onSubmit={handleLogin} className="mt-6 space-y-4">
  207 |           <div>
  208 |             <label className="block text-sm font-medium mb-1">Email or Agent ID</label>
  209 |             <input
  210 |               value={identifier}
  211 |               onChange={(e) => setIdentifier(e.target.value)}
  212 |               type="text"
  213 |               required
  214 |               placeholder="Enter your email or Agent ID"
  215 |               className="w-full px-4 py-3 borderless-shadow rounded-lg"
  216 |             />
  217 |             <p className="mt-1 text-xs text-slate-500">Agents: Use your assigned Agent ID to login</p>
  218 |           </div>
  219 |           <div>
  220 |             <label className="block text-sm font-medium mb-1">Password</label>
  221 |             {/* Password is required; actual auth validation happens server-side. */}
  222 |             <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full px-4 py-3 borderless-shadow rounded-lg" />
  223 |           </div>
  224 | 
  225 |           <div className="space-y-2">
  226 |             <label className="flex items-center gap-2 text-sm">
  227 |               <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
  228 |               Remember me
  229 |             </label>
  230 |             <label className="flex items-center gap-2 text-sm">
  231 |               <input
  232 |                 type="checkbox"
  233 |                 checked={rememberPasskeyUser}
  234 |                 onChange={(e) => setRememberPasskeyUser(e.target.checked)}
  235 |               />
  236 |               Remember passkey user
  237 |             </label>
  238 |             {passkeyHint ? (
  239 |               <p className="text-xs text-slate-500">
  240 |                 Passkey: <span className="font-semibold">{passkeyHint.passkey_name || 'Passkey'}</span>
  241 |                 {passkeyHint.user_name ? ` · ${passkeyHint.user_name}` : ''}
  242 |                 {passkeyHint.user_email ? ` (${passkeyHint.user_email})` : ''}
  243 |               </p>
  244 |             ) : null}
  245 |           </div>
  246 | 
  247 |           {/* Inline error (only renders when there is an error string). */}
  248 |           {error ? <p className="text-sm text-red-500">{error}</p> : null}
  249 | 
  250 |           {/* Primary CTA: uses brand blue color */}
  251 |           <button disabled={loading} className="w-full px-4 py-3 rounded-lg bg-[var(--gt-blue)] hover:bg-[var(--gt-blue-hover)] text-white disabled:opacity-70 transition">
  252 |             {loading ? 'Signing in...' : 'Sign in'}
  253 |           </button>
  254 |           <button
  255 |             type="button"
  256 |             onClick={handlePasskeyLogin}
  257 |             disabled={passkeyLoading}
  258 |             className="w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70"
  259 |           >
  260 |             {passkeyLoading ? 'Opening passkey...' : 'Sign in with passkey'}
  261 |           </button>
  262 |           <button
  263 |             type="button"
  264 |             onClick={handlePasskeyEnroll}
  265 |             disabled={enrollLoading}
  266 |             className="w-full px-4 py-3 rounded-lg borderless-shadow text-slate-700 disabled:opacity-70"
  267 |           >
  268 |             {enrollLoading ? 'Setting up passkey...' : 'Set up passkey (first time)'}
  269 |           </button>
  270 |         </form>
  271 | 
  272 |         {/* Secondary nav: send user to signup if they do not have an account yet. */}
  273 |         <p className="mt-6 text-sm text-gray-600">
  274 |           New here* <Link className="text-[var(--gt-blue)] hover:underline" to="/signup">Create account</Link>
  275 |         </p>
  276 |       </div>
  277 |     </div>
  278 |   )
  279 | }
  280 | 
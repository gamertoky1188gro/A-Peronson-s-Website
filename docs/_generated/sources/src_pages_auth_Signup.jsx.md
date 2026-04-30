    1 | /*
    2 |   Route: /signup
    3 |   Access: Public
    4 | 
    5 |   Public Pages:
    6 |     /, /pricing, /about, /terms, /privacy, /help, /login, /signup, /access-denied
    7 |   Protected Pages (login required):
    8 |     /feed, /search, /buyer/:id, /factory/:id, /buying-house/:id, /contracts,
    9 |     /notifications, /chat, /call, /verification, /verification-center
   10 | 
   11 |   Purpose:
   12 |     - Register a new account (Buyer / Factory / Buying House).
   13 |     - Immediately create a session and route the user to the correct role home.
   14 | 
   15 |   Key API:
   16 |     - POST /api/auth/register (via `apiRequest('/auth/register')`)
   17 | 
   18 |   Notes:
   19 |     - This file currently uses legacy `neo-page` / `cyberpunk-card` styles.
   20 |       We are only adding comments, not altering visuals or behavior.
   21 | */
   22 | import React, { useEffect, useState } from 'react'
   23 | import { Link, useNavigate } from 'react-router-dom'
   24 | import { apiRequest, getCurrentUser, getRoleHome, saveSession } from '../../lib/auth'
   25 | import { BUYER_COUNTRY_OPTIONS } from '../../../shared/config/geo.js'
   26 | import RoleSelect from '../../components/ui/RoleSelect'
   27 | import CountryAutocomplete from '../../components/ui/CountryAutocomplete'
   28 | import BackButton from '../../components/ui/BackButton'
   29 | 
   30 | export default function Signup() {
   31 |   // Router navigation after successful account creation.
   32 |   const navigate = useNavigate()
   33 |   const existingUser = getCurrentUser()
   34 |   // UX state for async submit + error display.
   35 |   const [loading, setLoading] = useState(false)
   36 |   const [error, setError] = useState('')
   37 |   // Controlled form model (single object keeps submission payload building simple).
   38 |   const [form, setForm] = useState({
   39 |     name: '',
   40 |     email: '',
   41 |     password: '',
   42 |     confirmPassword: '',
   43 |     primaryRole: 'buyer',
   44 |     country: '',
   45 |     organization: '',
   46 |   })
   47 |   const [passwordVisible, setPasswordVisible] = useState(false)
   48 |   const [confirmVisible, setConfirmVisible] = useState(false)
   49 | 
   50 |   // Generic onChange helper so each input doesn't need its own setter function.
   51 |   const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
   52 | 
   53 |   useEffect(() => {
   54 |     if (!existingUser?.role) return
   55 |     navigate(getRoleHome(existingUser.role), { replace: true })
   56 |   }, [existingUser?.role, navigate])
   57 | 
   58 |   const handleBack = () => {
   59 |     if (window.history.length > 1) {
   60 |       navigate(-1)
   61 |       return
   62 |     }
   63 |     navigate('/', { replace: true })
   64 |   }
   65 | 
   66 |   // Submit handler: builds backend payload, calls register endpoint, and saves session.
   67 |   const handleSubmit = async (e) => {
   68 |     e.preventDefault()
   69 |     setLoading(true)
   70 |     setError('')
   71 |     if (form.password !== form.confirmPassword) {
   72 |       setLoading(false)
   73 |       setError('Passwords do not match.')
   74 |       return
   75 |     }
   76 |     try {
   77 |       // Backend expects a slightly different field naming; map UI fields -> API fields here.
   78 |       const resolvedRole = form.primaryRole
   79 |       const payload = {
   80 |         name: form.name,
   81 |         email: form.email,
   82 |         password: form.password,
   83 |         role: resolvedRole,
   84 |         company_name: form.organization,
   85 |         profile: { country: form.country },
   86 |       }
   87 | 
   88 |       // Create the account on the server.
   89 |       const data = await apiRequest('/auth/register', { method: 'POST', body: payload })
   90 |       // Persist session immediately so user can access protected routes right away.
   91 |       saveSession(data.user, data.token)
   92 |       // project.md: onboarding wizard runs right after signup to reduce complexity.
   93 |       navigate('/onboarding', { replace: true })
   94 |     } catch (err) {
   95 |       setError(err.message)
   96 |     } finally {
   97 |       setLoading(false)
   98 |     }
   99 |   }
  100 | 
  101 |   return (
  102 |     // Page wrapper: centers the signup card and applies legacy base styles.
  103 |     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
  104 |       <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
  105 |         <div className="flex items-center justify-between">
  106 |           <div>
  107 |             <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
  108 |             <p className="mt-2 text-sm text-slate-500">A clean, professional start for Garments and Textile sourcing teams.</p>
  109 |           </div>
  110 |           <div className="hidden sm:flex items-center gap-3">
  111 |             <div className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0A66C2]">GarTexHub</div>
  112 |             <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
  113 |           </div>
  114 |         </div>
  115 |         <div className="mt-3 sm:hidden">
  116 |           <BackButton onClick={handleBack} className="text-sm text-slate-600 hover:text-slate-900 bg-transparent px-2 py-1 rounded-none" />
  117 |         </div>
  118 | 
  119 |         <form className="mt-8 grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
  120 |           <div>
  121 |             <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
  122 |             <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.name} onChange={(e) => onChange('name', e.target.value)} required />
  123 |           </div>
  124 |           <div>
  125 |             <label className="block text-sm font-medium mb-1 text-slate-700">Email</label>
  126 |             <input type="email" className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.email} onChange={(e) => onChange('email', e.target.value)} required />
  127 |           </div>
  128 |           <div>
  129 |             <label className="block text-sm font-medium mb-1 text-slate-700">Password</label>
  130 |             <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
  131 |               <input
  132 |                 type={passwordVisible ? 'text' : 'password'}
  133 |                 className="w-full bg-transparent outline-none"
  134 |                 value={form.password}
  135 |                 onChange={(e) => onChange('password', e.target.value)}
  136 |                 required
  137 |               />
  138 |               <button
  139 |                 type="button"
  140 |                 onClick={() => setPasswordVisible((prev) => !prev)}
  141 |                 className="text-xs font-semibold text-slate-500"
  142 |               >
  143 |                 {passwordVisible ? 'Hide' : 'Show'}
  144 |               </button>
  145 |             </div>
  146 |           </div>
  147 |           <div>
  148 |             <label className="block text-sm font-medium mb-1 text-slate-700">Confirm Password</label>
  149 |             <div className="flex items-center gap-2 rounded-lg borderless-shadow px-3 py-2 focus-within:ring-2 focus-within:ring-[#0A66C2]/20">
  150 |               <input
  151 |                 type={confirmVisible ? 'text' : 'password'}
  152 |                 className="w-full bg-transparent outline-none"
  153 |                 value={form.confirmPassword}
  154 |                 onChange={(e) => onChange('confirmPassword', e.target.value)}
  155 |                 required
  156 |               />
  157 |               <button
  158 |                 type="button"
  159 |                 onClick={() => setConfirmVisible((prev) => !prev)}
  160 |                 className="text-xs font-semibold text-slate-500"
  161 |               >
  162 |                 {confirmVisible ? 'Hide' : 'Show'}
  163 |               </button>
  164 |             </div>
  165 |           </div>
  166 |           <div className="md:col-span-2">
  167 |             <label className="block text-sm font-medium mb-2 text-slate-700">Account Type</label>
  168 |             <RoleSelect
  169 |               value={form.primaryRole}
  170 |               onChange={(v) => onChange('primaryRole', v)}
  171 |               options={[
  172 |                 { value: 'buyer', label: 'Buyer' },
  173 |                 { value: 'factory', label: 'Factory' },
  174 |                 { value: 'buying_house', label: 'Buying House' },
  175 |               ]}
  176 |             />
  177 |           </div>
  178 |           <div>
  179 |             <label className="block text-sm font-medium mb-1 text-slate-700">Country</label>
  180 |             <CountryAutocomplete
  181 |               value={form.country}
  182 |               onChange={(v) => onChange('country', v)}
  183 |               options={BUYER_COUNTRY_OPTIONS}
  184 |               placeholder="Type to search countries"
  185 |               required
  186 |             />
  187 |           </div>
  188 |           <div>
  189 |             <label className="block text-sm font-medium mb-1 text-slate-700">Organization Name</label>
  190 |             <input className="w-full px-4 py-3 borderless-shadow rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20" value={form.organization} onChange={(e) => onChange('organization', e.target.value)} />
  191 |           </div>
  192 |           {/* API error state (e.g. email already used). */}
  193 |           {error ? <p className="md:col-span-2 text-sm text-red-500">{error}</p> : null}
  194 | 
  195 |           {/* Footer actions: primary submit + link to login. */}
  196 |           <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
  197 |             <button disabled={loading} className="px-5 py-3 rounded-lg bg-[#0A66C2] hover:bg-[#004182] text-white disabled:opacity-70">
  198 |               {loading ? 'Creating account...' : 'Create account'}
  199 |             </button>
  200 |             <Link
  201 |               to="/login"
  202 |               className="px-5 py-3 rounded-lg borderless-shadow text-slate-700 font-semibold hover:bg-slate-50 dark:text-white dark:bg-slate-800/60 dark:hover:bg-slate-700/50 dark:ring-1 dark:ring-white/10"
  203 |             >
  204 |               Already have an account? Login
  205 |             </Link>
  206 |           </div>
  207 |         </form>
  208 |       </div>
  209 |     </div>
  210 |   )
  211 | }
  212 | 
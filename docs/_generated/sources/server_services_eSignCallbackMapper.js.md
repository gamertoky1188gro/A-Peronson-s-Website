    1 | /**
    2 |  * Normalize incoming e-sign provider webhook payloads to our internal shape.
    3 |  * Returns an object possibly containing `buyer_signed` and/or `factory_signed` booleans.
    4 |  * This is best-effort mapping across multiple vendor payload shapes (Dropbox Sign,
    5 |  * HelloSign, DocuSign, Adobe Sign, etc.). If mapping can't be determined, an
    6 |  * empty object is returned so the original payload is preserved.
    7 |  */
    8 | export function normalizeProviderWebhook(rawPayload = {}) {
    9 |   const payload = rawPayload || {}
   10 | 
   11 |   // If already in our internal shape, pass through
   12 |   if (payload.buyer_signed || payload.factory_signed) {
   13 |     return {
   14 |       buyer_signed: Boolean(payload.buyer_signed),
   15 |       factory_signed: Boolean(payload.factory_signed),
   16 |     }
   17 |   }
   18 | 
   19 |   const result = {}
   20 | 
   21 |   const eventType = (payload.event && (payload.event.event_type || payload.event.type)) || payload.type || payload.event_type || ''
   22 |   const le = String(eventType || '').toLowerCase()
   23 | 
   24 |   const detectRoleFromObj = (obj) => {
   25 |     if (!obj) return null
   26 |     const role = String(obj.role || obj.signer_role || obj.role_name || obj.roleType || '').toLowerCase()
   27 |     if (role.includes('buyer')) return 'buyer'
   28 |     if (role.includes('factory') || role.includes('supplier')) return 'factory'
   29 | 
   30 |     const email = String(obj.email || obj.signer_email_address || obj.email_address || obj.signer_email || '').toLowerCase()
   31 |     if (email) {
   32 |       if (email.includes('buyer')) return 'buyer'
   33 |       if (email.includes('factory') || email.includes('supplier')) return 'factory'
   34 |     }
   35 | 
   36 |     const name = String(obj.name || obj.signer_name || obj.signer || '').toLowerCase()
   37 |     if (name) {
   38 |       if (name.includes('buyer')) return 'buyer'
   39 |       if (name.includes('factory') || name.includes('supplier')) return 'factory'
   40 |     }
   41 |     return null
   42 |   }
   43 | 
   44 |   // Collect common signature arrays from different provider shapes
   45 |   const signatures = []
   46 |   if (Array.isArray(payload.signature_request?.signatures)) signatures.push(...payload.signature_request.signatures)
   47 |   if (Array.isArray(payload.signatures)) signatures.push(...payload.signatures)
   48 |   if (Array.isArray(payload.signers)) signatures.push(...payload.signers)
   49 |   if (Array.isArray(payload.recipientStatuses)) signatures.push(...payload.recipientStatuses)
   50 |   if (Array.isArray(payload.signerStatuses)) signatures.push(...payload.signerStatuses)
   51 |   // single objects
   52 |   if (payload.signature && !Array.isArray(payload.signature)) signatures.push(payload.signature)
   53 |   if (payload.signer && !Array.isArray(payload.signer)) signatures.push(payload.signer)
   54 | 
   55 |   for (const s of signatures) {
   56 |     const role = detectRoleFromObj(s)
   57 |     const status = String(s.status || s.status_code || s.signed || s.signer_status || '').toLowerCase()
   58 |     if (role === 'buyer') result.buyer_signed = result.buyer_signed || status === 'signed' || !!s.signed || !!s.signed_at
   59 |     if (role === 'factory') result.factory_signed = result.factory_signed || status === 'signed' || !!s.signed || !!s.signed_at
   60 |   }
   61 | 
   62 |   // Provider-level event hints meaning "all signers signed"
   63 |   if (!result.buyer_signed && !result.factory_signed) {
   64 |     if (le.includes('all_signed') || le.includes('all_signers') || le.includes('signature_request_all_signed') || le.includes('signatures:all')) {
   65 |       result.buyer_signed = true
   66 |       result.factory_signed = true
   67 |     } else if (le.includes('signed') || le.includes('signature')) {
   68 |       // If payload has exactly one signature object, try to map it
   69 |       if (signatures.length === 1) {
   70 |         const s = signatures[0]
   71 |         const role = detectRoleFromObj(s)
   72 |         const status = String(s.status || s.signed || s.status_code || '').toLowerCase()
   73 |         if (role === 'buyer') result.buyer_signed = status === 'signed' || !!s.signed || !!s.signed_at
   74 |         if (role === 'factory') result.factory_signed = status === 'signed' || !!s.signed || !!s.signed_at
   75 |       }
   76 |     }
   77 |   }
   78 | 
   79 |   if (!result.buyer_signed && !result.factory_signed) return {}
   80 | 
   81 |   // Attach some provider metadata to help debugging
   82 |   result.provider_event_type = eventType || ''
   83 |   return result
   84 | }
   85 | 
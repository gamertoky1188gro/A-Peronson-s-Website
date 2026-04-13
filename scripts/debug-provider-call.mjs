process.env.ESIGN_PROVIDER_TYPE='dropbox_sign'
process.env.ESIGN_PROVIDER_URL='https://api.dropbox.sign.test'
process.env.ESIGN_DROPBOX_SIGN_API_KEY='testkey'

import axios from 'axios'
axios.post = async () => ({ data: { signing_url: 'https://provider/sign/abc', session_id: 'sess-abc' } })

import { createProviderSignSession } from '../server/services/eSignProvider.js'
import { createDraftContract } from '../server/services/documentService.js'

;(async () => {
  const actor = { id: 'owner-debug', role: 'owner' }
  const draft = await createDraftContract(actor, { buyer_id: 'b1', factory_id: 'f1', buyer_name: 'B', factory_name: 'F' })
  try {
    const res = await createProviderSignSession({ contractId: draft.id, contract: draft, actor, token: 'tkn' })
    console.log('provider res', res)
  } catch (err) {
    console.error('provider error', err)
  }
})()

    1 | import {
    2 |   createMember,
    3 |   deactivateOrRemoveMember,
    4 |   getMemberConstraints,
    5 |   listMembers,
    6 |   resetMemberPassword,
    7 |   updateMember,
    8 |   updateMemberPermissions,
    9 | } from '../services/memberService.js'
   10 | import { canManageMembers, deny, handleControllerError } from '../utils/permissions.js'
   11 | import { ensureEntitlement } from '../services/entitlementService.js'
   12 | import { ACTIONS, authorize } from '../services/authorizationService.js'
   13 | 
   14 | function orgOwnerIdFromUser(user) {
   15 |   return user?.org_owner_id || user?.org_id || user?.organization_id || user?.id
   16 | }
   17 | 
   18 | function handleError(res, error) {
   19 |   return handleControllerError(res, error)
   20 | }
   21 | 
   22 | export async function createOrgMember(req, res) {
   23 |   if (!canManageMembers(req.user)) return deny(res)
   24 |   try {
   25 |     const currentMembers = await listMembers(orgOwnerIdFromUser(req.user))
   26 |     const constraints = await getMemberConstraints(req.user)
   27 |     const seatCap = Number(constraints?.plan === 'premium' ? constraints?.premium_member_limit : constraints?.free_member_limit)
   28 |     const activeSeats = currentMembers.filter((m) => String(m.status || 'active') === 'active').length
   29 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, {
   30 |       org_id: orgOwnerIdFromUser(req.user),
   31 |       active_seats: activeSeats,
   32 |       requested_seats: 1,
   33 |       seat_cap: seatCap,
   34 |     })
   35 |     if (req.body?.permissions !== undefined || req.body?.permission_matrix !== undefined) {
   36 |       await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
   37 |     }
   38 |     const member = await createMember(orgOwnerIdFromUser(req.user), req.body || {})
   39 |     return res.status(201).json({ member })
   40 |   } catch (error) {
   41 |     return handleError(res, error)
   42 |   }
   43 | }
   44 | 
   45 | export async function listOrgMembers(req, res) {
   46 |   if (!canManageMembers(req.user)) return deny(res)
   47 |   try {
   48 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user) })
   49 |     const members = await listMembers(orgOwnerIdFromUser(req.user))
   50 |     const constraints = await getMemberConstraints(req.user)
   51 |     return res.json({ members, constraints })
   52 |   } catch (error) {
   53 |     return handleError(res, error)
   54 |   }
   55 | }
   56 | 
   57 | export async function putOrgMember(req, res) {
   58 |   if (!canManageMembers(req.user)) return deny(res)
   59 |   try {
   60 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
   61 |     if (req.body?.permissions !== undefined || req.body?.permission_matrix !== undefined) {
   62 |       await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
   63 |     }
   64 |     const member = await updateMember(orgOwnerIdFromUser(req.user), req.params.memberId, req.body || {})
   65 |     if (!member) return res.status(404).json({ error: 'Member not found' })
   66 |     return res.json({ member })
   67 |   } catch (error) {
   68 |     return handleError(res, error)
   69 |   }
   70 | }
   71 | 
   72 | export async function patchMemberPermissions(req, res) {
   73 |   if (!canManageMembers(req.user)) return deny(res)
   74 |   try {
   75 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
   76 |     await ensureEntitlement(req.user, 'team_access_management', 'Premium plan required for team access management.')
   77 |     const member = await updateMemberPermissions(
   78 |       orgOwnerIdFromUser(req.user),
   79 |       req.params.memberId,
   80 |       req.body?.permissions,
   81 |       req.body?.permission_matrix,
   82 |     )
   83 |     if (!member) return res.status(404).json({ error: 'Member not found' })
   84 |     return res.json({ member })
   85 |   } catch (error) {
   86 |     return handleError(res, error)
   87 |   }
   88 | }
   89 | 
   90 | export async function postMemberPasswordReset(req, res) {
   91 |   if (!canManageMembers(req.user)) return deny(res)
   92 |   try {
   93 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
   94 |     const result = await resetMemberPassword(orgOwnerIdFromUser(req.user), req.params.memberId)
   95 |     if (!result) return res.status(404).json({ error: 'Member not found' })
   96 |     return res.json(result)
   97 |   } catch (error) {
   98 |     return handleError(res, error)
   99 |   }
  100 | }
  101 | 
  102 | export async function deactivateOrRemoveOrgMember(req, res) {
  103 |   if (!canManageMembers(req.user)) return deny(res)
  104 |   try {
  105 |     await authorize(req.user, ACTIONS.MEMBERS_MANAGE, { org_id: orgOwnerIdFromUser(req.user), member_id: req.params.memberId })
  106 |     const mode = req.query.remove === 'true' ? 'remove' : 'deactivate'
  107 |     const result = await deactivateOrRemoveMember(orgOwnerIdFromUser(req.user), req.params.memberId, mode)
  108 |     if (!result) return res.status(404).json({ error: 'Member not found' })
  109 |     return res.json(result)
  110 |   } catch (error) {
  111 |     return handleError(res, error)
  112 |   }
  113 | }
  114 | 
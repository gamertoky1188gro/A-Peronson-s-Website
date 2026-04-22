import express from 'express'
import { PrismaClient } from '@prisma/client'
import { requireAdminSecurity } from '../middleware/adminSecurity.js'

const prisma = new PrismaClient()

import {
  getInventoryWithFallback,
  getInventoryByModule,
  updateInventoryConfig,
  getActionsWithFallback,
  getActionsAsGroups,
  updateActionsConfig,
  getCapabilitiesWithFallback,
  updateCapabilities,
  getUiConfigWithFallback,
  updateUiConfig,
  getMockDataWithFallback,
  updateMockData,
  getRoleConfigWithFallback,
  updateRoleConfig,
  getGovernanceConfigWithFallback,
  updateGovernanceConfig,
  getBrandingConfigWithFallback,
  updateBrandingConfig,
  getSecurityPurposesWithFallback,
  updateSecurityPurposes,
  getAllConfig,
  getConfigHistory,
} from '../services/adminDynamicConfigService.js'

const router = express.Router()

router.get('/config', requireAdminSecurity, async (req, res) => {
  try {
    const config = await getAllConfig()
    res.json(config)
  } catch (error) {
    console.error('[AdminConfig] GET /config error:', error.message)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
})

router.get('/config/inventory', requireAdminSecurity, async (req, res) => {
  try {
    const inventory = await getInventoryWithFallback()
    res.json(inventory)
  } catch (error) {
    console.error('[AdminConfig] GET /config/inventory error:', error.message)
    res.status(500).json({ error: 'Failed to fetch inventory' })
  }
})

router.get('/config/inventory/:moduleId', requireAdminSecurity, async (req, res) => {
  try {
    const { moduleId } = req.params
    const module = await getInventoryByModule(moduleId)
    if (!module) {
      return res.status(404).json({ error: 'Module not found' })
    }
    res.json(module)
  } catch (error) {
    console.error('[AdminConfig] GET /config/inventory/:moduleId error:', error.message)
    res.status(500).json({ error: 'Failed to fetch module' })
  }
})

router.put('/config/inventory', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateInventoryConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/inventory error:', error.message)
    res.status(500).json({ error: 'Failed to update inventory' })
  }
})

router.get('/config/actions', requireAdminSecurity, async (req, res) => {
  try {
    const actions = await getActionsWithFallback()
    res.json(actions)
  } catch (error) {
    console.error('[AdminConfig] GET /config/actions error:', error.message)
    res.status(500).json({ error: 'Failed to fetch actions' })
  }
})

router.get('/config/actions/groups', requireAdminSecurity, async (req, res) => {
  try {
    const groups = await getActionsAsGroups()
    res.json(groups)
  } catch (error) {
    console.error('[AdminConfig] GET /config/actions/groups error:', error.message)
    res.status(500).json({ error: 'Failed to fetch action groups' })
  }
})

router.put('/config/actions', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateActionsConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/actions error:', error.message)
    res.status(500).json({ error: 'Failed to update actions' })
  }
})

router.get('/config/capabilities', requireAdminSecurity, async (req, res) => {
  try {
    const { moduleId } = req.query
    const capabilities = await getCapabilitiesWithFallback(moduleId)
    res.json(capabilities)
  } catch (error) {
    console.error('[AdminConfig] GET /config/capabilities error:', error.message)
    res.status(500).json({ error: 'Failed to fetch capabilities' })
  }
})

router.put('/config/capabilities', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateCapabilities(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/capabilities error:', error.message)
    res.status(500).json({ error: 'Failed to update capabilities' })
  }
})

router.get('/config/ui', requireAdminSecurity, async (req, res) => {
  try {
    const uiConfig = await getUiConfigWithFallback()
    res.json(uiConfig)
  } catch (error) {
    console.error('[AdminConfig] GET /config/ui error:', error.message)
    res.status(500).json({ error: 'Failed to fetch UI config' })
  }
})

router.put('/config/ui', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateUiConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/ui error:', error.message)
    res.status(500).json({ error: 'Failed to update UI config' })
  }
})

router.get('/config/mock', requireAdminSecurity, async (req, res) => {
  try {
    const { type } = req.query
    const mockData = await getMockDataWithFallback(type)
    res.json(mockData)
  } catch (error) {
    console.error('[AdminConfig] GET /config/mock error:', error.message)
    res.status(500).json({ error: 'Failed to fetch mock data' })
  }
})

router.put('/config/mock', requireAdminSecurity, async (req, res) => {
  try {
    const { dataKey, payload } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateMockData(dataKey, payload, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/mock error:', error.message)
    res.status(500).json({ error: 'Failed to update mock data' })
  }
})

router.get('/config/roles', requireAdminSecurity, async (req, res) => {
  try {
    const roleConfig = await getRoleConfigWithFallback()
    res.json(roleConfig)
  } catch (error) {
    console.error('[AdminConfig] GET /config/roles error:', error.message)
    res.status(500).json({ error: 'Failed to fetch role config' })
  }
})

router.put('/config/roles', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateRoleConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/roles error:', error.message)
    res.status(500).json({ error: 'Failed to update role config' })
  }
})

router.get('/config/governance', requireAdminSecurity, async (req, res) => {
  try {
    const governanceConfig = await getGovernanceConfigWithFallback()
    res.json(governanceConfig)
  } catch (error) {
    console.error('[AdminConfig] GET /config/governance error:', error.message)
    res.status(500).json({ error: 'Failed to fetch governance config' })
  }
})

router.put('/config/governance', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateGovernanceConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/governance error:', error.message)
    res.status(500).json({ error: 'Failed to update governance config' })
  }
})

router.get('/config/branding', requireAdminSecurity, async (req, res) => {
  try {
    const branding = await getBrandingConfigWithFallback()
    res.json(branding)
  } catch (error) {
    console.error('[AdminConfig] GET /config/branding error:', error.message)
    res.status(500).json({ error: 'Failed to fetch branding' })
  }
})

router.put('/config/branding', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateBrandingConfig(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/branding error:', error.message)
    res.status(500).json({ error: 'Failed to update branding' })
  }
})

router.get('/config/security', requireAdminSecurity, async (req, res) => {
  try {
    const security = await getSecurityPurposesWithFallback()
    res.json(security)
  } catch (error) {
    console.error('[AdminConfig] GET /config/security error:', error.message)
    res.status(500).json({ error: 'Failed to fetch security purposes' })
  }
})

router.put('/config/security', requireAdminSecurity, async (req, res) => {
  try {
    const { data } = req.body
    const actorId = req.user?.id || 'admin'
    const result = await updateSecurityPurposes(data, actorId)
    res.json(result)
  } catch (error) {
    console.error('[AdminConfig] PUT /config/security error:', error.message)
    res.status(500).json({ error: 'Failed to update security purposes' })
  }
})

router.get('/config/history', requireAdminSecurity, async (req, res) => {
  try {
    const { type, limit } = req.query
    const history = await getConfigHistory(type, parseInt(limit) || 20)
    res.json(history)
  } catch (error) {
    console.error('[AdminConfig] GET /config/history error:', error.message)
    res.status(500).json({ error: 'Failed to fetch config history' })
  }
})

router.get('/config/roles-list', requireAdminSecurity, async (req, res) => {
  try {
    const roles = await prisma.adminRoleConfig.findMany({ where: { active: true } })
    res.json(roles.map(r => ({ role_key: r.role_key, label: r.label, is_admin_role: r.is_admin_role, benefits: r.benefits })))
  } catch (error) {
    console.error('[AdminConfig] GET /config/roles-list error:', error.message)
    res.status(500).json({ error: 'Failed to fetch roles' })
  }
})

router.get('/config/infra-capabilities', requireAdminSecurity, async (req, res) => {
  try {
    const caps = await prisma.adminCapability.findMany({ where: { module_id: 'infra', active: true }, orderBy: { sort_order: 'asc' } })
    res.json(caps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })))
  } catch (error) {
    console.error('[AdminConfig] GET /config/infra-capabilities error:', error.message)
    res.status(500).json({ error: 'Failed to fetch capabilities' })
  }
})

router.get('/config/network-capabilities', requireAdminSecurity, async (req, res) => {
  try {
    const caps = await prisma.adminCapability.findMany({ where: { module_id: 'network', active: true }, orderBy: { sort_order: 'asc' } })
    res.json(caps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })))
  } catch (error) {
    console.error('[AdminConfig] GET /config/network-capabilities error:', error.message)
    res.status(500).json({ error: 'Failed to fetch capabilities' })
  }
})

router.get('/config/ultra-capabilities', requireAdminSecurity, async (req, res) => {
  try {
    const caps = await prisma.adminCapability.findMany({ where: { module_id: 'ultra-security', active: true }, orderBy: { sort_order: 'asc' } })
    res.json(caps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })))
  } catch (error) {
    console.error('[AdminConfig] GET /config/ultra-capabilities error:', error.message)
    res.status(500).json({ error: 'Failed to fetch capabilities' })
  }
})

router.get('/config/total-config', requireAdminSecurity, async (req, res) => {
  try {
    const [inventory, ui, roles, infraCaps, networkCaps, ultraCaps, actions] = await Promise.all([
      getInventoryWithFallback(),
      getUiConfigWithFallback(),
      getRoleConfigWithFallback(),
      prisma.adminCapability.findMany({ where: { module_id: 'infra', active: true }, orderBy: { sort_order: 'asc' } }),
      prisma.adminCapability.findMany({ where: { module_id: 'network', active: true }, orderBy: { sort_order: 'asc' } }),
      prisma.adminCapability.findMany({ where: { module_id: 'ultra-security', active: true }, orderBy: { sort_order: 'asc' } }),
      getActionsWithFallback(),
    ])
    
    res.json({
      inventory,
      ui_config: ui,
      roles,
      infra_capabilities: infraCaps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })),
      network_capabilities: networkCaps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })),
      ultra_capabilities: ultraCaps.map(c => ({ capability_id: c.capability_id, title: c.title, count: c.count, icon_name: c.icon_name, subtitle: c.subtitle })),
      actions: actions || [],
    })
  } catch (error) {
    console.error('[AdminConfig] GET /config/total-config error:', error.message)
    res.status(500).json({ error: 'Failed to fetch config' })
  }
})

export default router
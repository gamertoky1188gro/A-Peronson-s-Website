import fs from 'node:fs/promises'
import path from 'node:path'

const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')

describe('Prisma migrations smoke', () => {
  test('all SQL migrations are readable and key tables are present', async () => {
    const entries = await fs.readdir(migrationsDir, { withFileTypes: true })
    const migrationFolders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()

    expect(migrationFolders.length).toBeGreaterThan(0)

    const sqlChunks = await Promise.all(
      migrationFolders.map(async (folder) => {
        const filePath = path.join(migrationsDir, folder, 'migration.sql')
        const sql = await fs.readFile(filePath, 'utf8')
        expect(sql.trim().length).toBeGreaterThan(0)
        expect(sql).not.toMatch(/<<<<<<<|=======|>>>>>>>/)
        return { folder, sql }
      }),
    )

    const combinedSql = sqlChunks.map((row) => row.sql).join('\n')

    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"users"/i)
    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"leads"/i)
    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"fx_rates"/i)
    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"message_queue_items"/i)
    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"message_policy_logs"/i)
    expect(combinedSql).toMatch(/CREATE TABLE[\s\S]*?"communication_limits"/i)
    expect(combinedSql).toMatch(/CREATE UNIQUE INDEX[\s\S]*?"fx_base_quote"/i)
  })
})

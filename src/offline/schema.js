// HyperCache Phase 2 — schema definition.
// SCHEMA_VERSION is the single source of truth for Dexie upgrades.
// Bump it whenever stores/indexes change and add a note to UPGRADE_NOTES.

export const SCHEMA_VERSION = 1;

// Dexie store definitions: "++localKey, &unique, indexed, fields..."
// Primary key strategy:
// - Server-backed entities use their server `id` as primary key (string).
// - Local-only / cache entries use auto-increment or explicit string keys.
export const STORES = {
	users: "id, updatedAt",
	profiles: "id, userId, updatedAt",
	feedPosts: "id, updatedAt, feed_type, category",
	products: "id, updatedAt, category",
	requirements: "id, updatedAt, status",
	notifications: "id, updatedAt, read",
	messages: "id, conversationId, createdAt",
	conversations: "id, updatedAt",
	searchResults: "++localKey, queryHash, createdAt",
	feedPages: "++localKey, pageKey, cursor, createdAt",
	feedIndexes: "key, updatedAt",
	media: "id, updatedAt",
	routeMetadata: "route, updatedAt",
	cacheMetadata: "key, updatedAt",
	syncState: "key",
	syncChanges: "++localKey, entity, entityId, serverSequence, receivedAt",
	outbox: "++localKey, localId, entity, createdAt, status",
	conflicts: "++localKey, entity, entityId, detectedAt",
};

export const UPGRADE_NOTES = [
	{
		version: 1,
		date: "2026-10-05",
		notes:
			"Initial HyperCache Phase 2 schema: 18 stores covering entities, page/index caches, metadata, sync state, outbox and conflicts.",
	},
];

export default { SCHEMA_VERSION, STORES, UPGRADE_NOTES };

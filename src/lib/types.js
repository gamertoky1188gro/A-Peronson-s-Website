/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} role
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar]
 * @property {Object} [profile]
 * @property {string} [profile.avatar_url]
 * @property {string} [profile.name]
 * @property {string} [profile.email]
 */

/**
 * @typedef {Object} AuthResponse
 * @property {string} token
 * @property {User} user
 */

export const User = {};
export const AuthResponse = {};

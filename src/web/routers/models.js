/**
 * @typedef UserLoginInfo
 * @property {string} login.required - user login
 * @property {string} password.required - user password
 */

/**
 * @typedef User
 * @property {integer} id.required - user id
 * @property {string} login.required - user login
 * @property {integer} plevel.required - user privilege level
 */

/**
 * @typedef UserWithPass
 * @property {integer} id.required - user id
 * @property {string} login.required - user login
 * @property {integer} plevel.required - user privilege level
 * @property {string} password.required - user password
 */

/**
 * @typedef Team
 * @property {integer} id.required - team id
 * @property {string} name.required - team name
 * @property {integer} owner_id.required - team owner id
 */

/**
 * @typedef Player
 * @property {integer} id.required - player id
 * @property {string} fname.required - player first name
 * @property {string} lname.required - player last name
 * @property {string} cntry.required - player country
 * @property {string} dob.required - player date of birth
 */

/**
 * @typedef PlayerUpdInfo
 * @property {string} fname.required - player first name
 * @property {string} lname.required - player last name
 * @property {string} cntry.required - player country
 */



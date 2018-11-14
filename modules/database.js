const sql = require('sqlite3');

const db = new sql.Database(process.cwd() + "/database/luki.db")

module.exports = db
const pg = require('pg')

const pool = new pg.Pool({
	host: 'localhost',
  	port: 55000,
  	user: 'postgres',
  	password: 'postgrespw',
  	database: 'crud'
})


async function model (query, ...params) {
	const client = await pool.connect()
	try {
		const { rows } = await client.query(query, params.length ? params : null)
		return rows
	} catch(error) {
		console.log('database error: ', error)
	} finally {
		client.release()
	}
}
	

module.exports = model 
require('dotenv').config();
const { Pool } = require('pg');

const databaseUrl = new URL(process.env.DATABASE_URL);
databaseUrl.searchParams.delete('sslmode');

const connection = new Pool({
        connectionString: databaseUrl.toString(),
    ssl: {
        rejectUnauthorized: false,
    },
})

connection.connect()
    .then(() => {
        console.log('database connected successfully')
    })
    .catch((err) => {
        console.error('database connect failed', err)
    })

module.exports=connection;

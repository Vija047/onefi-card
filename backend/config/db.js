require('dotenv').config();
const { Pool } = require('pg');


const connection=new Pool({
    connectionString:process.env.DATABASE_URL,  
})
connection.connect()
.then(()=>{
console.log("databse connected successfully");
})
.catch((err)=>{
console.error("database connect failed",err);
})

module.exports=connection;

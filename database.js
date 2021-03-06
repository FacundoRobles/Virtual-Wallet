const mysql = require('mysql');
const { promisify } = require('util');

const database = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            console.error('DATABASE CONNECTION WAS CLOSED');
        if (err.code === 'ER_CON_COUNT_ERROR')
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        if (err.code === 'ECONNREFUSED')
            console.error('DATABASE CONNECTION WAS REFUSED');
    }
    if (connection) connection.release();
    console.log('DB is Connected');
    return;
});


//PROMISIFY POOL QUERYS
pool.query = promisify(pool.query);

module.exports = {
    pool,
    database
};

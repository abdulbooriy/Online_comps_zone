import mysql from 'mysql2/promise.js';

const database = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'Online_comps_zone',
});

export default database;
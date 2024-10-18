const sql = require('mssql'); // Use require instead of import

// connection configs
const config = {
    user: 'manu',
    password: 'abdurrehman0!', // replace with actual password
    server: 'dbprojectfast.database.windows.net', // Server name from the image
    database: 'dbProject', // Replace with actual database name
    port: 1433, // Port from the image
    options: {
        encrypt: true, // Encryption is set to 'Mandatory' in the image
        trustServerCertificate: false, // 'Trust server certificate' is unchecked
    },
    pool: {
        max: 10, // Maximum number of connections in the pool
        min: 0,  // Minimum number of connections in the pool
        idleTimeoutMillis: 30000 // Timeout for an idle connection
    }
};

// Initialize pool and keep a persistent connection
let poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.log('Database Connection Failed! Bad Config: ', err);
    });

// Function to query the database using the persistent connection pool
async function getAllUserIds() {
    try {
        let pool = await poolPromise;
        let result = await pool.request().query('SELECT id FROM dbo.[user];');
        return result.recordset;
    } catch (error) {
        console.log(error);
    }
}

getAllUserIds().then((result) => {
    console.log(result);
});

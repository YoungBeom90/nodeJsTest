module.exports = {
    user: process.env.NODE_ORACLEDB_USER || 'test_db',
    password: process.env.NODE_ORACLEDB_PASSWORD || 'test_db',
    connecString: process.env.NODE_ORACLEDB_CONNECTIONSTRING || 'localhost/orcl'
}
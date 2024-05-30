const fs = require('fs');
const path = require('path');
const pool = require("../server/modules/pool.js");

async function runQuery(query) {
  try {
    const res = await pool.query(query);
    console.log(`Successfully ran query: ${query}`);
    return res;
  } catch (err) {
    console.error(`Error running query: ${query}`, err.stack);
    throw err;
  }
}

async function insertTestData() {
  try {
    const sqlFilePath = path.join(__dirname, 'TestUsers.sql');
    const sqlFileContent = fs.readFileSync(sqlFilePath, 'utf8');

    // Split the SQL file content into separate queries
    const queries = sqlFileContent.split(';').filter(query => query.trim() !== '');

    // Run each query
    for (const query of queries) {
      await runQuery(query);
    }

    console.log('Successfully inserted test data');
  } catch (err) {
    console.error('Error inserting test data:', err.stack);
  }
}

insertTestData();
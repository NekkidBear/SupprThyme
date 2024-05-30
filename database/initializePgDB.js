const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool.js");

const checkIfDatabaseExists = async (dbName) => {
  const query = `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`;
  const result = await pool.query(query);

  if (result.rowCount === 0) {
    console.log("DB does not exist. Creating ", dbName);
    await pool.query(`CREATE DATABASE ${dbName}`);
  }
};

const tablesArray = [
  // base tables
  path.join(__dirname, "user.sql"),
  path.join(__dirname, "groups.sql"),
  path.join(__dirname, "restaurants.sql"),
  path.join(__dirname, "details.sql"),
  path.join(__dirname, "group_members.sql"),
  path.join(__dirname, "votes.sql"),
  path.join(__dirname, 'user_allergens.sql'),
  // lookup tables
  path.join(__dirname, "lookup_tables", "cuisine_types.sql"),
  path.join(__dirname, "lookup_tables", "meat_preferences.sql"),
  path.join(__dirname, "lookup_tables", "price_ranges.sql"),
  path.join(__dirname, "lookup_tables", "religious_restrictions.sql"),
  path.join(__dirname, "lookup_tables", "allergens_list.sql"),
  //create user preferences after lookups are complete
  path.join(__dirname, "user_preferences.sql"),
];

const addTables = async () => {
  for (const queryPath of tablesArray) {
    const tableName = path.basename(queryPath, '.sql');
    try {
      const queryContent = fs.readFileSync(queryPath, 'utf-8');
      console.log(`Dropping table if exists: ${tableName}`);
      await pool.query(queryContent);
      console.log(`Created table: ${tableName}`);
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
    }
  }
};

checkIfDatabaseExists("SupprThyme").catch((error)=>console.error('Error creating database:', error));
addTables().catch((error)=>console.error('Error adding tables:', error));
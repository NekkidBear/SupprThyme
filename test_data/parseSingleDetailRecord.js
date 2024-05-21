const fs = require("fs");
const path = require("path");
const pool = require("../server/modules/pool");
const readline = require("readline");

const minneapolisDetailsFilePath = path.join(
  __dirname,
  "cache",
  "minneapolisDetails.json"
);

const stPaulDetailsFilePath = path.join(
    __dirname,
    "cache",
    "stPaulDetails.json"
);

// Function to safely parse JSON
const parseJSONFile = (filePath) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return data.map((item) => item.results); //Get all records
  } catch (error) {
    console.error(`Error parsing JSON file at ${filePath}:`, error);
    return null;
  }
};

// Parse JSON data
const mlpsRestaurants = parseJSONFile(minneapolisDetailsFilePath);
const stPRestaurants = parseJSONFile(stPaulDetailsFilePath);

// Function to stringify and format JSON data
const stringifyJSON = (obj) => {
  if (typeof obj !== "object" || obj === null) {
    return JSON.stringify(obj);
  }

  const isArray = Array.isArray(obj);
  const keys = Object.keys(obj);
  const stringifiedObj = isArray ? [] : {};

  for (const key of keys) {
    stringifiedObj[key] = stringifyJSON(obj[key]);
  }

  return JSON.stringify(stringifiedObj, null, 2); // Indent with 2 spaces for better formatting
};

// Function to pause and wait for user approval
const waitForApproval = async (fieldName, fieldValue) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`${fieldName}: ${fieldValue}`);

  return new Promise((resolve) => {
    rl.question("Approve? (y/n) ", (answer) => {
      rl.close();
      if (answer.toLowerCase() === "y") {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

// Function to insert data into the database
// Function to insert data into the database
const insertData = async (restaurant) => {
    const client = await pool.connect();
    try {
      const detailsValues = Object.values(restaurant).map((value) => {
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value);
        }
        return value;
      });
  
      const query = `
        INSERT INTO details (${Object.keys(restaurant).join(", ")})
        VALUES (${detailsValues.map((_, i) => `$${i + 1}`).join(", ")})
      `;
  
      await client.query(query, detailsValues);
      console.log(`Data inserted successfully.`);
    } catch (error) {
      console.error("Error inserting data:", error);
      console.error("Failed JSON string:", stringifyJSON(restaurant));
      return; // Stop the insertion process
    } finally {
      client.release();
    }
  };

// Iterate over the array of restaurants and call insertData for each record
async function parseRestaurantDetails(restaurants) {
  if (restaurants) {
    for (const restaurant of restaurants) {
      await insertData(restaurant);
    }
  } else {
    console.error("No data found in the JSON file.");
  }
}

parseRestaurantDetails(mlpsRestaurants);
parseRestaurantDetails(stPRestaurants);


const pool = require('../server/modules/pool.js');

async function getAllDietaryRestrictions() {
  const res = await pool.query('SELECT dietary_restrictions FROM restaurants');
  return res.rows.map(row => JSON.parse(row.dietary_restrictions));
}

// async function insertCuisine(cuisine) {
//   const res = await pool.query('SELECT * FROM cuisine_types WHERE type = $1', [cuisine]);
//   if (res.rows.length === 0) {
//     await pool.query('INSERT INTO cuisine_types (type) VALUES ($1)', [cuisine]);
//   }
// }

async function printDistinctDietaryRestrictions() {
  const allDietaryRestrictions = await getAllDietaryRestrictions();
  const distinctDietaryRestrictions = [...new Set(allDietaryRestrictions.flatMap(restrictions => restrictions.map(restriction => restriction.name)))];
//   const ora = (await import('ora')).default;
//   const spinner = ora('Processing cuisines').start();
//   for (const cuisine of distinctCuisines) {
//     await insertCuisine(cuisine);
//     spinner.text = `Processed cuisine: ${cuisine}`;
//   }
//   spinner.succeed('All cuisines processed');
console.log (distinctDietaryRestrictions);
}

printDistinctDietaryRestrictions().catch(async error => {
//   const ora = (await import('ora')).default;
//   ora().fail(`Processing failed: ${error}`);
  console.error(error);
});
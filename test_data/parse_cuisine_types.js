const pool = require('../server/modules/pool.js');

async function getAllCuisines() {
  const res = await pool.query('SELECT cuisine FROM restaurants');
  return res.rows.map(row => JSON.parse(row.cuisine));
}

async function insertCuisine(cuisine) {
  const res = await pool.query('SELECT * FROM cuisine_types WHERE type = $1', [cuisine]);
  if (res.rows.length === 0) {
    await pool.query('INSERT INTO cuisine_types (type) VALUES ($1)', [cuisine]);
  }
}

async function rebuildCuisineTypes() {
  const allCuisines = await getAllCuisines();
  const distinctCuisines = [...new Set(allCuisines.flatMap(cuisines => cuisines.map(cuisine => cuisine.name)))];
  const ora = (await import('ora')).default;
  const spinner = ora('Processing cuisines').start();
  for (const cuisine of distinctCuisines) {
    await insertCuisine(cuisine);
    spinner.text = `Processed cuisine: ${cuisine}`;
  }
  spinner.succeed('All cuisines processed');
}

rebuildCuisineTypes().catch(async error => {
  const ora = (await import('ora')).default;
  ora().fail(`Processing failed: ${error}`);
  console.error(error);
});
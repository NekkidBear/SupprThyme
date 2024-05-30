const path = require('path');
const { exec } = require('child_process');
const Spinner = require('cli-spinner').Spinner;

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const absoluteScriptPath = path.join(__dirname, scriptPath);
    const spinner = new Spinner(`Running script "${scriptPath}"... %s`);
    spinner.setSpinnerString('|/-\\');
    spinner.start();

    exec(`node ${absoluteScriptPath}`, (error, stdout, stderr) => {
      spinner.stop(true);
      if (error) {
        console.warn(`Error running script "${scriptPath}": ${stderr}`);
        reject(error);
      } else {
        console.log(`Successfully ran script "${scriptPath}": ${stdout}`);
        resolve(stdout);
      }
    });
  });
}

async function rebuildTestData() {
  try {
    await runScript('test_data/test_data.js') //query 3rd party api for test data
    await runScript('database/initializePgDB.js'); //drop and recreate tables
    await runScript('test_data/populateTestUsers.js'); //populate test users
    await runScript('test_data/populateTestUserPreferencesData.js'); //populate test user preferences
    await runScript('test_data/populateTestSearchData.js'); //populate test Restaurant Search data
    await runScript('test_data/parseSingleDetailRecord.js');//Populate test Restaurant Details data
    console.log('Successfully rebuilt test data');
  } catch (error) {
    console.error('Error rebuilding test data:', error);
  }
}

rebuildTestData();
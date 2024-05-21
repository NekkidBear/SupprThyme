const csv = require("csv-parser");
const fs = require("fs");
const path = require('path');
const store = require('../src/redux/store');
const {register} = require('../src/redux/sagas/registration.saga.js')

const testUsersInfoArray = path.join(
    __dirname,
    "cache",
    "testUsersInfo.csv"
)

const userInfo = []


fs.createReadStream(testUsersInfoArray)
  .pipe(csv())
  .on('data', (row) => {
    userInfo.push(row);
  })
  .on('end', async () => {
    console.log('CSV file successfully processed');
    
    for (const user of userInfo) {
      // Define the user data
      const userData = {
        username: user.username,
        password: user.password,
        email: user.email,
        home_metro: user.home_metro
      };

      // Dispatch the registration action
      store.dispatch(register(userData));

      console.log(`Registration for ${user.username} complete.`);
    }
  });
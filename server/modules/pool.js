import pg from 'pg';

/* the only line you likely need to change is

 database: 'prime_app',

 change `prime_app` to the name of your database, and you should be all set!
*/

const pool = (() => {
  // When our app is deployed to the internet 
  // we'll use the DATABASE_URL environment variable
  // to set the connection info: web address, username/password, db name
  // eg: 
  //  DATABASE_URL=postgresql://jDoe354:secretPw123@some.db.com/prime_app
  if (process.env.DATABASE_URL) {
    return new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  // When we're running this app on our own computer
  // we'll connect to the postgres database that is 
  // also running on our computer (localhost)
  else {
    return new pg.Pool({
      host: 'localhost',
      port: 5432,
      database: 'SupprThyme',   
    });
  }
})();

if (process.env.DATABASE_URL) {
  console.log(`Connected to database with connection string: ${process.env.DATABASE_URL}`);
} else {
  console.log('Connected to local database: SupprThyme');
}

export default pool;

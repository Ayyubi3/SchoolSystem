const { Client } = require('pg');

class Database {



  static client = new Client({
    user: 'SchoolSystem',
    host: 'localhost',
    database: 'SchoolSystem',
    password: 'SchoolSystem',
    port: '5432',
  });

  static async exec(inpt, args)
  {

    console.log("Database.exec = ")

    try {
      let res = await this.client.query(inpt, args)
      console.log(JSON.stringify(res) + "\n")
      return res
    } catch (error) {
      console.log(error)

    }
  }




  static async connect() {
    try {
      await this.client.connect();
      console.log('Connected to the database');
    } catch (error) {
      console.error('Error connecting to the database:', error);
    }
  }

  static async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from the database');
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
    }
  }



}


Database.connect()



class DBHelper {

  async UserCreate(firstname, lastname, email, password) {

    console.log("DBHelper.UserCreate")
    console.log(firstname + lastname + email + password)

    const res = await this.Read("user", "email = '" + email + "'")

    if(res.rowCount != 0)
    {
      console.log(email + " already in use")
    }


    try {
      const result = Database.exec(
        'INSERT INTO "user" (surname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [firstname, lastname, email, password]
      );
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async Read(db, constraint) {

    console.log("DBHelper.Read")

    try {
      
      let command = 'SELECT * FROM "' + db + '" '
      command += constraint ? "WHERE " + constraint : ""
      command += ";"
      console.log(command)
      let result = await Database.exec(command);
      return result.rows
    } catch (error) {
      console.error('Error getting users:', error);
      return null;
    }
  }


}

const DatabaseHelper = new DBHelper()



module.exports = { DatabaseHelper }

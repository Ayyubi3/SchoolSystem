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
      //console.log(JSON.stringify(res) + "\n")
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

  async SubjectCreate(id, name, html_markdown_code) {

    console.log("DBHelper.SubjectCreate")
    console.log(id)

    const res = await this.Read("subject", "id = '" + id + "'")

    if(res.rowCount != 0)
    {
      console.log(id + " already in use")
    }


    try {
      const result = Database.exec(
        'INSERT INTO "subject" (id, name, html_markdown_code) VALUES ($1, $2, $3) RETURNING *',
        [id, name, html_markdown_code]
      );
      return result

    } catch (error) {
      console.error('Error creating subject:', error);
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

  async GetSubjectsFromUser(user_id)
  {
    try {
      
      console.log("DBHelper.GetSubjectsFromUser")
      let command = "SELECT subject.id, subject.name FROM subject_speakers JOIN subject ON subject_speakers.subject_id = subject.id WHERE subject_speakers.user_id = " + user_id + ";"
      const res = await Database.exec(command) 
      return res.rows
    } catch (error) {
      console.log(error)
    }
  }


  async GetNameFromSubjectID(SubjectID)
  {
    try {
      
      console.log("DBHelper.GetNameFromSubjectID")
      let command = 'SELECT "user".id, "user".lastname, "user".surname FROM subject_speakers JOIN "user" ON subject_speakers.user_id = "user".id WHERE subject_speakers.subject_id = ' + SubjectID + ";"
      const res = await Database.exec(command) 
      return res.rows
    } catch (error) {
      console.log(error)
    }
  }

}

const DatabaseHelper = new DBHelper()



module.exports = { DatabaseHelper }

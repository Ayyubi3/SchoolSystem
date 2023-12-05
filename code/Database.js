const { Client } = require('pg');

class Database {



  static client = new Client({
    user: 'SchoolSystem',
    host: 'localhost',
    database: 'SchoolSystem',
    password: 'SchoolSystem',
    port: '5432',
  });

  /**
   * return = error -> error
   *       return {
        iserror: true,
        details: error
      }
   */
  static async exec(inpt, args) {

    console.log("Database.exec = ")

    try {
      let res = await this.client.query(inpt, args)
      //console.log(JSON.stringify(res) + "\n")
      return res
    } catch (error) {
      console.log(error)
      return {
        iserror: true,
        details: error
      }

    }
  }



  static async connect() {
    try {
      await this.client.connect();
      console.log('Connected to the database');
      return true
    } catch (error) {
      console.error('Error connecting to the database:', error);
      return false
    }
  }

  static async disconnect() {
    try {
      await this.client.end();
      console.log('Disconnected from the database');
      return true
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
      return
    }
  }



}


Database.connect()



class DBHelper {

  /**
   * return = error -> error; 
   * return = result ->  
   */
  async UserCreate(firstname, lastname, email, password) {

    console.log("DBHelper.UserCreate")
    console.log(firstname + lastname + email + password)

    const res = await this.Read("user", "email = '" + email + "'")

    if (res.rowCount > 0) { console.log(email + " already in use") }


    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    const result = await Database.exec(
      'INSERT INTO "user" (id, firstname, lastname, email, password) VALUES (' + randomNumber + ', $1, $2, $3, $4) RETURNING *',
      [firstname, lastname, email, password]
    );


    return result;

  }


  /**
   * return = error -> error; 
   * return = result ->  
   */
  async SubjectCreate(name, html_markdown_code, speaker, creator) {

    let ROLLBACK = false;

    console.log("DBHelper.SubjectCreate")

    if (!Array.isArray(speaker)) { speaker = [speaker] }
    
    console.log("trying to create subject: " + name + "/" + html_markdown_code + "/" + speaker + "/" + creator)
    if (!name || !html_markdown_code || !speaker || !creator) { console.log("One of the Fields is empty"); return { iserror: true } }


    const res = await this.Read("subject", "name = '" + name + "'")

    if (res.rowCount > 0) { console.log(name + " already in use"); return { iserror: true } }


    await Database.exec("BEGIN;")


    const randomNumber = Math.floor(Math.random() * 9999);


    const result = await Database.exec(
      'INSERT INTO "subject" (id, name, html_markdown_code) VALUES (' + randomNumber + ', $1, $2) RETURNING *',
      [name, html_markdown_code]
    );
    if (result.iserror) { ROLLBACK = true }
    console.log(result)

    const result0 = await Database.exec(
      'INSERT INTO subject_creator (subject_id, creator_id) VALUES ('+randomNumber+', ' +creator+ ')'
    );
    if (result0.iserror) { ROLLBACK = true }
    console.log(result0)



    speaker.every(async element => {

      const result1 = await Database.exec(
        'INSERT INTO "subject_speaker" (subject_id, speaker_id) VALUES (' + randomNumber + ', ' + element + ') RETURNING *',
      );
      if (result1.iserror) {
        ROLLBACK = true
        return false;
      }

    });



    if (ROLLBACK == true) {
      console.log("Rollback;")
      await Database.exec("ROLLBACK;")
      console.error('Error creating subject:', error);
    } else {

      await Database.exec("COMMIT;")
      console.log("subject created")
    }


  }

  /**
   * return = error -> error; 
   * return = result.rows
   */
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
      return error;
    }
  }

  /**
 * return = error -> error; 
 * return = result.rows
 */
  async GetSubjectsFromUser(user_id) {
    try {

      console.log("DBHelper.GetSubjectsFromUser")
      let command =
        "SELECT subject.id, subject.name " +
        "FROM subject_speaker " +
        "JOIN subject ON subject_speaker.subject_id = subject.id " +
        "WHERE subject_speaker.speaker_id = " +
        user_id +
        ";"

      const res = await Database.exec(command)

      return res.rows

    } catch (error) {
      console.log(error)
      return error
    }
  }

  /**
 * return = error -> error; 
 * return = result.rows
 */
  async GetSpeakerNameFromSubjectID(SubjectID) {
    try {

      console.log("DBHelper.GetNameFromSubjectID")
      let command =
        'SELECT "user".id, "user".lastname, "user".firstname ' +
        'FROM subject_speaker ' +
        'JOIN "user" ON subject_speaker.speaker_id = "user".id ' +
        'WHERE subject_speaker.subject_id = ' +
        SubjectID +
        ";"

      const res = await Database.exec(command)

      return res.rows
    } catch (error) {
      console.log(error)
      return res.error

    }
  }

}

const DatabaseHelper = new DBHelper()



module.exports = { DatabaseHelper }

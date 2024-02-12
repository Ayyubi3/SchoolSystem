const { Pool } = require("pg")

class Database {

  static pool = null

  static async init() {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await (async () => {
      this.pool = new Pool()
      const client = await this.pool.connect()
      try {
        const result = await client.query(`SELECT NOW()`)
        console.log(`database test: ${JSON.stringify(result.rows[0])}`)
      } finally {
        client.release()
      }
    })().catch(e => console.error(e.message, e.stack))

    this.pool.on("connect", (client) => {
      console.log("DATABASE: Client connected")
    })
    this.pool.on("error", (err, client) => {
      console.log(`DATABASE: Client error: ${err}`)
    })
  }

  static async exec(inpt, args) {

    console.log(
      `Database.exec = Prompt: ${inpt} | Args: ${args}`
    )

    try {
      let data = await this.pool.query(inpt, args)
      console.log(`DatabaseOutput: ${data.rows}`)
      return [data, false]
    } catch (error) {
      console.log(`DatabaseError: ${error}`)
      return [false, error]
    }
  }
}

const bcrypt = require("bcrypt")
class DatabaseUtils {

  static async createUser(firstname, lastname, email, password) {
    console.log(`Create user: ${firstname}, ${lastname}, ${email}, ${password}`)


    let somethingsMissing = false
    let missingMessage = "Following fields are missing: ";
    if (!firstname) { missingMessage += "Firstname, "; somethingsMissing = true; }
    if (!lastname) { missingMessage += "Lastname, "; somethingsMissing = true; }
    if (!email) { missingMessage += "Email, "; somethingsMissing = true; }
    if (!password) { missingMessage += "Password, "; somethingsMissing = true; }

    if (somethingsMissing) return [false, missingMessage]


    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);


    let [data, error] = await Database.exec(
      `INSERT INTO "user"(firstname, lastname, email, password) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstname, lastname, email, hash]
    );

    if (error) { return [false, "Not allowed to create user."] }

    if (data.rows[0]) { data = data.rows[0] }

    return [data, false]

  }




  static async emailExists_b(email) {
    let [data, error] = await Database.exec(
      `SELECT COUNT(*) FROM "user" WHERE email=$1`,
      [email]
    );

    let out = data.rows[0].count > 0

    return out
  };




  static async getUserByEmail_o(email) {
    let [data, error] = await Database.exec(
      `SELECT * FROM "user" WHERE email=$1`,
      [email]
    );

    if (error) { data = false }
    return data.rows[0]
  };



  static async getUserByID_o(id) {

    let [data, error] = await Database.exec(
      `SELECT * FROM "user" WHERE id=$1`,
      [id]
    );

    if (error) { data = false }
    return data.rows[0]

  };

  static async deleteUser(id) {

    let [data, error] = await Database.exec(
      `DELETE FROM "user" WHERE id=$1`,
      [id]
    );
    return !error
  };


  //Course


  static async createCourse(name, html_markdown_code, creator_id) {


    console.log("Create course: ", name, html_markdown_code, creator_id)


    let somethingsMissing = false
    let missingMessage = "Following fields are missing: ";
    if (!name) { missingMessage += "name, "; somethingsMissing = true; }
    if (!html_markdown_code) { missingMessage += "html_markdown_code, "; somethingsMissing = true; }
    if (!creator_id) { missingMessage += "creator_id, "; somethingsMissing = true; }

    if (somethingsMissing) return new Result(true, missingMessage, false)



    let [data, error] = await Database.exec(
      `INSERT INTO "course"(name, html_markdown_code, creator_id) 
            VALUES ($1, $2, $3) RETURNING *`,
      [name, html_markdown_code, creator_id]
    );

    if (error) { return [false, "Not allowed to create course."] }

    if (data.rows[0]) { data = data.rows[0] }

    return [data, false]



  }




  static async deleteCourse_b(id) {
    let [data, error] = await Database.exec(
      `DELETE FROM "course" WHERE id=$1`,
      [id]
    );
    return !error

  };


  static async updateCourse_b(creator_id, course_id, name, html_markdown_code) {

    if (!name && !html_markdown_code) {
      return new Result(true, "Name AND Code are missing")
    }

    let cmd = ` UPDATE "course" SET `

    if (name) {
      cmd += ` name = '` + name + `' ,`
    }

    if (html_markdown_code) {
      cmd += ` html_markdown_code = $$` + html_markdown_code + `$$ `
    }

    cmd += `WHERE id = ` + course_id + ` AND creator_id = ` + creator_id

    const [data, error] = await Database.exec(
      cmd
    );

    return !error
  };








  static async getCourseByID_o(id) {

    let [data, error] = await Database.exec(
      `SELECT * FROM "course" WHERE id=$1`,
      [id]
    );

    if (error) { data = false }
    return data.rows[0]

  }


  static async userJoinCourse_b(course_id, user_id) {

    console.log("User join course: " + course_id + user_id)

    if (!course_id || !user_id) {
      console.log("input is missing")
      return false
    }

    const [data, error] = await Database.exec(
      `INSERT INTO user_course (user_id, course_id) 
            VALUES ($1, $2)`,
      [user_id, course_id]
    );

    return !error

  }

  static async userLeaveCourse_b(user_id) {

    console.log("User leave course: " + user_id)

    if (!user_id) {
      console.log("input is missing")
      return false
    }

    const [data, error] = await Database.exec(
      `DELETE FROM user_course WHERE user_id = $1`,
      [user_id]
    );

    return !error

  }
  static async getUserCourses(user_id) {


    let [data, error] = await Database.exec(
      `SELECT course.id, name 
            FROM user_course, course 
            WHERE user_course.user_id = $1`,
      [user_id]
    );

    data = data.rows || []
    return [data, error]


  }

  static async isUserInCourse_b(user_id) {


    let [data, error] = await Database.exec(
      `SELECT COUNT(*) FROM user_course WHERE user_id=$1;`,
      [user_id]
    );

    if (error) return false
    if (data.rows[0].count > 0) return true

    return false

  }

  static async createMessage(content, userID, courseID) {


    console.log("Create message: ", content, userID, courseID)

    let somethingsMissing = false
    let missingMessage = "Following fields are missing: ";
    if (!content) { missingMessage += "content, "; somethingsMissing = true; }
    if (!userID) { missingMessage += "userID, "; somethingsMissing = true; }
    if (!courseID) { missingMessage += "courseID, "; somethingsMissing = true; }

    if (somethingsMissing) return [false, missingMessage]


    let [data, error] = await Database.exec(
      `INSERT INTO "message" (content, user_id, course_id) 
            VALUES ($1, $2, $3) RETURNING *`,
      [content, userID, courseID]
    );

    if (!error) {
      data = data.rows[0]
    }
    return [data, error]
  }

  static async getMessagesFromCourse(course_id) {



    let [data, error] = await Database.exec(
      `SELECT * FROM message, "user" 
            WHERE message.user_id = "user".id
            AND message.course_id = $1`,
      [course_id]
    );

    if (error) {
      return [false, "Couldnt get messages."]
    }
    return [data.rows || [], false]

  }


  static async getMessagesFromCourseWithSide(course_id, user_id) {



    let [data, error] = await Database.exec(
      `SELECT message.*, "user".firstname, "user".lastname, "user".email,
            CASE WHEN "user".id = $2 THEN 'right' ELSE 'left' END AS side
            FROM message, "user" 
            WHERE message.user_id = "user".id
            AND message.course_id = $1`,
      [course_id, user_id]
    );

    if (error) {
      return [false, "Couldnt get messages."]
    }
    return [data.rows || [], false]

  }


  static async matchPassword_b(password, hashPassword) {
    const match = await bcrypt.compare(password, hashPassword);
    return match
  };



}



module.exports = { Database, DatabaseUtils }

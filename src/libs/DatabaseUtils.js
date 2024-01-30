const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = null

    static async init() {
        logger.info("Database.init()")


        try {

            this.pool = new Pool({
                user: "SchoolSystem",
                host: "localhost",
                database: "SchoolSystem",
                password: "SchoolSystem",
                port: 5432,
                max: 10,
                idleTimeoutMillis: 30000
            })
        } catch (error) {
            logger.error(error)
        }
    }


    static async exec(inpt, args) {

        logger.info(
            `Database.exec = Prompt: ${inpt} | Args: ${args}`
        )

        try {
            let data = await this.pool.query(inpt, args)
            logger.debug(JSON.stringify(data))
            return [data, null]
        } catch (error) {
            logger.error(error)
            return [null, error]
        }
    }



}

// Error means something unexpected happened
// If createUser failed bc of a missing input, its an error

class DatabaseUtils {

    static async createUser(firstname, lastname, email, password) {
        logger.info(`Create user: ${firstname}, ${lastname}, ${email}, ${password}`)


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

        let res = await Database.exec(
            `DELETE FROM "user" WHERE id=$1`,
            [id]
        );
        if (res.Result.rowCount < 1) res = new Result(true, "No rows delete", false)
        return res
    };


    //Course


    static async createCourse(name, html_markdown_code, creator_id) {


        logger.info("Create course: ", name, html_markdown_code, creator_id)


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




    static async deleteCourse(id) {
        let res = await Database.exec(
            `DELETE FROM "course" WHERE id=$1`,
            [id]
        );
        if (res.Result.rowCount < 1) res = new Result(true, "No rows delete", false)
        return res

    };


    static async updateCourse(creator_id, course_id, name, html_markdown_code) {

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

        const res = await Database.exec(
            cmd
        );

        return res
    };








    static async getCourseByID_o(id) {

        let [data, error] = await Database.exec(
            `SELECT * FROM "course" WHERE id=$1`,
            [id]
        );

        if (error) { data = false }
        return data.rows[0]

    }


    static async userJoinCourse(course_id, user_id) {

        logger.info("User join course: " + course_id + user_id)

        if (!course_id || !user_id) {
            logger.error("input is missing")
            return false
        }

        const [data, error] = await Database.exec(
            `INSERT INTO user_course (user_id, course_id) 
            VALUES ($1, $2)`,
            [user_id, course_id]
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

    static async createMessage(content, userID, courseID) {


        logger.info("Create message: ", content, userID, courseID)

        let somethingsMissing = false
        let missingMessage = "Following fields are missing: ";
        if (!content) { missingMessage += "content, "; somethingsMissing = true; }
        if (!userID) { missingMessage += "userID, "; somethingsMissing = true; }
        if (!courseID) { missingMessage += "courseID, "; somethingsMissing = true; }

        if (somethingsMissing) return new Result(true, missingMessage, false)


        const res = await Database.exec(
            `INSERT INTO "message" (content, user_id, course_id) 
            VALUES ($1, $2, $3) RETURNING *`,
            [content, userID, courseID]
        );
        logger.debug(data.rows[0])
        if (!res.isError) res.Result = res.Result.rows[0]
        return res
    }

    static async getMessagesFromCourse(course_id) {



        const [data, error] = await Database.exec(
            `SELECT * FROM message, "user" 
            WHERE message.user_id = "user".id
            AND message.course_id = $1`,
            [course_id]
        );

        if (error){
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
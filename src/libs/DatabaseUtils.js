const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = null

    static async init() {
        logger.info("Database.init()")


        try {

            this.pool = new Pool({
                user: process.env.DBUSER,
                host: process.env.DBHOST,
                database: process.env.DBDATABASE,
                password: process.env.DBPASSWORD,
                port: process.env.DBPORT,
                max: 10,
                idleTimeoutMillis: 30000
            })
        } catch (error) {
            logger.error(error)
        }
    }


    /**
     * 
     * @param {*} inpt 
     * @param {*} args 
     * @returns [res, null], [null, error]
     */
    static async exec(inpt, args) {

        logger.info("Database.exec('" + inpt + "')")

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


class DatabaseUtils {


    //User

    /**
     * return user object back
     * return false -> error
     */
    static async createUser(firstname, lastname, email, password) {
        logger.info(`Create user:  + ${firstname}, ${lastname}, ${email}, ${password}`)

        if (!firstname || !lastname || !email || !password) {
            logger.error("input is missing")
            return false

        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const [data, error] = await Database.exec(
            `INSERT INTO "user"(firstname, lastname, email, password) VALUES ('` + firstname + `', '` + lastname + `', '` + email + `', '` + hash + `') RETURNING *`
        );

        if (data) {
            return data.rows
        }
        if (error) {
            return error
        }

    }




    static async emailExists(email) {
        const [data, error] = await Database.exec(`SELECT * FROM "user" WHERE email=$1`,
            [email]);

        if (data.rowCount == 0) return false;
        else if (data.rowCount == 1) return true
        else logger.error("emailExists(" + email + ") something went wrong" + JSON.stringify(error))
    };




    static async getUserByEmail(email) {
        const [data, error] = await Database.exec(`SELECT * FROM "user" WHERE email=$1`, [
            email,
        ]);

        if (!data) return error
        else if (error) logger.error("ASD")

        return data.rows[0]

    };

    static async matchPassword(password, hashPassword) {
        const match = await bcrypt.compare(password, hashPassword);
        return match
    };

    static async getUserByID(id) {

        const [data, error] = await Database.exec(
            `SELECT * FROM "user" WHERE id = ` + id
        );
        if (data.rowCount == 0) return false;
        else if (data.rowCount == 1) return data.rows[0];
        else {
            logger.error("getUserByID(" + id + ") something went wrong" + JSON.stringify(error))

        }


    };

    static async deleteUser(id) {

        const [data, error] = await Database.exec(
            `DELETE FROM "user" WHERE id = ` + id
        );

        if (error) return false;
        return true
    };


    //Course


    /**
     * return course object back
     * return false -> error
     */
    static async createCourse(name, html_markdown_code, creator_id) {


        logger.info("Create course: ", name, html_markdown_code, creator_id)

        if (!name || !html_markdown_code || !creator_id) {
            logger.error("input is missing")
            return false

        }


        const [data, error] = await Database.exec(
            `INSERT INTO "course"(name, html_markdown_code, creator_id) VALUES ($1, $2, $3) RETURNING *`,
            [name, html_markdown_code, creator_id]
        );
        if (error) {
            console.error(error)
            return false
        }
        
        return data.rows[0]


    }




    static async deleteCourse(id) {

        const [data, error] = await Database.exec(
            `DELETE FROM "course" WHERE id = ` + id
        );

        if (error) return false;
        return true
    };



    /**
     * return true
     * return false -> error
     */
    static async updateCourse(creator_id, course_id, name, html_markdown_code) {

        if (!name && !html_markdown_code) {
            logger.error("updateCourse name AND html_markdown_code are false")
            return false
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

        if (error) return false;
        return true
    };








    static async getCourseByID(id) {



        const [data, error] = await Database.exec(
            `SELECT * FROM course WHERE id = ` + id
        );


        if (error) {
            logger.error(error)
            return false
        }
        if(data.rowCount == 0) return false

        logger.info("getCourseByID(" + id + ") = " + JSON.stringify(data.rows[0]))
        return data.rows[0]



    }


    static async userJoinCourse(course_id, user_id) {

        logger.info("User join course: "+ course_id+ user_id)

        if (!course_id || !user_id) {
            logger.error("input is missing")
            return false

        }

        logger.debug("userJoinCourse")
        const [data, error] = await Database.exec(
            `INSERT INTO user_course (user_id, course_id) VALUES ('` + user_id + `', '` + course_id + `')`,
        );

        if (error) {
            logger.error(error)
            return false;
        }
        return true;
    }

    /**
     * return [courses]
     * return  [] -> user has no courses
     * return false error
     */
    static async getUserCourses(userID) {


        const [data, error] = await Database.exec(
            `SELECT course_id FROM user_course WHERE user_id = ` + userID
        );

        logger.debug("User Courses")
        logger.debug(data.rows)



        const results = [];

        for (const courseId of data.rows) {
            try {

                results.push(await DatabaseUtils.getCourseByID(courseId.course_id));
            } catch (error) {
                logger.error(`Error fetching data for course ID ${courseId}:`, error);
                return false
            }
        }


        return results;

    }


    /**
     * return false -> error
     * return message object
     */
    static async createMessage(content, userID, courseID) {


        logger.info("Create message: ", content, userID, courseID)

        if (!content || !userID || !courseID) {
            logger.error("input is missing")
            return false

        }

        try {
            const data = await Database.exec(
                `INSERT INTO "message" (content, user_id, course_id) VALUES ($1, $2, $3) RETURNING *`,
                [content, userID, courseID]
            );
            logger.debug(data.rows[0])
            return data.rows[0]

        } catch (error) {
            logger.error(error)
            return false
        }


    }



    /**
     * 
     */
    static async getMessagesFromCourse(course_id) {



        const [data, error] = await Database.exec(
            `SELECT * FROM message WHERE course_id = ` + course_id
        );


        if (data.rowCount == 0) return [];
        logger.debug("getMessagesFromCourse(" + course_id + ") = " + data.rows[0])

        return data.rows;
    }






}



module.exports = { Database, DatabaseUtils }
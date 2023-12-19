const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = null

    static async init() {
        logger.debug("Database.init()")


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



    static async exec(inpt, args) {

        logger.info("Database.exec('" + inpt + "')")

        try {
            let res = await this.pool.query(inpt, args)
            logger.debug(res)
            return res
        } catch (error) {
            logger.error(error)
            return false

        }
    }



}


class DatabaseUtils {


    //User


    static async createUser(firstname, lastname, email, password, id) {
        logger.info("Create user: ", firstname, lastname, email, password, id)

        if (!firstname || !lastname || !email || !password) {
            logger.error("input is missing")
            return false

        }


        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const number = id ? id : await generateRandomID()
        logger.debug("id for " + firstname + " " + lastname + " = " + number)


        try {
            const data = await Database.exec(
                `INSERT INTO "user"(id, firstname, lastname, email, password) VALUES ('` + number + `', '` + firstname + `', '` + lastname + `', '` + email + `', '` + hash + `') RETURNING *`
            );


            logger.debug("response after adding user " + data.rows[0])
            return data.rows[0]

        } catch (error) {
            logger.error(error)
            return false
        }


        async function generateRandomID() {
            let out = false
            let output;
            let number;
            do {
                number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                logger.debug("Trying " + number)

                output = await Database.exec('SELECT COUNT(*) FROM "user" WHERE id = ' + number)
                const count = parseInt(output.rows[0].count)
                if (count == 0) { out = true }
            } while (!out);

            return number
        }
    };

    static async emailExists(email) {
        const data = await Database.exec(`SELECT * FROM "user" WHERE email=$1`, [
            email,
        ]);

        if (data.rowCount == 0) return false;
        return data.rows[0];
    };

    static async matchPassword(password, hashPassword) {
        const match = await bcrypt.compare(password, hashPassword);
        return match
    };

    static async getUserByID(id) {

        const data = await Database.exec(
            `SELECT * FROM "user" WHERE id = ` + id + `;`
        );

        if (data.rowCount == 0) return false;
        return data.rows[0];
    };



    //Course



    static async createCourse(name, html_markdown_code, creator_id, id) {


        logger.info("Create course: ", name, html_markdown_code, creator_id, id)

        if (!name || !html_markdown_code || !creator_id) {
            logger.error("input is missing")
            return false

        }

        const number = id ? id : await generateRandomID()
        logger.debug("id for " + name + " " + creator_id + " = " + number)


        try {
            const data = await Database.exec(
                `INSERT INTO "course"(id, name, html_markdown_code, creator_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [number, name, html_markdown_code, creator_id]
            );
            logger.debug(data.rows[0])
            return data.rows[0]

        } catch (error) {
            logger.error(error)
            return false
        }

        async function generateRandomID() {
            let out = false
            let output;
            let number;
            do {
                number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                logger.debug("Trying " + number)

                output = await Database.exec('SELECT COUNT(*) FROM "course" WHERE id = ' + number)
                const count = parseInt(output.rows[0].count)
                if (count == 0) { out = true }
            } while (!out);

            return number
        }

    }




    static async getCourseByID(id) {



        const data = await Database.exec(
            `SELECT * FROM course WHERE id = ` + id
        );


        if (data.rowCount == 0) return false;
        logger.debug("getCourseByID(" + id  + ") = " + data.rows[0])

        return data.rows[0];
    }


    static async userJoinCourse(course_id, user_id) {

        logger.debug("userJoinCourse")
        const data = await Database.exec(
            `INSERT INTO user_course (user_id, course_id) VALUES ($1, $2);`,
            [user_id, course_id]
        );

        if(!data) return false;

        return data.rows[0];
    }

    static async getUserCourses(userID) {


        const data = await Database.exec(
            `SELECT course_id FROM user_course WHERE user_id = ` + userID
        );

        logger.debug(data.rows)
        if (data.rowCount == 0) return false;


        const results = [];

        for (const courseId of data.rows) {
            try {
                const query = `SELECT * FROM course WHERE id = ` + course.course_id;

                const result = await Database.exec(query);

                results.push(result.rows[0]);
            } catch (error) {
                logger.error(`Error fetching data for course ID ${courseId}:`, error);
            }
        }


        return results;

    }



}



module.exports = { Database, DatabaseUtils }
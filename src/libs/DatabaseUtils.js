const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = null

    static async init() {

        console.group("Database.init()")
        try {


            this.pool = await new Pool({
                user: process.env.DBUSER,
                host: process.env.DBHOST,
                database: process.env.DBDATABASE,
                password: process.env.DBPASSWORD,
                port: process.env.DBPORT,
                max: 10,
                idleTimeoutMillis: 30000
            })

            const data = await this.exec("SELECT;")
            console.info(data)


            if (data.rowCount != 1) {
                new Error("SELECT; didnt expect response")
            }

            return true
        } catch (error) {
            console.error(error)
            return false
        } finally {
            console.groupEnd()

        }

    }



    static async exec(inpt, args) {


        try {
            console.group("Database.exec = " + inpt)
            let res = await this.pool.query(inpt, args)
            return res
        } catch (error) {
            console.error(error)
            return false

        } finally {
            console.groupEnd()

        }
    }



}


class DatabaseUtils {





    static async createUser(firstname, lastname, email, password, id) {

        console.group("DatabaseUtils.createUser()")
        console.info("Create user: ", firstname, lastname, email, password, id)

        if (!firstname || !lastname || !email || !password) {
            console.error("input is missing")
            console.groupEnd()
            return false

        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const number = id ? id : await generateRandomID()

        try {

            const data = await Database.exec(
                `INSERT INTO "user"(id, firstname, lastname, email, password) VALUES ('` + number + `', '` + firstname + `', '` + lastname + `', '` + email + `', '` + hash + `') RETURNING *`
            );

            return data.rows[0]

        } catch (error) {
            console.error(error)
            return false
        } finally {
            console.groupEnd()
        }





        async function generateRandomID() {
            let out = false
            let output;
            let number;
            do {
                number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                console.info("Trying " + number)

                output = await Database.exec('SELECT COUNT(*) FROM "user" WHERE id = ' + number)
                const count = parseInt(output.rows[0].count)
                console.info(number)
                if (count == 0) { out = true }
            } while (!out);

            return number
        }
    };



    static async createCourse(name, html_markdown_code, creator_id, id) {

        console.log("Create course: ", name, html_markdown_code, creator_id, id)

        if (!name || !html_markdown_code || !creator_id) {
            console.log("input is missing")
            return false

        }

        const number = id ? id : await generateRandomID()


        try {
            const data = await Database.exec(
                `INSERT INTO "subject"(id, name, html_markdown_code, creator_id) VALUES ($1, $2, $3, $4) RETURNING *`,
                [number, name, html_markdown_code, creator_id]
            );
            return data.rows[0]

        } catch (error) {
            console.log(error)
            return false
        }


        async function generateRandomID() {
            let out = false
            let output;
            let number;
            do {
                number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
                console.log("Trying " + number)

                output = await Database.exec('SELECT COUNT(*) FROM "subject" WHERE id = ' + number)
                const count = parseInt(output.rows[0].count)
                console.log(number)
                if (count == 0) { out = true }
            } while (!out);

            return number
        }

    }


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


    static async getCourseByID(id) {



        const data = await Database.exec(
            `SELECT * FROM subject WHERE id = ` + id
        );

        console.log(data.rows[0])

        if (data.rowCount == 0) return false;
        return data.rows[0];
    }


    static async userJoinCourse(course_id, user_id) {
        console.log(course_id, user_id)


        const data = await Database.exec(
            `INSERT INTO user_subject (user_id, subject_id) VALUES ($1, $2);`,
            [user_id, course_id]
        );

        console.log(data)

        if (data.rowCount == 0) return false;
        return data.rows[0];
    }

    static async getUserCourses(userID) {


        const data = await Database.exec(
            `SELECT subject_id FROM user_subject WHERE user_id = ` + userID
        );

        console.log(data.rows)
        if (data.rowCount == 0) return false;


        const results = [];

        for (const subjectId of data.rows) {
            try {
                const query = `SELECT * FROM subject WHERE id = ` + subjectId.subject_id;

                const result = await Database.exec(query);

                results.push(result.rows[0]);
            } catch (error) {
                console.error(`Error fetching data for subject ID ${subjectId}:`, error);
            }
        }


        return results;

    }



    static async emailExists(email) {
        const data = await Database.exec(`SELECT * FROM "user" WHERE email=$1`, [
            email,
        ]);

        if (data.rowCount == 0) return false;
        return data.rows[0];
    };
}



module.exports = { Database, DatabaseUtils }
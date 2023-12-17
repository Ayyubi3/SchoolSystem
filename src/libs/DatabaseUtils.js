const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = null

    static async init() {

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
         console.log(error)   
        }
    }



    static async exec(inpt, args) {

        console.log("Database.exec = " + inpt)

        try {
            let res = await this.pool.query(inpt, args)
            //console.log(JSON.stringify(res) + "\n")
            return res
        } catch (error) {
            console.log(error)
            return

        }
    }



}


class DatabaseUtils {



    static async emailExists(email) {
        const data = await Database.exec(`SELECT * FROM "user" WHERE email=$1`, [
            email,
        ]);

        if (data.rowCount == 0) return false;
        return data.rows[0];
    };


    static async createUser(firstname, lastname, email, password, id) {
        console.log("Create user: ", firstname, lastname, email, password, id)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);


        const number = id ? id : await generateRandomID()


        const data = await Database.exec(
            `INSERT INTO "user"(id, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [number, firstname, lastname, email, hash]
        );

        if (data.rowCount == 0) return false;
        return data.rows[0];




        async function generateRandomID() {
            let out = false
            let output;
            let number;
            do {
                number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
                console.log("Trying " + number)

                output = await Database.exec('SELECT COUNT(*) FROM "user" WHERE id = ' + number)
                const count = parseInt(output.rows[0].count)
                console.log(number)
                if (count == 0) { out = true }
            } while (!out);

            return number
        }
    };



    static async createCourse(name, html_markdown_code, creator_id, id) {
        // FIXME: Test if creator id is included
        // FIXME SELECT id FROM "subject" benutzen




        const number = id ? id : await generateRandomID()



        const data = await Database.exec(
            `INSERT INTO "subject"(id, name, html_markdown_code, creator_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [number, name, html_markdown_code, creator_id]
        );

        if (data.rowCount == 0) return false;
        return data.rows[0];



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



}



module.exports = { Database, DatabaseUtils }
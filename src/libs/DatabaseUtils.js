const { Pool } = require("pg")

const bcrypt = require('bcrypt')


class Database {


    static pool = new Pool({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBDATABASE,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT,
        max: 10,
        idleTimeoutMillis: 30000
    })


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


    static async createUser(user) {
        console.log("Create user: ", user)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        

        let out = false
        let output;
        let number;
        do {
            number = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            console.log(number)

            output = await Database.exec('SELECT * FROM "user" WHERE id = ' + number)
            console.log(output.rowCount)
            if(output.rowCount == 0)
            {
                out = true
            }
        } while (!out);


        


        const data = await Database.exec(
            `INSERT INTO "user"(id, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [number, user.firstname, user.lastname, user.email, hash]
        );

        if (data.rowCount == 0) return false;
        return data.rows[0];
    };



    static async createCourse(course)
    {
        // FIXME: Test if creator id is included

        let out = false
        let output;
        let number;
        do {
            number = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            console.log(number)

            output = await Database.exec('SELECT * FROM "subject" WHERE id = ' + number)
            console.log(output.rowCount)
            if(output.rowCount == 0)
            {
                out = true
            }
        } while (!out);


        


        const data = await Database.exec(
            `INSERT INTO "subject"(id, name, html_markdown_code, creator_id) VALUES ($1, $2, $3, $4) RETURNING *`,
            [number, course.name, course.html_markdown_code, course.creator_id]
        );

        if (data.rowCount == 0) return false;
        return data.rows[0];

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


    static async getCourseByID(id)
    {



        const data = await Database.exec(
            `SELECT * FROM subject WHERE id = ` + id
        );

        console.log(data.rows[0])

        if (data.rowCount == 0) return false;
        return data.rows[0];
    }


    static async userJoinCourse(course_id, user_id)
    {
        console.log(course_id, user_id)


        const data = await Database.exec(
            `INSERT INTO user_subject (user_id, subject_id) VALUES ($1, $2);`,
            [user_id, course_id]
        );

        console.log(data)

        if (data.rowCount == 0) return false;
        return data.rows[0];
    }




}



module.exports = { Database, DatabaseUtils }
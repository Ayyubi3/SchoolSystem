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

        console.log("Database.exec = ")

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
        console.log(user)
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        const data = await Database.exec(
            `INSERT INTO "user"(id, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [222222, user.firstname, user.lastname, user.email, hash]
        );

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




}



module.exports = { Database, DatabaseUtils }
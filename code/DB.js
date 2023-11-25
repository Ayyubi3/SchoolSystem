const fs = require("fs")

class DB {
    static Databases = {
        SUBJECTS: "./Subjects.json",
        USERS: "./Users.json"
    };

    static read(Database)
    {
        const elements = JSON.parse(fs.readFileSync(Database))    
        return elements
    }

    static writeAll(Database, obj)
    {
        fs.writeFileSync(Database, JSON.stringify(obj))
    }

    static add(Database, obj)
    {

        const content = this.read(Database)
        content.push(obj)

        this.writeAll(Database, content)
    }

}

module.exports = {DB}



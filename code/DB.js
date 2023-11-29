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

    static add(Database, obj, dupetest)
    {
        
        const content = this.read(Database)


        // Check for duplicates using the dupetest function
        if (dupetest && typeof dupetest === 'function') {
            const isDuplicate = dupetest(obj, content);
            if (isDuplicate) {
                console.log('Duplicate found. Object not added.');
                return;
            }
        } else {
            console.log("No dupetest")
        }

        content.push(obj)

        this.writeAll(Database, content)
    }

}

module.exports = {DB}



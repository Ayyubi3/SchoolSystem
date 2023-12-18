
const {Database, DatabaseUtils} = require("../src/libs/DatabaseUtils")

async function startTest()
{
    console.log("TEST")
    await Database.exec("BEGIN")

    await DatabaseUtils.createUser("Max", "Mustermann", "test@email", "test")
    await DatabaseUtils.createUser("test", "test", "test", "test", 123321)

    const user1 = await DatabaseUtils.getUserByID(123321)
    const user2exists = await DatabaseUtils.emailExists("test@email")

    console.log(user1)
    console.log(user2exists)


    await DatabaseUtils.createCourse("test", "test", 123321, 1231)
    await DatabaseUtils.createCourse("test2", "tes2t", 123321)


    console.log(await DatabaseUtils.getCourseByID(1231))




    await Database.exec("ROLLBACK")
}

module.exports = {startTest}
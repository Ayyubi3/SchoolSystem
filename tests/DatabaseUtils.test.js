const { Database, DatabaseUtils } = require("../src/libs/DatabaseUtils")
require("dotenv").config()



describe("Database Class", () => {

    describe("init", () => {
        test("works", async () => {
            expect(
                await Database.init()
            ).toBe(true)

        })

    })

    describe("exec", () => {
        test("works", async () => {

            await Database.init()
            const data = await Database.exec('SELECT;')
            expect(
                data.rowCount
            ).toBe(1)

        })

    })




})








describe("Database Class", () => {

    describe("Create User works", () => {
        test("if everything is perfect", async () => {
            await Database.init()
            await Database.exec("BEGIN")
            const data = await DatabaseUtils.createUser("test", "test", "test@test", "test")
            expect(
                data
            ).toBeTruthy()

            await Database.exec("ROLLBACK")
        })

        test("if everything is perfect with custom ID", async () => {
            await Database.init()
            await Database.exec("BEGIN")
            const data = await DatabaseUtils.createUser("asd", "asd", "asd@test", "asd", 999999)
            expect(
                data
            ).toBeTruthy()

            await Database.exec("ROLLBACK")
        })

        test("if custom id that is already used added", async () => {

            await Database.init()
            await Database.exec("BEGIN")

            const data = await DatabaseUtils.createUser("test", "test", "test@test", "test", 9999998)
            const data2 = await DatabaseUtils.createUser("test", "test", "test@test2", "test", 999998)

            expect(
                data2
            ).toBe(false)

            await Database.exec("ROLLBACK")
        })

        test("if one of the args is undefined", async () => {
            await Database.init()
            await Database.exec("BEGIN")

            const data = await DatabaseUtils.createUser("test", undefined, "test@test", undefined, 999997)

            expect(
                data
            ).toBe(false)

            await Database.exec("ROLLBACK")


        })

    })




    describe("Create Course works", () => {

        test("if everything is perfect", async () => {
            await Database.init()
            await Database.exec("BEGIN")
            const testuser = await DatabaseUtils.createUser("test", "test", "test@test", "test", 999996)

            const data = await DatabaseUtils.createCourse("test", "test", 999996)
            expect(
                data
            ).toBeDefined()

            await Database.exec("ROLLBACK")
        })
/*
        test("if everything is perfect with custom ID", async () => {
            await Database.init()
            await Database.exec("BEGIN")
            const data = await DatabaseUtils.createUser("test", "test", "test@test", "test", 999999)
            expect(
                data
            ).toBeTruthy()

            await Database.exec("ROLLBACK")
        })

        test("if custom id that is already used added", async () => {

            await Database.init()
            await Database.exec("BEGIN")

            const data = await DatabaseUtils.createUser("test", "test", "test@test", "test", 999999)
            const data2 = await DatabaseUtils.createUser("test", "test", "test@test2", "test", 999999)

            expect(
                data2
            ).toBe(false)

            await Database.exec("ROLLBACK")
        })

        test("if one of the args is undefined", async () => {
            await Database.init()
            await Database.exec("BEGIN")

            const data = await DatabaseUtils.createUser("test", undefined, "test@test", undefined, 999999)

            expect(
                data
            ).toBe(false)

            await Database.exec("ROLLBACK")


        })*/

    })





})




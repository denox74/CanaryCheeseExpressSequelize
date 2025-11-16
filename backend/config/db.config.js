module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "LuZdeKronoS.7474", //
    DB: "cheeses_db",
    dialect: "mysql",
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 1000
    }
}
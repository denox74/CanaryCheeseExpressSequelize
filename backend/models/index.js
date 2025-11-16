// Carga configuración de la base de datos
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// Crea la instancia de Sequelize con los datos de conexión
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

// Objeto contenedor de todos los modelos y de Sequelize
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Registra el modelo Cheese
db.cheeses = require("./cheese.model.js")(sequelize, Sequelize);

// Registra el modelo User
db.user = require("./user.model.js")(sequelize, Sequelize);

// Define la relación: un usuario tiene muchos quesos
db.user.hasMany(db.cheeses, { foreignKey: "userId" });

// Define la relación inversa: un queso pertenece a un usuario
db.cheeses.belongsTo(db.user, { foreignKey: "userId" });

module.exports = db;
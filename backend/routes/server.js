// Carga variables de entorno y dependencias principales
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

// Configuración de CORS para permitir peticiones desde Ionic
var corsOptions = {
  origin: "http://localhost:8100"
};
app.use(cors(corsOptions));

// Configuración de parseo del cuerpo de las peticiones
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión y sincronización de la base de datos
const db = require("./models");
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// Middleware de autenticación (Basic y Bearer JWT)
app.use(function (req, res, next) {
  // Lee la cabecera Authorization
  var token = req.headers['authorization'];
  if (!token) return next();

  // Manejo de autenticación Basic: usuario y contraseña en Base64
  if (req.headers.authorization.indexOf('Basic ') === 0) {
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    req.body.username = username;
    req.body.password = password;

    return next();
  }

  // Manejo de token Bearer JWT
  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user;
      req.token = token;
      next();
    }
  });
});

// Registro de rutas de la API
require("./routes/user.routes")(app);
require("./routes/motorbike.routes")(app);

// Arranque del servidor HTTP
app.listen(port, () => {
  console.log('Server started on: ' + port);
});
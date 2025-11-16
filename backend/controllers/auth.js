// Controlador de autenticación: login y verificación de JWT
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const bcrypt = require('bcryptjs');

const db = require("../models");
const User = db.user;

// Inicio de sesión de usuario (login)
exports.signin = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  // Comprobar que llegan usuario y contraseña
  if (!user || !pwd) {
    return res.status(400).json({
      error: true,
      message: "Username or Password required."
    });
  }

  // Buscar usuario y validar contraseña con bcrypt
  User.findOne({ where: { username: user } })
    .then(data => {
      const result = bcrypt.compareSync(pwd, data.password);
      if (!result) return res.status(401).send('Password not valid!');

      // Generar token y devolver datos limpios de usuario
      const token = utils.generateToken(data);
      const userObj = utils.getCleanUser(data);
      return res.json({ user: userObj, access_token: token });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Middleware para comprobar que el usuario está autenticado
exports.isAuthenticated = (req, res, next) => {
  // Recuperar el token que dejó el middleware principal
  var token = req.token;
  if (!token) {
    return res.status(400).json({
      error: true,
      message: "Token is required."
    });
  }

  // Verificar el token JWT con la clave secreta
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) return res.status(401).json({
      error: true,
      message: "Invalid token."
    });

    // Comprobar que el usuario asociado al token existe
    User.findByPk(user.id)
      .then(data => {
        if (!user.id) {
          return res.status(401).json({
            error: true,
            message: "Invalid user."
          });
        }
        // Usuario válido, continuar con la ruta protegida
        next();
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving User with id=" + user.id
        });
      });
  });
};

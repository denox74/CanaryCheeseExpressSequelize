const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const utils = require("../utils");
const bcrypt = require("bcryptjs");

//
// CONTROLADOR DE USUARIOS
// =======================
//
// Aquí se gestionan:
//  - Registro + login combinado (create)
//  - Listado de usuarios (findAll)
//  - Búsqueda por id (findOne)
//  - Actualización (update)
//  - Búsqueda por username/password (findUserByUsernameAndPassword)  [⚠ ver comentario abajo]
//

// -----------------------------
// Crear usuario / Login (POST)
// -----------------------------
// Si el username ya existe:
//   → comprueba la contraseña y devuelve token (login).
// Si el username NO existe:
//   → crea usuario nuevo, guarda hash de contraseña y devuelve token (registro).
exports.create = (req, res) => {
  // 1) Validar que llegan username y password
  if (!req.body.password || !req.body.username) {
    res.status(400).send({
      message: "Username y password son obligatorios.",
    });
    return;
  }

  // 2) Crear objeto usuario (aún sin guardar en BD)
  let user = {
    password: req.body.password, // de momento en plano; luego se hace hash
    name: req.body.name,
    username: req.body.username,
    isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
  };

  // 3) Buscar si ya existe un usuario con ese username
  User.findOne({ where: { username: user.username } })
    .then((data) => {
      // 3.1) Si el usuario YA existe → tratamos esto como LOGIN
      if (data) {
        // Comprobamos contraseña con bcrypt (password plano vs hash en BD)
        const result = bcrypt.compareSync(user.password, data.password);
        if (!result) return res.status(401).send("Password not valid!");

        // Generar token JWT
        const token = utils.generateToken(data);
        // Limpiar objeto usuario (sin password, etc.)
        const userObj = utils.getCleanUser(data);
        // Devolver datos de usuario + token
        return res.json({ user: userObj, access_token: token });
      }

      // 3.2) Si el usuario NO existe → tratamos esto como REGISTRO
      // Hasheamos la contraseña antes de guardar
      user.password = bcrypt.hashSync(req.body.password);

      // Guardar nuevo usuario en la BD
      User.create(user)
        .then((data) => {
          // Generar token para el nuevo usuario
          const token = utils.generateToken(data);
          const userObj = utils.getCleanUser(data);
          return res.json({ user: userObj, access_token: token });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Error al crear el usuario.",
          });
        });
    })
    .catch((err) => {
      // Error general en la búsqueda del usuario
      res.status(500).send({
        message: err.message || "Error al buscar el usuario.",
      });
    });
};

// -----------------------------
// Obtener todos los usuarios
// -----------------------------
exports.findAll = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al recuperar los usuarios.",
      });
    });
};

// -----------------------------
// Obtener un usuario por ID
// -----------------------------
exports.findOne = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error recuperando el usuario con id=" + id,
      });
    });
};

// -----------------------------
// Actualizar un usuario por ID
// -----------------------------
exports.update = (req, res) => {
  const id = req.params.id;

  // User.update devuelve un número (cantidad de filas afectadas)
  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario actualizado correctamente.",
        });
      } else {
        res.send({
          message: `No se pudo actualizar el usuario con id=${id}. 
Puede que no exista o que req.body esté vacío.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error actualizando el usuario con id=" + id,
      });
    });
};

// ---------------------------------------------
// Buscar usuario por username y password (POST)
// ---------------------------------------------
// ⚠ OJO: ahora mismo esto busca por password en texto plano.
//     Si las contraseñas están hasheadas (bcrypt), esta consulta
//     NO va a encontrar nada. Lo correcto sería:
//       1) buscar por username,
//       2) comparar con bcrypt.compareSync,
//       3) devolver token igual que en create().
//     Déjalo así solo si sabes que la BD guarda la password sin hash.
exports.findUserByUsernameAndPassword = (req, res) => {
  const user = req.body.username;
  const pwd = req.body.password;

  User.findOne({ where: { username: user, password: pwd } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Se ha producido un error al buscar el usuario por username y password.",
      });
    });
};

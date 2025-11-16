// Define las rutas relacionadas con usuarios
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const auth = require("../controllers/auth.js");

  const router = require("express").Router();

  // Crear un nuevo usuario (registro)
  router.post("/", users.create);

  // Obtener todos los usuarios (requiere estar autenticado)
  router.get("/", auth.isAuthenticated, users.findAll);

  // Obtener un usuario por id (requiere estar autenticado)
  router.get("/:id", auth.isAuthenticated, users.findOne);

  // Actualizar un usuario por id (requiere estar autenticado)
  router.put("/:id", auth.isAuthenticated, users.update);

  // Iniciar sesión y obtener token
  router.post("/signin", auth.signin);

  // Monta el router bajo la ruta base /api/users
  app.use('/api/users', router);
};
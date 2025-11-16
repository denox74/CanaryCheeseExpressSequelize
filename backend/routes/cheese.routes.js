// Carga JWT y variables de entorno
require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = app => {
  // Carga el controlador de quesos
  const cheeses = require("../controllers/cheese.controller");
  // Carga configuración de subida de ficheros (multer)
  const upload = require("../multer/upload");

  // Crea el router de Express
  const router = require("express").Router();

  // Middleware de autenticación: verifica el token Bearer y añade req.user
  function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Si no hay cabecera Authorization → 401
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verifica el JWT con la clave secreta
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Error verificando token:', err && err.message);
        return res.status(401).json({ message: 'Token inválido' });
      }

      // Guarda los datos del usuario en la request
      req.user = user;
      next();
    });
  }

  // Crea un queso (con posible subida de fichero), solo para usuario autenticado
  router.post(
    "/",
    authMiddleware,
    (req, res, next) => {
      const contentType = req.headers['content-type'] || '';
      if (contentType.startsWith('multipart/form-data')) {
        return upload.single('file')(req, res, next);
      } else {
        return next();
      }
    },
    cheeses.create
  );

  // Lista todos los quesos del usuario autenticado
  router.get("/", authMiddleware, cheeses.findAll);

  // Obtiene un queso concreto del usuario autenticado
  router.get("/:id", authMiddleware, cheeses.findOne);

  // Actualiza un queso del usuario autenticado (con posible subida de fichero)
  router.put(
    "/:id",
    authMiddleware,
    (req, res, next) => {
      const contentType = req.headers['content-type'] || '';
      if (contentType.startsWith('multipart/form-data')) {
        return upload.single('file')(req, res, next);
      } else {
        return next();
      }
    },
    cheeses.update
  );

  // Elimina un queso del usuario autenticado
  router.delete("/:id", authMiddleware, cheeses.delete);

  // Registra el router bajo /api/cheeses
  app.use("/api/cheeses", router);
};

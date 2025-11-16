// Utilidades para trabajar con JWT y objetos de usuario
var jwt = require('jsonwebtoken');

// Genera un token JWT a partir de un usuario
function generateToken(user) {
  if (!user) return null;

  const u = {
    id: user.id,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
    password: user.password   // ⚠️ en una app real no conviene incluir esto
  };

  return jwt.sign(u, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 // 24 horas
  });
}

// Devuelve un objeto de usuario simplificado
function getCleanUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    isAdmin: user.isAdmin,
    password: user.password   // ⚠️ idem, solo para la práctica
  };
}

// Exporta las funciones de utilidad
module.exports = {
  generateToken,
  getCleanUser
};
// Carga los modelos y extrae el modelo Cheese
const db = require("../models");
const Cheese = db.cheeses;
const Op = db.Sequelize.Op;

// Crea y guarda un nuevo queso asociado al usuario autenticado
exports.create = (req, res) => {
  // Comprueba que hay usuario en la request (token decodificado)
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  // Valida datos mínimos
  if (!req.body.name || !req.body.curation) {
    res.status(400).send({ message: "El nombre y la curación son obligatorios" });
    return;
  }

  // Construye el objeto queso, enlazándolo al usuario
  const cheese = {
    name: req.body.name,
    curation: req.body.curation,
    weight: req.body.weight,
    origen: req.body.origen,
    filename: req.file ? req.file.filename : "",
    userId: req.user.id              // <--- vínculo con el usuario
  };

  // Guarda el queso en la base de datos
  Cheese.create(cheese)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Error creando queso:", err && err.message);
      res.status(500).send({ message: "Algún error en la base de datos" });
    });
};

// Recupera todos los quesos del usuario autenticado
exports.findAll = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  Cheese.findAll({
    where: { userId: req.user.id }     // <--- solo los del usuario
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.error("Error listando quesos:", err && err.message);
      res.status(500).send({ message: "Algún error en la base de datos" });
    });
};

// Recupera un único queso perteneciente al usuario autenticado
exports.findOne = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  const id = req.params.id;

  Cheese.findOne({
    where: {
      id: id,
      userId: req.user.id            // <--- que sea suyo
    }
  })
    .then(data => {
      if (data) res.send(data);
      else res.status(404).send({ message: "Queso no encontrado" });
    })
    .catch(err => {
      console.error("Error recuperando queso:", err && err.message);
      res.status(500).send({ message: "Error recuperando el queso" });
    });
};

// Actualiza un queso del usuario autenticado
exports.update = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  const idQueso = req.params.id;
  const updateData = {};

  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.curation !== undefined) updateData.curation = req.body.curation;
  if (req.body.weight !== undefined) updateData.weight = req.body.weight;
  if (req.body.origen !== undefined) updateData.origen = req.body.origen;
  if (req.file && req.file.filename) updateData.filename = req.file.filename;

  console.log("Update request headers content-type:", req.headers["content-type"]);
  console.log("Update req.file:", req.file);
  console.log("UpdateData to apply:", updateData);

  Cheese.update(updateData, {
    where: {
      id: idQueso,
      userId: req.user.id           // <--- solo si es suyo
    }
  })
    .then(result => {
      if (result[0] == 1) {
        Cheese.findByPk(idQueso).then(updated => {
          if (updated) {
            console.log("Update succeeded, returning updated record id=", idQueso);
            res.send(updated);
          } else {
            res.send({ message: "Queso actualizado correctamente." });
          }
        }).catch(err => {
          console.error("Error fetching updated cheese:", err && err.message);
          res.send({ message: "Queso actualizado correctamente." });
        });
      } else {
        res
          .status(404)
          .send({ message: "No se encontró el queso o no se pudo actualizar." });
      }
    })
    .catch(err => {
      console.error("Update error:", err && err.message);
      res.status(500).send({ message: "Error actualizando el queso." });
    });
};

// Elimina un queso del usuario autenticado
exports.delete = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Usuario no autenticado" });
  }

  const id = req.params.id;

  Cheese.destroy({
    where: {
      id: id,
      userId: req.user.id           // <--- solo si es suyo
    }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Queso eliminado correctamente." });
      } else {
        res.status(404).send({ message: "No se encontró el queso." });
      }
    })
    .catch(err => {
      console.error("Delete error:", err && err.message);
      res.status(500).send({ message: "Error eliminando el queso." });
    });
};

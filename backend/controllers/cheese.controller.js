const db = require("../models");
const Cheese = db.cheeses;
const Op = db.Sequelize.Op;

// Create an Save a new Cheese
exports.create = (req, res) => {
    //Validate request
    if (!req.body.name || !req.body.curation) {
        res.status(400).send({ message: "content cannot be empty" })
        return
    }
    //Create a Cheese
    const chesse = {
        name: req.body.name,
        curation: req.body.curation
    };

    //Save cheese in the database
    Cheese.create(chesse).then(data => {
        res.send(data);
    }).catch( err => {
        res.status(500).send({ message: "some error en db"});
    })

};

// Retieve all Cheeses from the database.
exports.findAll = (req, res) => {
    Cheese.findAll().then((data) => {
        res.send(data);
    }).catch( err => {
        res.status(500).send({ message: "some error en db"});
    })
};

// Find a single Cheese from the database.
exports.findOne = (req, res) => {
};

// Update a Cheese byh the id in the request
  exports.update = (req, res) => {
  const idQueso = req.params.id;
  Cheese.update(req.body, { where: { id: idQueso } })
    .then(result => {
  if (result[0] == 1) {
    res.send({ message: "Queso actualizado correctamente." });
  } else {
    res.status(404).send({ message: "No se encontró el queso o no se pudo actualizar." });
  }
})
    .catch(err => {
      res.status(500).send({ message: "Error actualizando el queso." });
    });
};

// Delete a Cheese with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Cheese.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Queso eliminado correctamente." });
      } else {
        res.status(404).send({ message: "No se encontró el queso." });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error eliminando el queso." });
    });
};
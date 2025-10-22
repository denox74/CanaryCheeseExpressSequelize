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
        curation: req.body.curation,
        weight: req.body.weight,
        origen: req.body.origen,
        filename: req.file ? req.file.filename : ""
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
  const id = req.params.id;
  Cheese.findByPk(id).then(data => {
    if (data) res.send(data);
    else res.status(404).send({ message: 'Cheese not found' });
  }).catch(err => {
    res.status(500).send({ message: 'Error retrieving cheese' });
  });
};

// Update a Cheese byh the id in the request
  exports.update = (req, res) => {
  const idQueso = req.params.id;
  // Build update payload: pick fields from body and file
  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.curation !== undefined) updateData.curation = req.body.curation;
  if (req.body.weight !== undefined) updateData.weight = req.body.weight;
  if (req.body.origen !== undefined) updateData.origen = req.body.origen;
  if (req.file && req.file.filename) updateData.filename = req.file.filename;
  console.log('Update request headers content-type:', req.headers['content-type']);
  console.log('Update req.file:', req.file);
  console.log('UpdateData to apply:', updateData);

  Cheese.update(updateData, { where: { id: idQueso } })
    .then(result => {
      if (result[0] == 1) {
        // Return the updated object so client can immediately show changes (including filename)
        Cheese.findByPk(idQueso).then(updated => {
          if (updated) {
            console.log('Update succeeded, returning updated record id=', idQueso);
            res.send(updated);
          } else {
            res.send({ message: "Queso actualizado correctamente." });
          }
        }).catch(err => {
          console.error('Error fetching updated cheese:', err && err.message);
          res.send({ message: "Queso actualizado correctamente." });
        });
      } else {
        res.status(404).send({ message: "No se encontró el queso o no se pudo actualizar." });
      }
    })
    .catch(err => {
      console.error('Update error:', err && err.message);
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
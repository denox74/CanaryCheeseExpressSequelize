module.exports = app => {
    const cheeses = require("../controllers/cheese.controller");

    const router = require("express").Router();

    router.post("/", cheeses.create);
    router.get("/", cheeses.findAll);
    router.put("/:id", cheeses.update);
    router.delete("/:id", cheeses.delete);

    app.use("/api/cheeses", router);
};
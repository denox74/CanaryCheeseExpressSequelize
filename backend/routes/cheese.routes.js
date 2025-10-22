module.exports = app => {
    const cheeses = require("../controllers/cheese.controller");

    const upload = require("../multer/upload");

    const router = require("express").Router();

    // Use multer only for multipart/form-data requests (file uploads).
    router.post("/", (req, res, next) => {
        const contentType = req.headers['content-type'] || '';
        if (contentType.startsWith('multipart/form-data')) {
            return upload.single('file')(req, res, next);
        } else {
            return next();
        }
    }, cheeses.create);
    router.get("/", cheeses.findAll);
    router.get("/:id", cheeses.findOne);
    // allow multer for PUT when multipart/form-data
    router.put("/:id", (req, res, next) => {
        const contentType = req.headers['content-type'] || '';
        if (contentType.startsWith('multipart/form-data')) {
            return upload.single('file')(req, res, next);
        } else {
            return next();
        }
    }, cheeses.update);
    router.delete("/:id", cheeses.delete);

    app.use("/api/cheeses", router);
};
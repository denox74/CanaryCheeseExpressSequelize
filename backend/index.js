const express = require("express");
const cors = require("cors");
const app = express();

//app.use(cors());
app.use(cors({ origin: "http://localhost:8100" })); 
// parse requests of content-type -application/json
app.use(express.json());


// parse requests of content-type - application/x-www-form-urlencoded

app.use(express.urlencoded({ extended: true }));

const db = require("./models");
// normal use. Doesn't delete the database data
// db.sequelize.sync();

// In development, you may need to drop existing tables and re-sync database
db.sequelize.sync({force: false}).then(()=> {
    console.log("Database synced (no data loss).")
});


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a tu quesería canaria." });
});

require("./routes/cheese.routes")(app);

app.get("/cheeses/", (req, res) => {
  res.json({ message: "Más quesos por aqui." });
});

require("./routes/cheese.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
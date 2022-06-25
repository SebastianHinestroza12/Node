const express = require('express');
const { create } = require("express-handlebars");
const session = require("express-session");
const flash = require("connect-flash");
//configuracion variables de entorno
require('dotenv').config();
// importando nuestra db
require('./database/db.js');

const app = express();

app.use(session({
  secret: 'keyboard-secret',
  resave: false,
  saveUninitialized: false,
  name: 'secret-name'
}));

app.use(flash());

app.get("/mensaje-flash", (req, res) => {
  res.json(req.flash("mensaje"));
});

app.get("/campos-validados", (req, res) => {
  req.flash("mensaje", "todos los campos fueron validados");
  res.redirect("/mensaje-flash");
});


const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"]
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");



app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}))
app.use("/", require('./routes/home'));
app.use("/auth", require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Servidor Andando😎 '  +  PORT));


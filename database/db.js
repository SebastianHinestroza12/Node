const mongoose = require('mongoose');

mongoose.connect(process.env.URI)
  .then(() => console.log(' DB Connect😉'))
  .catch((e) => console.log('Fallo la conexion ' + e));
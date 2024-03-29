const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl,editarUrl,editarUrlForm,redireccionamiento} = require('../controllers/homeController')
const validate  = require('../middleware/validateUrl');
const verificarUser = require('../middleware/verificarUser');
const router = express.Router();

router.get("/", verificarUser, leerUrls);
router.post("/", validate, agregarUrl)
router.get("/eliminar/:id", eliminarUrl)
router.get("/editar/:id", editarUrlForm)
router.post("/editar/:id", validate, editarUrl)
router.get("/:shortURL", redireccionamiento)


module.exports = router 
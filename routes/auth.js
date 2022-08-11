const express = require('express');
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authController');
const { body } = require('express-validator')
const router = express.Router();


router.get('/register', registerForm)

router.post('/register', [

  body('userName', 'ingrese un nombre valido').trim().notEmpty().escape(), 
  body('email', 'ingrese un email valido').trim().isEmail().normalizeEmail(), 
  body('password', 'ingrese un password valida').trim().isLength({ min: 5 }).escape().custom((value, { req}) =>  { 
    if (value !== req.body.repetir_password) {
      throw new Error('no coinciden las contraseñas')
    }
    else return value;


  })
  

], registerUser)

router.get('/confirmarCuenta/:tokenConfirmation', confirmarCuenta)
router.get('/login', loginForm)
router.post('/login', [
  body('email', 'ingrese un email valido').trim().isEmail().normalizeEmail(),
  body('password', 'La password debe tener mas de 7 caracteres').trim().isLength({ min: 8}
  ).escape()
], loginUser)

router.get('/logout',  cerrarSesion)



module.exports = router;



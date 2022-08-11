const User = require("../models/User");
const { nanoid } = require('nanoid');
const { validationResult } = require('express-validator');

const registerForm = (req, res) => {
  res.render('register', { 'mensajes': req.flash('mensajes')})
}

const registerUser = async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('mensajes', errors.array());
    return res.redirect('/auth/register');
  }

  const { userName, email, password } = req.body;

  try {
    let user = await User.findOne({ email })
    if (user) throw new Error('Ya existe el usuario')

    user = new User({ userName, email, password, tokenConfirmation: nanoid() });

    await user.save();
    // enviar correo electronico
    req.flash('mensajes', [{ msg: 'revisa tu correo electronico y valida tu cuenta' }]);

    res.redirect('/auth/login');
  }
  catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/auth/register');
  }
};


const confirmarCuenta = async (req, res) => {
  const { tokenConfirmation } = req.params;

  try {
    const user = await User.findOne({ tokenConfirmation });

    if (!user) throw new Error(`No existe este usuario`)
    else {
      user.cuentaConfirmada = true;
      user.tokenConfirmation = null;

      await user.save();
    }

    req.flash('mensajes', [{ msg: 'cuenta verificada, puedes iniciar sesion' }]);
    res.redirect('/auth/login');

  } catch (error) {
    req.flash('mensajes', [{ msg: error.message }]);
    return res.redirect('/auth/login'); 
  }
};


const loginForm = (req, res) => {
  res.render('login', {mensajes: req.flash('mensajes')})

}

/**
 * Toma el correo electrónico y la contraseña del cuerpo de la solicitud, encuentra al usuario en la
 * base de datos, compara la contraseña y, si es correcta, inicia la sesión del usuario.
 */
const loginUser = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) { 
    req.flash('mensajes', errors.array());
    return res.redirect('/auth/login');
  }
  
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('no existe el usuario')

    if (!user.cuentaConfirmada) throw new Error('falta confirmar la cuenta')

    if (!(await user.comparePassword(password))) throw new Error('password incorrect');

   /* Una función de pasaporte que crea una sesión para el usuario. */
    req.login(user, (err) => {
      if (err) throw new Error('error ala crear la sesion')
      return res.redirect('/')
    })

  } catch (error) {
    // console.log(error)
    req.flash('mensajes', [{msg : error.message}]);
    return res.redirect('/auth/login');
    // res.send(error.message)

  }
};

const cerrarSesion = (req, res) => { 
  req.logout(() => { 

    return res.redirect('/auth/login');
  })
}

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
  cerrarSesion
}
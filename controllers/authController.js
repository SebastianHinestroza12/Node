const User = require("../models/User");
const { nanoid } = require('nanoid');

const registerForm = (req, res) => {
  res.render('register')
}

const registerUser = async (req, res) => {
  console.log(req.body)

  const { userName, email, password } = req.body;

  try {
    let user = await User.findOne({ email })
    if (user) throw new Error('Ya existe el usuario')
    
    user = new User({ userName, email, password, tokenConfirmation: nanoid() });
    
    await user.save();
    // enviar correo electronico
    res.redirect('/auth/login');
  }
  catch (error) {
    res.json({ error: error.message })
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

    res.redirect('/auth/login');

  } catch (error) {
    res.json({ error: error.message })
  }
};


const loginUser = async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('no existe el usuario')

    if (!user.cuentaConfirmada) throw new Error('falta confirmar la cuenta')
    
    if (!user.comparePassword(password)) throw new Error('password incorrect');
    
    res.redirect('/')
    
  } catch (error) {
    console.log(error)
    res.send(error.message)
    
  }
};



const loginForm = (req, res) => { 
  res.render('login')

}
module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser
}
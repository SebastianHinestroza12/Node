const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcryptjs  = require('bcryptjs')


const userSchema = new Schema({
  userName: {
    type: String,
    lowercase: true,
    required: true
  },

  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    index: { unique: true }
  },

  password: {
    type: String,
    required: true,
  },

  tokenConfirmation: {
    type: String,
    default: null
  },
  cuentaConfirmada: {
    type: Boolean,
    default: false
  }
});


userSchema.pre('save', async function (next) { 
  const user = this
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(user.password, salt);

    user.password = hash;
    next();

  } catch (error) {

    // validar si falla la encriptacion de la password
    console.log(error);
    throw new Error("error al codificar la contraseña");
  }
})

userSchema.methods.comparePassword = async function (cantidadPassword) { 
  return await bcryptjs.compare(cantidadPassword, userSchema.password);
}
module.exports = mongoose.model('User',userSchema);
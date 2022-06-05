const Url = require('../models/Url')
const { nanoid} = require('nanoid');

const leerUrls = async (req, res) => {
  try {
    const urls =  await Url.find().lean()
    res.render("home", { urls })
  }
  catch (e) { 
    console.log(e)
    res.send('hubo un fallo')
  }
  
};

const agregarUrl = async (req, res) => {

  const { origin } = req.body;
  try {
    const url = new Url({ origin: origin, shortURL: nanoid(9) })
    await url.save()
    res.redirect('/');
  }
  catch(e) { 
    console.log(e);
    res.send('error, hubo un fallo')
  }
}

const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    await Url.findByIdAndDelete(id);
    res.redirect('/')
  }
  catch (e) {
    console.log(e);
    res.send('error, hubo un fallo')
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    console.log(url);
    res.render("home", {url });
  } catch (error) {
    console.log(error);
  }
};

const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findByIdAndUpdate(id, {origin}).lean();
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
};

const redireccionamiento = async (req, res) => { 
  const { shortURL } = req.params
  try {
    const urlDB = await Url.findOne({ shortURL: shortURL})
    res.redirect(urlDB.origin)
  }
  catch (e) { 
    console.log(e)
  }
}
module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redireccionamiento
}
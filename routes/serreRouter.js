const express = require('express');
const Model = require('../models/user');
const Serre = require('../models/serre');


const serreRouter = express.Router()

module.exports = serreRouter;

//////ROUTE POUR LA SERRE/////


serreRouter.post('/postSerre', async (req, res) => {


  const {temp,
    hum,
    sol,
    lum} = req.body;

  const users = [];

  let dateInsertion = new Date();
  const newUser = Serre({
    temp,
    hum,
    sol,
    lum,
    dateInsertion
  });

  try {

    await newUser.save();

    res.status(201).json(newUser);

  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})



serreRouter.get('/serre', async (req, res) => {
    try {
        const data = await Serre.find();
        res.json(data)
      }
      catch (error) {
        res.status(500).json({ message: error.message })
      }
})


serreRouter.get('/serre/:id', async (req, res) => {
  try {
    const data = await Serre.findById(req.params.id);
    return res.json(data)
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

//Methode pour la modification d'un utilisateur
serreRouter.patch('/serreUpdate/:id',  async (req, res) => {
  const { matin, soir } = req.body;

  try {

    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Model.findByIdAndUpdate(id, updatedData, options)

     // Comparer l'ancien mot de passe avec le mot de passe haché dans la base de données
    //  const passwordMatch = await bcrypt.compare(oldPassword, result.password);
     if (!result) {
       return res.status(404).json({ message: 'Not found' });
     }
    await result.save();

    return res.status(200).json({ message: 'Insertion reussie' });
  
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})
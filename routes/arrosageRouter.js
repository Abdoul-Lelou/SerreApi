const express = require('express');
const Arrosage = require('../models/arrosage');


const arrosageRouter = express.Router()

module.exports = arrosageRouter;

//////ROUTE POUR LA SERRE/////


arrosageRouter.post('/postArrosage', async (req, res) => {


  const {matin,soir,dureMatin,dureSoir} = req.body;

  const users = [];

  let dateInsertion = new Date();
  const arrosageData = Arrosage({
    matin,
    soir,
    dureMatin,
    dureSoir
  });

  try {

    await arrosageData.save();
    return res.status(201).json(arrosageData);

  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})



arrosageRouter.get('/arrosage', async (req, res) => {
    try {
        const data = await Arrosage.find();
        res.json(data)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
})


arrosageRouter.patch('/updateArrosage/:id',  async (req, res) => {
  const {matin,soir,dureMatin,dureSoir} = req.body;
console.log(req.body);
  try {

    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Arrosage.findByIdAndUpdate(id, updatedData, options)

     // Comparer l'ancien mot de passe avec le mot de passe haché dans la base de données
    //  const passwordMatch = await bcrypt.compare(oldPassword, result.password);
     if (!result) {
       return res.status(404).json({ message: 'Systeme arrosage introuvable' });
     }

     // Hacher le nouveau mot de passe
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    // result.password = hashedPassword;
    await result.save();

    return res.status(200).json({ message: 'Modifier avec succès' });
  
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

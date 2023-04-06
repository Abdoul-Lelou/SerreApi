const express = require('express');
const Arrosage = require('../models/arrosage');


const arrosageRouter = express.Router()

module.exports = arrosageRouter;

//////ROUTE POUR LA SERRE/////


arrosageRouter.post('/postArrosage', async (req, res) => {


  const {matin,soir} = req.body;

  const users = [];

  let dateInsertion = new Date();
  const arrosageData = Arrosage({
    matin,
    soir
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

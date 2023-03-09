const express = require('express');
const Model = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var fs = require('fs');
var path = require('path');
const check = require("../middleware/middleware");

const router = express.Router()

module.exports = router;



router.post("/login", async (req, res, next) => {
    
    let { email, password } = req.body;

    let existingUser;
 
    existingUser = await Model.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).send("email doesn't exist...!");
    }else if(existingUser.etat == false){
      return res.status(401).send("user is disabled...!");
    }
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).send("password is invalid");
    }


    let token;
    try {
      //Creating jwt token
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
          process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    } catch (err) {
      console.log(err);
      const error = new Error("Erreur! Quelque chose s'est mal passée.");
      return next(error);
    }
   
    res
      .status(200)
      .json({
        success: true,
        data: {
          userId: existingUser.id,
          email: existingUser.email,
          nom: existingUser.nom,
          prenom: existingUser.prenom,
          token: token,
        },
      });
});


//Post Method
router.post('/post',   async(req, res) => {


try {

    res.json("post");

} catch(error) {
    res.status(400).json({message: error.message})
}

})

//Get all Method
router.get('/getAll', async(req, res) => {
    try{        
        
        res.json('get')
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', async(req, res) => {
   
    res.json('getById')
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        
           return res.send("update");
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id',check, async(req, res) => {
    try {
       
        res.send("delete")
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
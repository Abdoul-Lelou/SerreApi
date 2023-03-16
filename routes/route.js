const express = require('express');
const Model = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const check = require("../middleware/middleware");

const router = express.Router()

module.exports = router;



router.post("/login", async (req, res, next) => {
    
    let { email, password } = req.body;

    let existingUser;
 
    existingUser = await Model.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).send("email doesn't exist...!");
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
   
   return res
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


  const { email, password, prenom, nom} = req.body;

  const users = [];
  
  const newUser = Model({
      email,
      password, 
      prenom, 
      nom
  });
  
  try {
  
      const oldUser = await Model.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("Email Already Exist. Please Login");
      }
  
      const hash = await bcrypt.hash(newUser.password, 10);
      newUser.password = hash;
      users.push(newUser);
      // res.json(newUser);
      await newUser.save();
  
      res.status(201).json(newUser);
  
  } catch(error) {
      res.status(400).json({message: error.message})
  }

})

//Get all Method
router.get('/getAll',check, async(req, res) => {
  try{        
    const data = await Model.find();
    res.json(data)
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
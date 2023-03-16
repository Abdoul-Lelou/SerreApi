const express = require('express');
const Model = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const check = require("../middleware/middleware");

const router = express.Router()

module.exports = router;


// La connexion par formulaire
router.post("/login", async (req, res, next) => { // Async pour dire que la connexion ne dépend d'aucun processus 
    // On Récupère l'email et le mot de passe contenus dans la requete
    let { email, password } = req.body; 

    let existingUser;

// Retrouve l'email saisi dans la base de données et stocke ça dans existingUser
    existingUser = await Model.findOne({ email: email }); 
    if (!existingUser) 
    { // si l'email ne s'y trouve pas donne le message
      return res.status(400).send("email doesn't exist...!");
    }

    // On sort de if donc ça suppose que l'email existe
    //On vérifie maintenant si le mot de passe est correct ou pas
// Comparaison entre le mot de passe saisi et celui se trouvant dans la base de données
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) { // Le mot de passe n'est pas le bon
      return res.status(400).send("password is invalid");
    }

    // Maintenant que tout est bon (email et mot de passe correctes), on genere un token

    let token;
    try {  // Essaye de faire ceci ...
      //Creating jwt token
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email }, // id et email de la personne connectée
          process.env.JWT_SECRET, // cette clé secrète se trouve dans le fichier .env
        { expiresIn: "1h" } // delai d'expiration du token
      );
    } catch (err) {  // Informe-moi avec un message s'il y'a problème
      console.log(err);
      const error = new Error("Erreur! Quelque chose s'est mal passée!");
      return next(error);
    }
   // Si la tentative de connexion s'est bien déroullée, on envoi une réponse
   // avec les informations (id, email, nom, prenom et un token)
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
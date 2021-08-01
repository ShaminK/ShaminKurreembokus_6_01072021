const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");


const sauceRoutes = require('./routes/sauce');
const userRoute = require('./routes/user');

mongoose.connect('mongodb+srv://MyFirstDatabaseAdmin:9L8ve0gkkocU2VGh@cluster0.ryxut.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(helmet());

// Cross Origin Ressource Sharing -> permet a différents serveurs de communiquer entre-elles (LH3000 et LH4200)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');  //d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');    //d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');    //d'envoyer des requêtes avec les méthodes mentionnées
    next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoute);


// Exporter  l'application express pour qu'on puisse y accerde depuis les autre fichier (serveur node)
module.exports = app;
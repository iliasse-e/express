const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/dyma?authSource=admin')
    .then(() => console.log('Connexion to db OK'))
    .catch(() => console.error('Connexion to db KO'));

const jsonParser = express.json();

app.use(morgan('dev'));

app.param('from', (req, res, next, value, name) => {
    console.log(value, name);
    next();
})

app.post('/user/:from-:to', jsonParser, (req, res) => {
    res.send('Hello ' + req.body.name + ' ! ' + 'You are going from ' + req.params.from + ' to ' + req.params.to);
})

app.listen(3000)
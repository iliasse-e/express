const express = require('express');
const morgan = require('morgan');
const app = express();

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
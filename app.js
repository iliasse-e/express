const express = require('express');
const morgan = require('morgan');
const app = express();

const jsonParser = express.json();
app.use(morgan('dev'));


app.post('/', jsonParser, (req, res) => {
    res.send('Hello ' + req.body.name);
})

app.listen(3000)
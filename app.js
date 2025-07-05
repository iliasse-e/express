const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('<p>une string</p>'); // Définit le content-type html à partir du contenu de l'argument
    // res.set({'Content-Type': 'application/json'}) // Force le content-type
});

app.listen(3000)
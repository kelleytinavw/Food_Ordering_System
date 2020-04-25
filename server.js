//node setup test, no significance to project
console.log('food ordering management system');

//express setup
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

//local server
app.listen(3000, function() {
    console.log('Listening on 3000...') 
});

//read
app.use(express.static("website"));

app.post('#', (req, res) => {
    console.log('req.body')
})
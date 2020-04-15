//node setup test, no significance to project
console.log('food ordering management system');

//express setup
const express = require('express');
const app = express();

//local server
app.listen(3000, function() {
    console.log('listening on 3000')
});

//test read
app.get('/', (req, res) => {
    res.send('Food Ordering Management System');
})
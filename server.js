//node setup test, no significance to project
console.log('food ordering management system')

//express setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect('mongodb+srv://adrian:csc570@cluster0-onki1.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true })
.then (client => {
    console.log('Connected to Database')
    const db = client.db('menu')

    //local server
    app.listen(3000, function() {
        console.log('Listening on 3000...') 
    })

    //read
    app.use(express.static("website"))

    app.post('#', (req, res) => {
        console.log('req.body')
    })
})
.catch(error => console.error(error))


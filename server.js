//node setup test, no significance to project
console.log('food ordering management system')

//express setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

const sqlite3 = require('sqlite3').verbose()

let rdb = new sqlite3.Database('./sqlDB.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(error)
    }
    console.log('Connected to SQLite Database')
})

//test query
rdb.serialize(() => {
    rdb.each(`SELECT first_name AS f_name, 
                cust_email AS email 
                FROM Customer
                ORDER BY first_name`, (err, row) => {
        if (err) {
            console.error(error)
        }
        console.log(row.f_name + "\t" + row.email)
    })
})

rdb.close((err) => {
    if (err) {
        return console.error(error);
    }
    console.log('SQLite Database Connection Closed')
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))


MongoClient.connect('mongodb+srv://adrian:csc570@cluster0-onki1.mongodb.net/test?retryWrites=true&w=majority', {
    useUnifiedTopology: true })
.then (client => {
    console.log('Connected to Database')
    const db = client.db('menu-database')
    const menuCollection = db.collection('menus')
    

    //local server
    app.listen(3000, function() {
        console.log('Listening on 3000...') 
    })

    //read
    app.use(express.static("website"))

    app.post('/menu', (req, res) => {
        menuCollection.insertOne(req.body)
        .then(result => {
            console.log(result)
        })
        .catch(error => console.error(error))
    })

    app.get('/', (req, res) => {
        const cursor = db.collection('menus').find().toArray()
        .then(results => {
            console.log(cursor)
        })
        .catch(error => console.error(error))
    })
})
.catch(error => console.error(error))


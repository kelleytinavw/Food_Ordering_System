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
        return console.error(err.message)
    }
    console.log('Connected to SQLite Database')
})


//test query
rdb.serialize(() => {
    /*
    rdb.each(`SELECT first_name AS f_name, 
                cust_email AS email 
                FROM Customer
                ORDER BY first_name`, (err, row) => {
        if (err) {
            console.error(err.message)
        }
        console.log(row.f_name + "\t" + row.email)
    })
*/

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/add-payment-info.html', (req, res) => {
    let rand_id = Math.floor(Math.random() * 10000)
    let account_data = [rand_id, req.body.first_name, req.body.last_name, req.body.email, req.body.street_address, req.body.phone_number, req.body.password]
    console.log('account data added')
    rdb.run(`INSERT INTO Customer(cust_id, first_name, last_name, cust_email, cust_address, phone, cust_pass)
        VALUES(?, ?, ?, ?, ?, ?, ?)`, account_data,
        (err, row) => {
            if (err) {
                return console.error(err.message)
            }
            res.redirect(303, './add-payment-info.html') 
        })
})

app.post('/account-created.html', (req, res) => {
    console.log('Insertion Successful')
    res.redirect(303, './account-created.html')
    })

})
/*
rdb.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('SQLite Database Connection Closed')
})
*/

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


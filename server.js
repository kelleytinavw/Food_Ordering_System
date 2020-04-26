//node setup test, no significance to project
console.log('food ordering management system')

//express setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
let rand_id = 0
let rand_pay_id = 0
let user_id = 0

const sqlite3 = require('sqlite3').verbose()

let rdb = new sqlite3.Database('./sqlDB.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to SQLite Database')
})


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
    rand_id = Math.floor(Math.random() * 10000)
    let sql = `INSERT INTO Customer(cust_id, first_name, last_name, cust_email, cust_address, phone, cust_pass)
    VALUES(?, ?, ?, ?, ?, ?, ?)`
    let account_data = [rand_id, req.body.first_name, req.body.last_name, req.body.email, req.body.street_address, req.body.phone_number, req.body.password]
    console.log('account data added')
    rdb.run(sql, account_data,
        (err, row) => {
            if (err) {
                return console.error(err.message)
            }
            res.redirect(303, './add-payment-info.html') 
        })
})

app.post('/account-created.html', (req, res) => {
    rand_pay_id = Math.floor(Math.random() * 20000)
    let sql = `INSERT INTO Payment(payment_id, name, card_num, card_expDate, card_zip_code, card_name, cust_id)
    VALUES(?, ?, ?, ?, ?, ?, ?)`
    let payment_data = [rand_pay_id, req.body.name, req.body.card_num, req.body.card_exp_month + "/" + req.body.card_exp_year, req.body.zipCode, req.body.card_name, rand_id]
    rdb.run(sql, payment_data,
        (err, row) => {
            if (err) {
                return console.error(err.message)
            }
            console.log('Insertion Successful')
            res.redirect(303, './account-created.html')
        })
    
})

app.post('/index.html', (req, res, next) => {
    let sql = `SELECT * FROM Customer WHERE cust_email = "${req.body.email}" AND cust_pass = "${req.body.password}"`
    let isAccount

    rdb.all(sql, (err, rows) => {
        rows.forEach((row) => {
            if (row.cust_email == req.body.email && row.cust_pass == req.body.password) {
                isAccount = true
            }
            else {
                isAccount = false
            }
        })
        if (isAccount == true) {
            res.redirect('/index.html')
        }
        else {
            res.redirect('/create-account.html')
        }
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


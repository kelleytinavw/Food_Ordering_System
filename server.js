//express setup
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
let rand_id = 0
let rand_pay_id = 0
let rand_rest_id = 0

let current_id = 0
let current_vendor_id = 0

app.use(bodyParser.urlencoded({ extended: true }))

//read

app.use(express.static('website'))

//local server
app.listen(3000, function() {
    console.log('Listening on 3000...') 
})


app.get('/', (req, res) => {
    res.send('WHAT IS GOING ON')
})


const sqlite3 = require('sqlite3').verbose()

let rdb = new sqlite3.Database('./sqlDB.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to SQLite Database')
})

app.set('view engine', 'ejs')

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
            current_id = rand_id
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

app.post('/home.html', (req, res, next) => {
    let sql = `SELECT * FROM Customer WHERE cust_email = "${req.body.email}" AND cust_pass = "${req.body.password}"`
    let isAccount

    rdb.all(sql, (err, rows) => {
        rows.forEach((row) => {
            if (row.cust_email == req.body.email && row.cust_pass == req.body.password) {
                current_id = row.cust_id
                isAccount = true
            }
            else {
                isAccount = false
            }
        })
        if (isAccount == true) {
            res.redirect('/home.html')
        }
        else {
            res.redirect('/failed-login-redirect.html')
        }
    })

    
})

app.post('/rest-created.html', (req, res) => {
    rand_rest_id = Math.floor(Math.random() * 10000)
    let sql = `INSERT INTO Restaurant(rest_id, franchise_id, rest_name, rest_address, rest_pass)
    VALUES(?, ?, ?, ?, ?)`
    let rest_data = [rand_rest_id, req.body.franchise_id, req.body.rest_name, req.body.street_address, req.body.password]
    console.log('restaurant data added')
    rdb.run(sql, rest_data,
        (err, row) => {
            if (err) {
                return console.error(err.message)
            }
            current_vendor_id = rand_rest_id
            res.redirect(303, './rest-created.html') 
        })
})

app.post('/vendors_home.html', (req, res, next) => {
    let sql = `SELECT * FROM Restaurant WHERE franchise_id = "${req.body.franchise_id}" AND rest_pass = "${req.body.password}"`
    let isAccount

    rdb.all(sql, (err, rows) => {
        rows.forEach((row) => {
            if (row.franchise_id == req.body.franchise_id && row.rest_pass == req.body.password) {
                current_vendor_id = row.rest_id
                isAccount = true
            }
            else {
                isAccount = false
            }
        })
        if (isAccount == true) {
            res.redirect('/vendors_home.html')
        }
        else {
            res.redirect('/failed-login-vendor-redirect.html')
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
    console.log('Connected to MongoDB Server')
    const db = client.db('menu-database')
    const menuCollection = db.collection('menus')

    /*
    app.post('/rest-created.html', (req, res) => {
        sql = `SELECT rest_name FROM Restaurant WHERE rest_id = "${current_vendor_id}"`
        let rest_name = ""
        rdb.get(sql, (err, row) => {
            console.log(row.rest_name)
            rest_name = row.rest_name
        })
        menuCollection.insert({ restaurant: rest_name, menu: [] })
    })
*/

    app.post('/item-added.html', (req, res) => {
        menuCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/item-added.html')
        })
        .catch(error => console.error(error))
    })
})
.catch(error => console.error(error))
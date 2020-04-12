var express = require('express')
var fileup = require('express-fileupload')
var mysql = require('mysql')
var parser = require('body-parser')
var path = require('path')
var fs = require('fs')

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_honshou'
})

con.connect()

const apps = express()
apps.use(parser.json())
apps.use(parser.urlencoded({ extended: false }))
apps.use(fileup())
apps.use(express.static(path.join(__dirname)))
apps.set('views', __dirname)
apps.set('view engine', 'ejs')

apps.get('/create', function (req, res) {
    res.render('create')    
})
apps.post('/save', function (req, res) {
    var file = req.files.gambar
    var name = file.name
    var arr = {
        'judul_anime': req.body.judul,
        
    }
    console.log(arr)
    // if (!file) {
    //     con.query(`INSERT INTO tb_anime`)
    // } else {
        
    // }   
})

apps.listen(8000)
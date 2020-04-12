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
        judul_anime: con.escape(req.body.judul),
        studio: con.escape(req.body.studio),
        musim_rilis: con.escape(req.body.musim),
        tanggal_rilis: con.escape(req.body.tanggal),
        gambar: con.escape(name)
    }
    file.mv(__dirname+'/upload/'+name)
    con.query(`INSERT INTO tb_anime SET ?`, arr, function (err, results) {
            if (err) throw err
        res.redirect('/')      
    })
})
apps.get('/', function (req, res) {
    con.query(`SELECT * FROM tb_anime`, function (err, results) {
        res.render('index', { data: results })
    })
})

apps.listen(8000)
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
        judul_anime: req.body.judul,
        studio: req.body.studio,
        musim_rilis: req.body.musim,
        tanggal_rilis: req.body.tanggal,
        gambar: name
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
apps.get('/edit/:id', function (req, res) {
    con.query(`SELECT * FROM tb_anime WHERE id_anime=${con.escape(req.params.id)}`, function (err, results) {
            if (err) throw err
        res.render('edit', { data: results })
    })    
})

apps.get('/delete/:id', function (req, res) {
    con.query(`SELECT gambar FROM tb_anime WHERE id_anime=${con.escape(req.params.id)}`, function (err, results) {
        results.forEach(element => {
            fs.unlinkSync(__dirname+'/upload/'+element.gambar)
        });
    })
    con.query(`DELETE FROM tb_anime WHERE id_anime=${con.escape(req.params.id)}`, function (err, results) {
        res.redirect('/')      
    })
})

apps.listen(8000)
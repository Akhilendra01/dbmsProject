const mysql=require('mysql2');
const express=require('express');
const path = require('path');
const methodOverride = require('method-override');
const { randomUUID } = require('crypto');

const app=express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Example@2022#",
    database:"projectdb"
});

db.connect(err=>{
    if(err)console.log(err);
    else console.log('connected');
})

app.post('/home', (req, res) => {
    const data = req.body;
    let id=Math.ceil(Math.random()*50)+5;

    var sql = `insert into store values (${id}, '${data.location}');`;

    db.query(sql, (err, data) => {
        console.log('success');
        res.redirect('/home');
    });
});

app.get('/home', (req, res)=>{
    var sql = `select * from store`;
    db.query(sql, (err, data) => {
        res.render('home', {data: data});
        // console.log('success');
    });
});

app.get('/newStore', (req, res)=>{
    res.render('newStore');
})

app.get('/store/:id', (req, res)=>{
    const {id}=req.params;
    var sql=`select * from available natural join games where ${id}=store_id`;
    db.query(sql, (err, data)=>{
        // console.log(data);
        res.render('store', {data});
    });
});

app.listen(3000, ()=>{
    console.log('Listening to port 3000');
});
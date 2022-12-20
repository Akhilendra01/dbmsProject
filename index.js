const mysql=require('mysql2');
const express=require('express');
const path = require('path');
const methodOverride = require('method-override');

const app=express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// db connection
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

// adds a new store at home page
app.post('/home', (req, res) => {
    const data = req.body;
    let id=Math.ceil(Math.random()*50)+5;

    var sql = `insert into store values (${id}, '${data.location}');`;

    db.query(sql, (err, data) => {
        console.log('success');
        res.redirect('/home');
    });
});


// adds a new game in a store and also in games table if required
app.post('/store/:id', (req, res)=>{
    const data=req.body;
    const {id: store_id}=req.params;
    var sql1 =`select count(game_id) as cnt from games where game_id=${data.game_id};`
    var sql2=`insert into games values (${+data.game_id}, "${data.name}", ${+data.price}, "${data.category}");`;
    var sql3=`insert into available values (${+data.game_id}, ${store_id}, ${+data.copies_aval});`
    console.log(sql2+sql3);
    db.query(sql1, (err, data)=>{
        // console.log(data[0].cnt);
        if(data[0].cnt==0){
            db.query(sql2, (err, data)=>{
                console.log(data);
            });
        }
        db.query(sql3, (err, data)=>{});
        res.redirect('/home');
    });
});

// adds a new customer to database
app.post('/newCustomer', (req, res)=>{
    const data=req.body;
    var sql=`insert into customer values (${+data.cust_id}, "${data.name}");`;
    db.query(sql, (err, data)=>{});
    res.redirect('/home');
});

// renders home page
app.get('/home', (req, res)=>{
    var sql = `select * from store`;
    db.query(sql, (err, data) => {
        res.render('home', {data: data});
        // console.log('success');
    });
});


// renders form to add new store
app.get('/newStore', (req, res)=>{
    res.render('newStore');
});


// renders information about a store
app.get('/store/:id', (req, res)=>{
    const {id}=req.params;
    var sql=`select * from available natural join games where ${id}=store_id`;
    db.query(sql, (err, data)=>{
        // console.log(data);
        res.render('store', {data: data, id: id});
    });
});

// renders form to add a new game to a store
app.get('/store/:id/addNewGame', (req, res)=>{
    const {id}=req.params;
    res.render('addNewGame', {id});
});

app.get('/newCustomer', (req, res)=>{
    res.render('newCustomer');
});

app.listen(3000, ()=>{
    console.log('Listening to port 3000');
});
const mysql=require('mysql2');
const express=require('express');
const path = require('path');
const methodOverride = require('method-override');

const app=express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// db connection
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"TesterO1$5+#",
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
    // console.log(sql2+sql3);
    db.query(sql1, (err, data)=>{
        // console.log(data[0].cnt);
        const count=data[0].cnt;
        if(!count){
            db.query(sql2, (err, data)=>{
                // console.log(data);
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

//rent a game
app.post('/rent', (req, res)=>{
    const data=req.body;
    // console.log(data);

    var sql1 = `insert into rent values (${data.cust_id}, ${data.game_id}, ${data.store_id}, "${data.Date_out}", "${data.Date_in}")`;
    var sql2= 
     `update available 
      set copies_aval=copies_aval-1
      where game_id=${data.game_id} and store_id=${data.store_id};`;

    db.query(sql1, (err, data)=>{});
    db.query(sql2, (err, data)=>{});

    res.redirect('/home');
});

// return a game
app.post('/return', (req, res)=>{
    const data=req.body;

    var sql1=
    `update available
        set
            copies_aval=copies_aval+1
        where
            game_id=${data.game_id} and store_id=${data.store_id};
    `;

    var sql2=
    `delete from rent where 
        game_id=${data.game_id} and store_id=${data.store_id} and cust_id=${data.cust_id};
    `;

    db.query(sql1, (err, data)=>{});
    db.query(sql2, (err, data)=>{});

    res.redirect('/home');

    // console.log(data);
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
    var sql1=`select location from store where store_id=${id};`;
    var dat;
    db.query(sql1, (err, data)=>{
        dat=data;
    });
    db.query(sql, (err, data)=>{
        res.render('store', {data: data, id: id, location: dat[0].location});
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

app.get('/store/:store_id/rent/:game_id', (req, res)=>{
    const {store_id, game_id}= req.params;
    var sql=`select copies_aval from available where store_id=${store_id} and game_id=${game_id}`;

    db.query(sql, (err, data)=>{
        if(data[0].copies_aval==0){
            res.send('No Copies left');
        }
        else{
            res.render('rent', { store_id, game_id });
        }
    });
});

app.get('/store/:store_id/return/:game_id', (req, res)=>{
    const { store_id, game_id } = req.params;
    res.render('return', { store_id, game_id }); 
});

app.get('/info/:game_id', (req, res)=>{
    const {game_id}= req.params;
    var sql=`select * from games where game_id=${game_id}`;
    db.query(sql, (err, data)=>{
        res.render('info', {data: data[0]});
    });
});

app.listen(3000, ()=>{
    console.log('Listening to port 3000');
});
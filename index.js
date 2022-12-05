const mysql=require('mysql2');
const express=require('express');
const path = require('path');
const methodOverride = require('method-override');

const app=express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Example@2022#",
    database:"projectDB"
});

db.connect(err=>{
    if(err)console.log(err);
    else console.log('connected');
})

var sql=`create table test(i int)`;
db.query(sql, (err, res)=>{
    return console.log('Success');
})
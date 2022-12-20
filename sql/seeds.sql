show databases;
create database projectDB;

use projectdb;

create table store(
store_id int primary key,
location varchar(30));

create table games(
game_id int primary key,
name varchar(20),
price int,
category varchar(20));

create table available(
game_id int ,foreign key (game_id) references games(game_id),
store_id int, foreign key(store_id) references store(store_id),
copies_aval int,
primary key (game_id,store_id));

create table customer(
cust_id int primary key,
name varchar(20));

create table rent(
cust_id int, foreign key (cust_id) references customer(cust_id),
game_id int, foreign key(game_id) references games(game_id),
store_id int, foreign key(store_id) references store(store_id),
Date_in date,
Date_out date);

insert into store values
(1, "Delhi"),
(2, "Mumbai"),
(3,"Bhopal");

insert into games values
(21, "COD",1400, "action"),
(25, "far-cry",1600,"oper-world"),
(14,"NFS" ,1000,"race"),
(12,"gta 5",2000,"open-world");

insert into available values
(21,1,5),
(25,1,7),
(14,1,2),
(12,1,5),
(21,2,0),
(25,2,1),
(14,2,0),
(12,2,6),
(21,3,1),
(25,3,5),
(14,3,1),
(12,3,0);

insert into customer values
(11,"kanishk"),
(13,"Akhilendra"),
(15,"Ram"),
(20,"Mohan");

insert into rent values
(11,25,1,"2022-12-05", "2022-12-07"),
(13,14,2,"2022-07-01","2022-09-07"),
(15,21,3,"2022-11-20","2022-11-30"),
(20,25,1,"2022-11-05","2022-11-12"),
(11,12,1,"2022-06-09","2022-06-22");



use projectdb;
select count(game_id) as cnt from games where game_id=21;
// this is it
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');

// set up connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',

  database: 'nodesql',
});

// connect
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database !!!');
});

const app = express();

// middleWare
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Express veikia normaliai');
});

// create database
app.get('/createdb', (req, res) => {
  const sql = 'CREATE DATABASE nodesql';
  db.query(sql, (err, result) => {
    if (err) throw err;
    // no errors
    console.log(result);
    res.send('nodesql duomenu baze sukurta');
  });
});

// create table
app.get('/table/create', (req, res) => {
  const sql = `
  CREATE TABLE posts(
	id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.send(err.stack);
      throw err;
    }
    console.log(result);
    res.json({ msg: 'lentele sukurta', result });
  });
});

// add new post
app.get('/newpost', (req, res) => {
  const newPost = { title: 'Third post title', body: 'Third post body' };
  const sql = 'INSERT INTO posts SET ?';
  db.query(sql, newPost, (err, result) => {
    if (err) throw err.stack;
    res.json({ msg: 'irasas sukurtas', result });
  });
});

// get all posts

app.get('/allposts', (req, res) => {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// get single post dynamically
app.get('/post/:id', (req, res) => {
  const sql = `SELECT * FROM posts WHERE id = ${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// update post

app.get('/post/:id/update', (req, res) => {
  // from form returns udated title
  const newTitle = 'Updated Title';
  const sql = `UPDATE posts SET title = ${db.escape(
    newTitle
  )} WHERE id = ${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.redirect('/allposts');
  });
});

app.listen('3200', console.log('Server running, port 3200'));

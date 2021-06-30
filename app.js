// this is it
const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const path = require('path');

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
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'static')));

// app.get('/', (req, res) => {
//   //   res.send('Express veikia normaliai');
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
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
app.post('/newpost', (req, res) => {
  console.log('req.body', req.body);

  const newPost = { title: 'Third post title', body: 'Third post body' };
  const sql = 'INSERT INTO posts SET ?';
  db.query(sql, req.body, (err, result) => {
    if (err) throw err.stack;
    res.redirect('/allposts');
    // res.json({ msg: 'irasas sukurtas', result });
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

// delete post
app.get('/post/:id/delete', (req, res) => {
  const sql = `DELETE FROM posts WHERE id =${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json({ delete: 'success', result });
  });
});

// get ids and titles
app.get('/post-ids', (req, res) => {
  const sql = 'SELECT id, title FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err.stack;
    res.json(result);
  });
});

// AUTHORS
//create authors table
app.get('/authors/table/create', (req, res) => {
  const sql = `
    CREATE TABLE authors(
      au_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        name VARCHAR(25) NOT NULL,
        age INT(2) NOT NULL,
        sex VARCHAR(10) NOT NULL,
        post_id INT  NOT NULL,
        PRIMARY KEY (au_id)
    )`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'table author success' });
  });
});

//get all authors

app.get('/authors', (req, res) => {
  const sql = 'SELECT * FROM authors';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//add new author
app.post('/authors/new', (req, res) => {
  const sql = 'INSERT INTO authors SET ?';
  db.query(sql, req.body, (err, result) => {
    if (err) throw err.stack;
    console.log(result);
    res.redirect('/');
  });
});

app.get('/author/:id', (req, res) => {
  const sql = `SELECT * FROM authors WHERE au_id = ${db.escape(req.params.id)}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

// get author ant posts
app.get('/authors-and-posts', (req, res) => {
  const sql = `
    SELECT posts.title, authors.name, authors.age
    FROM posts
    INNER JOIN authors
    ON posts.id = authors.post_id
    `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'author and post merge created' });
  });
});

// PRODUCS

// Create product table
app.get('/products/table/create', (req, res) => {
  const sql = `
  CREATE TABLE \`nodesql\`.\`products\` ( 
    \`pro_id\` INT(2) NOT NULL AUTO_INCREMENT , 
    \`product_name\` VARCHAR(30) NOT NULL , 
     
    \`price\` INT(2) NOT NULL , 
    \`quantity\` INT(2) NOT NULL , 
    \`category\` VARCHAR(30) NOT NULL ,
   
    \`created_at\` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
    PRIMARY KEY (\`pro_id\`)) ENGINE = InnoDB;
  `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'product table created' });
  });
});
// Create product_categories table
app.get('/products-categories/table/create', (req, res) => {
  const sql = `
    CREATE TABLE \`nodesql\`.\`products_categories\` ( 
      \`id\` INT(2) NOT NULL AUTO_INCREMENT , 
      \`name\` VARCHAR(30) NOT NULL , 
      \`product_id\` INT(2) NOT NULL  ,      
      \`created_at\` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
      PRIMARY KEY (\`id\`)) ENGINE = InnoDB;
      
    `;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'product_categories table created' });
  });
});
//get all prod cat

app.get('/product-categories', (req, res) => {
  const sql = 'SELECT * FROM products_categories';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

// CREATE 3 CAT HOME, OUTDOORS, GARDEN
app.get('/products-categories/table/create/new', (req, res) => {
  console.log('req.body', req.body);

  const newCategory = { name: 'GARDEN', product_id: '1' };
  const sql = 'INSERT INTO products_categories SET ?';
  db.query(sql, newCategory, (err, result) => {
    if (err) throw err.stack;
    //   res.redirect('/allposts');
    res.json({ msg: 'irasas sukurtas', result });
  });
});

app.listen('3200', console.log('Server running, port 3200'));

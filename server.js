// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

db.defaults({ books:[],users:[]})
  .write();
app.get('/',function(req,res){
  res.render('index.pug');
})
app.get('/books',function(req,res){
  var books = db.get('books').value();
  res.render('./books/books.pug',{
    books: books
  })
})
app.get('/books/create',function(req,res){
  res.render('./books/create.pug')
})
app.post('/books/create',function(req,res){
  req.body.id = db.get('books').value().length+1;
  db.get('books').push(req.body).write();
  res.redirect('/books');
  
})
app.get('/books/:id/update',function(req,res){
  res.render('./books/update.pug');
})
app.get('/books/:id/delete',function(req,res){
  var id = parseInt(req.params.id);
  var book = db.get('books').find({id: id}).value();
  res.render('./books/delete.pug',{
    book: book
  })
})
app.get('/users',function(req,res){
    var users = db.get('users').value();
    res.render('./users/users.pug',{
      users: users
    })
  })
app.get('/users/create',function(req,res){
    res.render('./users/create.pug')
  })
 app.get('/users/:id/update',function(req,res){
    res.render('./users/update.pug');
  })
app.get('/users/:id/delete',function(req,res){
    var id = parseInt(req.params.id);
    var user = db.get('users').find({id: id}).value();
    res.render('./users/delete.pug',{
      user: user
    })
  })

app.post('/books/:id/update',function(req,res){
  var id = parseInt(req.params.id);
  db.get('books').find({id: id}).assign({description: req.body.description}).write();
  res.redirect('/books');
})
app.post('/books/:id/delete',function(req,res){
  var id = parseInt(req.params.id);
  db.get('books').remove({id: id}).write();
  res.redirect('/books');
})

  app.post('/users/create',function(req,res){
    req.body.id = db.get('users').value().length+1;
    db.get('users').push(req.body).write();
    res.redirect('/users');
    
  })
app.post('/users/:id/update',function(req,res){
    var id = parseInt(req.params.id);
    db.get('users').find({id: id}).assign({phoneNumber: req.body.phoneNumber}).write();
    res.redirect('/users');
  })
app.post('/users/:id/delete',function(req,res){
    var id = parseInt(req.params.id);
    db.get('users').remove({id: id}).write();
    res.redirect('/users');
  })
// https://expressjs.com/en/starter/basic-routing.html
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

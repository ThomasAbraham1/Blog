//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://thomas:5OA7xZnGONhxiH6V@cluster0.pqaf5xj.mongodb.net/blog', { useNewUrlParser: true });
const homeText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

app.use(bodyParser.urlencoded({ extended: true }));  
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, './public')));
app.use(express.static('./public'));


const postSchema = {
  postTitle: String,
  postContent: String,
}

const blogUsersSchema = {
  name: String,
  blogs: [postSchema],
}

const Post = new mongoose.model('Post', postSchema);

const post = new Post({
  postTitle: "Final Stage",
  postContent: "Hello darkness my old friend",
});



app.get('/', function (req, res) {
  // Selecting all the records from the database
  Post.find({}).then(function (posts) {
    res.render('home', { homeText: homeText, posts: posts });
  });
});

app.post('/', function (req, res) {
  var postTitle = req.body.postTitle;
  var postContent = req.body.postContent;
  // Storing the post values into database variables
  const post = new Post({
    postTitle: postTitle,
    postContent: postContent,
  });
  // Saving into the database
  post.save().then(function(){
    res.redirect('/');
  });
});

app.get('/compose', function (req, res) {
  res.render('compose.ejs');
});


app.get("/posts/:post", function (req, res) {
  var postTitle = req.params.post;
  Post.findOne({ postTitle: postTitle }).then(function (post) {
    res.render('post.ejs', { postTitle: post.postTitle, postContent: post.postContent });
  });
});

app.listen(port, function (req, res) {
  console.log("Runnging your app on port " + port);
});
/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: _________MD SAJIDUR RAHMAN_____________ Student ID: _____115695207_________ Date: _____1/31/2023___________
 *
 *  Online (Cyclic) Link: ________________________________________________________
 *
 ********************************************************************************/

var blog = require("./blog-service.js");
var express = require("express");
var app = express();

var path = require("path");

var HTTP_PORT = process.env.PORT || 8080;

function start() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path (http://localhost)
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.redirect("/about");
});

app.use(express.static("public"));
app.get("/about", function (req, res) {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.use(express.static("public"));
app.get("/blog", function (req, res) {
  blog
    .getPublishedPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});

app.use(express.static("public"));
app.get("/posts", function (req, res) {
  blog
    .getAllPosts()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});

app.use(express.static("public"));
app.get("/categories", function (req, res) {
  blog
    .getCategories()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send({ message: err });
    });
});

app.all("*", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "/data/Error.jpg"));
});

blog
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, start);
  })
  .catch((err) => {
    console.log(err);
  });

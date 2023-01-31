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

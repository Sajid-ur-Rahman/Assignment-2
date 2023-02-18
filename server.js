/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: _________MD SAJIDUR RAHMAN_____________ Student ID: _____115695207_________ Date: _____2/18/2023___________
 *
 *  Online (Cyclic) Link:
 *  https://outstanding-pear-giraffe.cyclic.app
 *
 ********************************************************************************/

var blog = require("./blog-service.js");
var express = require("express");
var app = express();

var path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: "dboqoihuy",
  api_key: 961783648495689,
  api_secret: "_o1fNNfyTMaiuk_eGS91gv0qgzU",
  secure: true,
});

const upload = multer();

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
  const category = req.query.category;
  const minDate = req.query.minDate;
  if (category) {
    blog
      .getPostsByCategory(category)
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  } else if (minDate) {
    blog
      .getPostsByMinDate(minDate)
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  } else
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
app.get("/post/:id", (req, res) => {
  blog
    .getPostById(req.params.id)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
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

app.use(express.static("public"));
app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/addPost.html"));
});

blog
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, start);
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.static("public"));
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
  }

  upload(req)
    .then((uploaded) => {
      req.body.featureImage = uploaded.url;

      blog
        .adPost(req.body)
        .then((data) => {
          //console.log(data);
          res.redirect("/posts");
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.all("*", function (req, res) {
  res.status(404).sendFile(path.join(__dirname, "/data/Error.jpg"));
});

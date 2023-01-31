var fs = require("fs");
var posts = [];
var categories = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile("./data/posts.json", "utf-8", (err, data) => {
      if (err) reject("Unable to read file");
      else {
        posts = JSON.parse(data);
        fs.readFile("./data/categories.json", "utf-8", (err, data) => {
          if (err) reject("Unable to read file");
          else {
            categories = JSON.parse(data);
            resolve("Initialization successful!");
          }
        });
      }
    });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    if (posts.length == 0) reject("Nothing is found");
    else resolve(posts);
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    const truePublish = posts.filter((pub) => pub.published == true);
    // console.log(truePublish.length););
    if (truePublish.length > 0) resolve(truePublish);
    else reject("No such result found!");
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    if (categories.length == 0) reject("Nothing is found");
    else resolve(categories);
  });
};

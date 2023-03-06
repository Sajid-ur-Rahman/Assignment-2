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

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    const truePublish = posts.filter(
      (pub) => pub.published == true && pub.category == category
    );
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

module.exports.getPostsByCategory = (category) => {
  return new Promise((resolve, reject) => {
    var PostsByCategory = posts.filter((post) => post.category == category);
    PostsByCategory.length == 0
      ? reject("No posts found")
      : resolve(PostsByCategory);
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);

    const postsByMinDate = posts.filter(
      (post) => new Date(post.postDate) >= minDate
    );

    postsByMinDate.length == 0
      ? reject("No posts found")
      : resolve(postsByMinDate);
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    const getId = posts.filter((post) => post.id == id);
    getId.length == 0 ? reject("No posts found") : resolve(getId);
  });
};

module.exports.adPost = function (postData) {
  return new Promise((resolve, reject) => {
    if (postData) {
      postData.published = postData.published == undefined ? false : true;
      postData.id = posts.length + 1;
      postData.postDate = new Date().toISOString().slice(0, 10);
      posts.push(postData);
      // posts.push({
      //   id: posts.length,
      //   body: postData.body,
      //   title: postData.title,
      //   postDate: postData.postDate,
      //   category: postData.category,
      //   featureImage: postData.featureImage,
      //   published: postData.published,
      // });
      resolve(postData);
    } else {
      reject("Invalid");
    }
  });
};

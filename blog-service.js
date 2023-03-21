// var fs = require("fs");
// var posts = [];
// var categories = [];

const Sequelize = require("sequelize");
var sequelize = new Sequelize(
  "ncutvmhn",
  "ncutvmhn",
  "X5LFD0wxNgW4ogvkVFwDhlIT4tqgwlsP",
  {
    host: "mouse.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

var Category = sequelize.define("category", {
  category: Sequelize.STRING,
});

var Post = sequelize.define("post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

Post.belongsTo(Category, { foreignKey: "categoryId" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(() => {
        console.log("Connection Successful");
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((posts) => {
        if (posts) resolve(posts);
        else reject("no results returned");
      })
      .catch(() => reject("no results returned"));
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
      },
    })
      .then((posts) => {
        if (posts) resolve(posts);
        else reject("no results returned");
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        published: true,
        category: category,
      },
    })
      .then((posts) => {
        if (posts) {
          resolve(posts);
        } else {
          reject("no results return");
        }
      })
      .catch(() => {
        reject("no results return");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((categories) => {
        if (categories) {
          resolve(categories);
        } else {
          reject("no results returned");
        }
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByCategory = (categoryId) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        category: categoryId,
      },
    })
      .then((posts) => {
        if (posts) resolve(posts);
        else reject("no results returned");
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = (minDateStr) => {
  return new Promise((resolve, reject) => {
    const { gte } = Sequelize.Op;
    Post.findAll({
      where: {
        postDate: {
          [gte]: new Date(minDateStr),
        },
      },
    })
      .then((posts) => {
        if (posts) resolve(posts);
        else reject("no results returned");
      })
      .catch(() => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = (id) => {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        id: id,
      },
    })
      .then((post) => {
        if (post) {
          resolve(post[0]);
        } else {
          reject("no results found");
        }
      })
      .catch(() => reject("no results found"));
  });
};

module.exports.adPost = function (postData) {
  postData.published = postData.published ? true : false;

  for (let prop in postData) {
    if (postData[prop] === "") {
      postData[prop] = null;
    }
  }
  postData.postDate = new Date();

  return new Promise((resolve, reject) => {
    Post.create(postData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("unable to create post");
      });
  });
};
module.exports.addCategory = function (categoryData) {
  for (let prop in categoryData) {
    if (categoryData[prop] === "") {
      categoryData[prop] = null;
    }
  }

  return new Promise((resolve, reject) => {
    Category.create(categoryData)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject("Unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function (ctgId) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: ctgId,
      },
    })
      .then((ctgDeleted) => {
        if (ctgDeleted == 0) reject("Category not found");
        else resolve("Category successfully deleted");
      })
      .catch((err) => reject(err));
  });
};

module.exports.deletePostById = function (pstId) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: pstId,
      },
    })
      .then((pstDeleted) => {
        if (pstDeleted == 0) reject("Post not found");
        else resolve("Post successfully deleted");
      })
      .catch((err) => reject(err));
  });
};

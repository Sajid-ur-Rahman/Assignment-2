var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema({
  userName: String,
  password: String,
  email: String,
  loginHistory: [
    {
      dateTime: Date,
      userAgent: String,
    },
  ],
});
let User;

module.exports.initialize = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://Sajid2022:oM6vayNQ4FEs22OS@sajidfirstcluster.qx8ulrk.mongodb.net/Web322App"
    );

    db.on("error", (err) => {
      console.log("Mongo Error");
      reject(err); // reject the promise with the provided error
    });
    db.once("open", () => {
      User = db.model("users", userSchema);
      resolve();
    });
  });
};

module.exports.registerUser = function (userData) {
  return new Promise((resolve, reject) => {
    if (userData.password !== userData.password2) {
      reject("Passwords do not match");
    } else {
      bcrypt
        .hash(userData.password, 10)
        .then((hash) => {
          let newUser = new User({
            userName: userData.userName,
            password: hash,
            email: userData.email,
          });
          newUser
            .save()
            .then(function () {
              resolve();
            })
            .catch(function (err) {
              if (err.code === 11000) {
                reject("User Name already taken");
              } else {
                console.log(err);
                reject("There was an error creating the user: " + err);
              }
            });
        })
        .catch((err) => {
          reject("There was an error encrypting the password");
        });
    }
  });
};

module.exports.checkUser = function (userData) {
  return new Promise(function (resolve, reject) {
    User.find({ userName: userData.userName })
      .then(function (users) {
        if (users.length === 0) {
          reject("Unable to find user: " + userData.userName);
        } else {
          bcrypt
            .compare(userData.password, users[0].password)
            .then(function (result) {
              if (!result) {
                reject("Incorrect Password for user: " + userData.userName);
              } else {
                users[0].loginHistory.push({
                  dateTime: new Date().toString(),
                  userAgent: userData.userAgent,
                });
                User.updateOne(
                  { userName: users[0].userName },
                  { $set: { loginHistory: users[0].loginHistory } }
                )
                  .then(() => {
                    resolve(users[0]);
                  })
                  .catch(function (err) {
                    reject("There was an error verifying the user: " + err);
                  });
              }
            })
            .catch(function (err) {
              reject("There was an error verifying the user: " + err);
            });
        }
      })
      .catch(function (err) {
        reject("Unable to find user: " + userData.userName);
      });
  });
};

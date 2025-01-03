const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please enter Username and password" });
  }

  const user = users.find((user) => user.username === username);

  if (user) {
    // Create a token using a secret key
    let token = jwt.sign({ username }, "accessToken");

    // Store the token in the session
    req.session.authorization = { accessToken: token };

    return res.status(200).json({
      message: "User logged in successfully",
      user: { username }
    });
  } else {
    return res.status(400).json({ message: "User not registered" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "Please enter a review" });
  }

  const findBook = Object.values(books).find((book) => book.isbn === isbn);

  if (findBook) {
    const username = req.user.username;

    findBook.reviews[username] = review;

    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: findBook.reviews
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const findBook = Object.values(books).find((book) => book.isbn === isbn);

  if (findBook) {
    const username = req.user.username;

    if (findBook.reviews[username]) {
      delete findBook.reviews[username];

      return res.status(200).json({
        message: "Review deleted successfully",
        reviews: findBook.reviews
      });
    } else {
      return res.status(404).json({ message: "No review found for the user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

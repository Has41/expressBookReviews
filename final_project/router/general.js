const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username && !password) {
    return res.status(400).json({ message: "Please enter Username and password" });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({
    message: "User registered successfully",
    user: { username, password }
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const result = Object.values(books).map((book) => ({
    author: book.author,
    title: book.title
  }));

  res.status(200).json(result);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const result = Object.values(books).find((book) => book.isbn === isbn);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const result = Object.values(books).find((book) => book.author === author);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).find((book) => book.title === title);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const result = Object.values(books).find((book) => book.isbn === isbn);

  if (result) {
    res.status(200).json(result.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

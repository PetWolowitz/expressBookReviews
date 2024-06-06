const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

// Endpoint di login per utenti registrati
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const user = users.find(user => user.username === username);
  const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });

  req.session.token = token;
  return res.status(200).json({ message: "Login successful", token });
});

// Endpoint per aggiungere o modificare una recensione
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const username = decoded.username;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  });
});

// Endpoint per eliminare una recensione
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const token = req.session.token;
  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    const username = decoded.username;
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
const public_users = express.Router();

// Simulazione di una richiesta per ottenere la lista dei libri
function fetchBooks() {
  return new Promise((resolve, reject) => {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject(new Error("No books available"));
    }
  });
}

// Simulazione di una richiesta per ottenere i dettagli del libro basati sull'ISBN
function fetchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
}

// Simulazione di una richiesta per ottenere i dettagli del libro basati sull'autore
function fetchBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("Books by this author not found"));
    }
  });
}

// Simulazione di una richiesta per ottenere i dettagli del libro basati sul titolo
function fetchBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error("Books with this title not found"));
    }
  });
}

// Endpoint per ottenere la lista dei libri disponibili usando Async-Await
public_users.get('/', async (req, res) => {
  try {
    const books = await fetchBooks();
    res.send(JSON.stringify(books, null, 2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Endpoint per ottenere i dettagli del libro basati sull'ISBN usando Async-Await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await fetchBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Endpoint per ottenere i dettagli del libro basati sull'autore usando Async-Await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await fetchBooksByAuthor(author);
    res.send(JSON.stringify(booksByAuthor, null, 2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Endpoint per ottenere i dettagli del libro basati sul titolo usando Async-Await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksByTitle = await fetchBooksByTitle(title);
    res.send(JSON.stringify(booksByTitle, null, 2));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Endpoint per ottenere le recensioni del libro basate sull'ISBN usando Async-Await
public_users.get('/review/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
      res.send(JSON.stringify(book.reviews, null, 2));
    } else {
      res.status(404).json({ message: "Reviews for this book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports.general = public_users;

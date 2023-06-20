class Book {
  constructor(title, author, genre, review) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.review = review;
  }
}

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const bookList = document.getElementById('book-list');
    const bookEl = document.createElement('div');
    bookEl.classList.add('book');
    bookEl.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Genre:</strong> ${book.genre}</p>
      <p><strong>Review:</strong> ${book.review}</p>
      <button class="delete" data-title="${book.title}">Remove</button>
      <button class="edit" data-title="${book.title}">Edit</button>
    `;
    bookList.appendChild(bookEl);
  }

  static clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('review').value = '';
  }

  static deleteBook(el) {
    if (el.classList.contains('delete')) {
      const title = el.dataset.title;
      el.parentElement.remove();
      Store.removeBook(title);
      UI.showAlert('Book Removed', 'success');
    }
  }

  static editBook(el) {
    if (el.classList.contains('edit')) {
      const title = el.dataset.title;
      const book = Store.getBook(title);
      document.getElementById('title').value = book.title;
      document.getElementById('author').value = book.author;
      document.getElementById('genre').value = book.genre;
      document.getElementById('review').value = book.review;
      Store.removeBook(title);
      UI.showAlert('Book Ready to be Edited', 'warning');
    }
  }

  static showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(message));
    const container = document.querySelector('.form-container');
    const form = document.getElementById('book-form');
    container.insertBefore(alertDiv, form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }
}

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(title) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.title === title) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }

  static getBook(title) {
    const books = Store.getBooks();
    return books.find((book) => book.title === title);
  }
}

// Event: display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: add book
document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const review = document.getElementById('review').value;
  const book = new Book(title, author, genre, review);
  UI.addBookToList(book);
  Store.addBook(book);
  UI.showAlert('Book Added', 'success');
  UI.clearFields();
});

// Event: remove or edit book
document.getElementById('book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);
  UI.editBook(e.target);
});

    //Used definitions from Hyperion Dev Full Stack Software and Web Developer pdf resourse: "Programming in JavaScript III: JSON"
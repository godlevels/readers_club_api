const express = require ('express');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteBook } = require('./book.controller');
const router = express.Router();

router.post('/create-book', postABook);

router.get('/', getAllBooks);

router.get('/:id', getSingleBook);

router.put('/edit/:id', UpdateBook);

router.delete('/delete/:id', deleteBook);

module.exports = router;
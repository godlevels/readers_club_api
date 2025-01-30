const express = require ('express');
const { body, validationResult } = require('express-validator');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteBook, getBooksByCategory, searchBooks } = require('./book.controller');
const router = express.Router();

router.post('/create-book', 
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('description').not().isEmpty().withMessage('Description is required'),
        body('category').not().isEmpty().withMessage('Category is required'),
        body('trending').not().isEmpty().withMessage('Trending status is required'),
        body('coverImage').not().isEmpty().withMessage('Cover image is required'),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    postABook
);

router.get('/', getAllBooks);

router.get('/:id', getSingleBook);

router.put('/edit/:id', UpdateBook);

router.delete('/delete/:id', deleteBook);

router.get('/category/:category', getBooksByCategory);

router.get('/search', searchBooks);

module.exports = router;
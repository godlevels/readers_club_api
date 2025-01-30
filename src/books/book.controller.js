const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const newBook = await Book({ ...req.body });
        await newBook.save();
        res.status(200).send({ message: 'Book created successfully!', book: newBook });
    } catch (error) {
        console.log("Error creating book", error);
        res.status(500).send({ message: 'Failed to create book', error });
    }
}

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Book.countDocuments();

        res.status(200).send({
            books,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log("Error getting books", error);
        res.status(500).send({ message: 'Failed to get books', error });
    }
}

const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error("Error getting book:", error);
        res.status(500).json({ message: 'Failed to get book', error: error.message });
    }
};


const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid book ID' });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ message: 'Book not found!' });
        }
        res.status(200).send({ message: 'Book updated successfully!', book: updatedBook });
    } catch (error) {
        console.log("Error updating book", error);
        res.status(500).send({ message: 'Failed to update book', error });
    }
}

const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid book ID' });
        }

        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: 'Book not found!' });
        }
        res.status(200).send({ message: 'Book deleted successfully!', book: deletedBook });
    } catch (error) {
        console.log("Error deleting book", error);
        res.status(500).send({ message: 'Failed to delete book', error });
    }
}

const getBooksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find({ category }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Book.countDocuments({ category });

        res.status(200).send({
            books,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log("Error getting books by category", error);
        res.status(500).send({ message: 'Failed to get books by category', error });
    }
}

const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).sort({ createdAt: -1 }).skip(skip).limit(limit);

        const total = await Book.countDocuments({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).send({
            books,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log("Error searching books", error);
        res.status(500).send({ message: 'Failed to search books', error });
    }
}

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteBook,
    getBooksByCategory,
    searchBooks
};
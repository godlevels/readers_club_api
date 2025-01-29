const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');

const port = process.env.PORT || 5000
require('dotenv').config();

app.use(express.json());
app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));

const bookRoutes = require('./src/books/book.route');
app.use("/api/books", bookRoutes);


async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  app.use('/', (req, res) => {
    res.send('Book Store Server is running!')
  })
}

main().then(()=> console.log("Mondogb is connected!")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
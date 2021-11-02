const express = require('express');
const router = express.Router();
const fs = require("fs");
const bookController = require("../controllers/books");
const upload = require("../middlewares/upload");

router.post("/upload",upload.single("books_csv"), bookController.upload);

router.post("/search",bookController.searchBook);

router.get("/",bookController.getBooks);

router.get("/add",bookController.addBookForm);

router.post("/",bookController.addBook);

router.get("/edit/:id",bookController.editBookForm);

router.post("/edit/:id",bookController.editBook);

router.get("/delete/:id",bookController.deleteBook);

router.get("/download", bookController.download);

module.exports = router
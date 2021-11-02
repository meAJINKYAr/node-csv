const express = require('express');
const router = express.Router();
const fs = require("fs");
const authorController = require("../controllers/authors");
const upload = require("../middlewares/upload");

// router.get('/', (req, res) => {
//     let filename = 'authors';
//     fs.readFile(`./data/${filename}.csv`,'utf8',function(err,data){
//         if(err) throw err;
//         const lines = (data.match(/\n/g) || '').length + 1
//         database = data.split(/\r\n|\r|\n/);
//         result = []
//         for(let data of database){
//             out = []
//             data = data.split(';')
//             for(let word of data){
//                 out.push(word)
//             }
//             result.push(out)
//         }
//         //console.log(result)
//         res.render('authors/show',{data:result,lines:lines});
//     })
// });

router.post("/upload",upload.single("authors_csv"), authorController.upload);

router.post("/search",authorController.searchAuthor);

router.get("/",authorController.getAuthors);

router.get("/add",authorController.addAuthorForm);

router.post("/",authorController.addAuthor);

router.get("/edit/:id",authorController.editAuthorForm);

router.post("/edit/:id",authorController.editAuthor);

router.get("/delete/:id",authorController.deleteAuthor);

router.get("/download", authorController.download);

module.exports = router
const conn = require('../models/db.js');
const fs = require("fs");
const fastcsv = require("fast-csv");
const ws = fs.createWriteStream("./static/downloads/books.csv");

const upload = async (req,res) => {
    try {
        if(req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let books = [];
        let path = "./static/uploads/" + req.file.filename;

        fs.createReadStream(path)
            .pipe(fastcsv.parse({headers: true,delimiter:';'}))
            .on("error",(error) => {
                throw error.message;
            })
            .on("data", (row)=>{
                //console.log(row);
                books.push(row);
            })
            .on("end", ()=>{
                console.log(JSON.parse(JSON.stringify(books)));
                for(let book of books){
                    //let a = {email: book.email, firstname: book.firstname, lastname: book.lastname};
                    conn.query("INSERT INTO books SET ?",book,(err, rows)=>{
                        if(!err){
                            if(rows==0){
                                res.send("No such entry! Try with different ID");
                            }
                        }else{
                            console.log(err);
                        }
                    })
                }
                return res.redirect('/books');
            });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

const searchBook = (req,res)=>{
    var search_data = req.body.search_term;
    //console.log(search_data)
    conn.query("SELECT * FROM books WHERE isbn = ? OR authors LIKE ? OR title LIKE ?",[search_data,'%'+search_data+'%','%'+search_data+'%'], function(err,data){
        if(err) throw err;
        //console.log(data)
        res.render('books/show',{data:data,page:"search",search_data:search_data});
    })
}

const getBooks = async (req,res)=>{
    conn.query("SELECT * FROM books", (err, rows, fields)=>{
        if(!err){
            //console.log(rows)
            console.log("showing all books data");
            res.render('books/show',{data:rows, page:"home"});
        }else{
            console.log(err);
        }
    })
};

const addBookForm = (req,res)=>{
    res.render("books/add");
}

const addBook = (req,res)=>{
    let book = {}
    book.title = req.body.title;
    book.isbn = req.body.isbn;
    book.authors = req.body.authors;
    book.description = req.body.description;

    conn.query("INSERT INTO books SET ?",book,(err, rows)=>{
        if(!err){
            if(rows==0){
                res.send("No such entry! Try with different ID");
            }
            console.log(book.email+" added successfully");
            res.redirect('/books');
        }else{
            console.log(err);
        }
    })
}

const editBookForm = (req,res)=>{
    let id = req.params.id;
    //console.log(id)
    conn.query("SELECT * FROM books WHERE id = ?",[id],function(error, data, fields) {
        if (error) throw error;
        //console.log(data);
        res.render("books/edit",{book:data});
    })
}

const editBook = (req,res)=>{
    let id = req.params.id;
    let title = req.body.title;
    let isbn = req.body.isbn;
    let authors = req.body.authors;
    let description = req.body.description;
    //console.log(id)
    conn.query("UPDATE books SET title = ?, isbn = ?, authors = ?, description = ? WHERE id = ?",[title, isbn, authors, description, id],function(error, data) {
        if (error) throw error;
        console.log("book update succcess for isbn "+isbn);
        res.redirect('/books');
    })
}

const deleteBook = (req,res)=>{
    let id = req.params.id;

    conn.query("DELETE FROM books WHERE id = ?",[id], function(err,data){
        if(err) throw err;
        //console.log(data);
        console.log("deleted book id "+id);
        res.redirect("/books");
    })
}

const download = (req,res) => {
    conn.connect(error => {
        if (error) throw error;
      
        // query data from MySQL
        conn.query("SELECT * FROM books", function(error, data, fields) {
          if (error) throw error;
      
          const jsonData = JSON.parse(JSON.stringify(data));
          console.log("jsonData", jsonData);
      
          fastcsv
            .write(jsonData, { headers: true,delimiter:';' })
            .on("finish", function() {
                console.log("Write to books.csv successfully!");

                fs.readFile('./static/downloads/books.csv',fastcsv,function(err,data){
                    if(err) throw err;
                    res.setHeader('Content-disposition', 'attachment; filename=books.csv');
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(data)
                })
            })
            .pipe(ws)
        });
    });
}

module.exports = {
    upload,
    searchBook,
    getBooks,
    addBookForm,
    addBook,
    editBookForm,
    editBook,
    deleteBook,
    download
};
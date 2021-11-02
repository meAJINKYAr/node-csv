const conn = require('../models/db.js');
const fs = require("fs");
const fastcsv = require("fast-csv");
const ws = fs.createWriteStream("./static/downloads/authors.csv");

const upload = async (req,res) => {
    try {
        if(req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let authors = [];
        let path = __basedir + "/raftlabs_test/static/uploads/" + req.file.filename;

        fs.createReadStream(path)
            .pipe(fastcsv.parse({headers: true,delimiter:';'}))
            .on("error",(error) => {
                throw error.message;
            })
            .on("data", (row)=>{
                //console.log(row);
                authors.push(row);
            })
            .on("end", ()=>{
                console.log(JSON.parse(JSON.stringify(authors)));
                for(let author of authors){
                    //let a = {email: author.email, firstname: author.firstname, lastname: author.lastname};
                    conn.query("INSERT INTO authors SET ?",author,(err, rows)=>{
                        if(!err){
                            if(rows==0){
                                res.send("No such entry! Try with different ID");
                            }
                        }else{
                            console.log(err);
                        }
                    })
                }
                return res.redirect('/authors');
            });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

const searchAuthor = (req,res)=>{
    var search_data = req.body.search_term;
    //console.log(search_data)
    conn.query("SELECT * FROM authors WHERE firstname LIKE ? OR lastname LIKE ? OR email = ?",['%'+search_data+'%','%'+search_data+'%',search_data], function(err,data){
        if(err) throw err;
        //console.log(data)
        res.render('authors/show',{data:data,page:"search",search_data:search_data});
    })
}

const getAuthors = async (req,res)=>{
        conn.query("SELECT * FROM authors", (err, rows, fields)=>{
            if(!err){
                //console.log(rows)
                console.log("showing all authors data");
                res.render('authors/show',{data:rows, page:"home"});
            }else{
                console.log(err);
            }
        })
};

const addAuthorForm = (req,res)=>{
    res.render("authors/add");
}

const addAuthor = (req,res)=>{
    let author = {}
    author.email = req.body.email;
    author.firstname = req.body.firstname;
    author.lastname = req.body.lastname;

    conn.query("INSERT INTO authors SET ?",author,(err, rows)=>{
        if(!err){
            if(rows==0){
                res.send("No such entry! Try with different ID");
            }
            console.log(author.email+" added successfully");
            res.redirect('/authors');
        }else{
            console.log(err);
        }
    })
}

const editAuthorForm = (req,res)=>{
    let id = req.params.id;
    //console.log(id)
    conn.query("SELECT * FROM authors WHERE id = ?",[id],function(error, data, fields) {
        if (error) throw error;
        //console.log(data);
        res.render("authors/edit",{author:data});
    })
}

const editAuthor = (req,res)=>{
    let id = req.params.id;
    let email = req.body.email;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    //console.log(id)
    conn.query("UPDATE authors SET email = ?, firstname = ?, lastname = ? WHERE id = ?",[email, firstname, lastname, id],function(error, data, fields) {
        if (error) throw error;
        console.log("author update succcess for email "+email);
        res.redirect('/authors');
    })
}

const deleteAuthor = (req,res)=>{
    let id = req.params.id;

    conn.query("DELETE FROM authors WHERE id = ?",[id], function(err,data){
        if(err) throw err;
        //console.log(data);
        console.log("deleted author id "+id);
        res.redirect("/authors");
    })
}

const download = (req,res) => {
    conn.connect(error => {
        if (error) throw error;
      
        // query data from MySQL
        conn.query("SELECT * FROM authors", function(error, data, fields) {
          if (error) throw error;
      
          const jsonData = JSON.parse(JSON.stringify(data));
          console.log("jsonData", jsonData);
      
          fastcsv
            .write(jsonData, { headers: true,delimiter:';' })
            .on("finish", function() {
                console.log("Write to authors.csv successfully!");

                fs.readFile('./static/downloads/authors.csv',fastcsv,function(err,data){
                    if(err) throw err;
                    res.setHeader('Content-disposition', 'attachment; filename=authors.csv');
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
    searchAuthor,
    getAuthors,
    addAuthorForm,
    addAuthor,
    editAuthorForm,
    editAuthor,
    deleteAuthor,
    download
};
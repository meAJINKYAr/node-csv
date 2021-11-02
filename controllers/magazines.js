const conn = require('../models/db.js');
const fs = require("fs");
const fastcsv = require("fast-csv");
const ws = fs.createWriteStream("./static/downloads/magazines.csv");

const upload = async (req,res) => {
    try {
        if(req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }

        let magazines = [];
        let path = "./static/uploads/" + req.file.filename;

        fs.createReadStream(path)
            .pipe(fastcsv.parse({headers: true,delimiter:';'}))
            .on("error",(error) => {
                throw error.message;
            })
            .on("data", (row)=>{
                //console.log(row);
                magazines.push(row);
            })
            .on("end", ()=>{
                console.log(JSON.parse(JSON.stringify(magazines)));
                for(let magazine of magazines){
                    function getData(magazine){
                        magazine.publishedAt = new Date(magazine.publishedAt);
                        return magazine
                    }
                    //let a = {email: magazine.email, firstname: magazine.firstname, lastname: magazine.lastname};
                    conn.query("INSERT INTO magazines SET ?",getData(magazine),(err, rows)=>{
                        if(!err){
                            if(rows==0){
                                res.send("No such entry! Try with different ID");
                            }
                        }else{
                            console.log(err);
                        }
                    })
                }
                return res.redirect('/magazines');
            });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

const searchMagazine = (req,res)=>{
    var search_data = req.body.search_term;
    //console.log(search_data)
    conn.query("SELECT * FROM magazines WHERE isbn = ? OR authors LIKE ? OR title LIKE ?",[search_data,'%'+search_data+'%','%'+search_data+'%'], function(err,data){
        if(err) throw err;
        //console.log(data)
        res.render('magazines/show',{data:data,page:"search",search_data:search_data});
    })
}

const getMagazines = async (req,res)=>{
        conn.query("SELECT * FROM magazines", (err, rows, fields)=>{
            if(!err){
                //console.log(rows)
                console.log("showing all magazines data");
                res.render('magazines/show',{data:rows, page:"home"});
            }else{
                console.log(err);
            }
        })
};

const addMagazineForm = (req,res)=>{
    res.render("magazines/add");
}

const addMagazine = (req,res)=>{
    let magazine = {}
    magazine.title = req.body.title;
    magazine.isbn = req.body.isbn;
    magazine.authors = req.body.authors;
    magazine.publishedAt = req.body.publishedAt;

    conn.query("INSERT INTO magazines SET ?",magazine,(err, rows)=>{
        if(!err){
            if(rows==0){
                res.send("No such entry! Try with different ID");
            }
            console.log(magazine.email+" added successfully");
            res.redirect('/magazines');
        }else{
            console.log(err);
        }
    })
}

const editMagazineForm = (req,res)=>{
    let id = req.params.id;
    //console.log(id)
    conn.query("SELECT * FROM magazines WHERE id = ?",[id],function(error, data, fields) {
        if (error) throw error;
        //console.log(data);
        res.render("magazines/edit",{magazine:data});
    })
}

const editMagazine = (req,res)=>{
    let id = req.params.id;
    let title = req.body.title;
    let isbn = req.body.isbn;
    let authors = req.body.authors;
    let publishedAt = req.body.publishedAt;
    //console.log(id)
    conn.query("UPDATE magazines SET title = ?, isbn = ?, authors = ?, publishedAt = ? WHERE id = ?",[title, isbn, authors, publishedAt, id],function(error, data) {
        if (error) throw error;
        console.log("magazine update succcess for isbn "+isbn);
        res.redirect('/magazines');
    })
}

const deleteMagazine = (req,res)=>{
    let id = req.params.id;

    conn.query("DELETE FROM magazines WHERE id = ?",[id], function(err,data){
        if(err) throw err;
        //console.log(data);
        console.log("deleted magazine id "+id);
        res.redirect("/magazines");
    })
}

const download = (req,res) => {
    // conn.connect(error => {
    //     if (error) throw error;
      
        // query data from MySQL
        conn.query("SELECT * FROM magazines", function(error, data, fields) {
          if (error) throw error;
      
          const jsonData = JSON.parse(JSON.stringify(data));
          //console.log("jsonData", jsonData);
      
          fastcsv
            .write(jsonData, { headers: true,delimiter:';' })
            .on("finish", function() {
                console.log("Write to magazines.csv successfully!");

                fs.readFile('./static/downloads/magazines.csv',fastcsv,function(err,data){
                    if(err) throw err;
                    res.setHeader('Content-disposition', 'attachment; filename=magazines.csv');
                    res.set('Content-Type', 'text/csv');
                    res.status(200).send(data)
                })
            })
            .pipe(ws)
        });
    //});
}

module.exports = {
    upload,
    searchMagazine,
    getMagazines,
    addMagazineForm,
    addMagazine,
    editMagazineForm,
    editMagazine,
    deleteMagazine,
    download
};
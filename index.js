const express = require('express');
const fs = require("fs");
const conn = require('./models/db.js');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const magazineRouter = require('./routes/magazines');
//const db = require('./models');

global.__basedir = __dirname + "/..";

const app = express();

app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }));

//db.sequelize.sync();

app.get('/', (req,res)=>{
    conn.query("SELECT id,title,isbn,authors,'book' as category FROM books UNION SELECT id,title,isbn,authors,'magazine' FROM magazines ORDER BY title", (err, rows)=>{
        if(!err){
            //console.log(rows)
            console.log("showing all books and magazines data");
            res.render('index',{data:rows});
        }else{
            console.log(err);
        }
    })
})

// app.get('/csv/:filename',(req,res)=>{
//     fs.readFile(`./data/${req.params.filename}.csv`,'utf8',function(err,data){
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
//         res.render('show',{data:result,lines:lines});
//     })
// })

app.use('/authors',authorRouter);
app.use('/books',bookRouter);
app.use('/magazines',magazineRouter);

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening on port ${port}...`);
})
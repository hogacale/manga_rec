const express = require('express');
const mysql = require('mysql');
const app = express();
const {spawn} = require('child_process');
app.use(express.json());
const cors = require("cors")
app.use(cors())

const con = mysql.createConnection({
  host: "washington.uww.edu",
  user: "hoganct11",
  password: "ch7463",
  database: "manga_rec"
});

con.connect(function(err) {
   if (err) throw err;
});

app.get('/api/manga/:id', function(req, res) {
    let sql = 'select * from manga where id = ?'
    con.query(sql,req.params.id,function (err,result) {
        if (err) throw err;
        console.log(result);
        res.send(JSON.stringify(result));
    });
    // res.send("id is set to " + req.params.id);
	// console.log("Request for manga id: " + req.params.id);
});

app.post('/api/search/', function(req, res) {
    let offset = 0;
    let limit = req.body.limit;
    const query = req.body.query;
    if(req.body.page !== undefined && req.body.page !== '0')
        offset = (req.body.page - 1) * limit;
    let sql = "call search(?,?,?)";
    let sqlParams = [query,limit,offset]
    // const sql = 'select title,id,pictureLink from manga where title like \'' + query + '\' limit ' + limit + ' offset ' + offset;
    // console.log(sql);
    console.log("Searching page",req.body.page,"with query", query);
    console.log(sql,sqlParams)
    con.query(sql,sqlParams,function (err,result) {
        if (err) throw err;
            // console.log(result);
            console.log("Results:",JSON.stringify(result));
            res.send(JSON.stringify(result));
    })

});

app.get('/api/genre/:genre', function(req, res) {
    let sql = 'select * from manga where genre like ? order by rand() limit 10'
    let genre = '%'+req.params.genre+'%'
    con.query(sql, genre,function (err,result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
    // res.send("id is set to " + req.params.id);
// console.log("Request for manga id: " + req.params.id);
});

app.get('/api/theme/:theme', function(req, res) {
    let sql = 'select * from manga where theme like ? order by rand() limit 10'
    let theme = '%'+req.params.theme+'%'
    con.query(sql, theme, function (err,result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
    // res.send("id is set to " + req.params.id);
// console.log("Request for manga id: " + req.params.id);
});

app.post('/api/manga/interest', function(req,res) {
    // const sql = 'call Interest(' + InterestStatus + ',' + 'mangaId' + ',' + 'userId' + ')';
    console.log("User: " + req.body.userId + " is " + req.body.interest + " in manga with id " + req.body.mangaId);
    con.query('CALL Interest(?,?,?)',
        [
            req.body.interest,
            req.body.mangaId,
            req.body.userId
        ], function (err,result,field) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post('/api/manga/recommend', function(req,res){
    console.log('User of ' + req.body.userId + " is getting recommendations with filters " + req.body.filters);
    let dataToSend;

    const python = spawn('python', ['mangaRecommender/recommender.py', req.body.userId, req.body.filters]);
    // const python = spawn('python', ['mangaRecommender/HelloWorld.py', "1", filters]);

    python.stdout.on('data', function (data) {
       dataToSend = data;
    });
    // python.stdout.on('data', data => {
    //    console.error(`stderr: ${data}`);
    // });
    python.on('exit', (code) => {
       console.log(`child process exited with code ${code}, ${dataToSend}`);
       res.send(dataToSend);
    });
});

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
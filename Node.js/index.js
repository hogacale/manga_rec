const express = require('express');
const mysql = require('mysql');
const app = express();
app.use(express.json());
const cors = require("cors")
app.use(cors())

const con = mysql.createConnection({
  host: "washington.uww.edu",
  user: <Your Username>,
  password: <Your password>,
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

app.get('/api/search/', function(req, res) {
    let offset = 0;
    let limit = req.query.limit;
    if(req.query.page !== undefined && req.query.page !== '0')
        offset = (req.query.page - 1) * limit;
    sql = "call search(?,?,?)";
    sqlParams = [req.query.query,limit,offset]
    // const sql = 'select title,id,pictureLink from manga where title like \'' + query + '\' limit ' + limit + ' offset ' + offset;
    // console.log(sql);

    con.query(sql,sqlParams,function (err,result) {
        if (err) throw err;
            // console.log(result);

            res.send(JSON.stringify(result));
    })

    // con.query('Select Title,id,pictureLink from manga where title like ? limit ? offset ?',
    //     [
    //         req.query.query,
    //         parseInt(req.query.limit),
    //         offset
    //     ],
    //     function (err,result) {
    //     if (err) throw err;
    //     res.send(JSON.stringify(result));
    // });
    // res.send("Searching with query " + req.query.query);
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

//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
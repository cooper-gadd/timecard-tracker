var express = require("express");
var DataLayer = require("./companydata/index.js");
var dl = new DataLayer("ritusername");
//now use dl.Department, dl.Employee and dl.TimeCard
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());

//use router if you'd like

//use appropriate routes/paths/verbs
app.get("/",async function(req,res){
    //call the appropriate dl methods/objects using
    //await as the data layer methods are asynchronous
    res.json({"response":"this is the appropriate response"});  
});


app.listen(8282);
console.log('Express started on port 8282');


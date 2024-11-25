import express, { json } from "express";
import DataLayer from "./companydata/index.js";
var dl = new DataLayer("ritusername");
//now use dl.Department, dl.Employee and dl.TimeCard
import logger from "morgan";

var app = express();

app.use(logger("dev"));
app.use(json());

//use router if you'd like

//use appropriate routes/paths/verbs
app.get("/", async function (req, res) {
  //call the appropriate dl methods/objects using
  //await as the data layer methods are asynchronous
  res.json({ response: "this is the appropriate response" });
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

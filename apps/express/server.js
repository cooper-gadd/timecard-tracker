import express, { json } from "express";
import DataLayer from "./companydata/index.js";
import logger from "morgan";

const dl = new DataLayer("ctg7866");
const app = express();

app.use(logger("dev"));
app.use(json());

app.get("/", async function (_req, res) {
  res.json({ response: "this is the appropriate response" });
});

app.get("/departments", async function (req, res) {
  const departments = await dl.getAllDepartment(req.query.company);
  res.send(departments);
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

import express, { json } from "express";
import DataLayer from "./companydata/index.js";
import logger from "morgan";
import e from "express";

const dl = new DataLayer("ctg7866");
const app = express();

app.use(logger("dev"));
app.use(json());

app.get("/", async function (_req, res) {
  res.json({ response: "this is the appropriate response" });
});

app.delete("/company", async function (req, res) {
  try {
    dl.deleteCompany(req.query.company);
    res.status(200).send("Company data deleted successfully");
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get("/department", async function (req, res) {
  try {
    const department = await dl.getDepartment(
      req.query.company,
      req.query.department,
    );
    res.send(200).send(department);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get("/departments", async function (req, res) {
  try {
    const departments = await dl.getAllDepartment(req.query.company);
    res.status(200).send(departments);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

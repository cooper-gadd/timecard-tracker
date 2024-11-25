import express, { json } from "express";
import DataLayer from "./companydata/index.js";
import logger from "morgan";

const dl = new DataLayer("ctg7866");
app.use(express.urlencoded({ extended: true }));

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
      req.query.dept_id,
    );
    res.send(200).send(department);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.post("/department", async function (req, res) {
  try {
    const department = await dl.insertDepartment(
      new dl.Department(
        req.body.company,
        req.body.dept_name,
        // dept_no must be unique among all companies, Suggestion: include company name as part of id
        req.body.dept_no + "_" + req.body.company,
        req.body.location,
      ),
    );
    res.status(200).send({ success: department });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.put("/department", async function (req, res) {
  try {
    if (!dl.getDepartment(req.body.company, req.body.dept_id)) {
      throw new Error("Department not found");
    }

    const department = await dl.updateDepartment(
      new dl.Department(
        req.body.dept_id,
        req.body.company,
        req.body.dept_name,
        // dept_no must be unique among all companies, Suggestion: include company name as part of id
        req.body.dept_no + "_" + req.body.company,
        req.body.location,
      ),
    );
    res.status(200).send(department);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.delete("/department", async function (req, res) {
  try {
    await dl.deleteDepartment(req.query.company, req.query.dept_id);
    res.status(200).send({
      success: `Department ${req.query.dept_id} from ${req.query.company} deleted successfully`,
    });
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

app.get("/employee", async function (req, res) {
  try {
    const employee = await dl.getEmployee(req.query.company, req.query.emp_id);
    res.send(200).send(employee);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

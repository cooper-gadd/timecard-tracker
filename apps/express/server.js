import express, { json } from "express";
import logger from "morgan";
import {
  deleteCompany,
  deleteDepartment,
  deleteEmployee,
  getDepartment,
  getDepartments,
  getEmployee,
  getEmployees,
  getTimecard,
  insertDepartment,
  insertEmployee,
  insertTimecard,
  updateDepartment,
} from "./business-layer.js";
import DataLayer from "./companydata/index.js";

const dl = new DataLayer("ctg7866");
const root = "/CompanyServices";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(json());

app.get(root + "/", async function (_req, res) {
  res.json({ response: "this is the appropriate response" });
});

app.delete(root + "/company", async function (req, res) {
  try {
    await deleteCompany(req.query.company);
    res.status(200).send({ success: "Company data deleted successfully" });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/department", async function (req, res) {
  try {
    const department = await getDepartment(req.body.company, req.body.dept_id);
    res.send(200).send(department);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.post(root + "/department", async function (req, res) {
  try {
    const department = await insertDepartment(
      req.body.company,
      req.body.dept_name,
      req.body.dept_no,
      req.body.location,
    );
    res.status(200).send({ success: department });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.put(root + "/department", async function (req, res) {
  try {
    const department = await updateDepartment(
      req.body.dept_id,
      req.body.company,
      req.body.dept_name,
      req.body.dept_no,
      req.body.location,
    );
    res.status(200).send({ success: department });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.delete(root + "/department", async function (req, res) {
  try {
    await deleteDepartment(req.query.company, req.query.dept_id);
    res.status(200).send({
      success: `Department ${req.query.dept_id} from ${req.query.company} deleted successfully`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/departments", async function (req, res) {
  try {
    const departments = await getDepartments(req.query.company);
    res.status(200).send(departments);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/employee", async function (req, res) {
  try {
    const employee = await getEmployee(req.query.company, req.query.emp_id);
    res.send(200).send(employee);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.post(root + "/exployee", async function (req, res) {
  try {
    const employee = await insertEmployee(
      req.body.company,
      req.body.emp_name,
      req.body.emp_no,
      req.body.hire_date,
      req.body.job,
      req.body.salary,
      req.body.dept_id,
      req.body.mng_id,
    );
    res.status(200).send({ success: employee });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.put(root + "/exployee", async function (req, res) {
  try {
    const employee = await updateDepartment(
      req.body.company,
      req.body.emp_id,
      req.body.emp_name,
      req.body.emp_no,
      req.body.hire_date,
      req.body.job,
      req.body.salary,
      req.body.dept_id,
      req.body.mng_id,
    );
    res.status(200).send({ success: employee });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.delete(root + "/employee", async function (req, res) {
  try {
    await deleteEmployee(req.query.company, req.query.emp_id);
    res.status(200).send({
      success: `Employee ${req.query.emp_id} deleted`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/employees", async function (req, res) {
  try {
    const employees = await getEmployees(req.query.company);
    res.status(200).send(employees);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/timecard", async function (req, res) {
  try {
    const timecard = await getTimecard(
      req.query.company,
      req.query.timecard_id,
    );
    res.status(200).send(timecard);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.post(root + "/timecard", async function (req, res) {
  try {
    const timecard = await insertTimecard(
      req.body.start_time,
      req.body.end_time,
      req.body.emp_id,
    );
    res.status(200).send({
      success: timecard,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.put(root + "/timecard", async function (req, res) {
  try {
    const timecard = await updateTimecard(
      req.body.timecard_id,
      req.body.start_time,
      req.body.end_time,
      req.body.emp_id,
    );
    res.status(200).send({
      success: timecard,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.delete(root + "/timecard", async function (req, res) {
  try {
    await dl.deleteTimecard(req.query.timecard_id);
    res.status(200).send({
      success: `Timecard ${req.query.timecard_id} deleted`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.get(root + "/timecards", async function (req, res) {
  try {
    const timecards = await dl.getAllTimecards(req.query.emp_id);
    res.status(200).send(timecards);
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

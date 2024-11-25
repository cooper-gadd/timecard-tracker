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
    await dl.deleteCompany(req.query.company);
    res.status(200).send({ success: "Company data deleted successfully" });
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
    // dept_id must be an existing record number for a department
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
    res.status(200).send({ success: department });
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

app.post("/exployee", async function (req, res) {
  try {
    // company – must be your RIT username
    if (req.body.company !== "ctg7866") {
      throw new Error("Company name must be your RIT username");
    }

    // dept_id must exist as a Department in your company
    if (!(await dl.getDepartment(req.body.company, req.body.dept_id))) {
      throw new Error("Department not found");
    }

    // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
    if (!(await dl.getEmployee(req.body.mng_id)) && req.body.mng_id !== 0) {
      throw new Error("Manager not found");
    }

    // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
    if (new Date(req.body.hireDate) > new Date()) {
      throw new Error("Hire date must be in the past");
    }

    // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
    if (
      new Date(req.body.hireDate).getDay() === 0 ||
      new Date(req.body.hireDate).getDay() === 6
    ) {
      throw new Error("Hire date must be a weekday");
    }

    const employee = await dl.insertEmployee(
      new dl.Employee(
        req.body.emp_name,
        // emp_no must be unique amongst all employees in the database, including those of other companies. You may wish to include your RIT user ID in the employee number somehow.
        req.body.emp_no + "_" + req.body.company,
        req.body.hire_date,
        req.body.job,
        req.body.salary,
        req.body.dept_id,
        req.body.mng_id,
      ),
    );
    res.status(200).send({ success: employee });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.put("/exployee", async function (req, res) {
  try {
    // company – must be your RIT username
    if (req.body.company !== "ctg7866") {
      throw new Error("Company name must be your RIT username");
    }

    // dept_id must exist as a Department in your company
    if (!(await dl.getDepartment(req.body.company, req.body.dept_id))) {
      throw new Error("Department not found");
    }

    // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
    if (!(await dl.getEmployee(req.body.mng_id)) && req.body.mng_id !== 0) {
      throw new Error("Manager not found");
    }

    // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
    if (new Date(req.body.hireDate) > new Date()) {
      throw new Error("Hire date must be in the past");
    }

    // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
    if (
      new Date(req.body.hireDate).getDay() === 0 ||
      new Date(req.body.hireDate).getDay() === 6
    ) {
      throw new Error("Hire date must be a weekday");
    }

    // emp_id must be a valid record id in the database
    if (!(await dl.getEmployee(req.body.emp_id))) {
      throw new Error("Employee not found");
    }

    const employee = await dl.updateDepartment(
      new dl.Employee(
        req.body.emp_id,
        req.body.emp_name,
        // emp_no must be unique amongst all employees in the database, including those of other companies. You may wish to include your RIT user ID in the employee number somehow.
        req.body.emp_no + "_" + req.body.company,
        req.body.hire_date,
        req.body.job,
        req.body.salary,
        req.body.dept_id,
        req.body.mng_id,
      ),
    );
    res.status(200).send({ success: employee });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.delete("/employee", async function (req, res) {
  try {
    await dl.deleteEmployee(req.query.company, req.query.emp_id);
    res.status(200).send({
      success: `Employee ${req.query.emp_id} deleted`,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
});

app.listen(8282);
console.log("API is running on http://localhost:8282");

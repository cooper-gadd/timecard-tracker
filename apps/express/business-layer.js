import DataLayer from "./companydata/index.js";
const dl = new DataLayer("ctg7866");

export async function deleteCompany(company) {
  return await dl.deleteCompany(company);
}

export async function getDepartment(company, dept_id) {
  return await dl.getDepartment(company, dept_id);
}

export async function insertDepartment(company, dept_name, dept_no, location) {
  return await dl.insertDepartment(
    new dl.Department(
      company,
      dept_name,
      // dept_no must be unique among all companies, Suggestion: include company name as part of id
      dept_no + "_" + company,
      location,
    ),
  );
}

export async function updateDepartment(
  dept_id,
  company,
  dept_name,
  dept_no,
  location,
) {
  // dept_id must be an existing record number for a department
  if (!dl.getDepartment(company, dept_id)) {
    throw new Error("Department not found");
  }

  return await dl.updateDepartment(
    new dl.Department(
      dept_id,
      company,
      dept_name,
      // dept_no must be unique among all companies, Suggestion: include company name as part of id
      dept_no + "_" + company,
      location,
    ),
  );
}

export async function deleteDepartment(company, dept_id) {
  return await dl.deleteDepartment(company, dept_id);
}

export async function getDepartments(company) {
  return await dl.getAllDepartment(company);
}

export async function getEmployee(company, emp_id) {
  return await dl.getEmployee(company, emp_id);
}

export async function insertEmployee(
  company,
  emp_name,
  emp_no,
  hire_date,
  job,
  salary,
  dept_id,
  mng_id,
) {
  // company – must be your RIT username
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  // dept_id must exist as a Department in your company
  if (!(await dl.getDepartment(company, dept_id))) {
    throw new Error("Department not found");
  }

  // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
  if (!(await dl.getEmployee(mng_id)) && mng_id !== 0) {
    throw new Error("Manager not found");
  }

  // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
  if (new Date(hire_date) > new Date()) {
    throw new Error("Hire date must be in the past");
  }

  // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
  if (
    new Date(hire_date).getDay() === 0 ||
    new Date(hire_date).getDay() === 6
  ) {
    throw new Error("Hire date must be a weekday");
  }

  return await dl.insertEmployee(
    new dl.Employee(
      emp_name,
      // emp_no must be unique among all companies, Suggestion: include company name as part of id
      emp_no + "_" + company,
      hire_date,
      job,
      salary,
      dept_id,
      mng_id,
    ),
  );
}

export async function updateEmployee(
  company,
  emp_id,
  emp_name,
  emp_no,
  hire_date,
  job,
  salary,
  dept_id,
  mng_id,
) {
  // company – must be your RIT username
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  // dept_id must exist as a Department in your company
  if (!(await dl.getDepartment(company, dept_id))) {
    throw new Error("Department not found");
  }

  // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
  if (!(await dl.getEmployee(mng_id)) && mng_id !== 0) {
    throw new Error("Manager not found");
  }

  // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
  if (new Date(hire_date) > new Date()) {
    throw new Error("Hire date must be in the past");
  }

  // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
  if (
    new Date(hire_date).getDay() === 0 ||
    new Date(hire_date).getDay() === 6
  ) {
    throw new Error("Hire date must be a weekday");
  }

  // emp_id must be a valid record id in the database
  if (!(await dl.getEmployee(emp_id))) {
    throw new Error("Employee not found");
  }

  return await dl.updateEmployee(
    new dl.Employee(
      emp_name,
      // emp_no must be unique among all companies, Suggestion: include company name as part of id
      emp_no + "_" + company,
      hire_date,
      job,
      salary,
      dept_id,
      mng_id,
    ),
  );
}

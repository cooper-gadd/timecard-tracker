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
      !dept_no.includes(company) ? company + "_" + dept_no : dept_no,
      location,
    ),
  );
}

export async function updateDepartment(
  company,
  dept_id,
  dept_name,
  dept_no,
  location,
) {
  // dept_id must be an existing record number for a department
  if (!(await dl.getDepartment(company, dept_id))) {
    throw new Error("Department not found");
  }

  // constructor didn't work for some reason
  const department = new dl.Department();
  department.setDeptId(parseInt(dept_id));
  department.setCompany(company);
  department.setDeptName(dept_name);
  department.setDeptNo(
    !dept_no.includes(company) ? company + "_" + dept_no : dept_no,
  );
  department.setLocation(location);

  return await dl.updateDepartment(department);
}

export async function deleteDepartment(company, dept_id) {
  return await dl.deleteDepartment(company, dept_id);
}

export async function getDepartments(company) {
  return await dl.getAllDepartment(company);
}

export async function getEmployee(company, emp_id) {
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  return await dl.getEmployee(emp_id);
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

  const employee = new dl.Employee();
  employee.setId(parseInt(emp_id));
  employee.setEmpName(emp_name);
  employee.setEmpNo(
    !emp_no.includes(company) ? company + "_" + emp_no : emp_no,
  ); // emp_no must be unique among all companies, Suggestion: include company name as part of id
  employee.setHireDate(hire_date);
  employee.setJob(job);
  employee.setSalary(parseFloat(salary));
  employee.setDeptId(parseInt(dept_id));
  employee.setMngId(parseInt(mng_id));

  return await dl.updateEmployee(employee);
}

export async function deleteEmployee(company, emp_id) {
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  return await dl.deleteEmployee(emp_id);
}

export async function getEmployees(company) {
  return await dl.getAllEmployee(company);
}

export async function getTimecard(company, timecard_id) {
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  return await dl.getTimecard(timecard_id);
}

export async function insertTimecard(company, emp_id, start_time, end_time) {
  // company – must be your RIT username
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  // emp_id must exist as an Employee in your company
  if (!(await dl.getEmployee(emp_id))) {
    console.log(emp_id);
    throw new Error("Employee not found");
  }

  // start_time must be a valid date and time equal to the current date
  if (new Date(start_time).getDate() !== new Date().getDate()) {
    // or back to the Monday prior to the current date if the current date is not a Monday.
    if (new Date(start_time).getDay() !== 1) {
      throw new Error("Start time must be a Monday");
    } else {
      throw new Error("Start time must be today");
    }
  }

  // end_time must be a valid date and time at least 1 hour greater than the start_time and be on the same day as the start_time.
  if (
    new Date(end_time).getTime() - new Date(start_time).getTime() <
    3600000 // 1 hour in milliseconds
  ) {
    throw new Error("End time must be at least 1 hour after start time");
  }

  // start_time and end_time must be a Monday, Tuesday, Wednesday, Thursday or a Friday. They cannot be Saturday or Sunday.
  if (
    new Date(start_time).getDay() === 0 ||
    new Date(start_time).getDay() === 6 ||
    new Date(end_time).getDay() === 0 ||
    new Date(end_time).getDay() === 6
  ) {
    throw new Error("Start and end time must be weekdays");
  }

  // start_time and end_time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive.
  if (
    new Date(start_time).getHours() < 8 ||
    new Date(start_time).getHours() >= 18 ||
    new Date(end_time).getHours() < 8 ||
    new Date(end_time).getHours() >= 18
  ) {
    throw new Error("Start and end time must be between 08:00 and 18:00");
  }

  // start_time must not be on the same day as any other start_time for that employee.
  const timecards = await dl.getAllTimecard(emp_id);
  for (const timecard of timecards) {
    if (
      new Date(start_time).getDate() === new Date(timecard.start_time).getDate()
    ) {
      throw new Error("Employee already clocked in today");
    }
  }

  const timecard = new dl.Timecard(start_time, end_time, parseInt(emp_id));

  return await dl.insertTimecard(timecard);
}

export async function updateTimecard(
  company,
  timecard_id,
  emp_id,
  start_time,
  end_time,
) {
  // company – must be your RIT username
  if (company !== "ctg7866") {
    throw new Error("Company name must be your RIT username");
  }

  // emp_id must exist as an Employee in your company
  if (!(await dl.getEmployee(emp_id))) {
    throw new Error("Employee not found");
  }

  // start_time must be a valid date and time equal to the current date
  if (new Date(start_time).getDate() !== new Date().getDate()) {
    // or back to the Monday prior to the current date if the current date is not a Monday.
    if (new Date(start_time).getDay() !== 1) {
      throw new Error("Start time must be a Monday");
    } else {
      throw new Error("Start time must be today");
    }
  }

  // end_time must be a valid date and time at least 1 hour greater than the start_time and be on the same day as the start_time.
  if (
    new Date(end_time).getTime() - new Date(start_time).getTime() <
    3600000 // 1 hour in milliseconds
  ) {
    throw new Error("End time must be at least 1 hour after start time");
  }

  // start_time and end_time must be a Monday, Tuesday, Wednesday, Thursday or a Friday. They cannot be Saturday or Sunday.
  if (
    new Date(start_time).getDay() === 0 ||
    new Date(start_time).getDay() === 6 ||
    new Date(end_time).getDay() === 0 ||
    new Date(end_time).getDay() === 6
  ) {
    throw new Error("Start and end time must be weekdays");
  }

  // start_time and end_time must be between the hours (in 24 hour format) of 08:00:00 and 18:00:00 inclusive.
  if (
    new Date(start_time).getHours() < 8 ||
    new Date(start_time).getHours() >= 18 ||
    new Date(end_time).getHours() < 8 ||
    new Date(end_time).getHours() >= 18
  ) {
    throw new Error("Start and end time must be between 08:00 and 18:00");
  }

  // start_time must not be on the same day as any other start_time for that employee.
  const timecards = await dl.getAllTimecard(emp_id);
  for (const timecard of timecards) {
    if (
      new Date(start_time).getDate() === new Date(timecard.start_time).getDate()
    ) {
      throw new Error("Employee already clocked in today");
    }
  }

  if (!(await dl.getTimecard(timecard_id))) {
    throw new Error("Timecard not found");
  }

  const timecard = new dl.Timecard(start_time, end_time, parseInt(emp_id));
  timecard.setId(timecard_id);

  return await dl.updateTimecard(timecard);
}

export async function deleteTimecard(timecard_id) {
  await dl.deleteTimecard(timecard_id);
}

export async function getTimecards(emp_id) {
  return await dl.getAllTimecard(emp_id);
}

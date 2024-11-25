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

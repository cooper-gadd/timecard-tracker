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

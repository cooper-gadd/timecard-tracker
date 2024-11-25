import DataLayer from "./companydata/index.js";
const dl = new DataLayer("ctg7866");

export async function deleteCompany(company) {
  return await dl.deleteCompany(company);
}

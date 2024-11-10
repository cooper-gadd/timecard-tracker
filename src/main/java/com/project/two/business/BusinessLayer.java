package com.project.two.business;

import companydata.DataLayer;
import companydata.Department;
import companydata.Employee;
import java.sql.Date;
import java.util.List;

public class BusinessLayer {

  private DataLayer dl = null;

  public BusinessLayer() {
    dl = new DataLayer("ctg7866");
  }

  public int deleteCompany(String companyName) {
    try {
      return dl.deleteCompany(companyName);
    } catch (Exception e) {
      System.out.println("Error in deleteCompany: " + e.getMessage());
    }
    return -1;
  }

  public Department getDepartment(String company, int id) {
    try {
      return dl.getDepartment(company, id);
    } catch (Exception e) {
      System.out.println("Error in getDepartment: " + e.getMessage());
    }
    return null;
  }

  public Department insertDepartment(
    String company,
    String deptName,
    String deptNo,
    String location
  ) {
    try {
      Department dept = new Department(company, deptName, deptNo, location);
      dl.insertDepartment(dept);
      return dept;
    } catch (Exception e) {
      System.out.println("Error in insertDepartment: " + e.getMessage());
    }
    return null;
  }

  public Department updateDepartment(
    int id,
    String company,
    String deptName,
    String deptNo,
    String location
  ) {
    try {
      //dept_no must be unique among all companies, Suggestion: include company name as part of id
      if (!deptNo.contains(company)) {
        deptNo = company + "_" + deptNo;
      }

      // dept_id must be an existing record number for a department
      if (dl.getDepartment(company, id) == null) {
        return null;
      }
      Department dept = new Department(id, company, deptName, deptNo, location);
      dl.updateDepartment(dept);
      return dept;
    } catch (Exception e) {
      System.out.println("Error in updateDepartment: " + e.getMessage());
    }
    return null;
  }

  public int deleteDepartment(String company, int id) {
    try {
      return dl.deleteDepartment(company, id);
    } catch (Exception e) {
      System.out.println("Error in deleteDepartment: " + e.getMessage());
    }
    return -1;
  }

  public List<Department> getAllDepartments(String company) {
    try {
      return dl.getAllDepartment(company);
    } catch (Exception e) {
      System.out.println("Error in getDepartments: " + e.getMessage());
    }
    return null;
  }

  public List<Employee> getAllEmployees(String company) {
    try {
      return dl.getAllEmployee(company);
    } catch (Exception e) {
      System.out.println("Error in getEmployees: " + e.getMessage());
    }
    return null;
  }

  public Employee getEmployee(String company, int id) {
    try {
      return dl.getEmployee(id);
    } catch (Exception e) {
      System.out.println("Error in getEmployee: " + e.getMessage());
    }
    return null;
  }

  public Employee insertEmployee(
    String company,
    String emp_name,
    String emp_no,
    Date hire_date,
    String job,
    double salary,
    int dept_id,
    int mng_id
  ) {
    try {
      Employee emp = new Employee(
        emp_name,
        emp_no,
        hire_date,
        job,
        salary,
        dept_id,
        mng_id
      );
      dl.insertEmployee(emp);
      return emp;
    } catch (Exception e) {
      System.out.println("Error in insertEmployee: " + e.getMessage());
    }
    return null;
  }
}

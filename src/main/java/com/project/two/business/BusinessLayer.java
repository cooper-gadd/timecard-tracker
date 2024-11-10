package com.project.two.business;

import companydata.DataLayer;
import companydata.Department;
import companydata.Employee;
import companydata.Timecard;
import java.sql.Date;
import java.util.Calendar;
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
      // dept_no must be unique among all companies, Suggestion: include company name as part of id
      if (!deptNo.contains(company)) {
        deptNo = company + "_" + deptNo;
      }

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
      // company – must be your RIT username
      if (!company.equals("ctg7866")) {
        return null;
      }

      // dept_id must exist as a Department in your company
      if (dl.getDepartment(company, dept_id) == null) {
        return null;
      }

      // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
      if (dl.getEmployee(mng_id) == null && mng_id != 0) {
        return null;
      }

      // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
      if (hire_date.after(new Date(System.currentTimeMillis()))) {
        return null;
      }

      // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
      Calendar c = Calendar.getInstance();
      c.setTime(hire_date);
      int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
      if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
        return null;
      }

      // emp_no must be unique amongst all employees in the database, including those of other companies. You may wish to include your RIT user ID in the employee number somehow.
      if (!emp_no.contains(company)) {
        emp_no = company + "_" + emp_no;
      }

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

  public Employee updateEmployee(
    String company,
    int emp_id,
    String emp_name,
    String emp_no,
    Date hire_date,
    String job,
    double salary,
    int dept_id,
    int mng_id
  ) {
    try {
      // company – must be your RIT username
      if (!company.equals("ctg7866")) {
        return null;
      }

      // dept_id must exist as a Department in your company
      if (dl.getDepartment(company, dept_id) == null) {
        return null;
      }

      // mng_id must be the record id of an existing Employee in your company. Use 0 if the first employee or any other employee that doesn’t have a manager.
      if (dl.getEmployee(mng_id) == null && mng_id != 0) {
        return null;
      }

      // hire_date must be a valid date equal to the current date or earlier (e.g. current date or in the past)
      if (hire_date.after(new Date(System.currentTimeMillis()))) {
        return null;
      }

      // hire_date must be a Monday, Tuesday, Wednesday, Thursday or a Friday. It cannot be Saturday or Sunday.
      Calendar c = Calendar.getInstance();
      c.setTime(hire_date);
      int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
      if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
        return null;
      }

      // emp_no must be unique amongst all employees in the database, including those of other companies. You may wish to include your RIT user ID in the employee number somehow.
      if (!emp_no.contains(company)) {
        emp_no = company + "_" + emp_no;
      }

      // emp_id must be an existing record number for an employee
      if (dl.getEmployee(emp_id) == null) {
        return null;
      }

      // emp_id must be a valid record id in the database
      if (dl.getEmployee(emp_id) == null) {
        return null;
      }

      Employee emp = new Employee(
        emp_id,
        emp_name,
        emp_no,
        hire_date,
        job,
        salary,
        dept_id,
        mng_id
      );
      dl.updateEmployee(emp);
      return emp;
    } catch (Exception e) {
      System.out.println("Error in updateEmployee: " + e.getMessage());
    }
    return null;
  }

  public int deleteEmployee(String company, int id) {
    try {
      return dl.deleteEmployee(id);
    } catch (Exception e) {
      System.out.println("Error in deleteEmployee: " + e.getMessage());
    }
    return -1;
  }

  public Timecard getTimecard(String company, int id) {
    try {
      return dl.getTimecard(id);
    } catch (Exception e) {
      System.out.println("Error in getTimecard: " + e.getMessage());
    }
    return null;
  }

  public int deleteTimecard(String company, int id) {
    try {
      return dl.deleteTimecard(id);
    } catch (Exception e) {
      System.out.println("Error in deleteTimecard: " + e.getMessage());
    }
    return -1;
  }

  public List<Timecard> getAllTimecards(String company, int emp_id) {
    try {
      return dl.getAllTimecard(emp_id);
    } catch (Exception e) {
      System.out.println("Error in getTimecards: " + e.getMessage());
    }
    return null;
  }
}

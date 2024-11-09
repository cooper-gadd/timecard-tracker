package com.project.two.business;

import companydata.DataLayer;
import companydata.Department;

public class BusinessLayer {

  private DataLayer dl = null;

  public BusinessLayer() {
    dl = new DataLayer("ctg7866");
  }

  public void deleteCompany(String companyName) {
    try {
      dl.deleteCompany(companyName);
    } catch (Exception e) {
      System.out.println("Error in deleteCompany: " + e.getMessage());
    }
  }

  public Department getDepartment(String company, int id) {
    try {
      return dl.getDepartment(company, id);
    } catch (Exception e) {
      System.out.println("Error in getDepartment: " + e.getMessage());
    }
    return null;
  }

  public void insertDepartment(
    String company,
    String deptName,
    String deptNo,
    String location
  ) {
    try {
      dl.insertDepartment(new Department(company, deptName, deptNo, location));
    } catch (Exception e) {
      System.out.println("Error in insertDepartment: " + e.getMessage());
    }
  }

  public Department updateDepartment(
    int id,
    String company,
    String deptName,
    String deptNo,
    String location
  ) {
    try {
      Department dept = new Department(id, company, deptName, deptNo, location);
      dl.updateDepartment(dept);
      return dept;
    } catch (Exception e) {
      System.out.println("Error in updateDepartment: " + e.getMessage());
    }
    return null;
  }

  public void deleteDepartment(String company, int id) {
    try {
      dl.deleteDepartment(company, id);
    } catch (Exception e) {
      System.out.println("Error in deleteDepartment: " + e.getMessage());
    }
  }
}

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
}

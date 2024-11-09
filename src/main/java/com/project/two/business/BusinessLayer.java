package com.project.two.business;

import companydata.DataLayer;

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
}

package com.project.two;

import com.project.two.business.BusinessLayer;
import companydata.Department;
import companydata.Employee;
import companydata.Timecard;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.io.StringReader;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("CompanyServices")
public class MyResource {

  /**
   * Method handling HTTP GET requests. The returned object will be sent
   * to the client as "text/plain" media type.
   *
   * @return String that will be returned as a text/plain response.
   */
  @GET
  @Produces(MediaType.TEXT_PLAIN)
  public String getIt() {
    return "Got it!";
  }

  @DELETE
  @Path("company")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteCompany(@QueryParam("company") String company) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      bl.deleteCompany(company);
      job.add("success", company + "'s information deleted.");
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("department")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getDepartment(
    @QueryParam("company") String company,
    @QueryParam("dept_id") int dept_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      Department dept = bl.getDepartment(company, dept_id);
      JsonObjectBuilder deptJson = Json.createObjectBuilder()
        .add("dept_id", dept.getId())
        .add("company", dept.getCompany())
        .add("dept_name", dept.getDeptName())
        .add("dept_no", dept.getDeptNo())
        .add("location", dept.getLocation());
      return Response.status(Response.Status.OK)
        .entity(deptJson.build())
        .build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @POST
  @Path("department")
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  @Produces(MediaType.APPLICATION_JSON)
  public Response insertDepartment(
    @FormParam("company") String company,
    @FormParam("deptName") String deptName,
    @FormParam("deptNo") String deptNo,
    @FormParam("location") String location
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      Department dept = bl.insertDepartment(
        company,
        deptName,
        deptNo,
        location
      );
      JsonObjectBuilder deptJson = Json.createObjectBuilder()
        .add("dept_id", dept.getId())
        .add("company", dept.getCompany())
        .add("dept_name", dept.getDeptName())
        .add("dept_no", dept.getDeptNo())
        .add("location", dept.getLocation());
      job.add("successs", deptJson);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @PUT
  @Path("department")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateDepartment(String jsonString) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      JsonObject departmentJson = Json.createReader(
        new StringReader(jsonString)
      ).readObject();
      Department updatedDept = bl.updateDepartment(
        departmentJson.getInt("dept_id"),
        departmentJson.getString("company"),
        departmentJson.getString("dept_name"),
        departmentJson.getString("dept_no"),
        departmentJson.getString("location")
      );
      JsonObjectBuilder deptJson = Json.createObjectBuilder()
        .add("dept_id", updatedDept.getId())
        .add("company", updatedDept.getCompany())
        .add("dept_name", updatedDept.getDeptName())
        .add("dept_no", updatedDept.getDeptNo())
        .add("location", updatedDept.getLocation());
      job.add("success", deptJson);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @DELETE
  @Path("department")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteDepartment(
    @QueryParam("company") String company,
    @QueryParam("dept_id") int dept_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      bl.deleteDepartment(company, dept_id);
      job.add(
        "success",
        "Department " + dept_id + " from " + company + " deleted."
      );
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("departments")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getDepartments(@QueryParam("company") String company) {
    BusinessLayer bl = new BusinessLayer();
    try {
      List<Department> departments = bl.getAllDepartments(company);
      JsonArrayBuilder jab = Json.createArrayBuilder();
      for (Department dept : departments) {
        JsonObjectBuilder deptJson = Json.createObjectBuilder()
          .add("dept_id", dept.getId())
          .add("company", dept.getCompany())
          .add("dept_name", dept.getDeptName())
          .add("dept_no", dept.getDeptNo())
          .add("location", dept.getLocation());
        jab.add(deptJson);
      }
      JsonArray departmentsArray = jab.build();
      return Response.status(Response.Status.OK)
        .entity(departmentsArray)
        .build();
    } catch (Exception e) {
      JsonObjectBuilder job = Json.createObjectBuilder();
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("employees")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getEmployees(@QueryParam("company") String company) {
    BusinessLayer bl = new BusinessLayer();
    try {
      List<Employee> employees = bl.getAllEmployees(company);
      JsonArrayBuilder jab = Json.createArrayBuilder();
      for (Employee emp : employees) {
        JsonObjectBuilder empJson = Json.createObjectBuilder()
          .add("emp_id", emp.getId())
          .add("emp_name", emp.getEmpName())
          .add("emp_no", emp.getEmpNo())
          .add("hire_date", emp.getHireDate().toString())
          .add("job", emp.getJob())
          .add("salary", emp.getSalary())
          .add("dept_id", emp.getDeptId())
          .add("mng_id", emp.getMngId());
        jab.add(empJson);
      }
      JsonArray employeesArray = jab.build();
      return Response.status(Response.Status.OK).entity(employeesArray).build();
    } catch (Exception e) {
      JsonObjectBuilder job = Json.createObjectBuilder();
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("employee")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getEmployee(
    @QueryParam("company") String company,
    @QueryParam("emp_id") int emp_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      Employee emp = bl.getEmployee(company, emp_id);
      JsonObjectBuilder empJson = Json.createObjectBuilder()
        .add("emp_id", emp.getId())
        .add("emp_name", emp.getEmpName())
        .add("emp_no", emp.getEmpNo())
        .add("hire_date", emp.getHireDate().toString())
        .add("job", emp.getJob())
        .add("salary", emp.getSalary())
        .add("dept_id", emp.getDeptId())
        .add("mng_id", emp.getMngId());
      return Response.status(Response.Status.OK)
        .entity(empJson.build())
        .build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @POST
  @Path("employee")
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  @Produces(MediaType.APPLICATION_JSON)
  public Response insertEmployee(
    @FormParam("company") String company,
    @FormParam("emp_name") String emp_name,
    @FormParam("emp_no") String emp_no,
    @FormParam("hire_date") Date hire_date,
    @FormParam("job") String job,
    @FormParam("salary") double salary,
    @FormParam("dept_id") int dept_id,
    @FormParam("mng_id") int mng_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder jsonObjectBuilder = Json.createObjectBuilder();
    try {
      Employee emp = bl.insertEmployee(
        company,
        emp_name,
        emp_no,
        hire_date,
        job,
        salary,
        dept_id,
        mng_id
      );
      JsonObjectBuilder empJson = Json.createObjectBuilder()
        .add("emp_id", emp.getId())
        .add("emp_name", emp.getEmpName())
        .add("emp_no", emp.getEmpNo())
        .add("hire_date", emp.getHireDate().toString())
        .add("job", emp.getJob())
        .add("salary", emp.getSalary())
        .add("dept_id", emp.getDeptId())
        .add("mng_id", emp.getMngId());
      jsonObjectBuilder.add("success", empJson);
      return Response.status(Response.Status.OK)
        .entity(jsonObjectBuilder.build())
        .build();
    } catch (Exception e) {
      jsonObjectBuilder.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(jsonObjectBuilder.build())
        .build();
    }
  }

  @PUT
  @Path("employee")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateEmployee(String jsonString) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      JsonObject jsonObject = Json.createReader(
        new StringReader(jsonString)
      ).readObject();
      Employee emp = bl.updateEmployee(
        jsonObject.getString("company"),
        jsonObject.getInt("emp_id"),
        jsonObject.getString("emp_name"),
        jsonObject.getString("emp_no"),
        Date.valueOf(jsonObject.getString("hire_date")),
        jsonObject.getString("job"),
        jsonObject.getJsonNumber("salary").doubleValue(),
        jsonObject.getInt("dept_id"),
        jsonObject.getInt("mng_id")
      );
      JsonObjectBuilder empJson = Json.createObjectBuilder()
        .add("emp_id", emp.getId())
        .add("emp_name", emp.getEmpName())
        .add("emp_no", emp.getEmpNo())
        .add("hire_date", emp.getHireDate().toString())
        .add("job", emp.getJob())
        .add("salary", emp.getSalary())
        .add("dept_id", emp.getDeptId())
        .add("mng_id", emp.getMngId());
      job.add("success", empJson);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @DELETE
  @Path("employee")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteEmployee(
    @QueryParam("company") String company,
    @QueryParam("emp_id") int emp_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      bl.deleteEmployee(company, emp_id);
      job.add("success", "Employee " + emp_id + " deleted");
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("timecard")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTimecard(
    @QueryParam("company") String company,
    @QueryParam("timecard_id") int timecard_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      Timecard tc = bl.getTimecard(company, timecard_id);
      JsonObjectBuilder tcJson = Json.createObjectBuilder()
        .add("timecard_id", tc.getId())
        .add("start_time", tc.getStartTime().toString())
        .add("end_time", tc.getEndTime().toString())
        .add("emp_id", tc.getEmpId());
      JsonObjectBuilder responseJson = Json.createObjectBuilder()
        .add("timecard", tcJson);
      return Response.status(Response.Status.OK)
        .entity(responseJson.build())
        .build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @GET
  @Path("timecards")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getTimecards(
    @QueryParam("company") String company,
    @QueryParam("emp_id") int emp_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    try {
      List<Timecard> timecards = bl.getAllTimecards(company, emp_id);
      JsonArrayBuilder timecardsJson = Json.createArrayBuilder();
      for (Timecard tc : timecards) {
        JsonObjectBuilder tcJson = Json.createObjectBuilder()
          .add("timecard_id", tc.getId())
          .add("start_time", tc.getStartTime().toString())
          .add("end_time", tc.getEndTime().toString())
          .add("emp_id", tc.getEmpId());
        timecardsJson.add(tcJson);
      }
      return Response.status(Response.Status.OK)
        .entity(timecardsJson.build())
        .build();
    } catch (Exception e) {
      JsonObjectBuilder job = Json.createObjectBuilder();
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @POST
  @Path("timecard")
  @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
  @Produces(MediaType.APPLICATION_JSON)
  public Response insertTimecard(
    @FormParam("company") String company,
    @FormParam("emp_id") int emp_id,
    @FormParam("start_time") String start_time,
    @FormParam("end_time") String end_time
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      Timecard tc = bl.insertTimecard(
        company,
        emp_id,
        Timestamp.valueOf(start_time),
        Timestamp.valueOf(end_time)
      );
      JsonObjectBuilder tcJson = Json.createObjectBuilder()
        .add("timecard_id", tc.getId())
        .add("start_time", tc.getStartTime().toString())
        .add("end_time", tc.getEndTime().toString())
        .add("emp_id", tc.getEmpId());
      job.add("success", tcJson);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @PUT
  @Path("timecard")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateTimecard(String timecardJson) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      JsonObject json = Json.createReader(
        new StringReader(timecardJson)
      ).readObject();
      Timecard tc = bl.updateTimecard(
        json.getString("company"),
        json.getInt("timecard_id"),
        json.getInt("emp_id"),
        Timestamp.valueOf(json.getString("start_time")),
        Timestamp.valueOf(json.getString("end_time"))
      );
      JsonObjectBuilder tcJson = Json.createObjectBuilder()
        .add("timecard_id", tc.getId())
        .add("start_time", tc.getStartTime().toString())
        .add("end_time", tc.getEndTime().toString())
        .add("emp_id", tc.getEmpId());
      job.add("success", tcJson);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }

  @DELETE
  @Path("timecard")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteTimecard(
    @QueryParam("company") String company,
    @QueryParam("timecard_id") int timecard_id
  ) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      bl.deleteTimecard(company, timecard_id);
      job.add("success", "Timecard " + timecard_id + " deleted");
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }
}

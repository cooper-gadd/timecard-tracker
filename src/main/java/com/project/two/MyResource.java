package com.project.two;

import com.project.two.business.BusinessLayer;
import jakarta.json.Json;
import jakarta.json.JsonObjectBuilder;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
  @Path("company/{companyName}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteCompany(@PathParam("companyName") String companyName) {
    BusinessLayer bl = new BusinessLayer();
    JsonObjectBuilder job = Json.createObjectBuilder();
    try {
      bl.deleteCompany(companyName);
      job.add("success", true);
      return Response.status(Response.Status.OK).entity(job.build()).build();
    } catch (Exception e) {
      job.add("error", e.getMessage());
      return Response.status(Response.Status.BAD_REQUEST)
        .entity(job.build())
        .build();
    }
  }
}

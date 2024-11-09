# Timecard Tracker Service

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Service Layer](#service-layer)
    - [Description](#description)
    - [Root Path](#root-path)
    - [Base URL Example](#base-url-example)
4. [Data Layer Documentation](#data-layer-documentation)
    - [Description](#description-1)
    - [Methods](#methods)
        - [Company Operations](#company-operations)
        - [Department Operations](#department-operations)
        - [Employee Operations](#employee-operations)
        - [Timecard Operations](#timecard-operations)
        - [Connection Management](#connection-management)
    - [Usage Example](#usage-example)
5. [OpenAPI Specification](#openapi-specification)
6. [Hints](#hints)
7. [Rubric](#rubric)
8. [Deliverables](#deliverables)

---

## Overview

The **Timecard Tracker Service** is a RESTful API developed in Java to help companies track employee timecards. It leverages a provided **Data Layer** for database interactions and includes comprehensive validation within the **Business Layer**. The service supports operations on companies, departments, employees, and timecards, ensuring data integrity and adherence to business rules.

---

## Getting Started

1. **Accept the Assignment**
   - Use the invite link provided on myCourses to accept the assignment.
   - Refresh the page to access starter files.

2. **Clone the Repository**
   ```bash
   cd ~/Developer
   git clone <repository-url>
   ```

3. **Configure the Project**
   - Update `pom.xml` to match your Java SDK version.

4. **Build and Deploy**
   - Use Maven to clean, compile, and package the project.
   - Deploy the generated WAR file to Wildfly.
   - Access the service at:
     ```
     http://127.0.0.1:8080/<your-war-name>/webapi/CompanyServices
     ```
   - Ensure the response `"got it"` is received.

5. **Implement the Service**
   - Define endpoints in `MyResource.java` using `@Path`, `@Produces`, `@Consumes`, etc.
   - Complete the Service and Business Layers as per the specifications.

---

## Service Layer

### Description

The Service Layer exposes various endpoints to manage companies, departments, employees, and timecards. All responses are in JSON format, and appropriate validations are enforced to maintain data consistency. This layer interacts with the Data Layer to perform CRUD operations and handle business logic.

### Root Path

```
/CompanyServices
```

### Base URL Example

```
http://localhost:8080/FrenchBP2/webapi/CompanyServices/
```

---

## Data Layer Documentation

### Description

The **companydata** Data Layer provides methods to interact with the underlying database, handling CRUD operations for companies, departments, employees, and timecards. It ensures database constraints are respected and manages connections efficiently.

### Methods

#### Company Operations
- `int deleteCompany(String companyName)`

#### Department Operations
- `Department insertDepartment(Department department)`
- `List<Department> getAllDepartment(String companyName)`
- `Department getDepartment(String companyName, int dept_id)`
- `Department getDepartmentNo(String companyName, String dept_no)`
- `Department updateDepartment(Department department)`
- `int deleteDepartment(String company, int dept_id)`

#### Employee Operations
- `Employee insertEmployee(Employee employee)`
- `List<Employee> getAllEmployee(String companyName)`
- `Employee getEmployee(int emp_id)`
- `Employee updateEmployee(Employee employee)`
- `int deleteEmployee(int emp_id)`

#### Timecard Operations
- `Timecard insertTimecard(Timecard timecard)`
- `List<Timecard> getAllTimecard(int emp_id)`
- `Timecard getTimecard(int timecard_id)`
- `Timecard updateTimecard(Timecard timecard)`
- `int deleteTimecard(int timecard_id)`

#### Connection Management
- `void close()`

### Usage Example

```java
import companydata.*;

DataLayer dl = null;

try {
     dl = new DataLayer("yourusername");
     // Call desired DataLayer methods
} catch (Exception e) {
    // Handle exceptions
} finally {
     dl.close();
}
```

---

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Timecard Tracker API
  version: 1.0.0
servers:
  - url: http://localhost:8080/FrenchBP2/webapi/CompanyServices
paths:
  /company:
    delete:
      summary: Delete Company Data
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
      responses:
        '200':
          description: Company data deleted successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: string
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /department:
    get:
      summary: Get Department by ID
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: dept_id
          required: true
          schema:
            type: integer
          description: Department record ID
      responses:
        '200':
          description: Department details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Department'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Department
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/DepartmentInput'
      responses:
        '201':
          description: Department created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessDepartment'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Department
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Department'
      responses:
        '200':
          description: Department updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessDepartment'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a Department
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: dept_id
          required: true
          schema:
            type: integer
          description: Department record ID
      responses:
        '200':
          description: Department deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /employees:
    get:
      summary: Get All Employees for a Company
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
      responses:
        '200':
          description: List of Employees
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Employee'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /employee:
    get:
      summary: Get Employee by ID
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: emp_id
          required: true
          schema:
            type: integer
          description: Employee record ID
      responses:
        '200':
          description: Employee details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Employee
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EmployeeInput'
      responses:
        '201':
          description: Employee created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessEmployee'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Employee
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Employee'
      responses:
        '200':
          description: Employee updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessEmployee'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete an Employee
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: emp_id
          required: true
          schema:
            type: integer
          description: Employee record ID
      responses:
        '200':
          description: Employee deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /timecard:
    get:
      summary: Get Timecard by ID
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: timecard_id
          required: true
          schema:
            type: integer
          description: Timecard record ID
      responses:
        '200':
          description: Timecard details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Timecard'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Timecard
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/TimecardInput'
      responses:
        '201':
          description: Timecard created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessTimecard'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Timecard
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Timecard'
      responses:
        '200':
          description: Timecard updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessTimecard'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a Timecard
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: timecard_id
          required: true
          schema:
            type: integer
          description: Timecard record ID
      responses:
        '200':
          description: Timecard deleted successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessMessage'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /timecards:
    get:
      summary: Get All Timecards for an Employee
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: RIT user ID as company name
        - in: query
          name: emp_id
          required: true
          schema:
            type: integer
          description: Employee record ID
      responses:
        '200':
          description: List of Timecards
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Timecard'
        '400':
          description: Error message
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Department:
      type: object
      properties:
        dept_id:
          type: integer
        company:
          type: string
        dept_name:
          type: string
        dept_no:
          type: string
        location:
          type: string
    DepartmentInput:
      type: object
      properties:
        company:
          type: string
        dept_name:
          type: string
        dept_no:
          type: string
        location:
          type: string
    SuccessDepartment:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Department'
    SuccessMessage:
      type: object
      properties:
        success:
          type: string
    Error:
      type: object
      properties:
        error:
          type: string
    Employee:
      type: object
      properties:
        emp_id:
          type: integer
        emp_name:
          type: string
        emp_no:
          type: string
        hire_date:
          type: string
          format: date
        job:
          type: string
        salary:
          type: number
          format: float
        dept_id:
          type: integer
        mng_id:
          type: integer
    EmployeeInput:
      type: object
      properties:
        company:
          type: string
        emp_name:
          type: string
        emp_no:
          type: string
        hire_date:
          type: string
          format: date
        job:
          type: string
        salary:
          type: number
          format: float
        dept_id:
          type: integer
        mng_id:
          type: integer
    SuccessEmployee:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Employee'
    Timecard:
      type: object
      properties:
        timecard_id:
          type: integer
        start_time:
          type: string
          format: date-time
        end_time:
          type: string
          format: date-time
        emp_id:
          type: integer
    TimecardInput:
      type: object
      properties:
        company:
          type: string
        emp_id:
          type: integer
        start_time:
          type: string
          format: date-time
        end_time:
          type: string
          format: date-time
    SuccessTimecard:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Timecard'
```

---

## Hints

1. **Starting Wildfly**
   ```bash
   cd /Applications/wildfly/bin
   sudo ./standalone.sh
   ```
   - Username and password: `student`

2. **Dependencies**
   - Ensure all required JARs are included in `pom.xml`.

3. **Date and Time Conversions**
   - **Timestamp to String**
     ```java
     DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
     String str = df.format(timestamp);
     ```
   - **String to Timestamp**
     ```java
     Timestamp ts = new Timestamp(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(jsonString).getTime());
     ```

4. **Date Conversions**
   - **String to Date**
     ```java
     Date date = new SimpleDateFormat("yyyy-MM-dd").parse(jsonDate);
     ```
   - **Date to String**
     ```java
     String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(date);
     ```

5. **Testing with Postman**
   - **DELETE Method:** Ensure body is empty and correct query parameters are set.
   - **POST Method:** Use `x-www-form-urlencoded` with necessary fields.
   - **PUT Method:** Set `Content-Type` header to `application/json`.

---

## Rubric

| Criteria                                      | Points |
|-----------------------------------------------|--------|
| Correct WEB-INF structure and WAR deployment | 10     |
| All Routes and Verbs                          | 65     |
| All Validations – Use Business Layer          | 15     |
| Output Matches Specifications                 | 10     |
| **Total**                                     | **100**|

---

## Deliverables

Submit the following by the due date:

1. **Project Folder Zip**
2. **WAR File** named: `YourLastNameYourFirstInitialP2.war`

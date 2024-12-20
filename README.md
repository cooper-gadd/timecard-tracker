# Timecard Tracker Service

## Table of Contents

1. [Overview](#overview)
2. [Service Layer](#service-layer)
    - [Description](#description)
    - [Root Path](#root-path)
3. [Business Layer](#business-layer)
    - [Description](#description-1)
    - [Validations](#validations)
        - [General Validation](#general-validation)
        - [Company Operations](#company-operations)
        - [Department Operations](#department-operations)
        - [Employee Operations](#employee-operations)
        - [Timecard Operations](#timecard-operations)
4. [Data Layer Documentation](#data-layer-documentation)
    - [Description](#description-1)
    - [Table Structure](#table-structure)
    - [Models](#models)
    - [Methods](#methods)
        - [Company Operations](#company-operations)
        - [Department Operations](#department-operations)
        - [Employee Operations](#employee-operations)
        - [Timecard Operations](#timecard-operations)
    - [Usage Example](#usage-example)
5. [OpenAPI Specification](#openapi-specification)

---

## Overview

The **Timecard Tracker Service** is a RESTful API developed to help companies track employee timecards. It leverages a provided **Data Layer** for database interactions and includes comprehensive validation within the **Business Layer**. The service supports operations on companies, departments, employees, and timecards, ensuring data integrity and adherence to business rules.

---

## Service Layer

### Description

The **Service Layer** exposes various endpoints to manage companies, departments, employees, and timecards. All responses are in JSON format, and appropriate validations are enforced to maintain data consistency. This layer interacts with the **Business Layer** to perform validations and uses the **Data Layer** to perform CRUD operations.

### Root Path

```
/CompanyServices
```

---

## Business Layer

### Description

The **Business Layer** enforces all business rules and validations required by the application. It acts as an intermediary between the **Service Layer** and the **Data Layer**, ensuring that only valid data is processed and persisted. This layer helps maintain data integrity and enforces constraints beyond basic data types and formats.

### Validations

#### General Validation

- **Data Types and Sizes**: All inputs are validated against the expected data types and sizes as per the database schema.
- **Company Name**: The `company` parameter must match your RIT username in all operations.

#### Company Operations

- **Delete Company** (`DELETE /company`)
  - Validates that the company name matches your RIT username.
  - Confirms that the company exists before attempting deletion.

#### Department Operations

- **Create Department** (`POST /department`)
  - **Unique `dept_no`**: The `dept_no` must be unique across all companies.
    - *Suggestion*: Include your RIT username as part of `dept_no` to ensure uniqueness.
  - **Company Name**: Must match your RIT username.

- **Update Department** (`PUT /department`)
  - **Existing `dept_id`**: The `dept_id` must correspond to an existing department in your company.
  - **Unique `dept_no`**: The updated `dept_no` must remain unique across all companies.
    - *Suggestion*: Include your RIT username as part of `dept_no` to ensure uniqueness.
  - **Company Name**: Must match your RIT username.

- **Delete Department** (`DELETE /department`)
  - Validates that the `dept_id` exists and belongs to your company.
  - Ensures that deleting the department does not violate any foreign key constraints with employees.

- **Get Department** (`GET /department`)
  - Validates that the `dept_id` exists and belongs to your company.

- **Get All Departments** (`GET /departments`)
  - Ensures that only departments belonging to your company are returned.

#### Employee Operations

- **Create Employee** (`POST /employee`)
  - **Company Name**: Must match your RIT username.
  - **Existing `dept_id`**: The `dept_id` must correspond to an existing department in your company.
  - **Valid `mng_id`**:
    - Must be the `emp_id` of an existing employee in your company.
    - Use `0` if the employee does not have a manager.
  - **Valid `hire_date`**:
    - Must be a valid date not in the future.
    - Must be a weekday (Monday to Friday).
  - **Unique `emp_no`**: The `emp_no` must be unique across all employees in the database.
    - *Suggestion*: Include your RIT username in `emp_no` to ensure uniqueness.

- **Update Employee** (`PUT /employee`)
  - **Existing `emp_id`**: The `emp_id` must correspond to an existing employee in your company.
  - **Validations from Create Employee**: All validations from the create operation apply.

- **Delete Employee** (`DELETE /employee`)
  - Validates that the `emp_id` exists and belongs to your company.
  - Ensures that deleting the employee does not violate any foreign key constraints with timecards.

- **Get Employee** (`GET /employee`)
  - Validates that the `emp_id` exists and belongs to your company.

- **Get All Employees** (`GET /employees`)
  - Ensures that only employees belonging to your company are returned.

#### Timecard Operations

- **Create Timecard** (`POST /timecard`)
  - **Company Name**: Must match your RIT username.
  - **Existing `emp_id`**: The `emp_id` must correspond to an existing employee in your company.
  - **Valid `start_time`**:
    - Must be a valid date and time not in the future.
    - Must be after the most recent past Monday if the current day is not Monday.
    - Must be on a weekday (Monday to Friday).
    - Must be between `08:00:00` and `18:00:00` inclusive.
    - Must not overlap with any existing timecard's `start_time` for the same employee.
  - **Valid `end_time`**:
    - Must be at least one hour greater than `start_time`.
    - Must be on the same day as `start_time`.
    - Must be between `08:00:00` and `18:00:00` inclusive.

- **Update Timecard** (`PUT /timecard`)
  - **Existing `timecard_id`**: The `timecard_id` must correspond to an existing timecard for your company's employee.
  - **Validations from Create Timecard**: All validations from the create operation apply.

- **Delete Timecard** (`DELETE /timecard`)
  - Validates that the `timecard_id` exists and belongs to an employee in your company.

- **Get Timecard** (`GET /timecard`)
  - Validates that the `timecard_id` exists and belongs to an employee in your company.

- **Get All Timecards** (`GET /timecards`)
  - Validates that the `emp_id` exists and belongs to your company.
  - Ensures that only timecards belonging to the specified employee are returned.

---

## Data Layer Documentation

### Description

The **Data Layer** provides methods to interact with the underlying database, handling CRUD operations for companies, departments, employees, and timecards. It ensures database constraints are respected and manages connections efficiently.

### Table Structure

The employee table has two foreign keys:
1. `mng_id` references `employee.emp_id`
2. `dept_id` references `department.dept_id`

The employee table has an additional unique index on `emp_no` besides the primary key.

The timecard table has one foreign key:
1. `emp_id` references `employee.emp_id`

The department table has one additional unique index on `dept_no` besides the primary key.

![ER Diagram](./diagrams/er.png)

### Models

The Data Layer includes the following model classes, each equipped with multiple constructors to facilitate various initialization scenarios.

![Class Diagram](./diagrams/class.png)

#### Employee

- `Employee(String emp_name, String emp_no, Date hire_date, String job, Double salary, int dept_id, int mng_id)`

  Creates a new `Employee` instance without specifying an `emp_id`.

- `Employee(int emp_id, String emp_name, String emp_no, Date hire_date, String job, Double salary, int dept_id, int mng_id)`

  Creates a new `Employee` instance with a specified `emp_id`.

#### Department

- `Department(String company, String dept_name, String dept_no, String location)`

  Creates a new `Department` instance with all primary attributes.

- `Department(int dept_id, String company, String dept_name, String dept_no, String location)`

  Creates a new `Department` instance with a specified `dept_id`.

- `Department(String company, int dept_id)`

  Creates a `Department` instance by specifying only the company and department ID.

- `Department()`

  Creates a `Department` instance with default values (no-argument constructor).

#### Timecard

- `Timecard(Timestamp start_time, Timestamp end_time, int emp_id)`

  Creates a new `Timecard` instance without specifying a `timecard_id`.

- `Timecard(int timecard_id, Timestamp start_time, Timestamp end_time, int emp_id)`

  Creates a new `Timecard` instance with a specified `timecard_id`.

- `Timecard()`

  Creates a `Timecard` instance with default values (no-argument constructor).

### Methods

All methods in the Data Layer throw an exception if there is an error, such as the requested object not existing.

#### Company Operations

- **`int deleteCompany(String companyName)`**

  Deletes all Departments, Employees, and Timecards associated with the specified company.

  **Parameters:**
  - `companyName` (`String`): The name of the company to delete.

  **Returns:**
  - `int`: The number of rows deleted.

  **Throws:**
  - `Exception`: If an error occurs or the company does not exist.

#### Department Operations

- **`Department insertDepartment(Department department)`**

  Inserts a new Department into the database.

  **Parameters:**
  - `department` (`Department`): The Department object to insert.

  **Returns:**
  - `Department`: The inserted Department object, potentially with an updated ID.

  **Throws:**
  - `Exception`: If an error occurs or the department data is invalid.

- **`List<Department> getAllDepartment(String companyName)`**

  Retrieves all Departments for the specified company.

  **Parameters:**
  - `companyName` (`String`): The name of the company whose departments are to be retrieved.

  **Returns:**
  - `List<Department>`: A list of Department objects.

  **Throws:**
  - `Exception`: If an error occurs or the company does not exist.

- **`Department getDepartment(String companyName, int dept_id)`**

  Retrieves a specific Department by its ID for the given company.

  **Parameters:**
  - `companyName` (`String`): The name of the company.
  - `dept_id` (`int`): The ID of the department to retrieve.

  **Returns:**
  - `Department`: The requested Department object.

  **Throws:**
  - `Exception`: If an error occurs or the department does not exist.

- **`Department getDepartmentNo(String companyName, String dept_no)`**

  Retrieves a specific Department by its number for the given company.

  **Parameters:**
  - `companyName` (`String`): The name of the company.
  - `dept_no` (`String`): The number of the department to retrieve.

  **Returns:**
  - `Department`: The requested Department object.

  **Throws:**
  - `Exception`: If an error occurs or the department does not exist.

- **`Department updateDepartment(Department department)`**

  Updates an existing Department's information.

  **Parameters:**
  - `department` (`Department`): The Department object containing updated information.

  **Returns:**
  - `Department`: The updated Department object.

  **Throws:**
  - `Exception`: If an error occurs or the department does not exist.

- **`int deleteDepartment(String company, int dept_id)`**

  Deletes a specific Department for the given company.

  **Parameters:**
  - `company` (`String`): The name of the company.
  - `dept_id` (`int`): The ID of the department to delete.

  **Returns:**
  - `int`: The number of rows deleted.

  **Throws:**
  - `Exception`: If an error occurs or the department does not exist.

#### Employee Operations

- **`Employee insertEmployee(Employee employee)`**

  Inserts a new Employee into the database.

  **Parameters:**
  - `employee` (`Employee`): The Employee object to insert.

  **Returns:**
  - `Employee`: The inserted Employee object, potentially with an updated ID.

  **Throws:**
  - `Exception`: If an error occurs or the employee data is invalid.

- **`List<Employee> getAllEmployee(String companyName)`**

  Retrieves all Employees for the specified company.

  **Parameters:**
  - `companyName` (`String`): The name of the company whose employees are to be retrieved.

  **Returns:**
  - `List<Employee>`: A list of Employee objects.

  **Throws:**
  - `Exception`: If an error occurs or the company does not exist.

- **`Employee getEmployee(int emp_id)`**

  Retrieves a specific Employee by their ID.

  **Parameters:**
  - `emp_id` (`int`): The ID of the employee to retrieve.

  **Returns:**
  - `Employee`: The requested Employee object.

  **Throws:**
  - `Exception`: If an error occurs or the employee does not exist.

- **`Employee updateEmployee(Employee employee)`**

  Updates an existing Employee's information.

  **Parameters:**
  - `employee` (`Employee`): The Employee object containing updated information.

  **Returns:**
  - `Employee`: The updated Employee object.

  **Throws:**
  - `Exception`: If an error occurs or the employee does not exist.

- **`int deleteEmployee(int emp_id)`**

  Deletes a specific Employee.

  **Parameters:**
  - `emp_id` (`int`): The ID of the employee to delete.

  **Returns:**
  - `int`: The number of rows deleted.

  **Throws:**
  - `Exception`: If an error occurs or the employee does not exist.

#### Timecard Operations

- **`Timecard insertTimecard(Timecard timecard)`**

  Inserts a new Timecard into the database.

  **Parameters:**
  - `timecard` (`Timecard`): The Timecard object to insert.

  **Returns:**
  - `Timecard`: The inserted Timecard object, potentially with an updated ID.

  **Throws:**
  - `Exception`: If an error occurs or the timecard data is invalid.

- **`List<Timecard> getAllTimecard(int emp_id)`**

  Retrieves all Timecards for a specific Employee.

  **Parameters:**
  - `emp_id` (`int`): The ID of the employee whose timecards are to be retrieved.

  **Returns:**
  - `List<Timecard>`: A list of Timecard objects.

  **Throws:**
  - `Exception`: If an error occurs or the employee does not exist.

- **`Timecard getTimecard(int timecard_id)`**

  Retrieves a specific Timecard by its ID.

  **Parameters:**
  - `timecard_id` (`int`): The ID of the timecard to retrieve.

  **Returns:**
  - `Timecard`: The requested Timecard object.

  **Throws:**
  - `Exception`: If an error occurs or the timecard does not exist.

- **`Timecard updateTimecard(Timecard timecard)`**

  Updates an existing Timecard's information.

  **Parameters:**
  - `timecard` (`Timecard`): The Timecard object containing updated information.

  **Returns:**
  - `Timecard`: The updated Timecard object.

  **Throws:**
  - `Exception`: If an error occurs or the timecard does not exist.

- **`int deleteTimecard(int timecard_id)`**

  Deletes a specific Timecard.

  **Parameters:**
  - `timecard_id` (`int`): The ID of the timecard to delete.

  **Returns:**
  - `int`: The number of rows deleted.

  **Throws:**
  - `Exception`: If an error occurs or the timecard does not exist.

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Timecard Tracker API
  version: 1.0.0
servers:
  - url: http://localhost:8080/<your-war-name>/webapi/CompanyServices
paths:
  /company:
    delete:
      summary: Delete Company Data
      description: Deletes all Department, Employee, and Timecard records for the given company.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
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
                    example: "ctg7866's information deleted."
        '400':
          description: Error occurred while deleting company data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /department:
    get:
      summary: Get Department by ID
      description: Returns the requested Department as a JSON object.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
        - in: query
          name: dept_id
          required: true
          schema:
            type: integer
          description: Department record ID
      responses:
        '200':
          description: Department details retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Department'
        '400':
          description: Error occurred while retrieving department
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Department
      description: Creates a new Department record.
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/DepartmentInsert'
      responses:
        '200':
          description: Department created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessDepartment'
        '400':
          description: Error occurred while creating department
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Department
      description: Updates an existing Department record.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DepartmentUpdate'
      responses:
        '200':
          description: Department updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessDepartment'
        '400':
          description: Error occurred while updating department
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a Department
      description: Deletes a specific Department record.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
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
                $ref: '#/components/schemas/SuccessMessageDepartment'
        '400':
          description: Error occurred while deleting department
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /departments:
    get:
      summary: Get All Departments for a Company
      description: Returns a list of all Departments for the specified company.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
      responses:
        '200':
          description: List of Departments retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Department'
        '400':
          description: Error occurred while retrieving departments
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /employee:
    get:
      summary: Get Employee by ID
      description: Returns the requested Employee as a JSON object.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
        - in: query
          name: emp_id
          required: true
          schema:
            type: integer
          description: Employee record ID
      responses:
        '200':
          description: Employee details retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Employee'
        '400':
          description: Error occurred while retrieving employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Employee
      description: Creates a new Employee record.
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EmployeeInsert'
      responses:
        '200':
          description: Employee created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessEmployee'
        '400':
          description: Error occurred while creating employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Employee
      description: Updates an existing Employee record.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmployeeUpdate'
      responses:
        '200':
          description: Employee updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessEmployee'
        '400':
          description: Error occurred while updating employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete an Employee
      description: Deletes a specific Employee record.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
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
                $ref: '#/components/schemas/SuccessMessageEmployee'
        '400':
          description: Error occurred while deleting employee
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /employees:
    get:
      summary: Get All Employees for a Company
      description: Returns a list of all Employees for the specified company.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
      responses:
        '200':
          description: List of Employees retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Employee'
        '400':
          description: Error occurred while retrieving employees
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /timecard:
    get:
      summary: Get Timecard by ID
      description: Returns the requested Timecard as a JSON object.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
        - in: query
          name: timecard_id
          required: true
          schema:
            type: integer
          description: Timecard record ID
      responses:
        '200':
          description: Timecard details retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Timecard'
        '400':
          description: Error occurred while retrieving timecard
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    post:
      summary: Create a New Timecard
      description: Creates a new Timecard record.
      requestBody:
        required: true
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/TimecardInsert'
      responses:
        '200':
          description: Timecard created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessTimecard'
        '400':
          description: Error occurred while creating timecard
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    put:
      summary: Update an Existing Timecard
      description: Updates an existing Timecard record.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/TimecardUpdate'
      responses:
        '200':
          description: Timecard updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SuccessTimecard'
        '400':
          description: Error occurred while updating timecard
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
    delete:
      summary: Delete a Timecard
      description: Deletes a specific Timecard record.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
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
                $ref: '#/components/schemas/SuccessMessageTimecard'
        '400':
          description: Error occurred while deleting timecard
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
  /timecards:
    get:
      summary: Get All Timecards for an Employee
      description: Returns a list of all Timecards for the specified employee.
      parameters:
        - in: query
          name: company
          required: true
          schema:
            type: string
          description: Your RIT username as the company name
        - in: query
          name: emp_id
          required: true
          schema:
            type: integer
          description: Employee record ID
      responses:
        '200':
          description: List of Timecards retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Timecard'
        '400':
          description: Error occurred while retrieving timecards
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
components:
  schemas:
    Error:
      type: object
      properties:
        error:
          type: string
          example: "An appropriate error message."
    SuccessDepartment:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Department'
    SuccessMessageDepartment:
      type: object
      properties:
        success:
          type: string
          example: "Department 5 from ctg7866 deleted."
    Department:
      type: object
      properties:
        dept_id:
          type: integer
          example: 1
        company:
          type: string
          example: "ctg7866"
        dept_name:
          type: string
          example: "Accounting"
        dept_no:
          type: string
          example: "ctg7866_D10"
        location:
          type: string
          example: "New York"
      required:
        - dept_id
        - company
        - dept_name
        - dept_no
        - location
    DepartmentInsert:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        dept_name:
          type: string
          example: "Research"
        dept_no:
          type: string
          example: "D20"
        location:
          type: string
          example: "Chicago"
      required:
        - company
        - dept_name
        - dept_no
        - location
    DepartmentUpdate:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        dept_id:
          type: integer
          example: 5
        dept_name:
          type: string
          example: "Research"
        dept_no:
          type: string
          example: "D20"
        location:
          type: string
          example: "Chicago"
      required:
        - company
        - dept_id
        - dept_name
        - dept_no
        - location
    SuccessEmployee:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Employee'
    SuccessMessageEmployee:
      type: object
      properties:
        success:
          type: string
          example: "Employee 3 deleted"
    Employee:
      type: object
      properties:
        emp_id:
          type: integer
          example: 15
        emp_name:
          type: string
          example: "French"
        emp_no:
          type: string
          example: "ctg7866-E1B"
        hire_date:
          type: string
          format: date
          example: "2018-06-16"
        job:
          type: string
          example: "Programmer"
        salary:
          type: number
          format: float
          example: 6000.0
        dept_id:
          type: integer
          example: 1
        mng_id:
          type: integer
          example: 2
      required:
        - emp_id
        - emp_name
        - emp_no
        - hire_date
        - job
        - salary
        - dept_id
        - mng_id
    EmployeeInsert:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        emp_name:
          type: string
          example: "Smith"
        emp_no:
          type: string
          example: "E3"
        hire_date:
          type: string
          format: date
          example: "2023-10-01"
        job:
          type: string
          example: "Developer"
        salary:
          type: number
          format: float
          example: 60000.0
        dept_id:
          type: integer
          example: 2
        mng_id:
          type: integer
          example: 2
      required:
        - company
        - emp_name
        - emp_no
        - hire_date
        - job
        - salary
        - dept_id
        - mng_id
    EmployeeUpdate:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        emp_id:
          type: integer
          example: 15
        emp_name:
          type: string
          example: "French"
        emp_no:
          type: string
          example: "ctg7866-E1B"
        hire_date:
          type: string
          format: date
          example: "2018-06-16"
        job:
          type: string
          example: "Programmer"
        salary:
          type: number
          format: float
          example: 6000.0
        dept_id:
          type: integer
          example: 1
        mng_id:
          type: integer
          example: 2
      required:
        - company
        - emp_id
        - emp_name
        - emp_no
        - hire_date
        - job
        - salary
        - dept_id
        - mng_id
    SuccessTimecard:
      type: object
      properties:
        success:
          $ref: '#/components/schemas/Timecard'
    SuccessMessageTimecard:
      type: object
      properties:
        success:
          type: string
          example: "Timecard 5 deleted"
    Timecard:
      type: object
      properties:
        timecard_id:
          type: integer
          example: 2
        start_time:
          type: string
          format: date-time
          example: "2018-06-14 11:30:00"
        end_time:
          type: string
          format: date-time
          example: "2018-06-14 15:30:00"
        emp_id:
          type: integer
          example: 1
      required:
        - timecard_id
        - start_time
        - end_time
        - emp_id
    TimecardInsert:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        emp_id:
          type: integer
          example: 1
        start_time:
          type: string
          format: date-time
          example: "2018-06-14 11:30:00"
        end_time:
          type: string
          format: date-time
          example: "2018-06-14 15:30:00"
      required:
        - company
        - emp_id
        - start_time
        - end_time
    TimecardUpdate:
      type: object
      properties:
        company:
          type: string
          example: "ctg7866"
        timecard_id:
          type: integer
          example: 2
        start_time:
          type: string
          format: date-time
          example: "2018-06-14 11:30:00"
        end_time:
          type: string
          format: date-time
          example: "2018-06-14 15:30:00"
        emp_id:
          type: integer
          example: 1
      required:
        - company
        - timecard_id
        - start_time
        - end_time
        - emp_id
```

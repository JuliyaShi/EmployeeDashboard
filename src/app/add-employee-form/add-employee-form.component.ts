import { Component } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { Employee } from '../employee.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-employee-form',
  templateUrl: './add-employee-form.component.html',
  styleUrls: ['./add-employee-form.component.css']
})
export class AddEmployeeFormComponent {
    employee: Employee = {
    name: '',
    jobTitle: '',
    tenure: '',
    gender: ''
  };
  constructor(private employeeService: EmployeeService, private http: HttpClient, private router: Router) {}

  newEmployee() {
    // Add validation logic if required

    // Call the employee service to add the new employee
    this.employeeService.addEmployee(this.employee).subscribe({
      next: (newEmployee) => {
        // Employee added successfully
        console.log('Employee added:', newEmployee);
        // Update the employee table here if required
        // Call the updateEmployeeTable() method or any other logic you have for updating the table
      },
      error: (error) => {
        // Error occurred while adding employee
        console.log('Error adding employee:', error);
      }
    });

    // Reset the form after adding the employee
    this.resetForm();
  }

  updateEmployeeTable() {
    // Reload the employee data from the JSON file
    this.http.get<Employee>('assets/new_hire.json').subscribe(
      (data: Employee) => {
        // Update the employeeData with the new data
        this.employee = data;
      },
      (error) => {
        console.error('Error loading employee data:', error);
      }
    );
    this.router.navigate(['/dashboard']);

  }


  resetForm() {
    // Reset the employee object and form fields
    this.employee = {
      name: '',
      jobTitle: '',
      tenure: '',
      gender: ''
    };
  }
}

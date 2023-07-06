import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Employee, EmployeeService } from '../employee.service'; // Import the Employee interface from the appropriate file

@Component({
  selector: 'app-add-employee-form',
  templateUrl: './add-employee-form.component.html',
  styleUrls: ['./add-employee-form.component.css']
})
export class AddEmployeeFormComponent {
  @ViewChild('employeeForm', { static: false }) employeeForm!: NgForm;
  employee: Employee = {
    name: '',
    jobTitle: '',
    tenure: 0,
    gender: ''
  };

  formSubmitted: boolean = false;
  formErrors: { [key: string]: boolean } = {};

  constructor(private http: HttpClient, private router: Router, private employeeService: EmployeeService) {}

  submitForm() {
    this.formSubmitted = true;
    this.formErrors = {};

    if (this.isFormValid()) {
      // Create the JSON data to send in the POST request
      const data: Employee = {
        name: this.employee.name as string,
        jobTitle: this.employee.jobTitle as string,
        tenure: Number(this.employee.tenure),
        gender: this.employee.gender as string
      };

      // Set the headers for the request
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      // Make the POST request using HttpClient
      this.employeeService.addEmployee(data).subscribe(
        (response) => {
          console.log('Employee added:', response);
          // Reset the form
          this.resetForm();
          // Redirect to the dashboard page
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error adding employee:', error);
          // Handle the error appropriately
        }
      );
    } else {
      this.validateForm();
    }
  }

  isFormValid(): boolean {
    return (
      this.employee.name.trim().length > 0 && typeof this.employee.name === 'string' &&
      this.employee.jobTitle.trim().length > 0 && typeof this.employee.jobTitle === 'string' &&
      this.employee.tenure.toString().length > 0 && typeof this.employee.tenure === 'number' &&
      this.employee.gender.trim().length > 0 && typeof this.employee.gender === 'string'
    );
  }

  validateForm() {
    const { name, jobTitle, tenure, gender } = this.employee;

    this.formErrors = {
      name: !name || typeof name !== 'string',
      jobTitle: !jobTitle || typeof jobTitle !== 'string',
      tenure: !tenure || typeof tenure !== 'number',
      gender: !gender || typeof gender !== 'string'
    };
  }

  resetForm() {
    this.employee = {
      name: '',
      jobTitle: '',
      tenure: 0,
      gender: ''
    };
    this.formSubmitted = false;
    this.formErrors = {};
  }
}



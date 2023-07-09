import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Employee, EmployeeService } from '../employee.service';

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
    gender: 'Select gender'
  };

  formSubmitted: boolean = false;
  formErrors: { [key: string]: boolean | string } = {};

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
        (response) => {          // Reset the form
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
      !isNaN(Number(this.employee.tenure)) && this.employee.gender.trim().length > 0 && typeof this.employee.gender === 'string'
    );
  }

  validateForm() {
    const { name, jobTitle, tenure, gender } = this.employee;

    this.formErrors = {
      name: !name || typeof name !== 'string' || name.trim().length === 0 || /\d/.test(name) ? 'Please enter a valid name.' : '',
      jobTitle: !jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0 || /\d/.test(jobTitle) ? 'Please enter a valid job title.' : '',
      tenure: isNaN(Number(tenure)) ? 'Please enter a valid tenure.' : '',
      gender: !gender || typeof gender !== 'string' || gender.trim().length === 0 ? 'Please select a valid gender.' : ''
    };
  }

  resetForm() {
    this.employee = {
      name: '',
      jobTitle: '',
      tenure: 0,
      gender: 'Select gender'
    };
    this.formSubmitted = false;
    this.formErrors = {};
  }
}



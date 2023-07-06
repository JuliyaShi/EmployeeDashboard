import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AddEmployeeFormComponent } from './add-employee-form.component';
import { EmployeeService, Employee } from '../employee.service';

describe('AddEmployeeFormComponent', () => {
  let component: AddEmployeeFormComponent;
  let fixture: ComponentFixture<AddEmployeeFormComponent>;
  let employeeService: EmployeeService;
  let httpTestingController: HttpTestingController;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, RouterTestingModule, HttpClientTestingModule],
        declarations: [AddEmployeeFormComponent],
        providers: [EmployeeService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEmployeeFormComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('submitForm()', () => {
    it('should call addEmployee() method of employeeService and reset the form when form is valid', () => {
      spyOn(employeeService, 'addEmployee').and.returnValue(of({ name: 'John Doe', jobTitle: 'Developer', tenure: 2, gender: 'Male' }));
      spyOn(component, 'resetForm');

      component.employee = {
        name: 'John Doe',
        jobTitle: 'Developer',
        tenure: 2,
        gender: 'Male',
      };
      component.submitForm();

      expect(employeeService.addEmployee).toHaveBeenCalledWith(component.employee);
      expect(component.resetForm).toHaveBeenCalled();
    });

    it('should not call addEmployee() method of employeeService when form is invalid', () => {
      spyOn(employeeService, 'addEmployee');
      spyOn(component, 'resetForm');

      component.employee = {
        name: '',
        jobTitle: '',
        tenure: 0,
        gender: '',
      };
      component.submitForm();

      expect(employeeService.addEmployee).not.toHaveBeenCalled();
      expect(component.resetForm).not.toHaveBeenCalled();
    });
  });

  describe('isFormValid()', () => {
    it('should return true when all fields are valid', () => {
      component.employee = {
        name: 'John Doe',
        jobTitle: 'Developer',
        tenure: 2,
        gender: 'Male',
      };
      const isValid = component.isFormValid();

      expect(isValid).toBe(true);
    });

    it('should return false when any field is invalid', () => {
      component.employee = {
        name: '',
        jobTitle: 'Developer',
        tenure: 2,
        gender: 'Male',
      };
      const isValid = component.isFormValid();

      expect(isValid).toBe(false);
    });
  });

  describe('validateForm()', () => {
    it('should set formErrors for each field when it is invalid', () => {
      component.employee = {
        name: '',
        jobTitle: '',
        tenure: 0,
        gender: '',
      };
      component.validateForm();

      expect(component.formErrors['name']).toBe(true);
      expect(component.formErrors['jobTitle']).toBe(true);
      expect(component.formErrors['tenure']).toBe(true);
      expect(component.formErrors['gender']).toBe(true);
    });

    it('should not set formErrors for any field when all fields are valid', () => {
      component.employee = {
        name: 'John Doe',
        jobTitle: 'Developer',
        tenure: 2,
        gender: 'Male',
      };
      component.validateForm();

      expect(component.formErrors['name']).toBe(false);
      expect(component.formErrors['jobTitle']).toBe(false);
      expect(component.formErrors['tenure']).toBe(false);
      expect(component.formErrors['gender']).toBe(false);
    });
  });

  describe('resetForm()', () => {
    it('should reset employee and form properties', () => {
      component.employee = {
        name: 'John Doe',
        jobTitle: 'Developer',
        tenure: 2,
        gender: 'Male',
      };
      component.formSubmitted = true;
      component.formErrors = {
        name: true,
        jobTitle: false,
        tenure: true,
        gender: false,
      };

      component.resetForm();

      expect(component.employee).toEqual({ name: '', jobTitle: '', tenure: 0, gender: '' });
      expect(component.formSubmitted).toBe(false);
      expect(component.formErrors).toEqual({});
    });
  });
});

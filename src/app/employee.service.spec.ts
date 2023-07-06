import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService, Employee } from './employee.service';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an employee', () => {
    const employee: Employee = {
      name: 'John Doe',
      jobTitle: 'Developer',
      tenure: 2,
      gender: 'Male'
    };

    service.addEmployee(employee).subscribe(response => {
      expect(response).toEqual(employee);
    });

    const request = httpMock.expectOne('http://localhost:8000/employees');
    expect(request.request.method).toBe('POST');
    request.flush(employee);
  });

  it('should get employees', () => {
    const employees = [
      { name: 'John Doe', jobTitle: 'Developer', tenure: 2, gender: 'Male' },
      { name: 'Jane Smith', jobTitle: 'Designer', tenure: 3, gender: 'Female' }
    ];

    service.getEmployees().subscribe(response => {
      expect(response).toEqual(employees);
    });

    const request = httpMock.expectOne('http://localhost:8000/employees');
    expect(request.request.method).toBe('GET');
    request.flush(employees);
  });
});

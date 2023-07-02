import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Employee {
  name: string;
  jobTitle: string;
  tenure: string;
  gender: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly employeeUrl = 'assets/hew_hire.json';

  constructor(private http: HttpClient) { }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.employeeUrl}/employees`, employee);
  }

  getEmployees(): Observable<any> {
    return this.http.get<any>(this.employeeUrl);
  }
}

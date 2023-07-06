import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { EmployeeService } from '../employee.service';

fdescribe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let employeeService: EmployeeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DashboardComponent],
      providers: [EmployeeService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate job title chart', () => {
    const mockChartInstance = jasmine.createSpyObj('Chart', ['destroy']);
    spyOn(component.jobTitleChartCanvas.nativeElement, 'getContext').and.returnValue({});
    spyOn(component, 'generateJobTitleChart').and.callThrough();

    component.ngAfterViewInit();
    expect(component.generateJobTitleChart).toHaveBeenCalled();
    expect(component.jobTitleChart).toBeDefined();

    component.jobTitleChart = mockChartInstance;
    component.generateJobTitleChart();
    expect(mockChartInstance.destroy).toHaveBeenCalled();
  });

  it('should generate gender chart', () => {
    const mockChartInstance = jasmine.createSpyObj('Chart', ['destroy']);
    spyOn(component.genderChartCanvas.nativeElement, 'getContext').and.returnValue({});
    spyOn(component, 'generateGenderChart').and.callThrough();

    component.ngAfterViewInit();
    expect(component.generateGenderChart).toHaveBeenCalled();
    expect(component.genderChart).toBeDefined();

    component.genderChart = mockChartInstance;
    component.generateGenderChart();
    expect(mockChartInstance.destroy).toHaveBeenCalled();
  });

  it('should fetch employees and generate charts on initialization', () => {
    const mockEmployees = [
      { name: 'John Doe', jobTitle: 'Developer', tenure: 2, gender: 'Male' },
      { name: 'Jane Smith', jobTitle: 'Designer', tenure: 4, gender: 'Female' },
    ];
    spyOn(employeeService, 'getEmployees').and.returnValue(of(mockEmployees));
    spyOn(component, 'generateJobTitleChart');
    spyOn(component, 'generateGenderChart');

    component.ngOnInit();

    expect(employeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
    expect(component.generateJobTitleChart).toHaveBeenCalled();
    expect(component.generateGenderChart).toHaveBeenCalled();
  });

  it('should sort the table', () => {
    component.employees = [
      { name: 'John Doe', jobTitle: 'Developer', tenure: 2, gender: 'Male' },
      { name: 'Jane Smith', jobTitle: 'Designer', tenure: 4, gender: 'Female' },
    ];

    component.sortTable('name');
    expect(component.employees[0].name).toBe('Jane Smith');
    expect(component.employees[1].name).toBe('John Doe');

    component.sortTable('tenure');
    expect(component.employees[0].tenure).toBe(2);
    expect(component.employees[1].tenure).toBe(4);
  });
});

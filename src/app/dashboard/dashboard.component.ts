import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { EmployeeService, Employee } from '../employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('jobTitleChartCanvas', { static: false }) jobTitleChartCanvas!: ElementRef;
  @ViewChild('genderChartCanvas', { static: false }) genderChartCanvas!: ElementRef;

  jobTitleChart!: Chart<'doughnut', number[], string>;
  genderChart!: Chart<'bar', number[], string>;

  employees: Employee[] = [];
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private http: HttpClient, private employeeService: EmployeeService) { }

  ngAfterViewInit(): void {
    this.generateJobTitleChart();
    this.generateGenderChart();
  }

  ngOnInit() {
    Chart.register(...registerables);
    this.employeeService.getEmployees().subscribe({
      next: employees => {
        this.employees = employees;
        this.generateJobTitleChart();
        this.generateGenderChart();
      },
      error: error => {
        console.error('Error:', error);
      }
    });
  }

  generateJobTitleChart(): void {
    const jobTitles = this.employees.map(employee => employee.jobTitle);
    const jobTitleCounts = jobTitles.reduce((counts: { [key: string]: number }, title: string) => {
      counts[title] = (counts[title] || 0) + 1;
      return counts;
    }, {});

    if (this.jobTitleChart) {
      this.jobTitleChart.destroy(); // Destroy the existing chart instance
    }

    if (this.jobTitleChartCanvas) {
      const jobTitleChartCanvas = this.jobTitleChartCanvas.nativeElement.getContext('2d');
      this.jobTitleChart = new Chart(jobTitleChartCanvas, {
        type: 'doughnut',
        data: {
          labels: Object.keys(jobTitleCounts),
          datasets: [
            {
              data: Object.values(jobTitleCounts),
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgba(245, 152, 66)',
                'rgba(66, 245, 245)',
              ],
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
      });
    }
  }

  generateGenderChart(): void {
  const genderCounts: { [key: string]: number } = this.employees.reduce((counts: { [key: string]: number }, employee: Employee) => {
    counts[employee.gender] = (counts[employee.gender] || 0) + 1;
    return counts;
  }, {});

  const genders = Object.keys(genderCounts);

  if (this.genderChart) {
    this.genderChart.destroy(); // Destroy the existing chart instance
  }

  if (this.genderChartCanvas) {
    const genderChartCanvas = this.genderChartCanvas.nativeElement.getContext('2d');

    this.genderChart = new Chart(genderChartCanvas, {
      type: 'bar',
      data: {
        labels: genders,
        datasets: [
          {
            data: Object.values(genderCounts),
            backgroundColor: [
              'rgba(41, 80, 179)', // Blue color for Male
              'rgba(237, 9, 165)', // Pink color for Female
            ],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              generateLabels: (chart: any) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label: string, index: number) => {
                    const dataset = data.datasets[0];
                    const backgroundColor = dataset.backgroundColor[index];
                    const borderColor = dataset.borderColor[index];
                    const borderWidth = dataset.borderWidth;

                    return {
                      text: label,
                      fillStyle: backgroundColor,
                      strokeStyle: borderColor,
                      lineWidth: borderWidth,
                      hidden: false,
                      index: index
                    };
                  });
                }
                return [];
              }
            }
          }
        },
      },
    });
  }
}

  sortTable(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.employees.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue, undefined, { numeric: true });
      } else {
        return aValue - bValue;
      }
    });

    if (this.sortDirection === 'desc') {
      this.employees.reverse();
    }
  }
}

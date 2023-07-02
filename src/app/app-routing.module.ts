import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddEmployeeFormComponent } from './add-employee-form/add-employee-form.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-employee', component: AddEmployeeFormComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

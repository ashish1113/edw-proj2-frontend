import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { EditIssueComponent } from './edit-issue/edit-issue.component';
import { IssueDescriptionViewComponent } from './issue-description-view/issue-description-view.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { RouteGaurdService } from './route-gaurd.service';
import {NgxPaginationModule} from 'ngx-pagination';
import { QuillModule } from 'ngx-quill'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    QuillModule.forRoot(),
    RouterModule.forChild([
      {path:'userDashboard', component: UserDashboardComponent, canActivate:[RouteGaurdService]},
      {path:'loggedin/userDashboard', component: UserDashboardComponent, canActivate:[RouteGaurdService]},
      //{path:'userDashboard', component: UserDashboardComponent},
      {path:'issue-description-view', component: IssueDescriptionViewComponent, canActivate:[RouteGaurdService]},
      {path:'create-issue', component: CreateIssueComponent, canActivate:[RouteGaurdService]},
      {path:'edit-issue', component: EditIssueComponent, canActivate:[RouteGaurdService]},
      
    ])
  ],
  declarations: [CreateIssueComponent, EditIssueComponent, IssueDescriptionViewComponent, UserDashboardComponent],
  providers: [RouteGaurdService]
})
export class DashboardModule { }

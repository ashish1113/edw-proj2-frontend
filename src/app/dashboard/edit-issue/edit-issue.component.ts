import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-edit-issue',
  templateUrl: './edit-issue.component.html',
  styleUrls: ['./edit-issue.component.css']
})
export class EditIssueComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({});

  public fullName: string;
  public currentIssueId: any;
  public currentFormData: any;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;

  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueStatus: any;
  public issueTitle: any;
  public issueScreenShotPath: any;
  public issueScreenShot: any;
  public filesToUpload: Array<File> = [];

  public selectedAssignee: any;

  public allUser = [];
  displayToken: boolean;

  constructor(public AppService: AppService, private location: Location, public toastr: ToastrManager, private router: Router, private _route: ActivatedRoute, private el: ElementRef) { }

  ngOnInit() {
    this.currentIssueId = Cookie.get('IssueSelected-Id')


    this.authToken = Cookie.get('authToken');
    console.log('the user Info are', this.userInfo)
    this.fullName = Cookie.get('fullName');
    this.firstChar = this.fullName[0];

    if (this.currentIssueId === undefined || this.currentIssueId === '' || this.currentIssueId === null) {
      this.toastr.errorToastr('select an issue to edit');
      this.router.navigate(['/userDashboard']);
    }

    this.getAllUserOnSystem();
    this.getAllInfoOfAnIssue(this.currentIssueId);


  }

  public getAllInfoOfAnIssue = (currentIssueId) => {

    console.log('inside getInfoOfAnIssue', currentIssueId)

    this.AppService.getASingleIssueDetails(currentIssueId).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        console.log('inside apiReponse of getInfoOfAnIssue', apiResponse)
        this.currentIssueId = apiResponse.data.issueId;
        this.issueStatus = apiResponse.data.status;
        this.issueTitle = apiResponse.data.title;
        this.issueDescription = apiResponse.data.description
        this.issueReporterName = apiResponse.data.reporterName
        this.issueReporterEmail = apiResponse.data.reporterEmail

        this.issueAssigneeName = apiResponse.data.assigneeName

        this.issueAssigneeEmail = apiResponse.data.assigneeEmail

        this.issueCreatedOn = new Date(apiResponse.data.creationDate).toLocaleDateString()


        this.issueScreenShotPath = apiResponse.data.screenshotPath;

        this.issueScreenShot = `http://api.essindia.club/${this.issueScreenShotPath}`


        this.displayToken = true;


      }

      else {
        this.toastr.errorToastr("no  issue-Details found for the selected issue")
      }
    })
  }

  public getAllUserOnSystem = () => {
    this.AppService.getAllUser().subscribe(
      data => {
        console.log('all user ', data.data)
        this.allUser = [];
        for (let x in data.data) {
          this.allUser.push(data.data[x])
        }


        console.log('all User Array', this.allUser)

      },
      error => {
        console.log('error to test ', error)
      })
  }

  public selectAssignee = (userInfo) => {

    this.allUser.map((user) => {

      if (user.email == userInfo) {
        this.issueAssigneeName = (`${user.firstName}` + ` ` + `${user.lastName}`)
      }

    })

    console.log('assignee selected ', userInfo)

  }

  public editIssue = () => {


    this.selectAssignee(this.issueAssigneeEmail)

    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let file = inputEl.files[0]

    console.log('file here is', file)
    let currentFormData = new FormData();
    currentFormData.append('status', this.issueStatus);
    currentFormData.append('title', this.issueTitle);
    currentFormData.append('description', this.issueDescription);
    currentFormData.append('reporterName', this.fullName);
    currentFormData.append('assigneeEmail', this.issueAssigneeEmail);
    currentFormData.append('assigneeName', this.issueAssigneeName);
    currentFormData.append('reporterEmail', this.issueReporterEmail);



    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        currentFormData.append('image', inputEl.files[i]);

        console.log('formData is', currentFormData)

      }
      this.AppService.editIssue(this.currentIssueId, currentFormData).subscribe(
        data => {
          console.log('edited  data is: ', data)
          this.toastr.successToastr("issue edited")
          setTimeout(() => {
            this.router.navigate(['/issue-description-view']);
          }, 1000)

        },
        error => {
          console.log('error to test ', error)
          this.toastr.errorToastr("some error occured");
          setTimeout(() => {
            this.router.navigate(['/issue-description-view']);
          }, 1000)
        }
      )


    } else {
      this.AppService.editIssue(this.currentIssueId, currentFormData).subscribe(
        data => {
          console.log('edited  data is: ', data)
          this.toastr.successToastr("issue edited")
          setTimeout(() => {
            this.router.navigate(['/issue-description-view']);
          }, 1000)

        },
        error => {
          console.log('error to test ', error)
          this.toastr.errorToastr("some error occured");
          setTimeout(() => {
            this.router.navigate(['/issue-description-view']);
          }, 1000)
        }
      )
    }



    console.log("assisngee", this.issueAssigneeEmail)
    console.log("reporter", this.issueReporterEmail)
    console.log("status", this.issueStatus)
  }

  public goBack(): any {
    this.location.back();
  }

  public logout: any = () => {
    this.AppService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log("logout function called");
        Cookie.set("token", "false")
        Cookie.deleteAll();

        this.router.navigate(['/']);
      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    }, (err) => {
      this.toastr.errorToastr("some error occured");
    })
  } // end of logout.

  public socialLogout: any = () => {
    this.AppService.socialLogout().subscribe(() => {

      console.log("facebook logout function called");
      Cookie.deleteAll();
      Cookie.delete("token")
      this.router.navigate(['/']);
    })
  } // end of socialLogout.

  ngOnDestroy() {

    Cookie.delete("'IssueSelected-Id'")

  }

}

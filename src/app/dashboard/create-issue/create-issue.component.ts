import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import { FileUploader } from 'ng2-file-upload';
//import { QuillModule } from 'ngx-quill'


@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css']
})
export class CreateIssueComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({});

  public fullName;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public issueDetails: any;
  public issueId: any



  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueStatus: any;
  public issueTitle: any;
  public issueScreenShotPath: any;
  public filesToUpload: Array<File> = [];

  public selectedAssignee: any;

  public allUser = [];
  socialFlag: string;
  constructor(public AppService: AppService, private location: Location, public toastr: ToastrManager, private router: Router, private _route: ActivatedRoute, private el: ElementRef) {

  }

  ngOnInit() {

    this.authToken = Cookie.get('authToken');
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    console.log('the user Info are', this.userInfo)
    this.fullName = Cookie.get('fullName');
    this.socialFlag = Cookie.get('socialFlag')
    //this.firstChar = this.fullName[0];
    this.issueReporterEmail = Cookie.get('email')
    this.issueReporterName = this.fullName

    this.getAllUserOnSystem();
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
        this.issueAssigneeName = (`${user.firstName}` +` `+ `${user.lastName}`)
      }

    })

    console.log('assignee selected ', userInfo)

  }

  public createIssue = () => {


    this.selectAssignee(this.issueAssigneeEmail)

    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let file = inputEl.files[0]

    console.log('file here is', file)
    let formData = new FormData();
    formData.append('status', this.issueStatus);
    formData.append('title', this.issueTitle);
    formData.append('description', this.issueDescription);
    formData.append('reporterName', this.fullName);
    formData.append('assigneeEmail', this.issueAssigneeEmail);
    formData.append('assigneeName', this.issueAssigneeName);
    formData.append('reporterEmail', this.issueReporterEmail);

    // import { FileUploader} from 'ng2-file-upload';

    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        formData.append('image', inputEl.files[i]);

        console.log('formDatais', formData)

      }
      this.AppService.createIssue(formData).subscribe(
        data => {
          console.log('data to test ', data)
          this.toastr.successToastr("issue created")
          this.router.navigate(['/userDashboard']);

        },
        error => {
          console.log('error to test ', error)
          this.toastr.errorToastr("some error occured");
          this.router.navigate(['/userDashboard']);
        }
      )



    } else {
      this.toastr.errorToastr("upload a file to create issue");
    }



    console.log("assignee", this.issueAssigneeEmail)
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
}

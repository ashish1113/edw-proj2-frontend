import { Component, ElementRef, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppService } from './../../app.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import 'rxjs/add/operator/map';
import "rxjs/add/operator/do";



@Component({
  selector: 'app-issue-description-view',
  templateUrl: './issue-description-view.component.html',
  styleUrls: ['./issue-description-view.component.css']
})
export class IssueDescriptionViewComponent implements OnInit {

  public descriptionToken = true;
  public watcherlistToken = false;
  public fullName: String;
  public firstChar: String;
  public authToken: any;
  public userInfo: any;
  public issueDetails: any;
  public issueId: any
  public issueStatus: any;
  public issueTitle: any;
  public uploadedFile: any
  public issueDescription: any;
  public issueReporterName: any;
  public issueReporterEmail: any;
  public issueAssigneeName: any;
  public issueAssigneeEmail: any;
  public issueCreatedOn: any;
  public issueScreenShotPath: any;
  public filesToUpload: Array<File> = [];
  public comment: String;
  public commenterEmail: string;
  public commentArray: any = [];
  public commentFlag = false;
  public noCommentFlag = false;
  public watcherList: any = [];
  public watcherFlag = false;
  public watcherEmail: string;
  public socialFlag: string ;


  constructor(public AppService: AppService, private location: Location, public toastr: ToastrManager, private _route: ActivatedRoute, private router: Router, private el: ElementRef) { }

  ngOnInit() {

    this.descriptionToken = true;
    this.authToken = Cookie.get('authToken');
    this.socialFlag = Cookie.get('socialFlag')
    this.userInfo = this.AppService.getUserInfoFromLocalstorage();
    this.fullName = Cookie.get('fullName');
    this.watcherEmail = Cookie.get('email');
    this.commenterEmail = Cookie.get('email');
    //this.firstChar = this.fullName[0];
    this.issueId = Cookie.get('IssueSelected-Id');

    this.getAllInfoOfAnIssue(this.issueId);
    this.getWatcherList();

  }

  public getAllInfoOfAnIssue = (issueId) => {

    console.log('inside get all Info Of An Issue :', issueId)

    this.AppService.getASingleIssueDetails(issueId).subscribe((apiResponse) => {
      if (apiResponse.status == 200) {
        console.log('inside apiReponse of getInfoOfAnIssue', apiResponse)
        this.issueId = apiResponse.data.issueId;
        this.issueStatus = apiResponse.data.status;
        this.issueTitle = apiResponse.data.title;
        this.issueDescription = apiResponse.data.description;
        this.issueReporterName = apiResponse.data.reporterName;
        this.issueReporterEmail = apiResponse.data.reporterEmail;
        this.issueAssigneeName = apiResponse.data.assigneeName;

        this.issueAssigneeEmail = apiResponse.data.assigneeEmail;

        this.issueCreatedOn = new Date(apiResponse.data.creationDate).toLocaleDateString();

        this.issueScreenShotPath = apiResponse.data.screenshotPath;

      }

      else {
        this.toastr.errorToastr("no  issue-Details found for the selected issue")
      }
    })
  } // end of getAllInfoOfAnIssue.

  public changeViewToWatcher = () => {

    this.descriptionToken = false;
    this.watcherlistToken = true;

    console.log("descp token", this.descriptionToken);
    console.log("watch token", this.watcherlistToken);

  } // end of changeViewToWatcher.

  public changeViewToDescription = () => {

    this.descriptionToken = true;
    this.watcherlistToken = false;

    console.log("descp token", this.descriptionToken);
    console.log("watch token", this.watcherlistToken);

  } // end of changeViewToDescription.

  public getWatcherList(): any {

    this.AppService.getWatcherList(this.issueId).subscribe((apiResponse) => {
      console.log(apiResponse);
      this.watcherList = [];
      if (apiResponse.data != null) {
        //this.watcherFlag = true
        for (let x of apiResponse.data) {
          let temp = {
            issueId: x.issueId,
            watcherId: x.watcherId,
            watcherEmail: x.watcherEmail,

            date: new Date(x.createdOn).toLocaleDateString()
          }
          this.watcherList.push(temp);
        }
        console.log("All watchers are:--", this.watcherList);

      }
    })
  } // end of getWatcherList.

  public addWatcher(): any {

    console.log("watcher fun called")
    let data = {
      issueId: this.issueId,
      watcherEmail: this.watcherEmail
    }
    this.AppService.AddWatcher(data).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log(apiResponse);
        this.toastr.successToastr("added as watcher")
        Cookie.set('watcheId', apiResponse.data.watcherId);
        location.reload();
      } else {
        this.toastr.errorToastr(apiResponse.message)
      }
    }, (err) => {
      this.toastr.errorToastr('some error occured')
    });
  } // end of addWatcher.

  public WriteComment(): any {

    if (this.comment == undefined || this.comment == '' || this.comment == null) {
      //alert("enter comment to add")
      this.toastr.errorToastr("no comment entered", 'Oops!')
    }
    else {
      let CommentData = {
        issueId: this.issueId,
        comment: this.comment,
        commenter: this.fullName,
        commenterEmail: this.commenterEmail
      }

      this.AppService.WriteComment(CommentData).subscribe(
        data => {

          console.log("write comment");
          console.log("response data of write comment:", data);
          this.toastr.successToastr('comment added.', 'Success!');


        },
        error => {
          console.log("some error occurred while writting comment");
          console.log(error.errorMessage);
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        }
      )
    }
  } // end of WriteComment.

  public getComment(): any {
    if (this.issueId === undefined || this.issueId === '' || this.issueId === null) {
      this.toastr.errorToastr('No issueId found');
    }
    else {
      this.AppService.ViewComment(this.issueId).subscribe(
        (apiResponse) => {
          //this.commentArray = apiResponse['data'];
          console.log(apiResponse);
          this.commentArray = [];
          if (apiResponse.data != null) {
            this.commentFlag = true
            for (let x of apiResponse.data) {
              let temp = {
                commentId: x.commentId,
                issueId: x.relatedIssueId,
                comment: x.comment,
                commenter: x.commenter,
                commenterEmail: x.commenterEmailId,
                createdOn: x.createdOn
              }
              this.commentArray.push(temp);
            }
            console.log("All comments are:--", this.commentArray);
          }
          else {
            this.commentFlag = false

            this.toastr.errorToastr('No comment Present');
          }
        }
      )
    }

  } // end of getComment.

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

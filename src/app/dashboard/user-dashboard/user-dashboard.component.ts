import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AppService } from './../../app.service';
import { SocketService } from "./../../socket.service"
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { from } from 'rxjs';

//import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {

  config: any;
  config1: any;

  @ViewChild('scrollMe', { read: ElementRef })

  public scrollMe: ElementRef;
  //var $ :any;

  public loggedInUserEmail: String;
  public fullName: String;
  public firstChar: String;
  public authToken: any;
  public loggedInUserInfo: any;
  public listOfAllIssues: any = [];
  public listOfAssigneedIssues: any = [];
  public text: String;
  public listOfSearchedIssue: any = [];
  public loggedInUserIssueFlag: boolean = false;
  public listOfNotification: any[];
  public notificationArraySize: Number;
  public socialFlag: string;

  p: Number = 1;
  count: Number = 5;
  public searchedTextFlag: boolean = false;


  

  constructor(public AppService: AppService, public Toastr: ToastrManager, private _route: ActivatedRoute, private router: Router, public SocketService: SocketService) { }


  ngOnInit() {

    console.log('on init function called');
    console.log("social flag is:", Cookie.get('socialFlag'));
    this.socialFlag = Cookie.get('socialFlag')
    this.authToken = Cookie.get('authToken');
    this.loggedInUserInfo = this.AppService.getUserInfoFromLocalstorage();
    this.fullName = Cookie.get('fullName');
    //this.firstChar = this.fullName[0];
    this.loggedInUserEmail = Cookie.get('email')
    console.log("the authToken of logged in user :", this.authToken);

    this.checkStatus();

    this.getLoggedInUserAssigneedIssues();

    this.SocketService.sendNotification(this.loggedInUserEmail);

    this.getMyNotification();


    

  }



  public checkStatus: any = () => {

    console.log("check status called")

    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null) {


      this.router.navigate(['/']);

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public getMyNotification: any = () => {

    this.SocketService.getNotification().subscribe((notificationdata) => {

      this.listOfNotification = [];

      for (let x in notificationdata) {

        if (notificationdata[x].notificationPurpose == "create") {
          let notificationObj = {
            message: ` A new issue is created with issueId:-${notificationdata[x].notificationIssueData.issueId}`,
            details: notificationdata[x]
          }

          this.listOfNotification.push(notificationObj)

        } else if (notificationdata[x].notificationPurpose == "edit") {
          let notificationObj = {
            message: `A issue is edited with issueId:-${notificationdata[x].notificationIssueData.issueId}`,
            details: notificationdata[x]
          }
          this.listOfNotification.push(notificationObj)
        } else {
          let notificationObj = {
            message: `${notificationdata[x].notificationMessage.commenter} commented on issue with issueId:-${notificationdata[x].notificationIssueData.issueId}`,
            details: notificationdata[x]
          }
          this.listOfNotification.push(notificationObj)
        }
      }

      console.log('your notification is', notificationdata)
      this.notificationArraySize = this.listOfNotification.length

      console.log('your notification list is', this.listOfNotification)

    })
  } //end of getMyNotification function.


  public getAllIssues: any = () => {
    this.loggedInUserIssueFlag = false;
    this.AppService.getAllIssues().subscribe((apiResponse) => {
      console.log(apiResponse);
      this.listOfAllIssues = [];
      if (apiResponse.data != null) {
        for (let x of apiResponse.data) {
          let temp = {
            title: x.title,
            issueId: x.issueId,
            status: x.status,
            reporter: x.reporterName,
            date: new Date(x.creationDate).toLocaleDateString()
          }
          this.listOfAllIssues.push(temp);
        }
        console.log("All issues are:-", this.listOfAllIssues);

      }

    })
  } // end of get all issues.

  public getLoggedInUserAssigneedIssues: any = () => {
    this.loggedInUserIssueFlag = true;

    this.AppService.getLoggedInUserAssigneedIssues(Cookie.get('email')).subscribe((apiResponse) => {
      console.log(apiResponse);

      this.listOfAssigneedIssues = [];
      if (apiResponse.data != null) {
        for (let x of apiResponse.data) {
          let temp = {
            title: x.title,
            issueId: x.issueId,
            status: x.status,
            reporter: x.reporterName,
            date: new Date(x.creationDate).toLocaleDateString()
          }
          this.listOfAssigneedIssues.push(temp);
        }
        console.log("All issues assigneed to logged-in-user", this.listOfAssigneedIssues);
      }

    })
  } //end of get logged in user assigneed issues.

  public issueSelected: any = (issueId) => {
    if (this.loggedInUserIssueFlag == true) {
      this.listOfAssigneedIssues.map((issue) => {
        if (issue.issueId == issueId) {
          Cookie.set('IssueSelected-Id', issue.issueId);
        }
      })
    } else {
      this.listOfAllIssues.map((issue) => {
        if (issue.issueId == issueId) {
          Cookie.set('IssueSelected-Id', issue.issueId);
        }
      })
    }

  } // end of issueSelected 

  public issueSelectedFromNotification: any = (notificationId) => {
    this.listOfNotification.map((notification) => {
      if (notification.details.notificationId == notificationId) {

        Cookie.set('IssueSelected-Id', notification.details.notificationIssueData.issueId);
        this.markNotificationAsSeen(notification.details.notificationId)
      }
    })
  } // end of issueSelectedFromNotification.

  public markNotificationAsSeen: any = (notificationId) => {

    this.AppService.markNotificationAsSeen(notificationId).subscribe((result) => {
      console.log('result in mark function ', result)
    })
  } // end of mark notification as seen.

  public searchedIssue: any = () => {
    this.listOfSearchedIssue = [];
    if(this.text === undefined || this.text === '' || this.text === null){
      this.Toastr.errorToastr("enter some text to search");
    } else {
    this.AppService.searchIssue(this.text).subscribe((apiResponse) => {
      
      console.log("you entered some text for search", this.text);
      console.log(apiResponse);
      this.listOfSearchedIssue = [];
      if (apiResponse.status === 200) {
        $('#exampleModalScrollable').modal('show');
        for (let x of apiResponse.data) {
          let temp = {
            title: x.title,
            issueId: x.issueId,
            status: x.status,
            reporter: x.reporterName,
            date: new Date(x.creationDate).toLocaleDateString()
          }
          this.listOfSearchedIssue.push(temp);
        }
       // $('#exampleModalScrollable').modal('show');
        
        console.log('the issues related to searched text:', this.listOfSearchedIssue);
      } else if (apiResponse.status === 404) {
        this.Toastr.errorToastr(apiResponse.message);
        
      } else {
        this.Toastr.errorToastr(apiResponse.message);
        
      }


    }, (error) => {
  
      console.log(error);
      this.Toastr.errorToastr('Some error ocurred');
      
    })
  }
  } // end of searched issues


  public logout: any = () => {
    this.AppService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log("logout function called");
        Cookie.set("token", "false")
        Cookie.deleteAll();

        this.router.navigate(['/']);
      } else {
        this.Toastr.errorToastr(apiResponse.message);
      }
    }, (err) => {
      this.Toastr.errorToastr("some error occured");
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

  public issueSelectedFromSearch: any = (issueId) => {

    this.listOfSearchedIssue.map((issue) => {
      if (issue.issueId == issueId) {
        Cookie.set('IssueSelected-Id', issue.issueId);
      }
    })

  } // end of issue selected from search.



  ngOnDestroy() {
  }

}

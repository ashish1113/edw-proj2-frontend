import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public password: any;
  public email: any;
  public socialFlag: boolean = false;


  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  constructor(public router: Router, public AppService: AppService, public Toastr: ToastrManager) { }

  ngOnInit() {

    this.bodyTag.classList.add('login-page');
    this.htmlTag.classList.add('login-page');
  }

  public redirectToSignUp: any = () => {
    this.router.navigate(['/signup']);
  }

  public signInFunction: any = () => {

    if (!this.email) {
      this.Toastr.warningToastr('please enter email')
    }
    else if (!this.password) {
      this.Toastr.warningToastr('please enter password')
    }
    else {
      let data = {
        email: this.email,
        password: this.password,
      }
      console.log("login data is :",data);
      this.AppService.signInFunction(data).subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log(apiResponse);
          this.socialFlag = false;

          Cookie.set('socialFlag','false');
          Cookie.set('authToken', apiResponse.data.authToken);

          Cookie.set('userId', apiResponse.data.userDetails.userId);

          Cookie.set('email', apiResponse.data.userDetails.email);

          Cookie.set('fullName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

          this.AppService.setUserInfoInLocalStorage(apiResponse.data.userDetails);

          console.log("The set user info :",apiResponse.data.userDetails);
          this.router.navigate(['/userDashboard']);
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('some error occured')
      });
    }
  }

}

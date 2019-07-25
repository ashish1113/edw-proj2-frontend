import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public mobileNumber:Number;
  public email: any;
  public password: any;


  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  constructor(public AppService: AppService, public router: Router, private Toastr: ToastrManager) { }

  ngOnInit() {
    // this.bodyTag.classList.add('signup-page');
    // this.htmlTag.classList.add('signup-page');
  }

  public redirectToSignIn: any = () => {
    this.router.navigate(['/']);
  } 

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.Toastr.warningToastr("please enter your firstName");
    }
    else if (!this.lastName) {
      this.Toastr.warningToastr("please enter your lastName");
    }
    else if (!this.mobileNumber) {
      this.Toastr.warningToastr("please enter your mobileNumber");
    }
    else if (!this.email) {
      this.Toastr.warningToastr("please enter your email");
    }
    else if (!this.password) {
      this.Toastr.warningToastr("please enter your password");
    }
    else {
      

      console.log("type of ph",typeof this.mobileNumber)
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobileNumber: this.mobileNumber,
        email: this.email,
        password: this.password,
      }

      console.log(data);

      this.AppService.signUpFunction(data).subscribe((apiResponse) => {

        console.log(apiResponse);

        if (apiResponse.status === 200) {
          this.Toastr.successToastr('you signedUp successfully');
          setTimeout(() => {
            this.redirectToSignIn();
          }, 2000);
        }
        else {
          this.Toastr.errorToastr(apiResponse.message);
        }
      }, (err) => {
        this.Toastr.errorToastr('some error occured');
      });
    }

  }

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
  public authToken: String;
  public socialFlag: boolean = false; 

  constructor(public router: Router, private activatedRoute: ActivatedRoute, public AppService: AppService, public Toastr: ToastrManager) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
    });
  }

  ngOnInit() {
    Cookie.set('authToken', this.activatedRoute.snapshot.paramMap.get('token'));

    console.log('authToken is', this.activatedRoute.snapshot.paramMap.get('token'))
    this.authToken = this.activatedRoute.snapshot.paramMap.get('token');



    this.getUserInfoFromAuthToken(this.authToken);
  }

  public getUserInfoFromAuthToken = (authToken) => {

    this.socialFlag=true;
    this.AppService.getUserInfo(authToken).subscribe((data) => {

      console.log('data for authToken is :', data.data.data)

      Cookie.set('authToken', authToken, 1, "/");

      Cookie.set('socialFlag','true');

      Cookie.set('userId', data.data.data.userId, 1, "/");

      Cookie.set('email', data.data.data.email, 1, "/");

      Cookie.set('fullName', data.data.data.firstName + ' ' + data.data.data.lastName, 1, "/");

      this.AppService.setUserInfoInLocalStorage(data.data.data)
      this.router.navigate([`/userDashboard`])
      console.log('data for authToken is : ', data.data.data)

    })


  }

}

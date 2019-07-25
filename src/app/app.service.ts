import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Options } from 'selenium-webdriver/opera';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  // private url = 'http://localhost:3000';
  private url = 'http://api.essindia.club';

  constructor(public http: HttpClient, public router: Router) { }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signUpFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
    return this.http.post(`${this.url}/api/v1/users/signup`, params);
  }

  public signInFunction(data): Observable<any> {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);
    return this.http.post(`${this.url}/api/v1/users/login`, params);
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public loginWithFacebook(): Observable<any> {
    return this.http.get(`${this.url}/login/facebook`);
  }

  public socialLogout(): Observable<any> {
    return this.http.get(`${this.url}/api/logout`);
  }

  public getUserInfo(authToken): Observable<any> {
    console.log("getUserInfo function called");
    return this.http.get(`${this.url}/api/v1/users/get/Details/full?authToken=${Cookie.get('authToken')}`);
  }

  public getAllIssues(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/get/allIssues?authToken=${Cookie.get('authToken')}`);
  }

  public getLoggedInUserAssigneedIssues(email): Observable<any> {

    return this.http.get(`${this.url}/api/v1/users/userIssues/${email}?authToken=${Cookie.get('authToken')}`);

  }

  public searchIssue(text): Observable<any> {
    
    return this.http.get(`${this.url}/api/v1/users/issue/${text}/search?authToken=${Cookie.get('authToken')}`);

  }

  public markNotificationAsSeen = (notificationId) => {

    return this.http.get(`${this.url}/api/v1/users/mark/notification/seen?notificationId=${notificationId}&authToken=${Cookie.get('authToken')}`)

  }

  public getASingleIssueDetails(issueId): Observable<any> {

    return this.http.get(`${this.url}/api/v1/users/issueDetails/${issueId}?authToken=${Cookie.get('authToken')}`);

  }

  public AddWatcher(data): Observable<any> {
    const params = new HttpParams()
      .set('issueId', data.issueId)
      .set('watcherEmail', data.watcherEmail)
    return this.http.post(`${this.url}/api/v1/users/add/as/watcher?authToken=${Cookie.get('authToken')}`, params)
  }

  public getWatcherList(issueId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${issueId}/get/watcherList?authToken=${Cookie.get('authToken')}`)
  }

  public WriteComment(CommentData): Observable<any> {
    console.log("comment data for comment in app service:", CommentData);
    const params = new HttpParams()
      .set('issueId', CommentData.issueId)
      .set('comment', CommentData.comment)
      .set('commenter', CommentData.commenter)
      .set('commenterEmail', CommentData.commenterEmail)
    return this.http.post(`${this.url}/api/v1/users/create/comment?authToken=${Cookie.get('authToken')}`, params);
  }

  public ViewComment(issueId): Observable<any> {
    console.log("viewing comment of issueId:", issueId);
    return this.http.get(`${this.url}/api/v1/users/${issueId}/view/comment?authToken=${Cookie.get('authToken')}`)
  }

  public getAllUser(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/view/allUsers?authToken=${Cookie.get('authToken')}`);
  }

  public createIssue(file): Observable<any> {

    const params = new HttpParams()

    return this.http.post(`${this.url}/api/v1/users/create/issue?authToken=${Cookie.get('authToken')}`, file);
  }

  public editIssue(issueId,file): Observable<any>{
    return this.http.put(`${this.url}/api/v1/users/editIssue/${issueId}?authToken=${Cookie.get('authToken')}`,file);
  }


  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  }

}

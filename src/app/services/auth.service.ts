import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //autenticación
  private url = '';
  private API_KEY = '';

  userToken: string;


  // crear usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient ) {
    this.readToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login( user: UserModel ) {
    const authData = {
      ...user,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }accounts:signInWithPassword?key=${ this.API_KEY }`,
      authData
    ).pipe(
      map( (ans: string) => {
        this.saveToken( ans[`idToken`]  );
        return ans;
      })
    );
  }

  newUser( user: UserModel ) {

    const authData = {
      ...user,
      // email: user.email,
      // password: user.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }accounts:signUp?key=${ this.API_KEY }`,
      authData
    ).pipe(
      map( ans => {
        this.saveToken( ans[`idToken`] );
        return ans;
      })
    );

  }


  private saveToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let today = new Date();
    today.setSeconds( 3600 );

    localStorage.setItem('expire', today.getTime().toString());
  }

readToken() {
  if ( localStorage.getItem('token') ) {
    this.userToken = localStorage.getItem('token');
  } else {
    this.userToken = '';
  }

  return this.userToken;
  }

  isAuthenticated(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if ( expireDate > new Date() ) {
      return true;
    } else {
      return false;
    }

    return this.userToken.length > 10;
  }




}

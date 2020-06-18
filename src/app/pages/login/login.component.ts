import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  rememberMe = false;


  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    if ( localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }
  }

  login( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      title: 'Ingresando...',
      icon: 'info',
      text: 'Espere por favor...'
    });

    Swal.showLoading();

    this.auth.login( this.user ).subscribe( ans => {
      console.log(ans);
      Swal.close();

      if ( this.rememberMe ) {
        localStorage.setItem('email', this.user.email);
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      Swal.fire({
        title: 'Error al autenticar',
        icon: 'error',
        text: 'El usuario y/o la contraseña son incorrectos'
      });
    });

  }

}

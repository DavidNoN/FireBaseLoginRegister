import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user: UserModel;
  rememberMe = false;


  constructor( private auth: AuthService,
               private router: Router ) { }

  ngOnInit() {
    this.user = new UserModel();

  }

  onSubmit( form: NgForm ) {

    if ( form.invalid ) { return; }

    Swal.fire({
      title: 'Error al autenticar',
      icon: 'success',
      text: 'Registro exitoso'
    });

    this.auth.newUser( this.user ).subscribe( ans => {
      console.log(ans);
      Swal.close();
      if ( this.rememberMe ) {
        localStorage.setItem('email', this.user.email);
      }
      this.router.navigateByUrl('/login');
    }, (err) => {
      Swal.fire({
        title: 'Error al registrar',
        icon: 'error',
        text: 'El correo electrónico ya existe'
      });
    });


  }


}

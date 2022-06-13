import { Router } from '@angular/router';
import { Login } from './../../structs/Login';
import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  form: FormGroup;
  loginError: boolean = false;
  disableBtn: boolean = false

  constructor(
    private builder: FormBuilder,
    private login: LoginService,
    private router: Router
  ) {
    if (login.getToken() != undefined) {
      this.router.navigate(['review']);
    }
    this.form = builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  submit() {
    let login: Login = new Login();
    login.username = this.form.get('username')?.value;
    login.password = this.form.get('password')?.value;
    this.disableBtn = true
    this.login.login(login).subscribe({
      next: (res) => {
        if (res.InternalCode != 'I_Success') {
          this.loginError = true;
          return;
        } else {
          this.login.setToken(res.Payload.token);
          this.login.saveLogin();
          this.router.navigate(['review']);
        }
      },
      error: (err) => {
        this.loginError = true;
        return;
      },
    });
  }
}

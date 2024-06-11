import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { firstName, email, password, cpf } = this.registerForm.value;
      this.authService.register(firstName, email, password, cpf)
        .then(() => {
          return this.authService.login(email, password);
        })
        .then(() => {
          this.router.navigateByUrl('/tabs/tab1');
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.error('Form is not valid');
    }
  }
}

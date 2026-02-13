import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage  {
  authService = inject(AuthService);
  router: Router = inject(Router);

  isSubmit = false;

  form = new FormGroup({
    password: new FormControl(null, Validators.required),
    username: new FormControl(null, Validators.required),
  });

  isInvalid(name: string) {
    const control = this.form.get(name);
    return control?.invalid && this.isSubmit;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.valid) {
      console.log(this.form.value);
      //@ts-ignore
      this.authService.login(this.form.value).subscribe({
        next: (res) => {
          this.router.navigate(['/']);
          console.log(res);
        },
        error: (err) => {
          this.form.get('password')?.setErrors({ auth: false });
          this.form.get('username')?.setErrors({ auth: false });
        },
      });
    } else {
      return;
    }
  }

  isPasswordVisible = signal<boolean>(false);
}

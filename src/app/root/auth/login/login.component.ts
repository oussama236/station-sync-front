import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // ✅ was 'email'
      password: ['', Validators.required]
    });;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<any>('https://station-sync-10.onrender.com/SS/login', credentials)
        .subscribe({
          next: (response) => {
            console.log('✅ Connexion réussie', response);
            localStorage.setItem('token', response.token); // store JWT token
            this.router.navigate(['/']); // redirect to home or dashboard
          },
          error: (err) => {
            console.error('❌ Erreur de connexion', err.error?.message || err.message);
            // Optional: display error message in template
          }
        });
    }
  }
}

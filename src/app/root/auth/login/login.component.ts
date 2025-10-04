import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Utilise bien 'username'
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<any>(`${environment.shellApiUrl}/login`, credentials)
        .subscribe({
          next: (response) => {
            console.log('✅ Connexion réussie', response);

            // stocker le token
            localStorage.setItem('token', response.token);

            console.log('🎯 Redirection en cours...');
            this.router.navigate(['/home']); 
          },
          error: (err) => {
            console.error('❌ Erreur de connexion', err);
            this.errorMessage = err.error?.error || 'Identifiants invalides';
          }
        });
    }
  }
  
}

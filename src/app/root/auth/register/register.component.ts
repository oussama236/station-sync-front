import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  private shellApiUrl = environment.shellApiUrl;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
  
      this.http.post(`${environment.shellApiUrl}/register`, userData)
      .subscribe({
          next: (response: any) => {
            console.log('✅ Inscription réussie:', response.message);
            this.router.navigate(['/auth/login']);
          },
          error: (err) => {
            console.error('❌ Erreur lors de l\'inscription:', err.error?.error || err.message);
          }
        });
    }
  }
}  

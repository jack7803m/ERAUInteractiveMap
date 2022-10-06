import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  loginModel = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.authService.login(this.loginModel.username, this.loginModel.password).subscribe((result) => {
        if (result) {
            console.log('Login successful');
            // wait 5s before redirecting to admin page
            setTimeout(() => {
                this.router.navigate(['/admin']);
            }, 5000);
        }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
    loginModel = { username: '', password: '' };
    error: boolean = false;
    errorMessage: string = 'Error logging in.';

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit(): void {}

    onSubmit(): void {
        this.authService
            .login(this.loginModel.username, this.loginModel.password)
            .subscribe({
                next: (result) => {
                    if (result) {
                        this.router.navigate(['/admin/map']);
                    } else {
                        this.errorMessage = 'Invalid username or password.';
                        this.error = true;
                    }
                },
                error: (error) => {
                    this.errorMessage = 'Error logging in.';
                    this.error = true;
                },
            });
    }
}

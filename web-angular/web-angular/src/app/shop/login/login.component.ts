import {ToastrService} from 'ngx-toastr';
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoginService} from '../services/login.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {Role, User} from '../interfaces/user.model';
import {LoginHelper} from '../shared/utils/login.helper';
import {LoginResponse} from '../interfaces/Ilogin';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    checkSignUp: boolean;
    loginForm: FormGroup;
    signUpForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private loginService: LoginService,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: [''],
            password: ['']
        });

        this.signUpForm = this.fb.group({
            username: '',
            password: '',
            fullname: '',
            phoneNumber: '',
            address: '',
        });
    }

    // Đăng nhập
    login() {
        this.loginService
            .login(this.loginForm.value)
            .subscribe((loginResponse) => {
                if (!loginResponse.userDTO) {
                    this.toastr.error('Sai tài khoản hoặc mật khẩu');
                    return;
                }

                // Lưu user hiện tại và token vào localStorage
                LoginHelper.saveToLocalStorage(loginResponse);
                this._navigate(loginResponse);

                this.loginService.logged$.next(true);
            });
    }

    // Đăng ký
    signUp() {
        this.loginService
            .addUser(this.signUpForm.value as User)
            .subscribe(response => {
                if (response == null) {
                    this.toastr.error('Username đã tồn tại!');
                } else {
                    this.signUpForm.reset();
                    this.toastr.success('Đăng ký thành công!');
                    this.checkSignUp = false;
                }
            });
    }

    // Chuyển sang đăng ký
    goToSignUp() {
        this.checkSignUp = true;
    }

    // Chuyển về đăng nhập
    goToLogin() {
        this.checkSignUp = false;
    }

    _navigate(loginResponse: LoginResponse): void {
        this.dialogRef.close();
        this.toastr.success(loginResponse.msg)

        loginResponse.userDTO.roles.forEach(role => {
            if (role === Role.ADMIN) {
                void this.router.navigate(['admin/dashboard']);
            }
        });
    }
}

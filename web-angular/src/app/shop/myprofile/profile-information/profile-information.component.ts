import {LoginService} from 'src/app/shop/services/login.service';
import {ToastrService} from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../interfaces/user.model';
import {LoginHelper} from '../../shared/utils/login.helper';

@Component({
    selector: 'app-profile-information',
    templateUrl: './profile-information.component.html',
    styleUrls: ['./profile-information.component.scss']
})
export class ProfileInformationComponent implements OnInit {

    user: User;
    profileForm = new FormGroup({
        fullname: new FormControl(''),
        createDate: new FormControl(''),
        phoneNumber: new FormControl(''),
        address: new FormControl(''),
    });

    constructor(
        private loginService: LoginService,
        private router: Router,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.loadPage();
    }

    // Lấy user hiện tại
    public loadPage() {
        this.user = this.loginService.getUserCurrent();
        if (!this.user) {
            void this.router.navigate(['/home']);
        } else {
            for (let controlName in this.profileForm.controls) {
                if (controlName) {
                    this.profileForm.controls[controlName].setValue(this.user[controlName]);
                }
            }
        }
    }

    // Cập nhật profile user
    saveUser() {
        this.refreshUser();
        this.loginService
            .updateUser(this.user)
            .subscribe((response) => {
                if (response) {
                    this.toastr.success('Cập nhật hồ sơ thành công', 'Thông báo');
                    LoginHelper.saveToLocalStorage(response);
                    window.location.reload();
                }
            });
    }

    // Đóng gói user muốn sửa để gửi lên server
    refreshUser() {
        for (let controlName in this.profileForm.controls) {
            if (controlName) {
                this.user[controlName] = this.profileForm.controls[controlName].value;
            }
        }
    }
}

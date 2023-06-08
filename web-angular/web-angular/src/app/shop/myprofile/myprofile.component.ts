import {ToastrService} from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../services/login.service';
import {getCurrentUser} from '../shared/utils/utils';
import {User} from '../interfaces/user.model';

@Component({
    selector: 'app-myprofile',
    templateUrl: './myprofile.component.html',
    styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {

    user: User = {} as User;

    constructor(
        private loginService: LoginService,
        private router: Router,
        private toastr: ToastrService) {
    }

    ngOnInit() {
        this.loadData();
    }

    // Load Data
    loadData() {
        this.user = getCurrentUser();
        if (!this.user) {
            this.router.navigate(['/home']);
        }
    }

    // Đăng xuất
    logout() {
        this.loginService.logout();
        window.location.reload();
        void this.router.navigate(['home']);
        this.toastr.info('Đã đăng xuất');
    }
}

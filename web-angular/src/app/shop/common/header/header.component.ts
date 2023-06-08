import {ToastrService} from 'ngx-toastr';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from '../../login/login.component';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LoadingService} from 'src/app/shop/services/loading.service';
import {PHONE} from '../../shared/utils/utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loadingEnable: boolean;
  sidenavEnable = false;
  isLogin: boolean;
  userCurrent: any;
  admin:any;
  isAdmin: boolean;

  @Output()
  sidenav = new EventEmitter();

  toggelSidenav() {
    this.sidenav.emit('toggel');
  }

  constructor(
    public dialog: MatDialog, 
    private router: Router, 
    public loginService: LoginService,
    private toastr: ToastrService,) { 
  
    }


  ngOnInit() {
    this.loginService.logged$.asObservable().subscribe(data =>{
      this.isLogin = data;
      this.userCurrent = this.loginService.getUserCurrent();
      console.log('user current',this.userCurrent)
      this.checkAdmin();
      console.log(this.isAdmin);
    })
  }

  checkAdmin() {
    if(this.userCurrent){
      this.userCurrent.roles.forEach(role =>{
        if(role === 'ADMIN'){
          this.isAdmin = true;
        }
      })
    }
  }

  openLoginDialog(): void {
    const dialogRef = this.dialog.open(LoginComponent, {

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Đăng xuất
  logout() {
    this.toastr.info('Đã đăng xuất')
    localStorage.removeItem('token');
    localStorage.removeItem('userCurrent');
    this.isAdmin = false;
    this.userCurrent = null;
    this.loginService.logged$.next(false);
    void this.router.navigate(['home']);
  }

  // Chuyển sang trang order
  openOrder() {
    this.router.navigate(['/shopping-cart/' + this.userCurrent.id]);
  }

  // Chuyển hướng sang profile
  openProfile() {
    void this.router.navigate(['/myprofile']);
  }

  get phone() {
    return PHONE;
  }
}

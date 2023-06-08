import {Component, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer', {static: false}) drawer: MatSidenav;
  title = 'e-comm';
  
  toggelNavbar (event) {
    this.drawer.toggle();
  }

   sideNavMenu = [
     {
       title: 'home',
       link: '/home'
     },
     {
      title: 'products',
      link: '/products'
    },
    {
      title: 'images',
      link: ''
    },
    {
      title: 'contact-us',
      link: ''
    }
    
   ];
}


import {ToastrService} from 'ngx-toastr';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../services/product.service';
import {getPathImage} from '../shared/utils/utils';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    data$ = this.productService.getHomePage();

    constructor(private router: Router,
                private productService: ProductService,
                private toastr: ToastrService) {

    }

    viewAll() {
        void this.router.navigate(['products']);
    }

    getPathImage(image: string): string {
        return getPathImage(image);
    }

}

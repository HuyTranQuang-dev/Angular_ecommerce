import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Product} from '../../../interfaces/product.model';
import {getCurrentUser, getPathImage} from '../../utils/utils';
import {ToastrService} from 'ngx-toastr';
import {ProductService} from '../../../services/product.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-item-single',
    templateUrl: './item-single.component.html',
    styleUrls: ['./item-single.component.scss', '../../../home/home.component.scss']
})
export class ItemSingleComponent implements OnInit {
    @Input() item!: Product;
    @Output() itemClicked = new EventEmitter<number>();

    carouselOptions = {
        items: 1,
        dots: false,
        navigation: false,
        loop: true,
        margin: 10,
        autoplay: true,
        animateOut: 'fadeOut',
        autoHeight: true,
        autoHeightClass: 'owl-height',
    };

    carouselClasses = ['owl-theme', 'row', 'sliding'];

    constructor(private toastr: ToastrService,
                private productService: ProductService,
                private router: Router) {
    }

    ngOnInit(): void {
    }

    // Thêm vào giỏ hàng
    addToCart(productId: number) {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            this.toastr.warning('Vui lòng đăng nhập để thêm vào giỏ hàng!', 'Thông báo');
            return;
        }

        this.productService
            .addProductToCart(currentUser.id, productId)
            .subscribe((data) => {
                    console.log(data);
                    this.toastr.success('Thêm vào giỏ hàng thành công', 'Thông báo');
                }, e => {
                    console.log(e);
                    this.toastr.error('Có lỗi xảy ra. Vui lòng thử lại', 'Lỗi hệ thống');
                }
            );
    }

    // Chuyển hướng sang trang chi tiết sp
    singleProduct(id: number) {
        void this.router.navigate(['product/' + id]);
    }

    cardClicked() {
        this.itemClicked.emit(this.item.id);
    }

    getPathImage(image: string): string {
        return getPathImage(image);
    }
}

import {ToastrService} from 'ngx-toastr';
import {Component, OnInit} from '@angular/core';
import {ProductService} from '../services/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {getComments, getCurrentUser, getPathImage} from '../shared/utils/utils';
import {Product} from '../interfaces/product.model';

@Component({
    selector: 'app-single-product',
    templateUrl: './single-product.component.html',
    styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
    public productId;
    product: Product;
    simillarProducts: Product[] = [];

    constructor(
        private productService: ProductService,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
    ) {
    }

    ngOnInit() {
        this.productId = +this.route.snapshot.paramMap.get('id')!;
        this.loadData(this.productId);
    }

    loadData(id: number) {
        this.productService.findById(id).subscribe((data) => {
            this.product = data;
        });
        this.productService.getSimillarProducts(id).subscribe((data) => {
            this.simillarProducts = data;
        });
    }

    // Xử lý khi click vào sản phẩm liên quan
    productDetail(id: number) {
        console.log(id);
        void this.router.navigate(['product/' + id]);
        this.ngOnInit();
    }

    // Thêm vào giỏ hàng
    addToCart(productId: number, navigate?: boolean) {
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
                    if (navigate) {
                        //Chuyển hướng vào đơn đặt hàng
                        void this.router.navigate(['shopping-cart/' + currentUser.id]);
                    }

                }, e => {
                    console.log(e);
                    this.toastr.error('Có lỗi xảy ra. Vui lòng thử lại', 'Lỗi hệ thống');
                }
            );
    }

    // Mua ngay
    buyNow() {
        this.addToCart(this.productId, true);
    }

    getPathImage(image: string): string {
        return getPathImage(image);
    }

    viewAll() {
        void this.router.navigate(['products']);
    }

    get messages() {
        return getComments();
    }
}

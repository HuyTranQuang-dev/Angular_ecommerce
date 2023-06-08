import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../services/product.service';
import {GetAllProductsResponse} from '../interfaces/product.model';
import {getPathImage} from '../shared/utils/utils';


@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
    page = 1;
    pageSize = 4;
    categorySelected = 'all';

    // Chỉ hiển thị phân trang khi cần thiết
    paginationIsDisplay = true;
    getAllProductsResponse = new GetAllProductsResponse();

    constructor(
        private router: Router,
        private productService: ProductService,
    ) {
    }

    ngOnInit() {
        this.getAllProductsOnPage();
    }

    // Lấy danh sách các sản phẩm ở trang hiện tại khi click vào danh mục
    getAllProductsOnPage() {
        this.categorySelected = 'all';
        this.paginationIsDisplay = true;

        // Lấy các sản phẩm thuộc trang hiện tại
        this.productService
            .getAllProducts(this.page, this.pageSize)
            .subscribe((data) => {
                this.getAllProductsResponse = data;
            });
    }

    // Tìm kiếm sản phẩm theo danh mục -> không phân trang
    findProductByCategory(id) {
        this.categorySelected = id + '';
        this.paginationIsDisplay = false;
        this.productService.findProductByCategory(id).subscribe((data) => {
            this.getAllProductsResponse.productDTOList = data;
        });
    }

    // Lấy danh sách sản phẩm trang tiếp theo
    handlePageChange(event: number) {
        this.page = event;
        this.getAllProductsOnPage();
    }

    getPathImage(image: string): string {
        return getPathImage(image);
    }
}


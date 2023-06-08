import {Router} from '@angular/router';
import {CategoryActionPopupComponent} from './category-action-popup/category-action-popup.component';
import {ToastrService} from 'ngx-toastr';
import {ActionProductPopupComponent} from './action-popup/action-popup.component';
import {MatDialog} from '@angular/material/dialog';
import {Component, OnInit} from '@angular/core';
import {ManageProductService} from '../../services/manage-product.service';
import {DeleteProductPopupComponent} from './delete-popup/delete-popup.component';
import {CategoryDeletePopupComponent} from './category-delete-popup/category-delete-popup.component';
import {getPathImage} from '../../../shop/shared/utils/utils';
import {Category, Product} from '../../../shop/interfaces/product.model';
import {DialogResult, EventEnum} from '../../../shop/interfaces/dialog-result.model';
import {ResponseNormal} from '../../../shop/interfaces/response-normal.model';

@Component({
    selector: 'app-manage-products',
    templateUrl: './manage-products.component.html',
    styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
    page: number;
    pageCategory: number;
    pageSize: number = 5;
    totalProducts: number;
    totalCategory: number;

    products: Product[];
    categories: Category[];

    currentCategory: number;
    //Chỉ hiện thị phân trang khi cần thiết

    paginationIsDisplay: boolean = true;
    paginationIsDisplayCate: boolean = true;

    // Xu ly sau khi luu product
    saveCallback = (data: ResponseNormal<undefined>) => {
        if (data.httpStatus === 'OK') {
            this.toastr.success(data.msg);
            this.getListProduct(this.currentCategory);
            return;
        }

        this.toastr.error(data.msg);
    }

    constructor(
        private productService: ManageProductService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private route: Router
    ) {
    }

    ngOnInit() {
        this.page = 1;
        this.pageCategory = 1;
        this.loadData();
    }

    loadData() {
        // Lấy ds danh mục
        this.productService.getAllCategory(this.pageCategory, this.pageSize).subscribe((data) => {
            this.categories = data;

            if (this.categories?.length == 0 && this.pageCategory > 0) {
                this.pageCategory -= 1;
                this.loadData();
                return;
            }

            if (!data || data.length === 0) {
                return;
            }

            console.log(data);
            this.currentCategory = data[0].id;
            // Lấy ds sản phẩm và số lượng sản phẩm
            this.getListProduct(this.currentCategory);
        });

        //Lấy tổng slg danh mục
        this.productService.getCountCategory().subscribe((data) => {
            this.totalCategory = data;
            this.paginationIsDisplayCate = this.totalCategory > this.pageSize;
        });
    }

    getListProduct(idCategory: number) {
        this.page = 1;
        this.currentCategory = idCategory;
        this.productService.getProductsByCategory(idCategory, this.page, this.pageSize).subscribe(data => {
            if (data) {
                this.products = data.list;
                this.totalProducts = data.total;
            }
        });
    }

    // Phân trang category
    handlePageCategoryChange(event) {
        this.pageCategory = event;
        this.loadData();
    }

    // Phân trang product
    handlePageChange(event) {
        this.page = event;
        this.productService.getProductsByCategory(this.currentCategory, this.page, this.pageSize).subscribe(data => {
            if (data) {
                this.products = data.list;
                this.totalProducts = data.total;
            }
        });
    }

    // Them sản phẩm
    add(action: string) {

        this.dialog.open(ActionProductPopupComponent, {
            data: {action, categories: this.categories},
            width: window.innerWidth + 'px',
            maxHeight: 500 + 'px',
        }).afterClosed().subscribe(result => {

            const resultDialog = result as DialogResult<FormData>;

            if (resultDialog?.event === EventEnum.ADD)
                this.productService
                    .addProduct(resultDialog.data)
                    .subscribe(this.saveCallback);
        });
    }

    // Sửa sản phẩm
    edit(product: any, action: string) {

        this.dialog.open(ActionProductPopupComponent, {
            data: {
                ...product,
                action,
                categories: this.categories
            },
            width: window.innerWidth + 'px',
            maxHeight: 500 + 'px',
        }).afterClosed().subscribe((result) => {

            const resultDialog = result as DialogResult<FormData>;

            if (resultDialog?.event === EventEnum.EDIT)
                this.productService
                    .updateProduct(result.data)
                    .subscribe(this.saveCallback);
        });
    }

    // Xoa sản phẩm
    delete(u: any, action: string) {
        u.action = action;
        this.dialog.open(DeleteProductPopupComponent, {data: u})
            .afterClosed()
            .subscribe((res) => {
                const resultDialog = res as DialogResult<FormData>;

                if (resultDialog.event === EventEnum.DELETE) {

                    this.productService
                        .deleteProduct(res.data.id)
                        .subscribe(this.saveCallback);
                }
            });
    }

    // Sửa danh mục
    editCategory(u: any, action: string) {
        u.action = action;
        const dialogRef = this.dialog.open(CategoryActionPopupComponent, {data: u});
        dialogRef.afterClosed().subscribe((result) => {
            if (result === undefined) {
                return;
            }
            if (result.event === 'edit') {
                console.log(result);
                this.productService.updateCategory(result.data).subscribe(res => {
                    if (res.httpStatus === 'OK') {
                        this.toastr.success(res.msg);
                    } else {
                        this.toastr.error(res.msg);
                    }
                    this.loadData();
                });
            }
        });
    }

    // Thêm danh mục
    addCategory(action: string) {
        const category: any = {};
        category.action = action;
        const dialogRef = this.dialog.open(CategoryActionPopupComponent, {data: category});
        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined) {
                return;
            }
            if (result.event === 'add') {
                this.productService.addCategory(result.data).subscribe(res => {
                    if (res.httpStatus === 'OK') {
                        this.toastr.success(res.msg);
                        this.loadData();
                    } else {
                        this.toastr.error(res.msg);
                    }
                });
            }
        });
    }

    // Xóa danh mục
    deleteCategory(category: any, action: string) {
        category.action = action;
        const dialogRef = this.dialog.open(CategoryDeletePopupComponent, {data: category});
        dialogRef.afterClosed().subscribe(result => {
            if (result === undefined) {
                return;
            }
            if (result.event === 'delete') {
                this.productService.deleteCategory(result.data.id).subscribe(res => {
                    if (res.httpStatus === 'OK') {
                        this.toastr.success(res.msg);
                    } else {
                        this.toastr.error(res.msg);
                    }
                    this.loadData();
                });
            }
        });
    }

    get categoryName() {
        if (!this.categories && !this.currentCategory) {
            return 'Bạn chưa chọn danh mục sản phẩm';
        }

        let categoryName = '';
        this.categories?.forEach(category => {
            if (category.id === this.currentCategory) {
                categoryName = category.name;
            }
        });

        return 'Danh sách sản phẩm của: ' + categoryName;
    }

    // lay đường dẫn ảnh
    getPathImage(image: string): string {
        return getPathImage(image);
    }
}

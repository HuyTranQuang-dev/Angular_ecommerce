import {FormControl, FormGroup} from '@angular/forms';
import {OderService} from '../../../services/oder.service';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {getCurrentUser, getPathImage} from '../../../shared/utils/utils';
import {Order, OrderProduct} from '../../../interfaces/order.model';

@Component({
    selector: 'app-order-current',
    templateUrl: './order-current.component.html',
    styleUrls: ['./order-current.component.scss'],
})
export class OrderCurrentComponent implements OnInit {
    private id: number = 0;

    orderProducts: OrderProduct[] = [];
    calculateOrder: Order;
    shipFee: number = 0;

    public notifyForm = new FormGroup({
        nameUser: new FormControl(''),
        phoneNumber: new FormControl(''),
        address: new FormControl(''),
        orderDate: new FormControl('')
    });

    constructor(
        private orderService: OderService,
        private router: Router,
        private toastr: ToastrService) {
    }

    ngOnInit() {
        this.loadPage();
    }

    // Lấy danh sách sản phẩm và số lượng + order hiện tại của user
    public loadPage() {
        this.checkUser();

        //Load data
        this.orderService.getOder().subscribe((data) => {

            if (!data) {
                void this.router.navigate(['/home']);
                this.toastr.warning('Vui lòng đăng nhập!');
                return;
            }

            console.log(data);

            this.calculateOrder = data.ordersDTO;
            this.orderProducts = data.orderProducts ?? [];

            // Set giá trị cho form control nếu có đơn đặt hàng
            if (data.ordersDTO) {
                for (let controlName in this.notifyForm.controls) {
                    if (controlName) {
                        this.notifyForm.controls[controlName].setValue(data.ordersDTO[controlName]);
                    }
                }
            }
        });
    }

    // Thanh toán tiền đặt hàng
    payment() {
        this.orderService
            .payment(this.id, this.orderCurrent())
            .subscribe((data) => {
                console.log(data);
                this.toastr.info(data.msg, 'Thông báo');
                void this.router.navigate(['/home']);
            });
    }

    // Đóng gói order hiện tại thành object gửi lên server khi thanh toán
    orderCurrent(): Order {
        const order = this.notifyForm.value;
        order.id = this.calculateOrder.id;
        order.status = 1;
        order.totalprice = this.calculateOrder.totalprice + this.shipFee;
        return order as Order;
    }

    // Xóa sản phẩm trong order
    removeProductOrder(id: number) {
        this.orderService.removeProductOrder(id).subscribe((data) => {
            console.log(data);
            this.orderProducts = data.orderProducts;
            this.calculateOrder = data.ordersDTO;
            this.toastr.success('Đã xóa sản phẩm này!', 'Thông báo');
        });
    }

    // Click vao sản phẩm trong giỏ hàng
    goToProductDetails(id: number) {
        void this.router.navigate(['product/' + id]);
    }

    checkUser() {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            void this.router.navigate(['/home']);
            return;
        }
        this.id = currentUser.id;
    }

    getPathImage(image: string): string {
        return getPathImage(image);
    }
}

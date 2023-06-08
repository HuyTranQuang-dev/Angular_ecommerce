import { OderService } from '../../../services/oder.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {getCurrentUser} from '../../../shared/utils/utils';
import {Order} from '../../../interfaces/order.model';

@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.scss']
})
export class HistoryOrderComponent implements OnInit {
  userId: number;
  orders: Order[] = [];

  status = {
    0: 'Đang đặt hàng',
    1: 'Đang chờ xác nhận',
    2: 'Đang giao hàng',
    3: 'Đã giao hàng'
  };

  constructor(
    private orderService: OderService, 
    private router: Router) { }

  ngOnInit() {
    this.checkUser();
    this.getHistoryOrders();
  }

  checkUser() {
    const currentUser = getCurrentUser();

    if(!currentUser){
      void this.router.navigate(['/home']);
      return;
    }

    this.userId = currentUser.id;
  }

  // Lấy danh sách đơn hàng đã đặt
  getHistoryOrders(){
    this.orderService.getHistoryOrders(this.userId).subscribe(response =>{
      this.orders = response;
    })
  }
}

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderCurrentComponent } from './order-current/order-current.component';
import { HistoryOrderComponent } from './history-order/history-order.component';
import { OrderPageRouting } from './order.routing';
import {NgModule} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    HistoryOrderComponent,
    OrderCurrentComponent
  ],
    imports: [
        OrderPageRouting,
        MatIconModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
  exports: [
    HistoryOrderComponent,
    OrderCurrentComponent
  ],
  entryComponents: []
})
export class OrderPageModule {
}

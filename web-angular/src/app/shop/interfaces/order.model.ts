import {Product} from './product.model';

export class Order {
    id: number;
    totalprice: number;
    address: string;
    phoneNumber: string;
    nameUser: string;
    orderDate: string;
    status: number;
    idUser: number;
}

export class OrderProduct {
    id: number;
    quantity: number;
    price: number;
    ordersDTO: Order;
    productDTO: Product;
}

export class OrderPageData {
    ordersDTO: Order;
    orderProducts: OrderProduct[];
}

import {catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {HttpHeaders, HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Order, OrderPageData} from '../interfaces/order.model';

@Injectable({
    providedIn: 'root'
})
export class OderService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        }),
    };

    private REST_API_SERVER = 'http://localhost:8080';

    constructor(private httpClient: HttpClient) {
    }

    // Lấy oder của user theo id
    public getOder(): Observable<OrderPageData> {
        const url = `${this.REST_API_SERVER}/order/`;
        return this.httpClient.get<OrderPageData>(url);
    }

    // Thanh toán order
    public payment(id: number, order: Order): Observable<any> {
        const url = `${this.REST_API_SERVER}/order/payment/${id}`;
        return this.httpClient.post<any>(url, order);
    }

    // Xóa sản phẩm trong order
    public removeProductOrder(idProductOrder: number): Observable<OrderPageData> {
        const url = `${this.REST_API_SERVER}/order/remove?id-product-order=${idProductOrder}`;
        return this.httpClient.delete<OrderPageData>(url);
    }

    getHistoryOrders(id: number): Observable<Order[]> {
        const url = `${this.REST_API_SERVER}/order/history?id-user=${id}`;
        return this.httpClient.get<Order[]>(url);
    }

    //Handles error when send data to server
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error :', error.error.message);
        } else {
            console.error(`Backend return code ${error.status},` + `body was: ${error.error} `);
        }
        return throwError('Something bad happened; please try again later.');
    }
}

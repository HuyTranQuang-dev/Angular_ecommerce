import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ResponseNormal} from '../../shop/interfaces/response-normal.model';

@Injectable({
  providedIn: 'root'
})
export class ManageProductService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private REST_API_SERVER = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  // Lấy toàn bộ danh sách san pham
  getAllProducts(page: number, pageSize: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/product?page=${page}&limit=${pageSize}`;
    return this.http.get<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  // Lấy toàn bộ danh sách danh muc
  getAllCategory(page: number, pageSize: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/category?page=${page}&limit=${pageSize}`;
    return this.http.get<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  // Lấy ds san phẩm theo category
  getProductsByCategory(id: number, page: number, pageSize: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/product/${id}?&page=${page}&limit=${pageSize}`;
    return this.http.get<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  getCount(): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/product-count`;
    return this.http.get<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  getCountCategory(): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/category-count`;
    return this.http.get<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  addProduct(formData: FormData): Observable<ResponseNormal<undefined>> {
    const url = `${this.REST_API_SERVER}/admin/product`;
    return this.http.post<ResponseNormal<undefined>>(url, formData);
  }

  updateProduct(product: FormData): Observable<ResponseNormal<undefined>> {
    const url = `${this.REST_API_SERVER}/admin/product`;
    return this.http.put<ResponseNormal<undefined>>(url, product);
  }

  deleteProduct(id: any): Observable<ResponseNormal<undefined>> {
    const url = `${this.REST_API_SERVER}/admin/product/${id}`;
    return this.http.delete<ResponseNormal<undefined>>(url)
  }

  addCategory(category: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/category`;
    return this.http.post<any>(url, category, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  updateCategory(category: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/category`;
    return this.http.put<any>(url, category, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }

  deleteCategory(id: any): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/category/${id}`;
    return this.http.delete<any>(url, this.httpOptions)
        .pipe(catchError(ManageProductService.handleError));
  }


  // Handles error when send data to server
  private static handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error :', error.error.message);
    } else {
      console.log(`Backend return code ${error.status},` + `body was: ${error.error} `);
    }
    return throwError(error);
  }
}

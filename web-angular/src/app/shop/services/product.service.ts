import {catchError} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {LoadingService} from './loading.service';
import {FindByPriceResponse, GetAllProductsResponse, HomePageData, Product} from '../interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private REST_API_SERVER = 'http://localhost:8080';

  constructor(private loadingService: LoadingService, private httpClient: HttpClient) { }


  // Get products on a page
  getAllProducts(page: number, pageSize: number): Observable<GetAllProductsResponse> {
    const url= `${this.REST_API_SERVER}/product-page?page=${page}&limit=${pageSize}`;
    return this.httpClient.get<GetAllProductsResponse>(url);
  }

  // Find product by id category
  findProductByCategory(id): Observable<Product[]> {
    const url= `${this.REST_API_SERVER}/product-page/category/${id}`;
    return this.httpClient.get<Product[]>(url);
  }

  //Find product by price
  findByPrice(price: number, page: number, pageSize: number): Observable<FindByPriceResponse> {
    const url= `${this.REST_API_SERVER}/product-page/search?price=${price}&page=${page}&limit=${pageSize}`;
    return this.httpClient.get<FindByPriceResponse>(url);
  }

  // Find product by id
  findById(id: number): Observable<Product>{
    const url= `${this.REST_API_SERVER}/product-page/${id}`;
    return this.httpClient.get<Product>(url);
  }

  // Lấy danh sách sản phẩm liên quan theo id sản phẩm
  getSimillarProducts(id: number): Observable<Product[]> {
    const url= `${this.REST_API_SERVER}/single-product/relate/${id}`;
    return this.httpClient.get<Product[]>(url)
  }

  //Thêm sản phẩm được chọn vào giỏ hàng của user hiện tại
  addProductToCart(idUser: number, idProduct: number): Observable<any> {
    const url= `${this.REST_API_SERVER}/product-page/cart?iduser=${idUser}&idproduct=${idProduct}`;
    return this.httpClient.get<any>(url);
  }

  //Lấy data home page (Gồm 4 sp mới nhất + 4 sp bán chạy)
  getHomePage(): Observable<HomePageData> {
    return this.httpClient.get<HomePageData>(`${this.REST_API_SERVER}/home`);
  }
}

export interface Product {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    price: number;
    image: string;
    createDate: Date;
}

export class HomePageData {
    listNewProduct: Product[];
    listBestSeller: Product[];

    constructor() {
        this.listBestSeller = [];
        this.listBestSeller = [];
    }
}

export interface Category {
    id: number;
    name: string;
}

export class GetAllProductsResponse {
    page: number;
    totalPage: number;
    totalProduct: number;
    productDTOList: Product[];
    categoryDTOList: Category[];

    constructor() {
        this.page = 1;
        this.totalPage = 1;
        this.productDTOList = [];
        this.categoryDTOList = [];
    }
}

export class FindByPriceResponse extends GetAllProductsResponse {
    constructor() {
        super();
    }
}

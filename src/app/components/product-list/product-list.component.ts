import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Products } from 'src/app/models/products';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productCardClass: string = 'card col-3 ms-3 mb-3';

  //: ! Şuan undefined olduğu için kızma, daha sonra seni atacağım şeklinde söz vermiş oluyoruz.
  //: ? Bu özellik undefined olabilir demek.
  //: null için ? kullanamıyoruz, | null diye belirtmemiz gerekiyor.
  products!: Products[];
  isLoaded = false

  selectedProductCategoryId: number | null = null;
  searchProductNameInput: any = null;  // any yapınca sorun çözüldü ama mantığını anlamadım.
  get filteredProducts(): any[] {
    let filteredProducts = this.products;
    console.log(filteredProducts)

      if (this.selectedProductCategoryId)
        filteredProducts = filteredProducts.filter(
          (p) => p.categoryId === this.selectedProductCategoryId)


      if (this.searchProductNameInput)
        filteredProducts = filteredProducts.filter((p) =>
          p.name.toLowerCase().includes(this.searchProductNameInput?.toLowerCase()));

        return filteredProducts;
  }
  //: ActivatedRoute mevcut route bilgisini almak için kullanılır.
  //: Router yeni route bilgisi oluşturmak için kullanılır.
  constructor(private activatedRoute: ActivatedRoute, private router: Router,private productService:ProductsService ) {}

  ngOnInit(): void {
    this.getCategoryIdFromRoute();
    this.getSearchProductNameFromRoute();
    this.getProductList();
  }
  getProductList(){
    this.productService.getProducts().subscribe((response)=>{

      // ! setTimeout !
      // setTimeout kullanarak sunucudan productList datalarını 2 sn'de getirmesini istedik. // Async
      // En başta false olarak tanımlandığım dataLoaded değişkeni veriler yüklendiğinde false olsun.
      //HTML sayfasında da eğer dataLoaded true ise productList'leri göster şeklinde koşul geçtim.
      setTimeout(()=>{
        this.products = response
        this.isLoaded = true
      },2000)
    })
  }

  getCategoryIdFromRoute(): void {
    //: route params'ları almak adına activatedRoute.params kullanılır.
    this.activatedRoute.params.subscribe((params) => {
      if (params['categoryId'])
        this.selectedProductCategoryId = parseInt(params['categoryId']);
      else this.selectedProductCategoryId = null;
      // "10.123" // float/double
      // "10" // int
    });
  }

  getSearchProductNameFromRoute(): void {
    //: query params'ları almak adına activatedRoute.queryParams kullanılır.
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      // && this.searchProductNameInput == null
      if (
        queryParams['searchProductName'] &&
        queryParams['searchProductName'] !== this.searchProductNameInput
      )
        this.searchProductNameInput = queryParams['searchProductName'];
      //# Defensive Programming
      if (
        !queryParams['searchProductName'] &&
        this.searchProductNameInput !== null
      )
        this.searchProductNameInput = null;
    });
  }

  isProductCardShow(product: any): boolean {
    return product.discontinued == false;
  }

  onSearchProductNameChange(event: any): void {
    // this.searchProductNameInput = event.target.value; //: ngModel'imiz kendisi bu işlemi zaten gerçekleştiriyor.

    const queryParams: any = {};
    if (this.searchProductNameInput !== '')
      queryParams['searchProductName'] = this.searchProductNameInput;
    this.router.navigate([], {
      queryParams: queryParams,
    });
  }



}


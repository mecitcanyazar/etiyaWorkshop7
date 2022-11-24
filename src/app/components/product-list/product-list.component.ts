import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productCardClass: string = 'card col-3 ms-3 mb-3';

  products: any[] = [
    {
      id: 1,
      name: 'Chai',
      categoryId: 1,
      unitPrice: 18,
      unitsInStock: 39,
      quantityPerUnit: '10 boxes x 20 bags',
      discontinued: false,
    },
    {
      id: 2,
      name: 'Chang',
      categoryId: 1,
      unitPrice: 19,
      unitsInStock: 0,
      quantityPerUnit: '24 - 12 oz bottles',
      discontinued: true,
    },
    {
      id: 3,
      name: 'Aniseed Syrup',
      categoryId: 2,
      unitPrice: 10,
      unitsInStock: 13,
      quantityPerUnit: '12 - 550 ml bottles',
      discontinued: false,
    },
  ];
  selectedProductCategoryId: number | null = null;
  searchProductNameInput: string | null = null;
  get filteredProducts(): any[] {
    let filteredProducts = this.products;

    if (this.selectedProductCategoryId)
      filteredProducts = filteredProducts.filter(
        (p) => p.categoryId === this.selectedProductCategoryId
      );

    if (this.searchProductNameInput)
      filteredProducts = filteredProducts.filter((p) =>
        p.name
          .toLowerCase()
          .includes(this.searchProductNameInput?.toLowerCase())
      );

    return filteredProducts;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.getCategoryIdFromRoute();
  }

  getCategoryIdFromRoute(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['categoryId'])
        this.selectedProductCategoryId = parseInt(params['categoryId']);
      else this.selectedProductCategoryId = null;
      // "10.123" // float/double
      // "10" // int
    });
  }

  isProductCardShow(product: any): boolean {
    return product.discontinued == false;
  }

  onSearchProductNameChange(event: any): void {
    this.searchProductNameInput = event.target.value;
  }
}

import {ManageProductService} from '../../../services/manage-product.service';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject, OnInit, Optional} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Category, Product} from '../../../../shop/interfaces/product.model';
import {EventEnum} from '../../../../shop/interfaces/dialog-result.model';
import {getPathImage} from '../../../../shop/shared/utils/utils';

@Component({
  selector: 'app-product-action-popup',
  templateUrl: './action-popup.component.html',
  styleUrls: ['./action-popup.component.scss']
})
export class ActionProductPopupComponent implements OnInit {
  files: File[] = [];

  action: EventEnum;
  product: Product;
  categories: Category[];

  productForm = this.fb.group({
    categoryId: ['', Validators.required],
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<ActionProductPopupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manageProductService: ManageProductService,
    private toast: ToastrService,
  ) { 
    this.action = data.action;
    this.product = data;
    this.categories = data.categories;
  }

  ngOnInit() {
    this.loadData();
  }

  // Đổ dữ liệu vào form sửa
  loadData(): void {

    // Set form control
    if(this.action === EventEnum.EDIT) {

      for (let controlName in this.productForm.controls) {
        this.productForm.controls[controlName].setValue(this.product[controlName]);
      }
    }
  }

  changeCategory(event){
    this.productForm.controls.categoryId.setValue(event.value);
  }

  save() {

    if (this.productForm.invalid) {
      this.toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    if (this.files.length <= 0 && this.action === EventEnum.ADD) {
      this.toast.error('Vui lòng chọn ảnh sản phẩm');
      return;
    }

    this.product = {
      ...this.product,
      ...this.productForm.value,
      createDate: new Date()
    };

    console.log(this.product)

    const formData = new FormData();
    formData.append('product',
        new Blob([JSON.stringify(this.product)],
            {type: 'application/json'})
    );
    formData.append('file', this.files[0])

    this.dialogRef.close({event: this.action, data: formData});
  }

  closeDialog(){
    this.dialogRef.close({event: 'cancel'});
  }

  onSelect(event) {
    console.log(event);
    this.files = [];
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  getCreateDate(): string {
    if (this.action === EventEnum.EDIT) {
      return this.product.createDate as unknown as string;
    }
    return new Date() as unknown as string;
  }

  get pathImage() {
    return getPathImage(this.product.image);
  }
}

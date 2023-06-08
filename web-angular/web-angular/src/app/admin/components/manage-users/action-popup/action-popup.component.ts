import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, Inject, OnInit, Optional} from '@angular/core';

@Component({
    selector: 'app-action-popup',
    templateUrl: './action-popup.component.html',
    styleUrls: ['./action-popup.component.scss']
})
export class ActionPopupComponent implements OnInit {

    public profileForm: FormGroup;

    roles: any[] = [
        {
            checkbox: false,
            name: 'ADMIN'
        },
        {
            checkbox: false,
            name: 'USER'
        }
    ];
    private roleUpdate: string[] = [];
    action: string;
    user: any = null;

    constructor(
        public dialogRef: MatDialogRef<ActionPopupComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        if (data.action === 'edit') {
            this.roleUpdate = data.roles;
        }
        this.action = data.action;
        this.user = data;
    }

    ngOnInit() {
        this.profileForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            fullname: ['', Validators.required],
            phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            address: ['', Validators.required],
        });
        this.loadData();
    }

    //Đổ dữ liệu vào form sửa
    loadData() {
        //Set form control
        if (this.action === 'edit') {
            for (let controlName in this.profileForm.controls) {
                this.profileForm.controls[controlName].setValue(this.user[controlName]);
            }
            this.profileForm.get('password').disable();
        }
        //Set options list
        if (this.roleUpdate) {
            this.roles.forEach(item => {
                this.roleUpdate.forEach(role => {
                    if (item.name === role) {
                        item.checkbox = true;
                    }
                });
            });
        }
    }

    //Chọn roles
    onCheckboxClick(event, list) {
        //Xóa hết role trong mảng
        this.roleUpdate = [];
        //Gán role theo list checked
        list.selectedOptions.selected.forEach(item => {
            this.roleUpdate.push(item.value);
        });
    }

    //Click vào lưu
    update() {
        //Gán roles vào user
        this.user.roles = this.roleUpdate;
        //Lấy giá trị từ các FormControl
        for (let controlName in this.profileForm.controls) {
            this.user[controlName] = this.profileForm.controls[controlName].value;
        }
        console.log('user sau khi sua/ them: ', this.user);
        this.dialogRef.close({event: this.action, data: this.user});
    }

    //Click vào bỏ qua
    closeDialog() {
        this.dialogRef.close({event: 'cancel'});
    }
}

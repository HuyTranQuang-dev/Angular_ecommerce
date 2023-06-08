import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Optional, Inject } from '@angular/core';

@Component({
  selector: 'app-popup-delete',
  templateUrl: './popup-delete.component.html',
  styleUrls: ['./popup-delete.component.scss']
})
export class PopupDeleteComponent implements OnInit {

  action: string;
  local_data:any;

  constructor(
    public dialogRef: MatDialogRef<PopupDeleteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.local_data = data;
    this.action = data.action;
   }

  ngOnInit() {
  }

  //Click vào xóa
  doAction(){
    this.dialogRef.close({event:this.action, data:this.local_data});
  }

  //Click vào bỏ qua
  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}

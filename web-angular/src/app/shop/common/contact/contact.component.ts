import { Component, OnInit } from '@angular/core';
import {PHONE} from '../../shared/utils/utils';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  open = false;

  constructor() { }

  ngOnInit() {
  }

  output(event) {
    console.log(event);
  }

  get phone() {
    return PHONE;
  }
}

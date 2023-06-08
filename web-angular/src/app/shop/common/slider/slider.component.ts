import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
    carouselOptions =
        {
            items: 1,
            dots: true,
            navigation: false,
            loop: true,
            margin: 10,
            autoplay: true,
            animateOut: 'fadeOut',
            autoHeight: true,
            autoHeightClass: 'owl-height',

        };


    images = [

        {
            text: 'Festive Deer',
            image: 'http://localhost:4200/assets/images/slider1.jpg'
        },
        {
            text: 'Festive Deer',
            image: 'http://localhost:4200/assets/images/slider2.jpg'
        },
        {
            text: 'Festive Deer',
            image: 'http://localhost:4200/assets/images/slider3.jpg'
        },
    ];

    constructor() {
    }

    ngOnInit() {
    }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageSliderInterface } from '../shared/image-slider/image-slider.interface';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  slides: ImageSliderInterface[] = [
    { url: "../assets/image-slider/construcao1.jpg", title: "construcao1" },
    { url: "../assets/image-slider/construcao2.jpg", title: "construcao2" },
    { url: "../assets/image-slider/construcao3.jpg", title: "construcao3" },
    { url: "../assets/image-slider/construcao4.jpg", title: "construcao4" },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
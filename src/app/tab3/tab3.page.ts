import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  map: any;

  constructor() {}

  ngOnInit(){
    this.mapLoad();
  }

  mapLoad(){
    var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

    mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YXN0cmEiLCJhIjoiY2swNWdxdHh5MnEwZzNjcWRwZHZhb3V4OSJ9.HzC-8uaNaR0649tGnfRzFA';
    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [151.1,-33.8],
      zoom: 12
    });
  }



}

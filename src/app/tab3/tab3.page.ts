import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var require: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  map: any;
  geoCoder: any;

  constructor(
    private router: Router
  ) {}

  ngOnInit(){
    //this.mapLoad();
  }

  // mapLoad(){
  //   var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

  //   mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YXN0cmEiLCJhIjoiY2swNWdxdHh5MnEwZzNjcWRwZHZhb3V4OSJ9.HzC-8uaNaR0649tGnfRzFA';
  //   var map = new mapboxgl.Map({
  //     container: 'map',
  //     // style: 'mapbox://styles/mapbox/streets-v11',
  //     style: {version: 8, sources: {}, layers: []},
  //     center: [151.1,-33.8],
  //     zoom: 12
  //   });
  // }

  // search(){
  //   var MapboxGeocoder = require('mapbox-gl/dist/mapbox-gl.js');
  //   var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  //   mapboxgl.accessToken = 'pk.eyJ1IjoiYXF1YXN0cmEiLCJhIjoiY2swNWdxdHh5MnEwZzNjcWRwZHZhb3V4OSJ9.HzC-8uaNaR0649tGnfRzFA';
    
  //   var geocoder = new MapboxGeocoder({
  //     accessToken: mapboxgl.accessToken,
  //     mapboxgl: mapboxgl
  //     });
  // }

  gotoPage(){
    this.router.navigate(['/createoffline']);
  }



}

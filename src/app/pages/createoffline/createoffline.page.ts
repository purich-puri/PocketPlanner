import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createoffline',
  templateUrl: './createoffline.page.html',
  styleUrls: ['./createoffline.page.scss'],
})
export class CreateofflinePage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
  }

}

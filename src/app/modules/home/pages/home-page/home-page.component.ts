import {Component, OnInit} from '@angular/core';
import {ChildrenOutletContexts} from '@angular/router';
import {slideInAnimation} from "@core/animations";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  animations: [slideInAnimation]
})
export class HomePageComponent implements OnInit {

  constructor(private contexts: ChildrenOutletContexts) {
  }

  _getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  ngOnInit(): void {
  }

}

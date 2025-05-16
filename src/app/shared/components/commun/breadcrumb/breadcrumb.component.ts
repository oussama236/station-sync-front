import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnChanges {

  @Input() url: string = "";
  pathNames: string[] = [];

  ngOnInit(): void {
    this.pathNames = this.url.split('/');
  };

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['url']){
      this.url = changes['url'].currentValue;
      this.pathNames = this.url.split('/');
    }
  };
}

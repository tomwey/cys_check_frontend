import { Component, OnInit, ViewChild, ElementRef, Input, Renderer } from '@angular/core';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})
export class AccordionListComponent implements OnInit {

  @ViewChild('wrapper', { read: ElementRef }) wrapper;
  @Input() expanded: any;
  @Input() expandedHeight: any;

  constructor(public renderer: Renderer) { }

  ngOnInit() {
    if (this.expandedHeight) {
      this.renderer.setElementStyle(this.wrapper.nativeElement,
        'height', this.expandedHeight + 'px');
    }
  }

}

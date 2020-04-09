import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hn-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
})
export class SwitchComponent implements OnInit {

  @Input() on: boolean = false;
  @Input() onText: string;
  @Input() onColor: string;
  @Input() offText: string;
  @Input() offColor: string;

  @Output() change: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  toggle(ev: Event) {
    ev.stopPropagation();
    this.on = !this.on;
    this.change.emit(this.on);
  }

}

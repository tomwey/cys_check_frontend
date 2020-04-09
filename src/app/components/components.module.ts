import { NgModule } from '@angular/core';
import { SwitchComponent } from './switch/switch.component';
import { IonicModule } from '@ionic/angular';
import { AccordionListComponent } from './accordion-list/accordion-list.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [SwitchComponent, AccordionListComponent],
  imports: [
    IonicModule, CommonModule
  ],
  exports: [SwitchComponent, AccordionListComponent]
})
export class ComponentsModule { }

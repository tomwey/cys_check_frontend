import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-comm-select',
  templateUrl: './comm-select.page.html',
  styleUrls: ['./comm-select.page.scss'],
})
export class CommSelectPage implements OnInit {

  keyword = '';
  error = null;
  @Input() data = [];

  selectedItem: any;
  originData: any = [];

  @Input() title = '请选择';

  constructor(private modalCtrl: ModalController) {
    // this.data = this.navParams.data.data;
    // this.title = this.navParams.data.title;
    // this.selectedItem = this.navParams.data.selectedItem;
    // if (this.data.length === 0) {
    //   this.error = '暂无数据';
    // }


  }

  ngOnInit() {
    this.originData = this.data;
  }

  close() {
    this.modalCtrl.dismiss();
  }

  startSearch(kw) {
    if (kw.trim() === '') {
      this.data = this.originData;
      return;
    }

    this.data = this.originData.filter(item => {
      return item.indexOf(kw.trim().toLowerCase()) > -1;
    });
  }

  selectItem(item) {
    const label = item.split('|')[0];
    const value = item.split('|')[1];
    this.modalCtrl.dismiss({
      label,
      value
    });
  }

}

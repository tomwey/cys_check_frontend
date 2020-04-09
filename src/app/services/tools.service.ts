import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  private isLoading = false;
  private loadings = [];
  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) { }

  /**
   * 显示Toast
   * @param message 内容
   * @param duration 显示时长
   */
  async showToast(message: string = '操作完成', duration: number = 2000) {
    const toast = await this.toastCtrl.create(
      {
        message,
        duration,
        position: 'middle',
        showCloseButton: false,
        // translucent: true,
        cssClass: 'custom-toast'
      }
    );
    await toast.present();
  }

  showLoading(content: string = '加载中...', spinner: any = 'lines', duration: number = 3000000) {
    this.hideLoading().then(() => {
      this._showLoading(content, spinner, duration);
    });
  }

  hideLoading() {
    // this._hideLoading();
    this.isLoading = false;
    let count = 0;
    return new Promise((resolve, _) => {
      if (this.loadings.length === 0) {
        resolve(true);
        return;
      }

      this.loadings.forEach(a => {
        a.dismiss().then(() => {
          count++;
          if (count === this.loadings.length) {
            this.loadings = [];
            resolve(true);
          }
        }).catch();
      });
    });
    // return new Promise((resolve) => {
    //   if (this.loadings.length === 0) {
    //     resolve(true);
    //     return;
    //   }

    //   this.loadings.forEach(a => {
    //     a.dismiss().then(() => {
    //       count++;
    //       if (count === this.loadings.length) {
    //         this.loadings = [];
    //         resolve(true);
    //       }
    //     }).catch();
    //   });
    // });
  }

  async _showLoading(content: string = '', spinner: any = 'lines', duration: number = 3000000) {
    // alert(123);
    this.isLoading = true;

    return await this.loadingCtrl.create({
      message: content,
      duration,
      spinner,
      translucent: true
    }).then(a => {
      this.loadings.push(a);
      // console.log(a);
      a.present().then(() => {
        if (!this.isLoading) {
          // a.dismiss().then().catch();
          this.hideLoading();
        }
      });
    }).catch();
  }

  async _hideLoading() {
    this.isLoading = false;

    return await this.loadingCtrl.dismiss().then((a) => { }).catch();
  }

}

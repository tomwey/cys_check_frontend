import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { Router } from "@angular/router";
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router // private splashScreen: SplashScreen, // private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    if (!localStorage.getItem("token")) {
      this.router.navigateByUrl("/login");
    } else {
      this.router.navigateByUrl("/");
    }
    // this.platform.ready().then(() => {
    // this.statusBar.styleDefault();
    // this.splashScreen.hide();
    // });
  }
}

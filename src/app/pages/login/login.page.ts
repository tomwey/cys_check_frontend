import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService, ResultData } from "src/app/services/api.service";
import { ToolsService } from "src/app/services/tools.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  user: any = {
    mobile: "",
    password: "",
  };
  constructor(
    private api: ApiService,
    private tools: ToolsService,
    private router: Router
  ) {}

  ngOnInit() {}

  login() {
    this.api
      .POST("mgwc/user/login", this.user)
      .then((res: ResultData) => {
        console.log(res);
        if (res.code === 0) {
          const data = res.data;
          localStorage.setItem("token", data.token);
          this.router.navigateByUrl("/");
        }
      })
      .catch((error) => {
        this.tools.showToast(error.message);
      });
  }
}

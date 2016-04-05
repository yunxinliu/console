import {Page, IonicApp} from "ionic-angular";
import {TabsPage} from "../tabs/tabs";
import {UserDataService} from "../../providers/userDataService";
import {doAlert} from "../../model/utils";

@Page({
    templateUrl: "build/pages/signInPage/signInPage.html"
})
export class SignInPage {

    // init form data
    credentials: { userName?: string, password?: string } = {};
    error = null;
    submitted = false;
    nav = null;

    // ctor
    constructor(private app: IonicApp, private userDataService: UserDataService) {
        this.nav = this.app.getComponent("nav");
    }

    // event handler for form submission
    submit(form) {
        this.submitted = true;
        this.error = null;
        if (form.valid) {
            this.userDataService.initiateSignIn(this.credentials.userName, this.credentials.password)
                .then((signedInUser) => {
                    // signed in. Go to home page.
                    this.nav.setRoot(TabsPage);
                }).catch((err) => {
                    // there was an error. display it on screen.
                    this.error = JSON.parse(err.text()).message;
                });
        }
    }

    // shows an doAlert.
    showdoAlert(message) {
        doAlert(message);
    }
}

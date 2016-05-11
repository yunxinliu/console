import {Page, NavController, NavParams} from "ionic-angular";
import {OnInit} from "angular2/core";
import {OnboardingDataService} from "../../../providers/onboardingDataService";
import {FileContentPage} from "../fileContentPage/fileContentPage";
import {doAlert} from "../../../model/utils";

@Page({
  templateUrl: "build/pages/browser/onboardingMethodNodePage/onboardingMethodNodePage.html"
})
export class OnboardingMethodNodePage implements OnInit {

  // files in the repository
  files: string[] = null;
  method: string = null;

  // ctor 
  constructor(private nav: NavController,
              private navParams: NavParams,
              private onboardingDataService: OnboardingDataService) {
    this.method = navParams.get("method");
  }

  // handles page init.
  ngOnInit() {
    this.onboardingDataService.initiateGetOnboardingMehtodNodeFiles(this.method)
            .then((files) => {
                this.files = files;
            }).catch((err) => {
                // there was an error. display it on screen.
                console.log(err.text());
                doAlert(err.text());
            });
  }

  browseFile(f: string) {
    let path = this.method + "/node/" + f;
    let data: string = null;
    this.onboardingDataService.initiateGetFileContent(path)
        .then((result) => {
          data = result;
          this.nav.push(FileContentPage, {name: f, content: data});
        }).catch((err) => {
            console.log(err.text());
            doAlert(err.text());
        });
  }

}
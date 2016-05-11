import {Page, NavParams} from "ionic-angular";

@Page({
  templateUrl: "build/pages/browser/fileContentPage/fileContentPage.html"
})
export class FileContentPage {
  name: string;
  content: string;

  // simply display the content of a file
  // requires two parameters from NavParams
  // name: file name
  // content: file content
  constructor(private navParams: NavParams) {
    this.name = navParams.get("name");
    this.content = navParams.get("content");
  }

}
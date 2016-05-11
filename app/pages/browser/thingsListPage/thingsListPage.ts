import {Page, NavController, NavParams} from "ionic-angular";
import {OnInit} from "angular2/core";
import {TranslatorsDataService} from "../../../providers/translatorsDataService";
import {ThingPage} from "../thingPage/thingPage";
import {FileContentPage} from "../fileContentPage/fileContentPage";
import {doAlert} from "../../../model/utils";

@Page({
  templateUrl: "build/pages/browser/thingsListPage/thingsListPage.html"
})
export class ThingsListPage implements OnInit {

  // things in the repository
  things: string[] = null;
  schema: string = null;
  schemaFile: string = null;

  // ctor 
  constructor(private nav: NavController,
              private navParams: NavParams,
              private translatorsDataService: TranslatorsDataService) {
    this.schema = navParams.get("schema");
  }

  // handles page init.
  ngOnInit() {
    this.translatorsDataService.initiateGetThingsList(this.schema)
            .then((things) => {
                this.things = things;  // things include the schema file name as well
            }).catch((err) => {
                // there was an error. display it on screen.
                console.log(err.text());
                doAlert(err.text());
            });
  }

  browseThing(t: string) {
    if (t.endsWith(".xml")) {
      let path = this.schema + "/" + t;
      let data: string = null;
      this.translatorsDataService.initiateGetFileContent(path)
          .then((result) => {
            data = result;
            this.nav.push(FileContentPage, {name: t, content: data});
          }).catch((err) => {
              console.log(err.text());
              doAlert(err.text());
          });
    }
    else
      this.nav.push(ThingPage, {schema: this.schema, name: t});
  }

}
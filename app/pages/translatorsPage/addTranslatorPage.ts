import {Page, NavController, NavParams} from "ionic-angular";
import {OnInit} from "angular2/core";
import {TranslatorsDataService} from "../../providers/translatorsDataService";
import {SearchDataService} from "../../providers/searchDataService";
import {BluetoothOnboardingPage} from "../onboarding/bluetoothOnboardingPage/bluetoothOnboardingPage";
import {ZWaveOnboardingPage} from "../onboarding/zwaveOnboardingPage/zwaveOnboardingPage";
import {WinkOnboardingPage} from "../onboarding/winkOnboardingPage/winkOnboardingPage";
import {doAlert} from "../../model/utils";

@Page({
    templateUrl: "build/pages/translatorsPage/addTranslatorPage.html"
})
export class AddTranslatorPage implements OnInit {

    // full device type name, e.g., org.OpenT2T.Sample.SuperPopular.Lamp 
    fullName: string = null;

    // short device type name, e.g., Lamp
    name: string = null;

    // available devices from the repo
    devices: string[];

    // ctor 
    constructor(private nav: NavController,
        private navParams: NavParams,
        private translatorsDataService: TranslatorsDataService,
        private searchDataService: SearchDataService) {

        this.fullName = navParams.get("name");
        this.name = this.fullName.split(".")[this.fullName.split(".").length - 1];
        this.devices = [];
    }

    // handles page init.
    ngOnInit() {
        this.translatorsDataService.initiateGetThingsListWithoutSchema(this.fullName)
            .then((devices) => {
                this.devices = devices;
            }).catch((err) => {
                // there was an error. display it on screen.
                console.log(err.text());
                doAlert(err.text());
            });
    }

    addTranslator(device: string) {

        this.searchDataService.initiateGetFilesListBySearch(device)
            .then((files) => {

                console.log("Fetched files for device: " + device);
                console.log(JSON.stringify(files));

                // download the manifest so we can provide the right context to onboarding
                this.searchDataService.initiateGetFileContent(files.manifest)
                    .then((manifestContent) => {

                        if (!files.onboarding) {
                            doAlert("Onboarding method not found. Please select another device");
                        }
                        else if (files.onboarding.endsWith("BluetoothLE.xml")) {
                            this.nav.push(BluetoothOnboardingPage, { files: files });
                        }
                        else if (files.onboarding.endsWith("ZWave.xml")) {
                            this.nav.push(ZWaveOnboardingPage, { files: files });
                        }
                        else if (files.onboarding.endsWith("WinkHub.xml")) {
                            let pattern: RegExp = /<\s*arg\s*name\s*=\s*"\s*idKeyFilter\s*"\s*value\s*=\s*".+"/;
                            let idKeyValue: string = this.getOnboardingValue(manifestContent, pattern);
                            console.log('id key value: ' + idKeyValue);

                            this.nav.push(WinkOnboardingPage, { files: files, idKeyFilter: idKeyValue });
                        }
                        else {
                            doAlert("Onboarding method not supported. Please select another device");
                        }
                    });
            }).catch((err) => {
                // there was an error. display it on screen.
                console.log(err.text());
                doAlert(err.text());
            });
    }

    // find the onboarding value with the given name
    getOnboardingValue(manifestContent: string, pattern: RegExp): string {
        let match: RegExpExecArray = pattern.exec(manifestContent);
        let result: string = null;
        if (!match) return null;

        result = match[0]; // we return only the first match
        let p: RegExp = /value\s*=\s*".+"/; // find the value part
        match = p.exec(result);
        if (!match) return null;

        result = match[0]; // there should be only one match
        let x: number = result.search("\"");
        result = result.substring(x + 1, result.length - 1);
        result = result.trim();

        return result;

    }
}
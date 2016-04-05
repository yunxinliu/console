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
                    this.nav.push(WinkOnboardingPage, { files: files, idKeyFilter: "light_bulb_id" });
                }
                else {
                    doAlert("Onboarding method not supported. Please select another device");
                }

            }).catch((err) => {
                // there was an error. display it on screen.
                console.log(err.text());
                doAlert(err.text());
            });
    }
}
import {Injectable} from "@angular/core";
import {mergeMap} from "rxjs/operators";
import {forkJoin, Observable} from "rxjs";
import {KnoraService} from "./services/knora.service";
import {ListService} from "./services/list.service";
import {GravsearchBuilderService} from "./services/gravsearch-builder.service";
import {ApiResponseError, List, ListNodeInfo} from "@dasch-swiss/dsp-js";

export interface IAppConfig {

    env: {
        name: string;
    };
    apiURL: string;
    externalApiURL: string;
    iiifURL: string;
    appURL: string;
    appName: string;
    localData: string;
    pagingLimit: number;
    startComponent: string;
    email: string;
    pwd: string;
    projectIRI: string;
}

@Injectable({
    providedIn: "root"
})
export class AppInitService {

    static settings: IAppConfig;

    constructor(
        private _knoraService: KnoraService,
        private _listService: ListService,
        private _gsBuilder: GravsearchBuilderService) {
    }

    Init(): Promise<any> {

        return new Promise<void>((resolve, reject) => {
            // do your initialisation stuff here
            // console.log("AppInitService.init() called");
            AppInitService.settings = window['tempConfigStorage'] as IAppConfig;

            this._gsBuilder.apiURL = AppInitService.settings.apiURL;

            this._knoraService.projectIRI = "http://rdfh.ch/projects/qhOve-cKTmSkiIU81W0lDQ";

            this._knoraService.knoraApiConnection = AppInitService.settings.apiURL;

            this._knoraService.appLogin("app@wordweb.ch", "2bon2btitq")
                .pipe(
                    mergeMap(() => this._knoraService.getAllLists("http://rdfh.ch/projects/qhOve-cKTmSkiIU81W0lDQ")),
                    mergeMap((lists: ListNodeInfo[]) => forkJoin<Observable<List>>(lists.map((list: ListNodeInfo) => this._knoraService.getList(list.id))))
                )
                .subscribe((fullList: List[]) => {
                    // Sets all the list
                    fullList.forEach(list => this._listService.list = list);
                    resolve();
                }, (error: ApiResponseError) => {
                    // Creates the error message
                    const errorMsgElement = document.querySelector('.errorMsgElement');
                    let message = 'Application initialization failed';
                    if (error) {
                        message = error.error ? `${message}: ${error.error}` : `${message}: ${error}`;
                    }
                    errorMsgElement.textContent = message;
                });
        });
    }
}

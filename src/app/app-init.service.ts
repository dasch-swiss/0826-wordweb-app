import {Injectable} from "@angular/core";
import {KnoraService} from "./services/knora.service";
import {mergeMap} from "rxjs/operators";
import {forkJoin, Observable} from "rxjs";
import {ListService} from "./services/list.service";
import {GravsearchBuilderService} from "./services/gravsearch-builder.service";
import {List, ListNodeInfo} from "@dasch-swiss/dsp-js";

export interface IAppConfig {

  env: {
    name: string;
  };
  ontologyIRI: string;
  apiURL: string;
  externalApiURL: string;
  iiifURL: string;
  appURL: string;
  appName: string;
  localData: string;
  pagingLimit: number;
  startComponent: string;
}

@Injectable({
    providedIn: "root"
})
export class AppInitService {

  static settings: IAppConfig;

  constructor(
      private knoraService: KnoraService,
      private listService: ListService,
      private gsBuilder: GravsearchBuilderService) {
  }

  Init() {

    return new Promise<void>((resolve, reject) => {
      // do your initialisation stuff here
      // console.log("AppInitService.init() called");
      AppInitService.settings = window["tempConfigStorage"] as IAppConfig;

      this.gsBuilder.apiURL = AppInitService.settings.apiURL;

      this.knoraService.knoraApiConnection = AppInitService.settings.apiURL;

      this.knoraService.login("root@example.com", "test")
          .pipe(
              mergeMap(() => this.knoraService.getAllLists()),
              mergeMap((lists: ListNodeInfo[]) => forkJoin<Observable<List>>(lists.map((list: ListNodeInfo) => this.knoraService.getList(list.id))))
          )
          .subscribe((fullList: List[]) => {

            fullList.forEach(list => this.listService.list = list);

            // console.log("AppInitService: finished");
            resolve();
          }, (error) => console.error("Failed to connect", error));
    });
  }
}

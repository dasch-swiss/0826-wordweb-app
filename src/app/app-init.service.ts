import {Injectable} from "@angular/core";
import {KuiCoreConfig} from "@knora/core";

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
  static coreConfig: KuiCoreConfig;

  constructor() {
  }

  Init() {

    return new Promise<void>((resolve, reject) => {
      // console.log("AppInitService.init() called");
      // do your initialisation stuff here

      const data = window["tempConfigStorage"] as IAppConfig;
      // console.log("AppInitService: json", data);
      AppInitService.settings = data;

      AppInitService.coreConfig = {
        name: AppInitService.settings.appName,
        api: AppInitService.settings.apiURL,
        media: AppInitService.settings.iiifURL,
        app: AppInitService.settings.appURL
      } as KuiCoreConfig;

      // console.log("AppInitService: finished");

      resolve();
    });
  }
}

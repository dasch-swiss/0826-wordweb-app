import {Injectable} from "@angular/core";
import {
    ApiResponseData,
    CountQueryResponse,
    KnoraApiConfig,
    KnoraApiConnection, KnoraPeriod,
    ListResponse,
    ListsResponse, ReadDateValue, ReadLinkValue, ReadListValue,
    ReadResource, ReadTextValueAsString
} from "@knora/api";
import {GravesearchBuilderService} from "./gravesearch-builder.service";
import {IDisplayedClass} from "../model/displayModel";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
    providedIn: "root"
})
export class KnoraService {
    readonly url = "http://rdfh.ch/projects/0826";
    readonly urlOntology = "http://www.knora.org/ontology/0826/teimww";
    readonly protocol = "http";
    readonly host = "0.0.0.0";
    readonly port = 3333;

    knoraApiConnection: KnoraApiConnection;

    constructor(private gBuilder: GravesearchBuilderService) {
        const config = new KnoraApiConfig(this.protocol, this.host, this.port);
        this.knoraApiConnection = new KnoraApiConnection(config);
    }

    login(email: string, password: string): any {
        return this.knoraApiConnection.v2.auth.login("email", email, password);
    }

    graveSeachQuery(structure: IDisplayedClass, priority: number, offset?: number): Observable<any> {
        const graveSearch = this.gBuilder.getQuery(structure, priority, offset);
        console.log(graveSearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(graveSearch)
            .pipe(
                map((resources: ReadResource[]) => {
                    return resources.map(resource => this.processRes(resource));
                })
            );
    }

    processRes(resource: ReadResource) {
        const newResource = {
            id: resource.id,
            arkUrl: resource.arkUrl
        };

        for (const property of Object.entries(resource.properties)) {

            const newPropertyKey = property[0].split("#").pop().replace("Value", "");

            newResource[newPropertyKey] = property[1].map((propValue: any) => {

                switch (true) {
                    case (propValue instanceof ReadTextValueAsString): {
                        return {
                            id: propValue.id,
                            value: propValue.text
                        };
                    }
                    case (propValue instanceof ReadListValue): {
                        return {
                            id: propValue.id,
                            listNode: propValue.listNode
                        };
                    }
                    case (propValue instanceof ReadLinkValue): {
                        return propValue.linkedResource ? this.processRes(propValue.linkedResource) : {};
                    }
                    case (propValue instanceof ReadDateValue): {
                        return (propValue.date instanceof KnoraPeriod) ?
                            {
                                id: propValue.id,
                                start: propValue.date.start.year,
                                end: propValue.datae.end.year
                            } :
                            {
                                id: propValue.id,
                                start: propValue.date.year,
                                end: propValue.date.year
                            };
                    }
                }

            });
        }

        return newResource;
    }

    graveSearchQueryCount(structure: IDisplayedClass, priority: number): Observable<number> {
        const graveSearch = this.gBuilder.getQuery(structure, priority);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(graveSearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getProjectOntology() {
        const url = `http://0.0.0.0:3333/ontology/0826/teimww/simple/v2`;
    }

    getAllLists() {
        return this.knoraApiConnection.admin.listsEndpoint.getLists()
            .pipe(
                map((data: ApiResponseData<ListsResponse>) => data.body.lists)
            );
    }

    getList(iri: string) {
        return this.knoraApiConnection.admin.listsEndpoint.getList(iri)
            .pipe(
                map((data: ApiResponseData<ListResponse>) => data.body.list)
            );
    }

    getNodeOfList(iri: string) {
        const iriEncoded = encodeURIComponent(iri);
        const url = `http://0.0.0.0:3333/v2/node/`;
    }

    getResource(iri: string) {
        const iriEncoded = encodeURIComponent(iri);
        const url = `http://0.0.0.0:3333/v2/resources/`;

        return this.knoraApiConnection.v2.res.getResource("http://rdfh.ch/0826/-CXBmQ_-QvyqroyGJG_oHw");
    }
}

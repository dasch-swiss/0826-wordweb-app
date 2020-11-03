import {Injectable} from "@angular/core";
import {
    KnoraApiConfig,
    KnoraApiConnection,
    ApiResponseData,
    ReadResource,
    ReadTextValueAsString,
    ReadListValue,
    ReadLinkValue,
    ReadDateValue,
    CountQueryResponse,
    ListResponse,
    ListsResponse,
    KnoraPeriod
} from "@dasch-swiss/dsp-js";
import {GravsearchBuilderService} from "./gravsearch-builder.service";
import {IMainClass} from "../model/displayModel";
import {map, tap} from "rxjs/operators";
import {Observable, throwError} from "rxjs";
import {ReadResourceSequence} from "@dasch-swiss/dsp-js";

@Injectable({
    providedIn: "root"
})
export class KnoraService {
    private knoraApiConnection: KnoraApiConnection;

    constructor(private gsBuilder: GravsearchBuilderService) {
    }

    set knoraConnection(url: string) {
        const settings = url.split("://");
        if (settings[0] !== "http" && settings[0] !== "https") {
            throwError("Expected 'http' or 'https' in the url");
        }
        const host = `${settings[1]}`;
        // @ts-ignore
        const config = new KnoraApiConfig(settings[0], host);
        this.knoraApiConnection = new KnoraApiConnection(config);
    }

    login(email: string, password: string): any {
        return this.knoraApiConnection.v2.auth.login("email", email, password);
    }

    gravseachQuery(structure: IMainClass, priority: number, offset?: number): Observable<any> {
        const gravsearch = this.gsBuilder.getQuery(structure, priority, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    // Error found in person res without last names
                    // resources.map(resource => {
                    //     if (!Object.keys(resource.properties).includes("http://0.0.0.0:3333/ontology/0826/teimww/v2#hasLastName")) {
                    //         console.log("knora", resource);
                    //     }
                    // });
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    processRes(resource: ReadResource) {
        const newResource = {
            id: resource.id,
            arkUrl: resource.arkUrl,
            type: resource.type.split("#")[1]
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
                                end: propValue.date.end.year
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

    gravsearchQueryCount(structure: IMainClass, priority: number): Observable<number> {
        const gravsearch = this.gsBuilder.getQuery(structure, priority);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
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

    getPassageRes(iri: string) {
        return this.knoraApiConnection.v2.res.getResource(iri)
            .pipe(map((res: ReadResource) => this.processRes(res)));
    }

    getPrimaryAuthorsCount(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getPrimaryAuthorsQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryAuthors(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getPrimaryAuthorsQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getPrimaryBooksCount(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getPrimaryBooksQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryBooks(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getPrimaryBooksQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getLexiasCount(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getLexiasQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getLexias(char: string, offset?: number) {
        const gravsearch = this.gsBuilder.getLexiasQuery(char, offset);
        console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getCompaniesCount(offset?: number) {
        const gravsearch = this.gsBuilder.getCompaniesQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getCompanies(offset?: number) {
        const gravsearch = this.gsBuilder.getCompaniesQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getVenuesCount(offset?: number) {
        const gravsearch = this.gsBuilder.getVenuesQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getVenues(offset?: number) {
        const gravsearch = this.gsBuilder.getVenuesQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getActorsCount(offset?: number) {
        const gravsearch = this.gsBuilder.getActorsQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getActors(offset?: number) {
        const gravsearch = this.gsBuilder.getActorsQuery(offset);
        // console.log(gravsearch);
        return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

}

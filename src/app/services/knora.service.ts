import {Injectable} from '@angular/core';
import {
    KnoraApiConfig,
    KnoraApiConnection,
    ApiResponseData,
    ReadResource,
    ReadResourceSequence,
    ReadTextValueAsString,
    ReadListValue,
    ReadLinkValue,
    ReadDateValue,
    CountQueryResponse,
    ListResponse,
    ListsResponse,
    KnoraPeriod,
    ListNodeInfo,
    List,
    ILabelSearchParams,
    ApiResponseError,
    ReadStillImageFileValue,
    StringLiteral,
    ReadIntValue,
    ReadUriValue,
    Constants
} from '@dasch-swiss/dsp-js';
import {GravsearchBuilderService} from './gravsearch-builder.service';
import {IMainClass} from '../model/displayModel';
import {map, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {AppInitService} from '../app-init.service';

//---- BEGIN LUKAS ---------------------------------------------------------------------------------------------------

export class CompanyData {
    constructor(
        public label: string,
        public title: string,
        public internalId: string,
        public extraInfo?: string,
        public members?: {memberName: string; memberIri: string}[]
    ) {}
}

export class LangString {
    data: {[index: string]: string};

    constructor(langstr: Array<StringLiteral>) {
        this.data = {};
        for (const p of langstr) {
            this.data[p.language || 'de'] = p.value || 'GAGA';
        }
    }

    get(lang: string): string {
        if (lang in this.data) {
            return this.data[lang];
        } else {
            for (const l in this.data) {
                if (this.data.hasOwnProperty(l)) {
                    return this.data[l];
                }
            }
        }
        return '-';
    }
}

export class ListData {
    constructor(public listid: string,
                public labels: LangString,
                public name?: string) {
    }
}

export class PropertyData {
    constructor(public propname: string,
                public label: string,
                public values: Array<string>,
                public ids: Array<string>,
                public comments: Array<string | undefined>,
                public permissions: Array<string>) {}
}

export class IntPropertyData extends PropertyData {
    public ivalues: Array<number>;

    constructor(propname: string,
                label: string,
                ivalues: Array<number>,
                ids: Array<string>,
                comments: Array<string | undefined>,
                permissions: Array<string>) {
        const values = ivalues.map(x => x.toString(10));
        super(propname, label, values, ids, comments, permissions);
        this.ivalues = ivalues;
    }
}

export class ListPropertyData extends PropertyData {
    public nodeIris: Array<string>;

    constructor(propname: string,
                label: string,
                nodeIris: Array<string>,
                values: Array<string>,
                ids: Array<string>,
                comments: Array<string | undefined>,
                permissions: Array<string>) {
        super(propname, label, values, ids, comments, permissions);
        this.nodeIris = nodeIris;
    }
}

export class LinkPropertyData extends PropertyData {
    public resourceIris: Array<string>;
    public resourceLabels: Array<string>;

    constructor(propname: string,
                label: string,
                resourceIris: Array<string>,
                values: Array<string>,
                ids: Array<string>,
                comments: Array<string | undefined>,
                permissions: Array<string>) {
        super(propname, label, values, ids, comments, permissions);
        this.resourceIris = resourceIris;
    }
}

export class StillImagePropertyData extends PropertyData {
    public dimX: number;
    public dimY: number;
    filename: string;
    fileUrl: string;
    iiifBase: string;

    constructor(propname: string,
                label: string,
                dimX: number,
                dimY: number,
                filename: string,
                fileUrl: string,
                iiifBase: string,
                values: Array<string>,
                ids: Array<string>,
                comments: Array<string | undefined>,
                permissions: Array<string>) {
        super(propname, label, values, ids, comments, permissions);
        this.dimX = dimX;
        this.dimY = dimY;
        this.filename = filename;
        this.fileUrl = fileUrl;
        this.iiifBase = iiifBase;
    }
}

export interface ResourceData {
    id: string; /** Id (iri) of the resource */
    label: string; /** Label of the resource */
    arkUrl?: string;
    permission: string; /** permission of the current user */
    lastmod: string; /** last modification date of resource */
    properties: Array<PropertyData>; /** Array of properties with associated value(s) */
}

//---- END LUKAS  -----------------------------------------------------------------------------------------------------

@Injectable({
    providedIn: 'root'
})
export class KnoraService {
    private _knoraApiConnection: KnoraApiConnection;
    wwOntology: string;

    constructor(private _gsBuilder: GravsearchBuilderService) {
    }

    set knoraApiConnection(url: string) {
        const settings = url.split('://');
        if (settings[0] !== 'http' && settings[0] !== 'https') {
            throwError('Expected "http" or "https" in the url');
        }
        const host = `${settings[1]}`;
        // @ts-ignore
        const config = new KnoraApiConfig(settings[0], host);
        this._knoraApiConnection = new KnoraApiConnection(config);
        this.wwOntology = url.replace('https', 'http') + '/ontology/0826/teimww/v2#';
    }

    login(email: string, password: string): any {
        return this._knoraApiConnection.v2.auth.login('email', email, password);
    }

    gravseachQuery(structure: IMainClass, priority: number, offset?: number): Observable<any> {
        const gravsearch = this._gsBuilder.getQuery(structure, priority, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
                map((sequence: ReadResourceSequence) => {
                    // Error found in person res without last names
                    // resources.map(resource => {
                    //     if (!Object.keys(resource.properties).includes('http://0.0.0.0:3333/ontology/0826/teimww/v2#hasLastName')) {
                    //         console.log('knora', resource);
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
            type: resource.type.split('#')[1]
        };

        for (const property of Object.entries(resource.properties)) {
            // Extracts the name of the property (may it be a text, date, list or link value)
            // if it's a link value the string 'Value' at the end must be replaced
            const newPropertyKey = property[0].split('#').pop().replace('Value', '');

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
        const gravsearch = this._gsBuilder.getQuery(structure, priority);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllLists(projectIri: string): Observable<ListNodeInfo[]> {
        return this._knoraApiConnection.admin.listsEndpoint.getListsInProject(projectIri)
            .pipe(
                map((data: ApiResponseData<ListsResponse>) => data.body.lists)
            );
    }

    getList(iri: string): Observable<List> {
        return this._knoraApiConnection.admin.listsEndpoint.getList(iri)
            .pipe(
                map((data: ApiResponseData<ListResponse>) => data.body.list)
            );
    }

    getPassageRes(iri: string) {
        return this._knoraApiConnection.v2.res.getResource(iri)
            .pipe(
                map((res: ReadResource) => this.processRes(res))
            );
    }

    getAllAuthorsCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getAllAuthorsQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllAuthors(offset?: number) {
        const gravsearch = this._gsBuilder.getAllAuthorsQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getPrimaryAuthorsCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getPrimaryAuthorsQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryAuthors(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getPrimaryAuthorsQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }


    getAllBooksCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getAllBooksQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllBooks(offset?: number) {
        const gravsearch = this._gsBuilder.getAllBooksQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getPrimaryBooksCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getPrimaryBooksQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryBooks(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getPrimaryBooksQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getAllLexiasCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getAllLexiasQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllLexias(offset?: number) {
        const gravsearch = this._gsBuilder.getAllLexiasQuery(offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getLexiasCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getLexiasQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getLexias(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getLexiasQuery(char, offset);
        console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getCompaniesCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getCompaniesQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getCompanies(offset?: number) {
        const gravsearch = this._gsBuilder.getCompaniesQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getVenuesCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getVenuesQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getVenues(offset?: number) {
        const gravsearch = this._gsBuilder.getVenuesQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getActorsCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getActorsQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getActors(offset?: number) {
        const gravsearch = this._gsBuilder.getActorsQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }

    getMembersCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getMembersQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getMembers(offset?: number) {
        const gravsearch = this._gsBuilder.getMembersQuery(offset);
        // console.log(gravsearch);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => {
                    return sequence.resources.map(resource => this.processRes(resource));
                })
            );
    }


    // EDITING BY LUKAS //----------------------------------------------------------------------------------------------

    getResourcesByLabel(val: string, restype?: string): Observable<Array<{ id: string; label: string }>> {
        let params: ILabelSearchParams | undefined;
        if (restype !== undefined) {
            params = {
                limitToResourceClass: restype
            };
        }
        return this._knoraApiConnection.v2.search.doSearchByLabel(val, 0, params).pipe(
            map((data: ReadResourceSequence | ApiResponseError) => {
                if (data instanceof ApiResponseError) {
                    return [];
                } else {
                    const items: Array<{id: string, label: string}> = data.resources.map((item: ReadResource) => {
                        return {id: item.id, label: item.label};
                    });
                    return items;
                }
            }),
        );
    }

    private processResourceProperties(data: ReadResource): Array<PropertyData> {
        const propdata: Array<PropertyData> = [];
        for (const prop in data.properties) {
            if (data.properties.hasOwnProperty(prop)) {
                switch (data.getValues(prop)[0].type) {
                    case Constants.StillImageFileValue: {
                        const val = data.getValuesAs(prop, ReadStillImageFileValue)[0];
                        const label: string = val.propertyLabel || '?';
                        const dimX: number = val.dimX;
                        const dimY: number = val.dimY;
                        const filename: string = val.filename;
                        const fileUrl: string = val.fileUrl;
                        const iiifBase = val.iiifBaseUrl;
                        const values: Array<string> = [];
                        const ids: Array<string> = [val.id];
                        const comments: Array<string | undefined> = [val.valueHasComment];
                        const permissions: Array<string> = [val.userHasPermission];
                        propdata.push(new StillImagePropertyData(prop, label, dimX, dimY, filename,
                            fileUrl, iiifBase, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.DateValue: {
                        const vals = data.getValuesAs(prop, ReadDateValue);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.strval || '?');
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.UriValue: {
                        const vals = data.getValuesAs(prop, ReadUriValue);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.uri);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.TextValue: {
                        const vals = data.getValuesAs(prop, ReadTextValueAsString);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.text);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.ListValue: {
                        const vals = data.getValuesAs(prop, ReadListValue);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.listNodeLabel);
                        const nodeIris: Array<string> = vals.map(v => v.listNode);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new ListPropertyData(prop, label, nodeIris, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.LinkValue: {
                        const vals = data.getValuesAs(prop, ReadLinkValue);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.linkedResource && v.linkedResource.label || '?');
                        const resourceIris: Array<string> = vals.map(v => v.linkedResourceIri);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new LinkPropertyData(prop, label, resourceIris, values, ids, comments, permissions));
                        break;
                    }
                    case Constants.IntValue: {
                        const vals = data.getValuesAs(prop, ReadIntValue);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<number> = vals.map(v => v.int);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new IntPropertyData(prop, label, values, ids, comments, permissions));
                        break;
                    }
                    default: {
                        const vals = data.getValuesAs(prop, ReadTextValueAsString);
                        const label: string = vals[0].propertyLabel || '?';
                        const values: Array<string> = vals.map(v => v.text);
                        const ids: Array<string> = vals.map(v => v.id);
                        const comments: Array<string | undefined> = vals.map(v => v.valueHasComment);
                        const permissions: Array<string> = vals.map(v => v.userHasPermission);
                        propdata.push(new PropertyData(prop, label, values, ids, comments, permissions));
                    }
                }
            }
        }
        return propdata;
    }

    getResource(iri: string): Observable<ResourceData> {
        return this._knoraApiConnection.v2.res.getResource(iri).pipe(
            map((data: ReadResource) => {
                    console.log(':::::::::', data);
                    return {
                        id: data.id,
                        label: data.label,
                        arkUrl: data.arkUrl,
                        permission: data.userHasPermission,
                        lastmod: data.lastModificationDate || '',
                        properties: this.processResourceProperties(data)};
                }
            ));
    }

}

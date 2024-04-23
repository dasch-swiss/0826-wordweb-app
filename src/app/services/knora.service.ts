import {Injectable} from '@angular/core';
import {
    ApiResponseData,
    ApiResponseError,
    Constants,
    CountQueryResponse,
    CreateDateValue,
    CreateLinkValue,
    CreateListValue,
    CreateResource,
    CreateTextValueAsString,
    CreateValue,
    DeleteResource,
    DeleteValue,
    DeleteValueResponse,
    ILabelSearchParams,
    KnoraApiConfig,
    KnoraApiConnection,
    KnoraPeriod,
    List,
    ListAdminCache, ListNode,
    ListNodeInfo,
    ListResponse,
    ListsResponse, LoginResponse, LogoutResponse,
    ReadDateValue,
    ReadIntValue,
    ReadLinkValue,
    ReadListValue,
    ReadResource,
    ReadResourceSequence,
    ReadStillImageFileValue,
    ReadTextValueAsString,
    ReadUriValue,
    StringLiteral, UpdateDateValue,
    UpdateLinkValue, UpdateListValue,
    UpdateResource,
    UpdateResourceMetadata,
    UpdateResourceMetadataResponse,
    UpdateTextValueAsString,
    UpdateValue,
    WriteValueResponse
} from "@dasch-swiss/dsp-js";
import {GravsearchBuilderService} from './gravsearch-builder.service';
import {IMainClass} from '../model/displayModel';
import {catchError, map} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {DateValue} from '../edit/date-value/date-value.component';
import {DateCalendar} from '../classes/calendar';
import {AppInitService} from "../app-init.service";

//---- BEGIN LUKAS ---------------------------------------------------------------------------------------------------
export interface UserData {
    user: string;
    token: string;
}

export interface OptionType {
    iri: string;
    name: string;
}

export class CompanyData {
    constructor(
        public label: string,
        public title: string, // hasCompanyTitle (1)
        public internalId: string, //hasCompanyInternalId (1)
        public extraInfo?: string, // hasCompanyExtraInfo (0-1)
        public members?: {memberName: string; memberIri: string}[], // hasMamber (0-n)
        public lexias?: {lexiaName: string; lexiaIri: string}[], // isLexiaCompany (0-n)
    ) {}
}

export class PersonData {
    constructor(
        public label: string,
        public internalId: string, // hasPersonInternalId (1)
        public firstName: string, // hasFirstName (0-1)
        public lastName: string, // hasLastName (1)
        public genderIri: string, // hasGender (1)
        public description: string, // hasDescription (1)
        public birthDate?: DateValue, // hasBirthDate (0-1)
        public deathDate?: DateValue, // hasDeathDate (0-1)
        public activeDate?: DateValue, // hasActiveDate (0-1)
        public extraInfo?: string, // hasPersonExtraInfo (0-1)
        public lexias?: {lexiaName: string; lexiaIri: string}[], // isLexiaPersonValue (0-n)
    ) {}
}

export class LexiaData {
    constructor(
        public label: string,
        public internalId: string, // hasLexiaInternalId (1)
        public title: string, // hasLexiaTitle (1)
        public formalClassIris: string[], // hasFormalClass (1-n) -> List formalClass
        public imageIris?: string[], // hasImage (0-n) -> List image
        public displayedTitle?: string, // hasLexiaDisplayedTitle (0-1)
        public extraInfo?: string, // hasLexiaExtraInfo (0-1)
    ) {}
}

export class PassageData {
    constructor(
        public label: string,
        public internalId: string, //hasPassageInternalId (1)
        public displayedTitle: string, // hasDisplayedTitle (1)
        public functionVoices: {functionVoiceIri: string} [], // hasFunctionVoice (1-n) -> List functionVoice
        public markings: {markingIri: string}[], // hasMarking (1-n) -> List marking
        public researchField: {researchFieldIri: string}, // hasResearchField (1) -> List researchField
        public status: {statusIri: string}, // hasStatus (1) -> List status
        public text: string, // hasText (1)
        public occursIn: {occursInName: string; occursInIri: string}, // occursInValue (1) -> Link ww:book
        public contributedBy: {contributedByName: string; contributedByIri: string}, // wasContributedByValue (1) -> Link ww:person
        public contains?: {containsName: string; containsIri: string}[], // containsValue (0-n) -> Link ww:lexia
        public internalComment?: string, // hasInternalComment (0-1)
        public page?: string, // hasPage (0-1)
        public pageHist?: string, // hasPageHist (0-1)
        public comment?: string, // hasPassageComment (0-1)
        public extraInfo?: string, // hasPassageExtraInfo (0-1)
        public prefixTitle?: string, // hasPrefixDisplayedTitle (0-1)
        public textHist?: string, // hasTextHist (0-1)
        public mentionedIn?: {mentionedInName: string; mentionedInIri: string}[], // isMentionedInValue (0-n) -> Link ww:pasage
    ) {}
}

export class BookData {
    constructor(
        public label: string,
        public internalId: string, // hasBookInternalId (1) ->text
        public title: string, // hasBookTitle (1) -> text
        public creationDate: DateValue, // hasCreationDate (1) ->date
        public edition: string, // hasEdition (1) ->text
        public genres: {genreIri: string}[], // hasGenre (1-n) ->list genre
        public language: {languageIri: string}, // hasLanguage (1) -> list language
        public writtenBy:  {writtenByName: string; writtenByIri: string}[], // isWrittenByValue (1-n) link ww:person
        public comment?: string, // hasBookComment (0-1) ->text
        public extraInfo?: string, // hasBookExtraInfo (0-1) ->text
        public editionHist?: string, // hasEditionHistory (0-1) ->text
        public firstPerformance?: DateValue, // hasFirstPerformanceDate (0-1) ->date
        public prefixTitle?: string, // hasPrefixBookTitle (0-1) ->text
        public pubdate?: DateValue, // hasPublicationDate (0-1) ->date
        public subjects?: {subjectIri: string}[], // hasSubject (0-n) -> list subject
        public lexias?: {lexiaName: string; lexiaIri: string}[], // isLexiaBookValue (0-n) -> link ww:lexia
        public performedBy?: {performedByName: string; performedByIri: string}[], // performedByValue (0-n) link ww:company
        public performedByActor?: {performedByActorName: string; performedByActorIri: string}[], // performedByActorValue (0-n) link ww:person
        public performedIn?: {performedInName: string; performedInIri: string}[], // performedInValue (0-n) link -> venue
    ) {}
}

export class VenueData {
    constructor(
        public label: string,
        public internalId: string, // hasVenueInternalId (1) ->text
        public place: {placeIri: string}, // hasPlaceVenue (1) -> List place
        public extraInfo?: string, // hasVenueExtraInfo (0-1) ->text
        public lexias?: {lexiaName: string; lexiaIri: string}[], // isLexiaVenueValue (0-n) -> link ww:lexia
    ) {
    }
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
                public name?: string,
                public level?: number) {
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
    private _projectIRI = '';
    public _knoraApiConnection: KnoraApiConnection;
    wwOntology: string;
    loggedin: boolean;
    useremail: string;
    token?: string;
    listAdminCache: ListAdminCache;

    researchFieldListIri: string;
    public researchFieldTypes: Array<OptionType> = [];
    markingTypeListIri: string;
    public markingTypes: Array<OptionType> = [];
    languageListIri: string;
    public languageTypes: Array<OptionType> = [];
    formalClassListIri: string;
    public formalClassTypes: Array<OptionType> = [];
    venuePlaceListIri: string;
    public venuePlaceTypes: Array<OptionType> = [];
    genreListIri: string;
    public genreTypes: Array<OptionType> = [];
    genderListIri: string;
    public genderTypes: Array<OptionType> = [];
    subjectListIri: string;
    public subjectTypes: Array<OptionType> = [];
    imageListIri: string;
    public imageTypes: Array<OptionType> = [];
    statusListIri: string;
    public statusTypes: Array<OptionType> = [];
    functionVoiceListIri: string;
    public functionVoiceTypes: Array<OptionType> = [];


    constructor(private _gsBuilder: GravsearchBuilderService) {
    }

    set projectIRI(projectIRI: string) {
        this._projectIRI = projectIRI;
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
        this.listAdminCache = new ListAdminCache(this._knoraApiConnection.admin);
        this.getListTypes();
    }

    appLogin(email: string, password: string): any {
        return this._knoraApiConnection.v2.auth.login('email', email, password);
    }

    login(email: string, password: string): Observable<{ success: boolean, token: string, user: string }> {
        return this._knoraApiConnection.v2.auth.login('email', email, password)
            .pipe(
                catchError((err) => {
                    return of(err.error.response['knora-api:error']);
                }),
                map((response) => {
                    if (response instanceof ApiResponseData) {
                        const apiResponse = response as ApiResponseData<LoginResponse>;
                        this.loggedin = true;
                        this.useremail = email;
                        this.token = apiResponse.body.token;
                        sessionStorage.setItem('useremail', email);
                        sessionStorage.setItem('token', apiResponse.body.token);
                        return {success: true, token: apiResponse.body.token, user: email};
                    } else {
                        return {success: false, token: response, user: '-'};
                    }
                }));
    }

    logout(): Observable<string> {
        return this._knoraApiConnection.v2.auth.logout().pipe(
            catchError((err) => {
                return of(err.error.response['knora-api:error']);
            }),
            map((response) => {
                if (response instanceof ApiResponseData) {
                    const apiResponse = response as ApiResponseData<LogoutResponse>;
                    this.loggedin = false;
                    this.useremail = '';
                    this.token = undefined;
                    sessionStorage.removeItem('useremail');
                    sessionStorage.removeItem('token');
                    return apiResponse.body.message;
                } else {
                    return response;
                }
            }));
    }

    restoreToken(): UserData | undefined {
        const user = sessionStorage.getItem('useremail');
        if (user === null) {
            return undefined;
        }
        const token = sessionStorage.getItem('token');
        if (token === null) {
            return undefined;
        }
        this._knoraApiConnection.v2.auth.jsonWebToken = token;
        this.loggedin = true;
        this.useremail = user;
        this.token = token;

        return {user, token};
    }

    gravseachQuery(structure: IMainClass, priority: number, offset?: number): Observable<any> {
        const gravsearch = this._gsBuilder.getQuery(structure, priority, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) =>
                    // Error found in person res without last names
                    // resources.map(resource => {
                    //     if (!Object.keys(resource.properties).includes('http://0.0.0.0:3333/ontology/0826/teimww/v2#hasLastName')) {
                    //         console.log('knora', resource);
                    //     }
                    // });
                     sequence.resources.map(resource => this.processRes(resource))
                )
            );
    }

    processRes(resource: ReadResource) {
        const newResource = {
            id: resource.id,
            arkUrl: resource.arkUrl,
            lastmod: resource.lastModificationDate,
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
                                sEra: propValue.date.start.era,
                                end: propValue.date.end.year,
                                eEra: propValue.date.end.era,
                            } :
                            {
                                id: propValue.id,
                                start: propValue.date.year,
                                sEra: propValue.date.era,
                                end: propValue.date.year,
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
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllAuthors(offset?: number) {
        const gravsearch = this._gsBuilder.getAllAuthorsQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getPrimaryAuthorsCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getPrimaryAuthorsQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryAuthors(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getPrimaryAuthorsQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }


    getAllBooksCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getAllBooksQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllBooks(offset?: number) {
        const gravsearch = this._gsBuilder.getAllBooksQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getPrimaryBooksCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getPrimaryBooksQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getPrimaryBooks(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getPrimaryBooksQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getAllLexiasCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getAllLexiasQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getAllLexias(offset?: number) {
        const gravsearch = this._gsBuilder.getAllLexiasQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getLexiasCount(char: string, offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getLexiasQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getLexias(char: string, offset?: number) {
        const gravsearch = this._gsBuilder.getLexiasQuery(char, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getCompaniesCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getCompaniesQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getCompanies(offset?: number) {
        const gravsearch = this._gsBuilder.getCompaniesQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getVenuesCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getVenuesQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getVenues(offset?: number) {
        const gravsearch = this._gsBuilder.getVenuesQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getActorsCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getActorsQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getActors(offset?: number) {
        const gravsearch = this._gsBuilder.getActorsQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }

    getMembersCount(offset?: number): Observable<number> {
        const gravsearch = this._gsBuilder.getMembersQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearchCountQuery(gravsearch)
            .pipe(
                map((data: CountQueryResponse) => data.numberOfResults)
            );
    }

    getMembers(offset?: number) {
        const gravsearch = this._gsBuilder.getMembersQuery(offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                map((sequence: ReadResourceSequence) => sequence.resources.map(resource => this.processRes(resource)))
            );
    }


    // EDITING BY LUKAS //----------------------------------------------------------------------------------------------

    getAllLists2(): Observable<Array<ListData>> {
        return this._knoraApiConnection.admin.listsEndpoint.getListsInProject(this._projectIRI).pipe(
            map((res: ApiResponseData<ListsResponse>) => {
                const result: Array<ListData> = [];
                for (const list of res.body.lists) {
                    result.push(new ListData(list.id, new LangString(list.labels)));
                }
                return result;
            })
        );
    }

    getChildren(children: Array<ListNode>, level: number, flatlist: Array<ListData>) {
        for (const child of children) {
            flatlist.push(new ListData(child.id, new LangString(child.labels), child.name, level));
            if (child.children.length > 0) {
                this.getChildren(child.children, level + 1, flatlist);
            }
        }
    }

    getFlatList(listIri: string): Observable<Array<ListData>> {
        return this.listAdminCache.getList(listIri).pipe(
            map( (res: ListResponse) => {
                const flatList: Array<ListData> = [];
                this.getChildren(res.list.children, 0, flatList);

                return flatList;
            })
        );
    }

    getListTypes() {
        this.getAllLists2().subscribe(
            lists => {
                for (const list of lists) {
                    if (list.labels.get('en') === 'Research field') {
                        this.researchFieldListIri = list.listid;
                        this.getFlatList(this.researchFieldListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.researchFieldTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Marking') {
                        this.markingTypeListIri = list.listid;
                        this.getFlatList(this.markingTypeListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.markingTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Language') {
                        this.languageListIri = list.listid;
                        this.getFlatList(this.languageListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.languageTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Formal class') {
                        this.formalClassListIri = list.listid;
                        this.getFlatList(this.formalClassListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.formalClassTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Venue place') {
                        this.venuePlaceListIri = list.listid;
                        this.getFlatList(this.venuePlaceListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.venuePlaceTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Genre') {
                        this.genreListIri = list.listid;
                        this.getFlatList(this.genreListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.genreTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Gender') {
                        this.genderListIri = list.listid;
                        this.getFlatList(this.genderListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.genderTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Subject') {
                        this.subjectListIri = list.listid;
                        this.getFlatList(this.subjectListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.subjectTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Image') {
                        this.imageListIri = list.listid;
                        this.getFlatList(this.imageListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.imageTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Status') {
                        this.statusListIri = list.listid;
                        this.getFlatList(this.statusListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.statusTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                    if (list.labels.get('en') === 'Function voice') {
                        this.functionVoiceListIri = list.listid;
                        this.getFlatList(this.functionVoiceListIri).subscribe(
                            (res: Array<ListData>) => {
                                for (const lt of res) {
                                    let prefix = '';
                                    for (let ii = 0; ii < lt.level; ii++) {
                                        prefix += '– ';
                                    }
                                    this.functionVoiceTypes.push({iri: lt.listid, name: prefix + lt.labels.get('en')});
                                }
                            }
                        );
                    }
                }
            }
        );
    }


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
                    const items: Array<{id: string; label: string}> = data.resources.map((item: ReadResource) => ({id: item.id, label: item.label}));
                    return items;
                }
            }),
        );
    }

    getResource(iri: string): Observable<ResourceData> {
        return this._knoraApiConnection.v2.res.getResource(iri).pipe(
            map((data: ReadResource) => {
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

    createCompany(data: CompanyData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'company';
        createResource.attachedToProject = this._projectIRI;

        const props = {};

        if (data.title !== null && data.title !== undefined && data.title !== '') {
            const titleVal = new CreateTextValueAsString();
            titleVal.text = data.title;
            props[this.wwOntology + 'hasCompanyTitle'] = [
                titleVal
            ];
        }

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasCompanyInternalId'] = [
                internalIdVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoIdVal = new CreateTextValueAsString();
            extraInfoIdVal.text = data.extraInfo;
            props[this.wwOntology + 'hasCompanyExtraInfo'] = [
                extraInfoIdVal
            ];
        }

        if (data.members !== null && data.members !== undefined && data.members.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const member of data.members) {
                if (member.memberIri !== '') {
                    const memberVal = new CreateLinkValue();
                    memberVal.linkedResourceIri = member.memberIri;
                    v.push(memberVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasMemberValue'] = v;
            }
        }

        if (data.lexias !== null && data.lexias !== undefined && data.lexias.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const lexia of data.lexias) {
                if (lexia.lexiaIri !== '') {
                    const lexiaVal = new CreateLinkValue();
                    lexiaVal.linkedResourceIri = lexia.lexiaIri;
                    v.push(lexiaVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isLexiaCompanyValue'] = v;
            }
        }

        createResource.properties = props;

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );

    }

    createPerson(data: PersonData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'person';
        createResource.attachedToProject = this._projectIRI;

        const props = {};
        createResource.properties = props;

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasPersonInternalId'] = [
                internalIdVal
            ];
        }

        if (data.firstName !== null && data.firstName !== undefined && data.firstName !== '') {
            const firstNameVal = new CreateTextValueAsString();
            firstNameVal.text = data.firstName;
            props[this.wwOntology + 'hasFirstName'] = [
                firstNameVal
            ];
        }

        if (data.lastName !== null && data.lastName !== undefined && data.lastName !== '') {
            const lastNameVal = new CreateTextValueAsString();
            lastNameVal.text = data.lastName;
            props[this.wwOntology + 'hasLastName'] = [
                lastNameVal
            ];
        }

        if (data.genderIri !== null && data.genderIri !== undefined && data.genderIri !== '') {
            const genderIriVal = new CreateListValue();
            genderIriVal.listNode = data.genderIri;
            props[this.wwOntology + 'hasGender'] = [
                genderIriVal
            ];
        }

        if (data.description !== null && data.description !== undefined && data.description !== '') {
            const descriptionVal = new CreateTextValueAsString();
            descriptionVal.text = data.description;
            props[this.wwOntology + 'hasDescription'] = [
                descriptionVal
            ];
        }

        const birthVal = new DateValue(
            data.birthDate.calendar,
            data.birthDate.timeSpan,
            data.birthDate.startYear,
            data.birthDate.startMonth,
            data.birthDate.startDay,
            data.birthDate.endYear,
            data.birthDate.endMonth,
            data.birthDate.endDay);
        if (!birthVal.isEmpty()) {
            const birthDateVal = new CreateDateValue();
            birthDateVal.calendar = birthVal.calendar;
            if (data.birthDate.startYear < 0) {
                birthDateVal.startEra = 'BCE';
                if (data.birthDate.calendar === DateCalendar.JULIAN) {
                    birthDateVal.startYear = -birthVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    birthDateVal.startYear = -birthVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                birthDateVal.startEra = 'CE';
                birthDateVal.startYear = birthVal.startYear;
            }
            birthDateVal.startMonth = birthVal.startMonth;
            birthDateVal.startDay = birthVal.startDay;
            if (birthVal.endYear < 0) {
                birthDateVal.endEra = 'BCE';
                if (birthVal.calendar === DateCalendar.JULIAN) {
                    birthDateVal.endYear = -birthVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    birthDateVal.endYear = -birthVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                birthDateVal.endEra = 'CE';
                birthDateVal.endYear = birthVal.endYear;
            }
            birthDateVal.endMonth = birthVal.endMonth;
            birthDateVal.endDay = birthVal.endDay;
            props[this.wwOntology + 'hasBirthDate'] = [
                birthDateVal
            ];
        }

        const deathVal = new DateValue(
            data.deathDate.calendar,
            data.deathDate.timeSpan,
            data.deathDate.startYear,
            data.deathDate.startMonth,
            data.deathDate.startDay,
            data.deathDate.endYear,
            data.deathDate.endMonth,
            data.deathDate.endDay);
        if (!deathVal.isEmpty()) {
            const deathDateVal = new CreateDateValue();
            deathDateVal.calendar = deathVal.calendar;
            if (deathVal.startYear < 0) {
                deathDateVal.startEra = 'BCE';
                if (deathVal.calendar === DateCalendar.JULIAN) {
                    deathDateVal.startYear = -deathVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    deathDateVal.startYear = -deathVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                deathDateVal.startEra = 'CE';
                deathDateVal.startYear = deathVal.startYear;
            }
            deathDateVal.startMonth = deathVal.startMonth;
            deathDateVal.startDay = deathVal.startDay;
            if (deathVal.endYear < 0) {
                deathDateVal.endEra = 'BCE';
                if (deathVal.calendar === DateCalendar.JULIAN) {
                    deathDateVal.endYear = -deathVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    deathDateVal.endYear = -deathVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                deathDateVal.endEra = 'CE';
                deathDateVal.endYear = deathVal.endYear;
            }
            deathDateVal.endMonth = deathVal.endMonth;
            deathDateVal.endDay = deathVal.endDay;
            props[this.wwOntology + 'hasDeathDate'] = [
                deathDateVal
            ];
        }

        const activeVal = new DateValue(
            data.activeDate.calendar,
            data.activeDate.timeSpan,
            data.activeDate.startYear,
            data.activeDate.startMonth,
            data.activeDate.startDay,
            data.activeDate.endYear,
            data.activeDate.endMonth,
            data.activeDate.endDay);
        if (!activeVal.isEmpty()) {
            const activeDateVal = new CreateDateValue();
            activeDateVal.calendar = activeVal.calendar;
            if (activeVal.startYear < 0) {
                activeDateVal.startEra = 'BCE';
                if (activeVal.calendar === DateCalendar.JULIAN) {
                    activeDateVal.startYear = -activeVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    activeDateVal.startYear = -activeVal.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                activeDateVal.startEra = 'CE';
                activeDateVal.startYear = activeVal.startYear;
            }
            activeDateVal.startMonth = activeVal.startMonth;
            activeDateVal.startDay = activeVal.startDay;
            if (activeVal.endYear < 0) {
                activeDateVal.endEra = 'BCE';
                if (activeVal.calendar === DateCalendar.JULIAN) {
                    activeDateVal.endYear = -activeVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    activeDateVal.endYear = -activeVal.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                activeDateVal.endEra = 'CE';
                activeDateVal.endYear = activeVal.endYear;
            }
            activeDateVal.endMonth = activeVal.endMonth;
            activeDateVal.endDay = activeVal.endDay;
            props[this.wwOntology + 'hasActiveDate'] = [
                activeDateVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoIdVal = new CreateTextValueAsString();
            extraInfoIdVal.text = data.extraInfo;
            props[this.wwOntology + 'hasPersonExtraInfo'] = [
                extraInfoIdVal
            ];
        }

        if (data.lexias !== null && data.lexias !== undefined && data.lexias.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const lexia of data.lexias) {
                if (lexia.lexiaIri !== '') {
                    const lexiaVal = new CreateLinkValue();
                    lexiaVal.linkedResourceIri = lexia.lexiaIri;
                    v.push(lexiaVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isLexiaPersonValue'] = v;
            }
        }

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    createLexia(data: LexiaData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'lexia';
        createResource.attachedToProject = this._projectIRI;

        const props = {};

        if (data.title !== null && data.title !== undefined && data.title !== '') {
            const titleVal = new CreateTextValueAsString();
            titleVal.text = data.title;
            props[this.wwOntology + 'hasLexiaTitle'] = [
                titleVal
            ];
        }

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasLexiaInternalId'] = [
                internalIdVal
            ];
        }

        if (data.formalClassIris !== null && data.formalClassIris !== undefined && data.formalClassIris.length > 0) {
            const v: CreateListValue[] = [];
            for (const formalClassIri of data.formalClassIris) {
                if (formalClassIri !== '') {
                    const formalClassIriVal = new CreateListValue();
                    formalClassIriVal.listNode = formalClassIri;
                    v.push(formalClassIriVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasFormalClass'] = v;
            }
        }

        if (data.imageIris !== null && data.imageIris !== undefined && data.imageIris.length > 0) {
            const v: CreateListValue[] = [];
            for (const imageIri of data.imageIris) {
                if (imageIri !== '') {
                    const imageIriVal = new CreateListValue();
                    imageIriVal.listNode = imageIri;
                    v.push(imageIriVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasImage'] = v;
            }
        }

        if (data.displayedTitle !== null && data.displayedTitle !== undefined && data.displayedTitle !== '') {
            const displayedTitleVal = new CreateTextValueAsString();
            displayedTitleVal.text = data.displayedTitle;
            props[this.wwOntology + 'hasLexiaDisplayedTitle'] = [
                displayedTitleVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoIdVal = new CreateTextValueAsString();
            extraInfoIdVal.text = data.extraInfo;
            props[this.wwOntology + 'hasLexiaExtraInfo'] = [
                extraInfoIdVal
            ];
        }

        createResource.properties = props;

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    createPassage(data: PassageData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'passage';
        createResource.attachedToProject = this._projectIRI;

        const props = {};

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasPassageInternalId'] = [
                internalIdVal
            ];
        }

        if (data.displayedTitle !== null && data.displayedTitle !== undefined && data.displayedTitle !== '') {
            const displayedTitleVal = new CreateTextValueAsString();
            displayedTitleVal.text = data.displayedTitle;
            props[this.wwOntology + 'hasDisplayedTitle'] = [
                displayedTitleVal
            ];
        }

        if (data.functionVoices !== null && data.functionVoices !== undefined && data.functionVoices.length > 0) {
            const v: CreateListValue[] = [];
            for (const functionVoice of data.functionVoices) {
                if (functionVoice.functionVoiceIri !== '') {
                    const functionVoiceIriVal = new CreateListValue();
                    functionVoiceIriVal.listNode = functionVoice.functionVoiceIri;
                    v.push(functionVoiceIriVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasFunctionVoice'] = v;
            }
        }

        if (data.markings !== null && data.markings !== undefined && data.markings.length > 0) {
            const v: CreateListValue[] = [];
            for (const marking of data.markings) {
                if (marking.markingIri !== '') {
                    const markingIriVal = new CreateListValue();
                    markingIriVal.listNode = marking.markingIri;
                    v.push(markingIriVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasMarking'] = v;
            }
        }

        if (data.researchField?.researchFieldIri !== null && data.researchField?.researchFieldIri !== undefined &&
            data.researchField?.researchFieldIri !== '') {
            const researchFieldIriVal = new CreateListValue();
            researchFieldIriVal.listNode = data.researchField.researchFieldIri;
            props[this.wwOntology + 'hasResearchField'] = [
                researchFieldIriVal
            ];
        }

        if (data.status?.statusIri !== null && data.status?.statusIri !== undefined &&
            data.status?.statusIri !== '') {
            const statusIriVal = new CreateListValue();
            statusIriVal.listNode = data.status.statusIri;
            props[this.wwOntology + 'hasStatus'] = [
                statusIriVal
            ];
        }

        if (data.text !== null && data.text !== undefined && data.text !== '') {
            const textVal = new CreateTextValueAsString();
            textVal.text = data.text;
            props[this.wwOntology + 'hasText'] = [
                textVal
            ];
        }

        if (data.occursIn?.occursInIri !== null && data.occursIn?.occursInIri !== undefined && data.occursIn?.occursInIri !== '') {
            const occursInVal = new CreateLinkValue();
            occursInVal.linkedResourceIri = data.occursIn.occursInIri;
            props[this.wwOntology + 'occursInValue'] = [
                occursInVal
            ];
        }

        if (data.contributedBy?.contributedByIri !== null && data.contributedBy?.contributedByIri !== undefined &&
            data.contributedBy?.contributedByIri !== '') {
            const contributedByVal = new CreateLinkValue();
            contributedByVal.linkedResourceIri = data.contributedBy.contributedByIri;
            props[this.wwOntology + 'wasContributedByValue'] = [
                contributedByVal
            ];
        }

        if (data.contains !== null && data.contains !== undefined && data.contains.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const contains of data.contains) {
                if (contains.containsIri !== '') {
                    const containsVal = new CreateLinkValue();
                    containsVal.linkedResourceIri = contains.containsIri;
                    v.push(containsVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'containsValue'] = v;
            }
        }

        if (data.internalComment !== null && data.internalComment !== undefined && data.internalComment !== '') {
            const internalCommentVal = new CreateTextValueAsString();
            internalCommentVal.text = data.internalComment;
            props[this.wwOntology + 'hasInternalComment'] = [
                internalCommentVal
            ];
        }

        if (data.page !== null && data.page !== undefined && data.page !== '') {
            const pageVal = new CreateTextValueAsString();
            pageVal.text = data.page;
            props[this.wwOntology + 'hasPage'] = [
                pageVal
            ];
        }

        if (data.pageHist !== null && data.pageHist !== undefined && data.pageHist !== '') {
            const pageHistVal = new CreateTextValueAsString();
            pageHistVal.text = data.pageHist;
            props[this.wwOntology + 'hasPageHist'] = [
                pageHistVal
            ];
        }

        if (data.comment !== null && data.comment !== undefined && data.comment !== '') {
            const commentVal = new CreateTextValueAsString();
            commentVal.text = data.comment;
            props[this.wwOntology + 'hasPassageComment'] = [
                commentVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoVal = new CreateTextValueAsString();
            extraInfoVal.text = data.extraInfo;
            props[this.wwOntology + 'hasPassageExtraInfo'] = [
                extraInfoVal
            ];
        }

        if (data.prefixTitle !== null && data.prefixTitle !== undefined && data.prefixTitle !== '') {
            const prefixTitleVal = new CreateTextValueAsString();
            prefixTitleVal.text = data.prefixTitle;
            props[this.wwOntology + 'hasPrefixDisplayedTitle'] = [
                prefixTitleVal
            ];
        }

        if (data.textHist !== null && data.textHist !== undefined && data.textHist !== '') {
            const textHistVal = new CreateTextValueAsString();
            textHistVal.text = data.textHist;
            props[this.wwOntology + 'hasTextHist'] = [
                textHistVal
            ];
        }

        if (data.mentionedIn !== null && data.mentionedIn !== undefined && data.mentionedIn.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const mentionedIn of data.mentionedIn) {
                if (mentionedIn.mentionedInIri !== '') {
                    const mentionedInVal = new CreateLinkValue();
                    mentionedInVal.linkedResourceIri = mentionedIn.mentionedInIri;
                    v.push(mentionedInVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isMentionedInValue'] = v;
            }
        }

        createResource.properties = props;

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    createBook(data: BookData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'book';
        createResource.attachedToProject = this._projectIRI;

        const props = {};

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasBookInternalId'] = [
                internalIdVal
            ];
        }

        if (data.title !== null && data.title !== undefined && data.title !== '') {
            const titleVal = new CreateTextValueAsString();
            titleVal.text = data.title;
            props[this.wwOntology + 'hasBookTitle'] = [
                titleVal
            ];
        }

        const creationDate = new DateValue(
            data.creationDate.calendar,
            data.creationDate.timeSpan,
            data.creationDate.startYear,
            data.creationDate.startMonth,
            data.creationDate.startDay,
            data.creationDate.endYear,
            data.creationDate.endMonth,
            data.creationDate.endDay);
        if (!creationDate.isEmpty()) {
            const creationDateVal = new CreateDateValue();
            creationDateVal.calendar = creationDate.calendar;
            if (data.creationDate.startYear < 0) {
                creationDateVal.startEra = 'BCE';
                if (data.creationDate.calendar === DateCalendar.JULIAN) {
                    creationDateVal.startYear = -creationDate.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    creationDateVal.startYear = -creationDate.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                creationDateVal.startEra = 'CE';
                creationDateVal.startYear = creationDate.startYear;
            }
            creationDateVal.startMonth = creationDate.startMonth;
            creationDateVal.startDay = creationDate.startDay;
            if (creationDate.endYear < 0) {
                creationDateVal.endEra = 'BCE';
                if (creationDate.calendar === DateCalendar.JULIAN) {
                    creationDateVal.endYear = -creationDate.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    creationDateVal.endYear = -creationDate.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                creationDateVal.endEra = 'CE';
                creationDateVal.endYear = creationDate.endYear;
            }
            creationDateVal.endMonth = creationDate.endMonth;
            creationDateVal.endDay = creationDate.endDay;
            props[this.wwOntology + 'hasCreationDate'] = [
                creationDateVal
            ];
        }

        if (data.edition !== null && data.edition !== undefined && data.edition !== '') {
            const editionVal = new CreateTextValueAsString();
            editionVal.text = data.edition;
            props[this.wwOntology + 'hasEdition'] = [
                editionVal
            ];
        }

        if (data.genres !== null && data.genres !== undefined && data.genres.length > 0) {
            const v: CreateListValue[] = [];
            for (const genre of data.genres) {
                if (genre.genreIri !== '') {
                    const genreVal = new CreateListValue();
                    genreVal.listNode = genre.genreIri;
                    v.push(genreVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasGenre'] = v;
            }
        }

        if (data.language?.languageIri !== null && data.language?.languageIri !== undefined &&
            data.language?.languageIri !== '') {
            const languageIriVal = new CreateListValue();
            languageIriVal.listNode = data.language.languageIri;
            props[this.wwOntology + 'hasLanguage'] = [
                languageIriVal
            ];
        }

        if (data.writtenBy !== null && data.writtenBy !== undefined && data.writtenBy.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const writtenBy of data.writtenBy) {
                if (writtenBy.writtenByIri !== '') {
                    const writtenByVal = new CreateLinkValue();
                    writtenByVal.linkedResourceIri = writtenBy.writtenByIri;
                    v.push(writtenByVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isWrittenByValue'] = v;
            }
        }

        if (data.comment !== null && data.comment !== undefined && data.comment !== '') {
            const commentVal = new CreateTextValueAsString();
            commentVal.text = data.comment;
            props[this.wwOntology + 'hasBookComment'] = [
                commentVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoVal = new CreateTextValueAsString();
            extraInfoVal.text = data.extraInfo;
            props[this.wwOntology + 'hasBookExtraInfo'] = [
                extraInfoVal
            ];
        }

        if (data.editionHist !== null && data.editionHist !== undefined && data.editionHist !== '') {
            const editionHistVal = new CreateTextValueAsString();
            editionHistVal.text = data.editionHist;
            props[this.wwOntology + 'hasEditionHistory'] = [
                editionHistVal
            ];
        }

        const firstPerformance = new DateValue(
            data.firstPerformance.calendar,
            data.firstPerformance.timeSpan,
            data.firstPerformance.startYear,
            data.firstPerformance.startMonth,
            data.firstPerformance.startDay,
            data.firstPerformance.endYear,
            data.firstPerformance.endMonth,
            data.firstPerformance.endDay);
        if (!firstPerformance.isEmpty()) {
            const firstPerformanceVal = new CreateDateValue();
            firstPerformanceVal.calendar = firstPerformance.calendar;
            if (data.firstPerformance.startYear < 0) {
                firstPerformanceVal.startEra = 'BCE';
                if (data.firstPerformance.calendar === DateCalendar.JULIAN) {
                    firstPerformanceVal.startYear = -firstPerformance.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    firstPerformanceVal.startYear = -firstPerformance.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                firstPerformanceVal.startEra = 'CE';
                firstPerformanceVal.startYear = firstPerformance.startYear;
            }
            firstPerformanceVal.startMonth = firstPerformance.startMonth;
            firstPerformanceVal.startDay = firstPerformance.startDay;
            if (firstPerformance.endYear < 0) {
                firstPerformanceVal.endEra = 'BCE';
                if (firstPerformance.calendar === DateCalendar.JULIAN) {
                    firstPerformanceVal.endYear = -firstPerformance.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    firstPerformanceVal.endYear = -firstPerformance.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                firstPerformanceVal.endEra = 'CE';
                firstPerformanceVal.endYear = firstPerformance.endYear;
            }
            firstPerformanceVal.endMonth = firstPerformance.endMonth;
            firstPerformanceVal.endDay = firstPerformance.endDay;
            props[this.wwOntology + 'hasFirstPerformanceDate'] = [
                firstPerformanceVal
            ];
        }

        if (data.prefixTitle !== null && data.prefixTitle !== undefined && data.prefixTitle !== '') {
            const prefixTitleVal = new CreateTextValueAsString();
            prefixTitleVal.text = data.prefixTitle;
            props[this.wwOntology + 'hasPrefixBookTitle'] = [
                prefixTitleVal
            ];
        }

        const pubdate = new DateValue(
            data.pubdate.calendar,
            data.pubdate.timeSpan,
            data.pubdate.startYear,
            data.pubdate.startMonth,
            data.pubdate.startDay,
            data.pubdate.endYear,
            data.pubdate.endMonth,
            data.pubdate.endDay);
        if (!pubdate.isEmpty()) {
            const pubdateVal = new CreateDateValue();
            pubdateVal.calendar = pubdate.calendar;
            if (data.pubdate.startYear < 0) {
                pubdateVal.startEra = 'BCE';
                if (data.pubdate.calendar === DateCalendar.JULIAN) {
                    pubdateVal.startYear = -pubdate.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    pubdateVal.startYear = -pubdate.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                pubdateVal.startEra = 'CE';
                pubdateVal.startYear = pubdate.startYear;
            }
            pubdateVal.startMonth = pubdate.startMonth;
            pubdateVal.startDay = pubdate.startDay;
            if (pubdate.endYear < 0) {
                pubdateVal.endEra = 'BCE';
                if (pubdate.calendar === DateCalendar.JULIAN) {
                    pubdateVal.endYear = -pubdate.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                } else {
                    pubdateVal.endYear = -pubdate.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
                }
            } else {
                pubdateVal.endEra = 'CE';
                pubdateVal.endYear = pubdate.endYear;
            }
            pubdateVal.endMonth = pubdate.endMonth;
            pubdateVal.endDay = pubdate.endDay;
            props[this.wwOntology + 'hasPublicationDate'] = [
                pubdateVal
            ];
        }

        if (data.subjects !== null && data.subjects !== undefined && data.subjects.length > 0) {
            const v: CreateListValue[] = [];
            for (const subject of data.subjects) {
                if (subject.subjectIri !== '') {
                    const subjectVal = new CreateListValue();
                    subjectVal.listNode = subject.subjectIri;
                    v.push(subjectVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'hasSubject'] = v;
            }
        }

        if (data.lexias !== null && data.lexias !== undefined && data.lexias.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const lexia of data.lexias) {
                if (lexia.lexiaIri !== '') {
                    const lexiaVal = new CreateLinkValue();
                    lexiaVal.linkedResourceIri = lexia.lexiaIri;
                    v.push(lexiaVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isLexiaBookValue'] = v;
            }
        }

        if (data.lexias !== null && data.lexias !== undefined && data.lexias.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const lexia of data.lexias) {
                if (lexia.lexiaIri !== '') {
                    const lexiaVal = new CreateLinkValue();
                    lexiaVal.linkedResourceIri = lexia.lexiaIri;
                    v.push(lexiaVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isLexiaBookValue'] = v;
            }
        }

        if (data.performedBy !== null && data.performedBy !== undefined && data.performedBy.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const performedBy of data.performedBy) {
                if (performedBy.performedByIri !== '') {
                    const performedByVal = new CreateLinkValue();
                    performedByVal.linkedResourceIri = performedBy.performedByIri;
                    v.push(performedByVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'performedByValue'] = v;
            }
        }

        if (data.performedByActor !== null && data.performedByActor !== undefined && data.performedByActor.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const performedByActor of data.performedByActor) {
                if (performedByActor.performedByActorIri !== '') {
                    const performedByActorVal = new CreateLinkValue();
                    performedByActorVal.linkedResourceIri = performedByActor.performedByActorIri;
                    v.push(performedByActorVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'performedByActorValue'] = v;
            }
        }

        if (data.performedIn !== null && data.performedIn !== undefined && data.performedIn.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const performedIn of data.performedIn) {
                if (performedIn.performedInIri !== '') {
                    const performedInVal = new CreateLinkValue();
                    performedInVal.linkedResourceIri = performedIn.performedInIri;
                    v.push(performedInVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'performedInValue'] = v;
            }
        }

        createResource.properties = props;

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    createVenue(data: VenueData): Observable<string> {
        const createResource = new CreateResource();
        createResource.label = data.label;
        createResource.type = this.wwOntology + 'venue';
        createResource.attachedToProject = this._projectIRI;

        const props = {};

        if (data.internalId !== null && data.internalId !== undefined && data.internalId !== '') {
            const internalIdVal = new CreateTextValueAsString();
            internalIdVal.text = data.internalId;
            props[this.wwOntology + 'hasVenueInternalId'] = [
                internalIdVal
            ];
        }

        if (data.place?.placeIri !== null && data.place?.placeIri !== undefined &&
            data.place?.placeIri !== '') {
            const placeIriVal = new CreateListValue();
            placeIriVal.listNode = data.place.placeIri;
            props[this.wwOntology + 'hasPlaceVenue'] = [
                placeIriVal
            ];
        }

        if (data.extraInfo !== null && data.extraInfo !== undefined && data.extraInfo !== '') {
            const extraInfoIdVal = new CreateTextValueAsString();
            extraInfoIdVal.text = data.extraInfo;
            props[this.wwOntology + 'hasVenueExtraInfo'] = [
                extraInfoIdVal
            ];
        }

        if (data.lexias !== null && data.lexias !== undefined && data.lexias.length > 0) {
            const v: CreateLinkValue[] = [];
            for (const lexia of data.lexias) {
                if (lexia.lexiaIri !== '') {
                    const lexiaVal = new CreateLinkValue();
                    lexiaVal.linkedResourceIri = lexia.lexiaIri;
                    v.push(lexiaVal);
                }
            }
            if (v.length > 0) {
                props[this.wwOntology + 'isLexiaVenueValue'] = v;
            }
        }

        createResource.properties = props;

        return this._knoraApiConnection.v2.res.createResource(createResource).pipe(
            map((res: ReadResource) => res.id),
            catchError((error: ApiResponseError) => of('error'))
        );

    }

    updateLabel(resId: string, resType: string, label: string, lastmod?: string) {
        const updateResourceMetadata = new UpdateResourceMetadata();
        updateResourceMetadata.id = resId;
        updateResourceMetadata.type = resType;
        updateResourceMetadata.label = label;
        updateResourceMetadata.lastModificationDate = lastmod;

        return this._knoraApiConnection.v2.res.updateResourceMetadata(updateResourceMetadata).pipe(
            map((res: UpdateResourceMetadataResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    createTextValue(resId: string, resType: string, property: string, text: string): Observable<string> {
        const createTextVal = new CreateTextValueAsString();
        createTextVal.text = text;

        const createResource = new UpdateResource<CreateValue>();
        createResource.id = resId;
        createResource.type = resType;
        createResource.property = property;
        createResource.value = createTextVal;

        return this._knoraApiConnection.v2.values.createValue(createResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    updateTextValue(resId: string, resType: string, valId: string, property: string, text: string): Observable<string> {
        const updateTextVal = new UpdateTextValueAsString();
        updateTextVal.id = valId;
        updateTextVal.text = text;

        const updateResource = new UpdateResource<UpdateValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = updateTextVal;

        return this._knoraApiConnection.v2.values.updateValue(updateResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    deleteTextValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
        const deleteVal = new DeleteValue();

        deleteVal.id = valId;
        deleteVal.type = Constants.TextValue;

        const updateResource = new UpdateResource<DeleteValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = deleteVal;

        return this._knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
            map((res: DeleteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    createLinkValue(resId: string, resType: string, property: string, iri: string): Observable<string> {
        const createLinkVal = new CreateLinkValue();
        createLinkVal.linkedResourceIri = iri;

        const updateResource = new UpdateResource<CreateValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = createLinkVal;

        return this._knoraApiConnection.v2.values.createValue(updateResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    updateLinkValue(resId: string, resType: string, valId: string, property: string, iri: string): Observable<string> {
        const updateLinkVal = new UpdateLinkValue();
        updateLinkVal.id = valId;
        updateLinkVal.linkedResourceIri = iri;

        const updateResource = new UpdateResource<UpdateValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = updateLinkVal;

        return this._knoraApiConnection.v2.values.updateValue(updateResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    deleteLinkValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
        const deleteVal = new DeleteValue();

        deleteVal.id = valId;
        deleteVal.type = Constants.LinkValue;

        const updateResource = new UpdateResource<DeleteValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = deleteVal;

        return this._knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
            map((res: DeleteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    createListValue(resId: string, resType: string, property: string, nodeIri: string): Observable<string> {
        const createListVal = new CreateListValue();
        createListVal.listNode = nodeIri;

        const createResource = new UpdateResource<CreateValue>();
        createResource.id = resId;
        createResource.type = resType;
        createResource.property = property;
        createResource.value = createListVal;

        return this._knoraApiConnection.v2.values.createValue(createResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    updateListValue(resId: string, resType: string, valId: string, property: string, nodeIri: string): Observable<string> {
        const updateListVal = new UpdateListValue();
        updateListVal.id = valId;
        updateListVal.listNode = nodeIri;

        const updateResource = new UpdateResource<UpdateValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = updateListVal;

        return this._knoraApiConnection.v2.values.updateValue(updateResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    deleteListValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
        const deleteVal = new DeleteValue();

        deleteVal.id = valId;
        deleteVal.type = Constants.ListValue;

        const updateResource = new UpdateResource<DeleteValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = deleteVal;

        return this._knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
            map((res: DeleteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    createDateValue(resId: string, resType: string, property: string,
                    value: DateValue): Observable<string> {
        const createDateVal = new CreateDateValue();

        createDateVal.calendar = value.calendar;
        if (value.startYear < 0) {
            createDateVal.startEra = 'BCE';
            if (value.calendar === DateCalendar.JULIAN) {
                createDateVal.startYear = -value.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
            } else {
                createDateVal.startYear = -value.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
            }
        } else {
            createDateVal.startEra = 'CE';
            createDateVal.startYear = value.startYear;
        }
        createDateVal.startMonth = value.startMonth;
        createDateVal.startDay = value.startDay;
        if (value.endYear < 0) {
            createDateVal.endEra = 'BCE';
            if (value.calendar === DateCalendar.JULIAN) {
                createDateVal.endYear = -value.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
            } else {
                createDateVal.endYear = -value.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
            }
        } else {
            createDateVal.endEra = 'CE';
            createDateVal.endYear = value.startYear;
        }
        createDateVal.endMonth = value.endMonth;
        createDateVal.endDay = value.endDay;

        const createResource = new UpdateResource<CreateValue>();
        createResource.id = resId;
        createResource.type = resType;
        createResource.property = property;
        createResource.value = createDateVal;

        return this._knoraApiConnection.v2.values.createValue(createResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    updateDateValue(resId: string, resType: string, valId: string, property: string,
                    value: DateValue): Observable<string> {
        const updateDateVal = new UpdateDateValue();
        updateDateVal.id = valId;
        updateDateVal.calendar = value.calendar;
        if (value.startYear < 0) {
            updateDateVal.startEra = 'BCE';
            if (value.calendar === DateCalendar.JULIAN) {
                updateDateVal.startYear = -value.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
            } else {
                updateDateVal.startYear = -value.startYear; // Todo: depending on handling of year 0 in Knora +/- 1
            }
        } else {
            updateDateVal.startEra = 'CE';
            updateDateVal.startYear = value.startYear;
        }
        updateDateVal.startMonth = value.startMonth;
        updateDateVal.startDay = value.startDay;
        if (value.endYear < 0) {
            updateDateVal.endEra = 'BCE';
            if (value.calendar === DateCalendar.JULIAN) {
                updateDateVal.endYear = -value.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
            } else {
                updateDateVal.endYear = -value.endYear; // Todo: depending on handling of year 0 in Knora +/- 1
            }
        } else {
            updateDateVal.endEra = 'CE';
            updateDateVal.endYear = value.startYear;
        }
        updateDateVal.endMonth = value.endMonth;
        updateDateVal.endDay = value.endDay;

        const updateResource = new UpdateResource<UpdateValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = updateDateVal;

        return this._knoraApiConnection.v2.values.updateValue(updateResource).pipe(
            map((res: WriteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('error'))
        );
    }

    deleteDateValue(resId: string, resType: string, valId: string, property: string): Observable<string> {
        const deleteVal = new DeleteValue();

        deleteVal.id = valId;
        deleteVal.type = Constants.DateValue;

        const updateResource = new UpdateResource<DeleteValue>();
        updateResource.id = resId;
        updateResource.type = resType;
        updateResource.property = property;
        updateResource.value = deleteVal;

        return this._knoraApiConnection.v2.values.deleteValue(updateResource).pipe(
            map((res: DeleteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
        );
    }

    deleteResource(resId: string, resType: string, lastmod: string, delcomment?: string): Observable<string> {
        const deleteResource = new DeleteResource();
        deleteResource.id = resId;
        deleteResource.type = this.wwOntology + resType;
        deleteResource.lastModificationDate = lastmod;
        deleteResource.deleteComment = delcomment || undefined;
        return this._knoraApiConnection.v2.res.deleteResource(deleteResource).pipe(
            map( (res: DeleteValueResponse) => 'OK'),
            catchError((error: ApiResponseError) => of('ERROR'))
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

}

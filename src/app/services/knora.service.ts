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
    ListsResponse,
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
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, of, throwError} from 'rxjs';
import {DateValue} from '../edit/date-value/date-value.component';
import {DateCalendar} from '../classes/calendar';

//---- BEGIN LUKAS ---------------------------------------------------------------------------------------------------

export interface OptionType {
    iri: string;
    name: string;
}

export class CompanyData {
    constructor(
        public label: string,
        public title: string,
        public internalId: string,
        public extraInfo?: string,
        public members?: {memberName: string; memberIri: string}[],
        public lexias?: {lexiaName: string; lexiaIri: string}[],
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
        public occursIn: {occursInName: string; occursInIri: string}, // occursIn (1) -> Link ww:book
        public contributedBy: {contributedByName: string; contributedByIri: string}, // wasContributedBy (1) -> Link ww:person
        public contains?: {containsName: string; containsIri: string}[], // contains (0-n) -> Link ww:lexia
        public internalComment?: string, // hasInternalComment (0-1)
        public page?: string, // hasPage (0-1)
        public pageHist?: string, // hasPageHist (0-1)
        public comment?: string, // hasPassageComment (0-1)
        public extraInfo?: string, // hasPassageExtraInfo (0-1)
        public prefixTitle?: string, // hasPrefixDisplayedTitle (0-1)
        public textHist?: string, // hasTextHist (0-1)
        public mentionedIn?: {mentionedInName: string; mentionedInIri: string}[], // isMentionedIn (0-n) -> Link ww:pasage
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
    public _knoraApiConnection: KnoraApiConnection;
    wwOntology: string;
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

    login(email: string, password: string): any {
        return this._knoraApiConnection.v2.auth.login('email', email, password);
    }

    gravseachQuery(structure: IMainClass, priority: number, offset?: number): Observable<any> {
        const gravsearch = this._gsBuilder.getQuery(structure, priority, offset);
        return this._knoraApiConnection.v2.search.doExtendedSearch(gravsearch)
            .pipe(
                tap(data => console.log(data)),
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
        return this._knoraApiConnection.admin.listsEndpoint.getListsInProject('http://rdfh.ch/projects/0826').pipe(
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
        createResource.attachedToProject = 'http://rdfh.ch/projects/0826';

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
        createResource.attachedToProject = 'http://rdfh.ch/projects/0826';

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
        createResource.attachedToProject = 'http://rdfh.ch/projects/0826';

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

    updateLabel(resId: string, resType: string, label: string) {
        const updateResourceMetadata = new UpdateResourceMetadata();
        updateResourceMetadata.id = resId;
        updateResourceMetadata.type = resType;
        updateResourceMetadata.label = label;

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
        createDateVal.startYear = value.startYear;
        createDateVal.startMonth = value.startMonth;
        createDateVal.startDay = value.startDay;
        createDateVal.endYear = value.endYear;
        createDateVal.endMonth = value.endMonth;
        createDateVal.endDay = value.endDay;

        createDateVal.startEra = 'CE';
        createDateVal.endEra = 'CE';

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
        updateDateVal.startYear = value.startYear;
        updateDateVal.startMonth = value.startMonth;
        updateDateVal.startDay = value.startDay;
        updateDateVal.endYear = value.endYear;
        updateDateVal.endMonth = value.endMonth;
        updateDateVal.endDay = value.endDay;

        updateDateVal.startEra = 'CE';
        updateDateVal.endEra = 'CE';

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

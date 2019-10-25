import {Injectable} from "@angular/core";
import {
    Contributor,
    Lexia,
    Subject,
    Organisation,
    Book,
    Passage,
    Language,
    Venue,
    Author,
    Gender,
    Genre,
    ResearchField, Status, Image, Marking, FormalClass, FunctionVoice
} from "../model/model";
import {BackendDataService} from "./backend-data.service";
import {Observable, of} from "rxjs";
import {delay} from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class ApiService {
    static readonly DELAY = 500;

    constructor(private backendData: BackendDataService) {
    }

    // READ REQUEST

    getBook(iri: number, references: boolean = false): Observable<Book> {
        return of(this.backendData.getBook(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getBooks(references: boolean = false): Observable<Book[]> {
        return of(this.backendData.getBooks(references))
            .pipe(delay(ApiService.DELAY));
    }

    getAuthor(iri: number, references: boolean = false): Observable<Author> {
        return of(this.backendData.getAuthor(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getAuthors(references: boolean = false): Observable<Author[]> {
        return of(this.backendData.getAuthors(references))
            .pipe(delay(ApiService.DELAY));
    }

    getPassage(iri: number, references: boolean = false): Observable<Passage> {
        return of(this.backendData.getPassage(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getPassages(references: boolean = false): Observable<Passage[]> {
        return of(this.backendData.getPassages(references))
            .pipe(delay(ApiService.DELAY));
    }

    getLanguage(iri: number, references: boolean = false): Observable<Language> {
        return of(this.backendData.getLanguage(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getLanguages(references: boolean = false): Observable<Language[]> {
        return of(this.backendData.getLanguages(references))
            .pipe(delay(ApiService.DELAY));
    }

    getVenue(iri: number, references: boolean = false): Observable<Venue> {
        return of(this.backendData.getVenue(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getVenues(references: boolean = false): Observable<Venue[]> {
        return of(this.backendData.getVenues(references))
            .pipe(delay(ApiService.DELAY));
    }

    getOrganisation(iri: number, references: boolean = false): Observable<Organisation> {
        return of(this.backendData.getOrganisation(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getOrganisations(references: boolean = false): Observable<Organisation[]> {
        return of(this.backendData.getOrganisations(references))
            .pipe(delay(ApiService.DELAY));
    }

    getSubject(iri: number, references: boolean = false): Observable<Subject> {
        return of(this.backendData.getSubject(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getSubjects(references: boolean = false): Observable<Subject[]> {
        return of(this.backendData.getSubjects(references))
            .pipe(delay(ApiService.DELAY));
    }

    getLexia(iri: number, references: boolean = false): Observable<Lexia> {
        return of(this.backendData.getLexia(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getLexias(references: boolean = false): Observable<Lexia[]> {
        return of(this.backendData.getLexias(references))
            .pipe(delay(ApiService.DELAY));
    }

    getContributor(iri: number, references: boolean = false): Observable<Contributor> {
        return of(this.backendData.getContributor(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getContributors(references: boolean = false): Observable<Contributor[]> {
        return of(this.backendData.getContributors(references))
            .pipe(delay(ApiService.DELAY));
    }

    getGender(iri: number, references: boolean = false): Observable<Gender> {
        return of(this.backendData.getGender(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getGenders(references: boolean = false): Observable<Gender[]> {
        return of(this.backendData.getGenders(references))
            .pipe(delay(ApiService.DELAY));
    }

    getGenre(iri: number, references: boolean = false): Observable<Genre> {
        return of(this.backendData.getGenre(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getGenres(references: boolean = false): Observable<Genre[]> {
        return of(this.backendData.getGenres(references))
            .pipe(delay(ApiService.DELAY));
    }

    getResearchField(iri: number, references: boolean = false): Observable<ResearchField> {
        return of(this.backendData.getResearchField(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getResearchFields(references: boolean = false): Observable<ResearchField[]> {
        return of(this.backendData.getResearchFields(references))
            .pipe(delay(ApiService.DELAY));
    }

    getStatus(iri: number, references: boolean = false): Observable<Status> {
        return of(this.backendData.getStatus(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getStatuses(references: boolean = false): Observable<Status[]> {
        return of(this.backendData.getStatuses(references))
            .pipe(delay(ApiService.DELAY));
    }

    getImage(iri: number, references: boolean = false): Observable<Image> {
        return of(this.backendData.getImage(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getImages(references: boolean = false): Observable<Image[]> {
        return of(this.backendData.getImages(references))
            .pipe(delay(ApiService.DELAY));
    }

    getMarking(iri: number, references: boolean = false): Observable<Marking> {
        return of(this.backendData.getMarking(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getMarkings(references: boolean = false): Observable<Marking[]> {
        return of(this.backendData.getMarkings(references))
            .pipe(delay(ApiService.DELAY));
    }

    getFormalClass(iri: number, references: boolean = false): Observable<FormalClass> {
        return of(this.backendData.getFormalClass(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getFormalClasses(references: boolean = false): Observable<FormalClass[]> {
        return of(this.backendData.getFormalClasses(references))
            .pipe(delay(ApiService.DELAY));
    }

    getFunctionVoice(iri: number, references: boolean = false): Observable<FunctionVoice> {
        return of(this.backendData.getFunctionVoice(iri, references))
            .pipe(delay(ApiService.DELAY));
    }

    getFunctionVoices(references: boolean = false): Observable<FunctionVoice[]> {
        return of(this.backendData.getFunctionVoices(references))
            .pipe(delay(ApiService.DELAY));
    }

    // UPDATE REQUESTS

    updateAuthor(iri: number, author: any) {
        const data: Author = {
            id: author.id,
            internalID: author.internalID,
            firstName: author.firstName,
            lastName: author.lastName,
            gender: author.gender,
            description: author.description,
            birthStartDate: author.birthStartDate,
            birthEndDate: author.birthEndDate,
            deathStartDate: author.deathStartDate,
            deathEndDate: author.deathEndDate,
            flStartDate: author.flStartDate,
            flEndDate: author.flEndDate,
            humanAsLexia: author.humanAsLexia ? author.humanAsLexia : null,
            internalComment: "",
            references: 0,
            order: author.order
        };
        this.backendData.updateAuthor(iri, data);
    }

    updateBook(iri: number, book: any) {
        const data: Book = {
            id: book.id,
            internalID: book.internalID,
            title: book.title,
            createdStartDate: book.createdStartDate,
            createdEndDate: book.createdEndDate,
            publishedStartDate: book.publishedStartDate,
            publishedEndDate: book.publishedEndDate,
            licenseStartDate: book.licenseStartDate,
            licenseEndDate: book.licenseEndDate,
            firstPerformanceStartDate: book.firstPerformanceStartDate,
            firstPerformanceEndDate: book.firstPerformanceEndDate,
            edition: book.edition,
            editionHist: book.editionHist,
            publicComment: book.publicComment,
            commentForPassage: book.commentForPassage,
            authors: book.authors.map(author => author.id),
            venues: book.venues.map(venue => venue.id),
            organisations: book.organisations.map(organisation => organisation.id),
            subjects: book.subjects.map(subject => subject.id),
            genres: book.genres.map(genre => genre.id),
            language: book.language ? book.language.id : null,
            bookAsLexia: book.bookAsLexia ? book.bookAsLexia.id : null,
            internalComment: "",
            references: 0,
            order: book.order
        };
        this.backendData.updateBook(iri, data);
    }

    updatePassage(iri: number, passage: any) {
        const data: Passage = {
            id: passage.id,
            occursIn: passage.occursIn ? passage.occursIn.id : null,
            text: passage.text,
            textHist: passage.textHist,
            page: passage.page,
            pageHist: passage.pageHist,
            publicComment: passage.publicComment,
            marking: passage.marking ? passage.marking.id : null,
            researchField: passage.researchField ? passage.researchField.id : null,
            status: passage.status ? passage.status.id : null,
            functionVoice: passage.functionVoice ? passage.functionVoice.id : null,
            contains: passage.contains.map(lexia => lexia.id),
            mentionedIn: passage.mentionedIn.map(con => con.id),
            wasContributedBy: passage.wasContributedBy.id,
            internalComment: "",
            references: 0,
            order: passage.order
        };
        this.backendData.updatePassage(iri, data);
    }

    updateLanguage(iri: number, language: Language) {
        this.backendData.updateLanguage(iri, language);
    }

    updateVenue(iri: number, venue: any) {
        const data: Venue = {
            id: venue.id,
            internalID: venue.internalID,
            name: venue.name,
            place: venue.place,
            venueAsLexia: venue.venueAsLexia ? venue.venueAsLexia.id : null,
            internalComment: "",
            references: 0,
            order: venue.order
        };
        this.backendData.updateVenue(iri, data);
    }

    updateOrganisation(iri: number, organisation: any) {
        const data: Organisation = {
            id: organisation.id,
            internalID: organisation.internalID,
            name: organisation.name,
            organisationAsLexia: organisation.organisationAsLexia ? organisation.organisationAsLexia.id : null,
            internalComment: "",
            references: 0,
            order: organisation.order
        };
        this.backendData.updateOrganisation(iri, data);
    }

    updateSubject(iri: number, subject: Subject) {
        this.backendData.updateSubject(iri, subject);
    }

    updateLexia(iri: number, lexia: Lexia) {
        this.backendData.updateLexia(iri, lexia);
    }

    updateContributor(iri: number, contributor: any) {
        const data: Contributor = {
            id: contributor.id,
            internalID: contributor.internalID,
            firstName: contributor.firstName,
            lastName: contributor.lastName,
            gender: contributor.gender,
            email: contributor.email,
            humanAsLexia: contributor.humanAsLexia ? contributor.humanAsLexia : null,
            internalComment: "",
            references: 0,
            order: contributor.order
        };
        this.backendData.updateContributor(iri, data);
    }

    // CREATE REQUESTS

    createAuthor(data: any) {
        this.backendData.createAuthor(data);
    }

    createBook(data: any) {
        // converts reference to IDs
        data.authors = data.authors.map(author => author.id);
        data.venues = data.venues.map(venue => venue.id);
        data.organisations = data.organisations.map(organisation => organisation.id);
        this.backendData.createBook(data);
    }

    createPassage(data: any) {
        // converts reference to IDs
        if (data.edition) {
            data.edition = data.edition.id;
        }
        // data.edition = data.edition ? data.edition.id;
        this.backendData.createPassage(data);
    }

    createLanguage(data: any) {
        this.backendData.createLanguage(data);
    }

    createGender(data: any) {
        this.backendData.createGender(data);
    }

    createStatus(data: any) {
        this.backendData.createStatus(data);
    }

    createVenue(data: any) {
        this.backendData.createVenue(data);
    }

    createOrganistaion(data: any) {
        this.backendData.createOrganisation(data);
    }

    createSubject(data: any) {
        this.backendData.createSubject(data);
    }

    createLexia(data: any) {
        this.backendData.createLexia(data);
    }

    createContributor(data: any) {
        this.backendData.createContributor(data);
    }
}

import {Injectable} from "@angular/core";
import {BackendService} from "../backendData/backend.service";
import {
    Author,
    Book, Contributor,
    Edition,
    EditionOriginal,
    Language,
    Lexia,
    Organisation,
    Passage,
    PassageOriginal,
    Subject,
    Venue
} from "../../model/model";

@Injectable({
    providedIn: "root"
})
export class ApiService {

    constructor(private backendData: BackendService) {
    }

    // READ REQUEST

    getBook(iri: number, references: boolean = false) {
        return this.backendData.getBook(iri, references);
    }

    getBooks(references: boolean = false) {
        return this.backendData.getBooks(references);
    }

    getAuthor(iri: number, references: boolean = false) {
        return this.backendData.getAuthor(iri, references);
    }

    getAuthors(references: boolean = false) {
        return this.backendData.getAuthors(references);
    }

    getEdition(iri: number, references: boolean = false) {
        return this.backendData.getEdition(iri, references);
    }

    getEditions(references: boolean = false) {
        return this.backendData.getEditions(references);
    }

    getPassage(iri: number, references: boolean = false) {
        return this.backendData.getPassage(iri, references);
    }

    getPassages(references: boolean = false) {
        return this.backendData.getPassages(references);
    }

    getEditionOriginal(iri: number, references: boolean = false) {
        return this.backendData.getEditionOriginal(iri, references);
    }

    getEditionsOriginal(references: boolean = false) {
        return this.backendData.getEditionsOriginal(references);
    }

    getPassageOriginal(iri: number, references: boolean = false) {
        return this.backendData.getPassageOriginal(iri, references);
    }

    getPassagesOriginal(references: boolean = false) {
        return this.backendData.getPassagesOriginal(references);
    }

    getLanguage(iri: number, references: boolean = false) {
        return this.backendData.getLanguage(iri, references);
    }

    getLanguages(references: boolean = false) {
        return this.backendData.getLanguages(references);
    }

    getVenue(iri: number, references: boolean = false) {
        return this.backendData.getVenue(iri, references);
    }

    getVenues(references: boolean = false) {
        return this.backendData.getVenues(references);
    }

    getOrganisation(iri: number, references: boolean = false) {
        return this.backendData.getOrganisation(iri, references);
    }

    getOrganisations(references: boolean = false) {
        return this.backendData.getOrganisations(references);
    }

    getSubject(iri: number, references: boolean = false) {
        return this.backendData.getSubject(iri, references);
    }

    getSubjects(references: boolean = false) {
        return this.backendData.getSubjects(references);
    }

    getLexia(iri: number, references: boolean = false) {
        return this.backendData.getLexia(iri, references);
    }

    getLexias(references: boolean = false) {
        return this.backendData.getLexias(references);
    }

    getContributor(iri: number, references: boolean = false) {
        return this.backendData.getContributor(iri, references);
    }

    getContributors(references: boolean = false) {
        return this.backendData.getContributors(references);
    }

    getGenres(references: boolean = false) {
        return this.backendData.getGenres(references);
    }

    // UPDATE REQUESTS

    updateAuthor(iri: number, author: Author) {
        this.backendData.updateAuthor(iri, author);
    }

    updateBook(iri: number, book: Book) {
        const data = {
            id: book.id,
            internalID: book.internalID,
            title: book.title,
            authors: book.authors.map(author => author.id),
            venues: book.venues.map(venue => venue.id),
            organisations: book.organisations.map(organisation => organisation.id),
            order: book.order
        };
        this.backendData.updateBook(iri, data);
    }

    updateEdition(iri: number, edition: Edition) {
        const data = {
            id: edition.id,
            book: edition.book ? edition.book.id : null,
            language: edition.language ? edition.language.id : null,
            publicationInfo: edition.publicationInfo,
            order: edition.order
        };
        this.backendData.updateEdition(iri, data);
    }

    updatePassage(iri: number, passage: Passage) {
        const data = {
            id: passage.id,
            edition: passage.edition ? passage.edition.id : null,
            text: passage.text,
            page: passage.page,
            order: passage.order
        };
        this.backendData.updatePassage(iri, data);
    }

    updateEditionOriginal(iri: number, editionOr: EditionOriginal) {
        this.backendData.updateEditionOriginal(iri, editionOr);
    }

    updatePassageOriginal(iri: number, passageOr: PassageOriginal) {
        this.backendData.updatePassageOriginal(iri, passageOr);
    }

    updateLanguage(iri: number, language: Language) {
        this.backendData.updateLanguage(iri, language);
    }

    updateVenue(iri: number, venue: Venue) {
        this.backendData.updateVenue(iri, venue);
    }

    updateOrganisation(iri: number, organisation: Organisation) {
        this.backendData.updateOrganisation(iri, organisation);
    }

    updateSubject(iri: number, subject: Subject) {
        this.backendData.updateSubject(iri, subject);
    }

    updateLexia(iri: number, lexia: Lexia) {
        this.backendData.updateLexia(iri, lexia);
    }

    updateContributor(iri: number, contributor: Contributor) {
        this.backendData.updateContributor(iri, contributor);
    }

    // CREATE REQUESTS

    createAuthor(data: any) {
        this.backendData.createAuthor(data);
    }

    createBook(data: any) {
        // converts reference to IDs
        data.authors = data.authors.map(author => author.id);
        data.venues =  data.venues.map(venue => venue.id);
        data.organisations = data.organisations.map(organisation => organisation.id);
        this.backendData.createBook(data);
    }

    createEdition(data: any) {
        // converts reference to IDs
        data.book = data.book ? data.book.id : null;
        data.language = data.language ? data.language.id : null;
        this.backendData.createEdition(data);
    }

    createEditionOriginal(data: any) {
        this.backendData.createEditionOriginal(data);
    }

    createPassage(data: any) {
        // converts reference to IDs
        if (data.edition) {
            data.edition = data.edition.id;
        }
        // data.edition = data.edition ? data.edition.id;
        this.backendData.createPassage(data);
    }

    createPassageOriginal(data: any) {
        this.backendData.createPassageOriginal(data);
    }

    createLanguage(data: any) {
        this.backendData.createLanguage(data);
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

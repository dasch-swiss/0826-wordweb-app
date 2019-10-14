import {Injectable} from "@angular/core";
import {Contributor, Lexia, Subject, Organisation, Book, Passage, Language, Venue, Author} from "../model/model";
import {BackendDataService} from "./backend-data.service";

@Injectable({
    providedIn: "root"
})
export class ApiService {

    constructor(private backendData: BackendDataService) {
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

    getPassage(iri: number, references: boolean = false) {
        return this.backendData.getPassage(iri, references);
    }

    getPassages(references: boolean = false) {
        return this.backendData.getPassages(references);
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

    getGender(iri: number, references: boolean = false) {
        return this.backendData.getGender(iri, references);
    }

    getGenders(references: boolean = false) {
        return this.backendData.getGenders(references);
    }

    getGenre(iri: number, references: boolean = false) {
        return this.backendData.getGenre(iri, references);
    }

    getGenres(references: boolean = false) {
        return this.backendData.getGenres(references);
    }

    getResearchField(iri: number, references: boolean = false) {
        return this.backendData.getResearchField(iri, references);
    }

    getResearchFields(references: boolean = false) {
        return this.backendData.getResearchFields(references);
    }

    getStatus(iri: number, references: boolean = false) {
        return this.backendData.getStatus(iri, references);
    }

    getStatuses(references: boolean = false) {
        return this.backendData.getStatuses(references);
    }

    getImage(iri: number, references: boolean = false) {
        return this.backendData.getImage(iri, references);
    }

    getImages(references: boolean = false) {
        return this.backendData.getImages(references);
    }

    getMarking(iri: number, references: boolean = false) {
        return this.backendData.getMarking(iri, references);
    }

    getMarkings(references: boolean = false) {
        return this.backendData.getMarkings(references);
    }

    getFormalClass(iri: number, references: boolean = false) {
        return this.backendData.getFormalClass(iri, references);
    }

    getFormalClasses(references: boolean = false) {
        return this.backendData.getFormalClasses(references);
    }

    getFunctionVoice(iri: number, references: boolean = false) {
        return this.backendData.getFunctionVoice(iri, references);
    }

    getFunctionVoices(references: boolean = false) {
        return this.backendData.getFunctionVoices(references);
    }

    // UPDATE REQUESTS

    updateAuthor(iri: number, author: Author) {
        this.backendData.updateAuthor(iri, author);
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
            authors: book.authors.map(author => author.id),
            venues: book.venues.map(venue => venue.id),
            organisations: book.organisations.map(organisation => organisation.id),
            subjects: book.subjects.map(subject => subject.id),
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
            book: passage.book ? passage.book.id : null,
            text: passage.text,
            textHist: passage.textHist,
            page: passage.page,
            pageHist: passage.pageHist,
            lexias: passage.lexias.map(lexia => lexia.id),
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

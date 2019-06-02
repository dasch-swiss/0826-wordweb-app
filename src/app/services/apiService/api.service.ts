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

    updateAuthor(iri: number, author: Author) {
        this.backendData.updateAuthor(iri, author);
    }

    updateBook(iri: number, book: Book) {
        this.backendData.updateBook(iri, book);

    }

    updateEdition(iri: number, edition: Edition) {
        this.backendData.updateEdition(iri, edition);
    }

    updatePassage(iri: number, passage: Passage) {
        this.backendData.updatePassage(iri, passage);
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

    createAuthor() {

    }

    createBook() {

    }

    createEdition() {

    }

    createEditionOriginal() {

    }

    createPassage() {

    }

    createPassageOriginal() {

    }
}

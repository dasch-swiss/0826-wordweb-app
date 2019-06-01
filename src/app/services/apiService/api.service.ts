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

    }

    updatePassage(iri: number, passage: Passage) {

    }

    updateEditionOriginal(iri: number, editionOr: EditionOriginal) {

    }

    updatePassageOriginal(iri: number, passageOr: PassageOriginal) {

    }

    updateLanguage(iri: number, language: Language) {

    }

    updateVenue(iri: number, venue: Venue) {

    }

    updateOrganisation(iri: number, organisation: Organisation) {

    }

    updateSubject(iri: number, subject: Subject) {

    }

    updateLexia(iri: number, lexia: Lexia) {

    }

    updateContributor(iri: number, contributor: Contributor) {

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

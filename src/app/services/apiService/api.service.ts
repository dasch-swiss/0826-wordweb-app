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

    getBook(iri: number) {
        return this.backendData.getBook(iri);
    }

    getBooks() {
        return this.backendData.getBooks();
    }

    getAuthor(iri: number) {
        return this.backendData.getAuthor(iri);
    }

    getAuthors() {
        return this.backendData.getAuthors();
    }

    getEdition(iri: number) {
        return this.backendData.getEdition(iri);
    }

    getEditions() {
        return this.backendData.getEditions();
    }

    getPassage(iri: number) {
        return this.backendData.getPassage(iri);
    }

    getPassages() {
        return this.backendData.getPassages();
    }

    getEditionOriginal(iri: number) {
        return this.backendData.getEditionOriginal(iri);
    }

    getEditionsOriginal() {
        return this.backendData.getEditionsOriginal();
    }

    getPassageOriginal(iri: number) {
        return this.backendData.getPassageOriginal(iri);
    }

    getPassagesOriginal() {
        return this.backendData.getPassagesOriginal();
    }

    getLanguage(iri: number) {
        return this.backendData.getLanguage(iri);
    }

    getLanguages() {
        return this.backendData.getLanguages();
    }

    getVenue(iri: number) {
        return this.backendData.getVenue(iri);
    }

    getVenues() {
        return this.backendData.getVenues();
    }

    getOrganisation(iri: number) {
        return this.backendData.getOrganisation(iri);
    }

    getOrganisations() {
        return this.backendData.getOrganisations();
    }

    getSubject(iri: number) {
        return this.backendData.getSubject(iri);
    }

    getSubjects() {
        return this.backendData.getSubjects();
    }

    getLexia(iri: number) {
        return this.backendData.getLexia(iri);
    }

    getLexias() {
        return this.backendData.getLexias();
    }

    getContributor(iri: number) {
        return this.backendData.getContributor(iri);
    }

    getContributors() {
        return this.backendData.getContributors();
    }

    getGenres() {
        return this.backendData.getGenres();
    }

    updateAuthor(iri: number, author: Author) {
        this.backendData.updateAuthor(iri, author);
    }

    updateBook(iri: number, book: Book) {

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

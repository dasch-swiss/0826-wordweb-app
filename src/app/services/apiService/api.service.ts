import {Injectable} from "@angular/core";
import {BackendService} from "../backendData/backend.service";

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

  getGenres() {
    return this.backendData.getGenres();
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

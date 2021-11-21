import { Component, OnInit } from '@angular/core';
import {KnoraService} from "../services/knora.service";
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit',
  template: `
    <div *ngIf="knoraService.loggedin" class="container">
      <mat-card>
        <mat-card-title>Person</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createPerson()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select Person"
                   aria-label="Value"
                   [matAutocomplete]="autoPerson"
                   [(ngModel)]="person"
                   (change)="_handleInput('person')"
                   (input)="_handleLinkInput('person')">
            <input matInput [(ngModel)]="personIri" [hidden]="true">
            <mat-autocomplete #autoPerson="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                          'person')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="personEditDisabled"
                  (click)="editPerson()">Edit
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Book</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createBook()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select Book"
                   aria-label="Value"
                   [matAutocomplete]="autoBook"
                   [(ngModel)]="book"
                   (change)="_handleInput('book')"
                   (input)="_handleLinkInput('book')">
            <input matInput [(ngModel)]="bookIri" [hidden]="true">
            <mat-autocomplete #autoBook="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                            'book')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="bookEditDisabled"
                  (click)="editBook()">Edit
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Lexia</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createLexia()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select Lexia"
                   aria-label="Value"
                   [matAutocomplete]="autoLexia"
                   [(ngModel)]="lexia"
                   (change)="_handleInput('lexia')"
                   (input)="_handleLinkInput('lexia')">
            <input matInput [(ngModel)]="lexiaIri" [hidden]="true">
            <mat-autocomplete #autoLexia="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                            'lexia')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="lexiaEditDisabled"
                  (click)="editLexia()">Edit
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Passage</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createPassage()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select Passage"
                   aria-label="Value"
                   [matAutocomplete]="autoPassage"
                   [(ngModel)]="passage"
                   (change)="_handleInput('passage')"
                   (input)="_handleLinkInput('passage')">
            <input matInput [(ngModel)]="passageIri" [hidden]="true">
            <mat-autocomplete #autoPassage="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                            'passage')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="passageEditDisabled"
                  (click)="editPassage()">Edit
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Company {{knoraService.loggedin}}</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createCompany()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select company"
                   aria-label="Value"
                   [matAutocomplete]="autoCompany"
                   [(ngModel)]="company"
                   (change)="_handleInput('company')"
                   (input)="_handleLinkInput('company')">
            <input matInput [(ngModel)]="companyIri" [hidden]="true">
            <mat-autocomplete #autoCompany="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                          'company')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="companyEditDisabled"
                  (click)="editCompany()">Edit
          </button>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-title>Venue</mat-card-title>
        <mat-card-content>
          <button mat-raised-button (click)="createVenue()">New</button>
          <br><br>
          <mat-form-field>
            <input matInput
                   placeholder="Select Venue"
                   aria-label="Value"
                   [matAutocomplete]="autoVenue"
                   [(ngModel)]="venue"
                   (change)="_handleInput('venue')"
                   (input)="_handleLinkInput('venue')">
            <input matInput [(ngModel)]="venueIri" [hidden]="true">
            <mat-autocomplete #autoVenue="matAutocomplete"
                              (optionSelected)="_optionSelected($event.option.value,
                            'venue')">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <button mat-raised-button
                  [disabled]="venueEditDisabled"
                  (click)="editVenue()">Edit
          </button>
        </mat-card-content>
      </mat-card>
    </div>
    <div *ngIf="!knoraService.loggedin" class="container">
      <mat-card>
        <mat-card-title>No access!</mat-card-title>
      </mat-card>
    </div>
  `,
  styles: [
  ]
})
export class EditComponent implements OnInit {
  company = '';
  companyIri = '';
  companyEditDisabled = true;
  person = '';
  personIri = '';
  personEditDisabled = true;
  lexia = '';
  lexiaIri = '';
  lexiaEditDisabled = true;
  passage = '';
  passageIri = '';
  passageEditDisabled = true;
  book = '';
  bookIri = '';
  bookEditDisabled = true;
  venue = '';
  venueIri = '';
  venueEditDisabled = true;
  options: Array<{id: string; label: string}> = [];

  constructor(public knoraService: KnoraService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onChange = (_: any) => {};

  _handleInput(what: string): void {
    switch(what) {
      case 'company':
        this.onChange(this.company);
        this.onChange(this.companyIri);
        break;
      case 'person':
        this.onChange(this.person);
        this.onChange(this.personIri);
        break;
      case 'lexia':
        this.onChange(this.lexia);
        this.onChange(this.lexiaIri);
        break;
      case 'passage':
        this.onChange(this.passage);
        this.onChange(this.passageIri);
        break;
      case 'book':
        this.onChange(this.book);
        this.onChange(this.bookIri);
        break;
      case 'venue':
        this.onChange(this.book);
        this.onChange(this.bookIri);
        break;
    }
  }

  _handleLinkInput(what: string): void {
    switch(what) {
      case 'company':
        if (this.companyIri !== '') {
          this.companyIri = '';
        }
        this.companyEditDisabled = true;
        if (this.company.length >= 3) {
          this.knoraService.getResourcesByLabel(this.company, this.knoraService.wwOntology + 'company').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
      case 'person':
        if (this.personIri !== '') {
          this.personIri = '';
        }
        this.personEditDisabled = true;
        if (this.person.length >= 3) {
          this.knoraService.getResourcesByLabel(this.person, this.knoraService.wwOntology + 'person').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
      case 'lexia':
        if (this.lexiaIri !== '') {
          this.lexiaIri = '';
        }
        this.lexiaEditDisabled = true;
        if (this.lexia.length >= 3) {
          this.knoraService.getResourcesByLabel(this.lexia, this.knoraService.wwOntology + 'lexia').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
      case 'passage':
        if (this.passageIri !== '') {
          this.passageIri = '';
        }
        this.passageEditDisabled = true;
        if (this.passage.length >= 3) {
          this.knoraService.getResourcesByLabel(this.passage, this.knoraService.wwOntology + 'passage').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
      case 'book':
        if (this.bookIri !== '') {
          this.bookIri = '';
        }
        this.bookEditDisabled = true;
        if (this.book.length >= 0) {
          this.knoraService.getResourcesByLabel(this.book, this.knoraService.wwOntology + 'book').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
      case 'venue':
        if (this.venueIri !== '') {
          this.venueIri = '';
        }
        this.venueEditDisabled = true;
        if (this.venue.length >= 3) {
          this.knoraService.getResourcesByLabel(this.venue, this.knoraService.wwOntology + 'venue').subscribe(
              res => {
                this.options = res;
                console.log('_handleLinkInput:res=', res);
              }
          );
        }
        break;
    }
  }

  _optionSelected(val: any, what: string): void {
    const res = this.options.filter(tmp => tmp.label === val);
    switch(what) {
      case 'company':
        this.company = res[0].label;
        this.companyIri = res[0].id;
        this.companyEditDisabled = false;
        break;
      case 'person':
        this.person = res[0].label;
        this.personIri = res[0].id;
        this.personEditDisabled = false;
        break;
      case 'lexia':
        this.lexia = res[0].label;
        this.lexiaIri = res[0].id;
        this.lexiaEditDisabled = false;
        break;
      case 'passage':
        this.passage = res[0].label;
        this.passageIri = res[0].id;
        this.passageEditDisabled = false;
        break;
      case 'book':
        this.book = res[0].label;
        this.bookIri = res[0].id;
        this.bookEditDisabled = false;
        break;
      case 'venue':
        this.venue = res[0].label;
        this.venueIri = res[0].id;
        this.venueEditDisabled = false;
        break;
    }
  }

  editCompany(): void {
    this.router.navigate(['/edit/company', this.companyIri]);
  }

  createCompany(): void {
    this.router.navigate(['/edit/company']);
  }

  editPerson(): void {
    this.router.navigate(['/edit/person', this.personIri]);
  }

  createPerson(): void {
    this.router.navigate(['/edit/person']);
  }

  editLexia(): void {
    this.router.navigate(['/edit/lexia', this.lexiaIri]);
  }

  createLexia(): void {
    this.router.navigate(['/edit/lexia']);
  }

  editPassage(): void {
    this.router.navigate(['/edit/passage', this.passageIri]);
  }

  createPassage(): void {
    this.router.navigate(['/edit/passage']);
  }

  editBook(): void {
    this.router.navigate(['/edit/book', this.bookIri]);
  }

  createBook(): void {
    this.router.navigate(['/edit/book']);
  }

  editVenue(): void {
    this.router.navigate(['/edit/venue', this.venueIri]);
  }

  createVenue(): void {
    this.router.navigate(['/edit/venue']);
  }

}

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
    <mat-card>
      <mat-card-title>Company</mat-card-title>
      <mat-card-content>
        <button mat-raised-button (click)="createCompany()">New</button><br><br>
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
                (click)="editCompany()">Edit</button>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>Person</mat-card-title>
      <mat-card-content>
        <button mat-raised-button (click)="createPerson()">New</button><br><br>
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
                (click)="editPerson()">Edit</button>
      </mat-card-content>
    </mat-card>

    <mat-card>
      <mat-card-title>Lexia</mat-card-title>
      <mat-card-content>
        <button mat-raised-button (click)="createLexia()">New</button><br><br>
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
                (click)="editLexia()">Edit</button>
      </mat-card-content>
    </mat-card>

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
    }
  }

  _handleLinkInput(what: string): void {
    switch(what) {
      case 'company':
        if (this.companyIri !== '') {
          this.companyIri = '';
        }
        this.companyEditDisabled = true;
        console.log(this.company);
        this.knoraService.getResourcesByLabel(this.company, this.knoraService.wwOntology + 'company').subscribe(
            res => {
              this.options = res;
              console.log('_handleLinkInput:res=', res);
            }
        );
        break;
      case 'person':
        if (this.personIri !== '') {
          this.personIri = '';
        }
        this.personEditDisabled = true;
        console.log(this.person);
        this.knoraService.getResourcesByLabel(this.person, this.knoraService.wwOntology + 'person').subscribe(
            res => {
              this.options = res;
              console.log('_handleLinkInput:res=', res);
            }
        );
        break;
      case 'lexia':
        if (this.lexiaIri !== '') {
          this.lexiaIri = '';
        }
        this.lexiaEditDisabled = true;
        console.log(this.lexia);
        this.knoraService.getResourcesByLabel(this.lexia, this.knoraService.wwOntology + 'lexia').subscribe(
            res => {
              this.options = res;
              console.log('_handleLinkInput:res=', res);
            }
        );
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
    }
    console.log('_optionSelected:res', res);
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
}

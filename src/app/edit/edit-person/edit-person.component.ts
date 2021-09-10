import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgControl, Validators} from '@angular/forms';
import {CompanyData, KnoraService, ListPropertyData, OptionType, PersonData} from '../../services/knora.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material/core';
import {combineLatest, forkJoin} from 'rxjs';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';

interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class PersonIds {
  public label: ValInfo;
  public internalId: ValInfo;
  public firstName: ValInfo;
  public lastName: ValInfo;
  public gender: ValInfo;
  public description: ValInfo;
  public birthDate: ValInfo;
  public deathDate: ValInfo;
  public extraInfo: ValInfo;
  public lexias: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.firstName = {id: undefined, changed: false, toBeDeleted: false};
    this.lastName = {id: undefined, changed: false, toBeDeleted: false};
    this.gender = {id: undefined, changed: false, toBeDeleted: false};
    this.description = {id: undefined, changed: false, toBeDeleted: false};
    this.birthDate = {id: undefined, changed: false, toBeDeleted: false};
    this.deathDate = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.lexias = [];
  }
}


@Component({
  selector: 'app-edit-person',
  template: `
    <mat-card>
      <mat-card-title>Person Editor</mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Label"
                 formControlName="label"
                 (input)="_handleInput('label')">
          <mat-error *ngIf="form.controls.label.errors?.required">Label erforderlich!</mat-error>
          <mat-error *ngIf="form.controls.label.errors?.minlength">Label muss mindestens aus 5 Buchstaben bestehen!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Internal ID"
                 formControlName="internalId"
                 (input)="_handleInput('internalId')">
          <mat-error *ngIf="form.controls.internalId.errors?.required">Internal ID required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.internalId.changed" mat-mini-fab (click)="_handleUndo('internalId')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Firstname"
                 formControlName="firstName"
                 (input)="_handleInput('firstName')">
        </mat-form-field>
        <button *ngIf="valIds.firstName.changed" mat-mini-fab (click)="_handleUndo('firstName')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.firstName.id !== undefined" mat-mini-fab (click)="_handleDelete('firstName')">
          <mat-icon *ngIf="!valIds.firstName.toBeDeleted" color="basic">delete</mat-icon>
          <mat-icon *ngIf="valIds.firstName.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Lastname"
                 formControlName="lastName"
                 (input)="_handleInput('lastName')">
          <mat-error *ngIf="form.controls.lastName.errors?.required">Lastname required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.lastName.changed" mat-mini-fab (click)="_handleUndo('lastName')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <mat-select matInput required
                      placeholder="Geschlecht"
                      formControlName="genderIri"
                      (selectionChange)="_handleInput('gender')">
            <mat-option *ngFor="let lt of genderTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.gender.changed" mat-mini-fab (click)="_handleUndo('gender')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Description"
                 formControlName="description"
                 (input)="_handleInput('description')">
          <mat-error *ngIf="form.controls.description.errors?.required">Description required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.description.changed" mat-mini-fab (click)="_handleUndo('description')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field appearance="fill" [style.width.px]=400>
          <mat-label>Enter a date range</mat-label>
          <mat-date-range-input [rangePicker]="picker" (change)="_handleInput('birthDate')" required>
            <input matStartDate
                   class="full-width"
                   placeholder="Birthdate (period start)"
                   formControlName="birthDateStart"
                   (dateChange)="_handleInput('birthDate')">
            <input matEndDate
                   class="full-width"
                   placeholder="Birthdate (period end)"
                   formControlName="birthDateEnd"
                   (dateChange)="_handleInput('birthDate')">
          </mat-date-range-input>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
          <mat-error *ngIf="form.controls.birthDateStart.errors?.required">Ungültiges Startdatum</mat-error>
          <mat-error *ngIf="form.controls.birthDateEnd.errors?.required">Ungültiges Enddatum</mat-error>
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.birthDate.changed" mat-mini-fab (click)="_handleUndo('birthDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.birthDate.id !== undefined" mat-mini-fab (click)="_handleDelete('birthDate')">
          <mat-icon *ngIf="!valIds.birthDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.birthDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field appearance="fill" [style.width.px]=400>
          <mat-label>Enter a date range</mat-label>
          <mat-date-range-input [rangePicker]="picker" (change)="_handleInput('deathDate')" required>
            <input matStartDate
                   class="full-width"
                   placeholder="Deathdate (period start)"
                   formControlName="deathDateStart"
                   (dateChange)="_handleInput('deathDate')">
            <input matEndDate
                   class="full-width"
                   placeholder="Deathdate (period end)"
                   formControlName="deathDateEnd"
                   (dateChange)="_handleInput('deathDate')">
          </mat-date-range-input>
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-date-range-picker #picker></mat-date-range-picker>
          <mat-error *ngIf="form.controls.deathDateStart.errors?.required">Invalid start date</mat-error>
          <mat-error *ngIf="form.controls.deathDateEnd.errors?.required">Invalid end date</mat-error>
        </mat-form-field>
        &nbsp;
        <button *ngIf="valIds.deathDate.changed" mat-mini-fab (click)="_handleUndo('deathDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.deathDate.id !== undefined" mat-mini-fab (click)="_handleDelete('deathDate')">
          <mat-icon *ngIf="!valIds.deathDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.deathDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Extra info"
                 formControlName="extraInfo"
                 (input)="_handleInput('extraInfo')">
        </mat-form-field>
        <button *ngIf="valIds.extraInfo.changed" mat-mini-fab (click)="_handleUndo('extraInfo')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.extraInfo.id !== undefined" mat-mini-fab (click)="_handleDelete('extraInfo')">
          <mat-icon *ngIf="!valIds.extraInfo.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.extraInfo.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="lexias">
          <mat-label>Lexias</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem">
              <input matInput [matAutocomplete]="autoLexia"
                     formControlName="lexiaName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Has lexia"
                     aria-label="Value"
                     (change)="_handleInput('lexias', i)"
                     (input)="_handleLinkInput('lexias', i)">
              <input matInput formControlName="lexiaIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoLexia="matAutocomplete" (optionSelected)="_optionSelected($event.option.value, 'lexias', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.lexias[i].changed" mat-mini-fab (click)="_handleUndo('lexias', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.lexias[i].id !== undefined" mat-mini-fab (click)="_handleDelete('lexias', i)">
              <mat-icon *ngIf="!valIds.lexias[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.lexias[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>

          </div>
          <button mat-mini-fab (click)="addLexia()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-card-content>
      <mat-card-actions>
        <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
        <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        <button *ngIf="inData.personIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
        <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
  ]
})

export class EditPersonComponent implements OnInit {
  controlType = 'EditPerson';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: PersonData = new PersonData('', '', '', '', {gender: '', genderIri: ''},
      '', new Date(), new Date(), new Date(), new Date(), '', []);
  working: boolean;
  public valIds: PersonIds = new PersonIds();
  public genderTypes: Array<OptionType>;


  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private dateAdapter: DateAdapter<Date>,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    console.log('EditPersonComponent.constructor');
    this.dateAdapter.setLocale('de'); // dd/MM/yyyy
    this.inData = {};
    this.working = false;
    this.genderTypes = knoraService.genderTypes;
  }

  @Input()
  get value(): PersonData | null {
    const lexias: FormArray = this.getLexias();
    const lexiaValues: { lexiaName: string; lexiaIri: string }[] = [];
    for (const x of lexias.controls) {
      lexiaValues.push(x.value);
    }
    return new PersonData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.firstName.value,
        this.form.controls.lastName.value,
        this.form.controls.gender.value, // ToDo: is this correct??
        this.form.controls.description.value,
        this.form.controls.birthDateStart.value,
        this.form.controls.birthDateEnd.value,
        this.form.controls.deathDateStart.value,
        this.form.controls.deathDateEnd.value,
        this.form.controls.extraInfo.value,
        lexiaValues,
    );
  }

  set value(knoraVal: PersonData | null) {
    const {
      label, internalId, firstName, lastName, gender, description, birthDateStart, birthDateEnd,
      deathDateStart, deathDateEnd, extraInfo, lexias
    }
        = knoraVal || new PersonData('', '', '', '', {gender: '', genderIri: ''},
        '', new Date(), new Date(), new Date(), new Date(), '', [{lexiaName: '', lexiaIri: ''}]);
    this.form.setValue({
      label, internalId, firstName, lastName, gender, description,
      birthDateStart, birthDateEnd, deathDateStart, deathDateEnd, extraInfo, lexias
    });
  }

  ngOnInit(): void {
    console.log('EditPersonComponent.ngOnInit');
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.personIri = arr[0].iri;
      }

      if (this.inData.personIri !== undefined) {
        this.knoraService.getResource(this.inData.personIri).subscribe((data) => {
          if (this.inData.personIri !== undefined) {
            console.log('DATA: ', data);
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.wwOntology + 'hasPersonInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasFirstName': {
                  this.form.controls.firstName.setValue(ele.values[0]);
                  this.valIds.firstName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.firstName = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasLastName': {
                  this.form.controls.lastName.setValue(ele.values[0]);
                  this.valIds.lastName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.lastName = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasGender': { // ToDo: Check if correct!!
                  const tmp = ele as ListPropertyData;
                  this.form.controls.genderIri.setValue(tmp.nodeIris[0]);
                  this.valIds.gender = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                  this.data.gender = {gender: tmp.values[0], genderIri: tmp.nodeIris[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'hasDescription': {
                  this.form.controls.description.setValue(ele.values[0]);
                  this.valIds.description = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.description = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasDescription': {
                  this.form.controls.description.setValue(ele.values[0]);
                  this.valIds.description = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.description = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasBirthDate': {
                  const regex = 'GREGORIAN:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE';
                  const found = ele.values[0].match(regex);
                  if (found !== null) {
                    const startYear = parseInt(found[1], 10);
                    const startMonth = parseInt(found[2], 10) - 1;
                    const startDay = parseInt(found[3], 10);
                    const startDate = new Date(startYear, startMonth, startDay);
                    this.form.controls.birthDateStart.setValue(startDate);
                    const endYear = parseInt(found[4], 10);
                    const endMonth = parseInt(found[5], 10) - 1;
                    const endDay = parseInt(found[6], 10);
                    const endDate = new Date(endYear, endMonth, endDay);
                    this.form.controls.birthDateEnd.setValue(endDate);
                    this.data.birthDateStart = startDate;
                    this.data.birthDateEnd = endDate;
                  }
                  this.valIds.birthDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                }
                case this.knoraService.wwOntology + 'hasDeathDate': {
                  const regex = 'GREGORIAN:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE';
                  const found = ele.values[0].match(regex);
                  if (found !== null) {
                    const startYear = parseInt(found[1], 10);
                    const startMonth = parseInt(found[2], 10) - 1;
                    const startDay = parseInt(found[3], 10);
                    const startDate = new Date(startYear, startMonth, startDay);
                    this.form.controls.deathDateStart.setValue(startDate);
                    const endYear = parseInt(found[4], 10);
                    const endMonth = parseInt(found[5], 10) - 1;
                    const endDay = parseInt(found[6], 10);
                    const endDate = new Date(endYear, endMonth, endDay);
                    this.form.controls.deathDateEnd.setValue(endDate);
                    this.data.deathDateStart = startDate;
                    this.data.deathDateStart = endDate;
                  }
                  this.valIds.deathDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                }
                case this.knoraService.wwOntology + 'hasPersonExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'isLexiaPersonValue': {
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addLexia({lexiaName: ele.values[i], lexiaIri: ele.ids[i]});
                  }
                  break;
                }
              }
            }
          }
        });
      }

      //this.memberItems = this.fb.array([this.fb.group({memberName: '', memberIri: ''})]);
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        firstName: [this.data.firstName, []],
        lastName: [this.data.lastName, [Validators.required]],
        genderIri: [this.data.gender.genderIri, [Validators.required]],
        description: [this.data.description, [Validators.required]],
        birthDateStart: [this.data.birthDateStart, []],
        birthDateEnd: [this.data.birthDateEnd, []],
        deathDateStart: [this.data.deathDateStart, []],
        deathDateEnd: [this.data.deathDateEnd, []],
        internalId: [this.data.internalId, [Validators.required]],
        extraInfo: this.data.extraInfo,
        lexias: this.fb.array([
          /*this.fb.group({lexiaName: '', lexiaIri: ''}),*/
        ]),
      });
      console.log(this.form);
    });
  }

  getLexias() {
    return this.form.controls.lexias as FormArray;
  }

  addLexia(lexia?: { lexiaName: string; lexiaIri: string }) {
    const lexias = this.getLexias();
    if (lexia === undefined) {
      lexias.push(this.fb.group({lexiaName: '', lexiaIri: ''}));
      this.data.lexias.push({lexiaName: '', lexiaIri: ''});
      this.valIds.lexias.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      lexias.push(this.fb.group({lexiaName: lexia.lexiaName, lexiaIri: lexia.lexiaIri}));
      this.data.lexias.push({lexiaName: lexia.lexiaName, lexiaIri: lexia.lexiaIri});
      this.valIds.lexias.push({id: lexia.lexiaIri, changed: false, toBeDeleted: false});
    }
  }

  onChange = (_: any) => {};

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'lexias':
        const lexias = this.getLexias();
        const lexiaName = lexias.value[index].lexiaName;

        this.valIds.lexias[index].changed = true;
        this.knoraService.getResourcesByLabel(lexiaName, this.knoraService.wwOntology + 'lexia').subscribe(
            res => {
              this.options = res;
              this.form.value.lexias[index].lexiaName = res[0].label;
              this.form.value.lexias[index].lexiaIri =  res[0].id;
            }
        );
        break;
    }
  }

  _optionSelected(val: any, what: string, index?: number): void {
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    switch(what) {
      case 'lexias':
        this.form.value.lexias[index].lexiaName = res[0].label;
        this.form.value.lexias[index].lexiaIri =  res[0].id;
        this.value = new PersonData(
            this.form.value.label,
            this.form.value.internalId,
            this.form.value.firstName,
            this.form.value.lastName,
            this.form.value.gender,
            this.form.value.description,
            this.form.value.birthDateStart,
            this.form.value.birthDateEnd,
            this.form.value.deathDateStart,
            this.form.value.deathDateEnd,
            this.form.value.extraInfo,
            this.form.value.lexias,
        );
        break;
    }
  }

  _handleInput(what: string, index?: number): void {
    this.onChange(this.form.value);
    switch (what) {
      case 'label':
        this.valIds.label.changed = true;
        break;
      case 'internalId':
        this.valIds.internalId.changed = true;
        break;
      case 'firstName':
        this.valIds.firstName.changed = true;
        break;
      case 'lastName':
        this.valIds.lastName.changed = true;
        break;
      case 'gender':
        this.valIds.gender.changed = true;
        break;
      case 'description':
        this.valIds.description.changed = true;
        break;
      case 'birthDate':
        this.valIds.birthDate.changed = true;
        break;
      case 'deathDate':
        this.valIds.deathDate.changed = true;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.changed = true;
        break;
      case 'lexias':
        this.valIds.lexias[index].changed = true;
        break;
    }
  }

  _handleDelete(what: string, index?: number): void {
    switch (what) {
      case 'firstName':
        this.valIds.firstName.toBeDeleted = !this.valIds.firstName.toBeDeleted;
        console.log('_handleDelete("firstName")');
        break;
      case 'birthDate':
        this.valIds.birthDate.toBeDeleted = !this.valIds.birthDate.toBeDeleted;
        console.log('_handleDelete("birthDate")');
        break;
      case 'deathDate':
        this.valIds.deathDate.toBeDeleted = !this.valIds.deathDate.toBeDeleted;
        console.log('_handleDelete("deathDate")');
        break;
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
        console.log('_handleDelete("extraInfo")');
        break;
      case 'lexias':
        this.valIds.lexias[index].toBeDeleted = !this.valIds.lexias[index].toBeDeleted;
        break;
    }

  }

  _handleUndo(what: string, index?: number): void {
    switch (what) {
      case 'label':
        this.form.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      case 'internalId':
        this.form.controls.internalId.setValue(this.data.internalId);
        this.valIds.internalId.changed = false;
        break;
      case 'firstName':
        this.form.controls.firstName.setValue(this.data.firstName);
        this.valIds.firstName.changed = false;
        break;
      case 'lastName':
        this.form.controls.lastName.setValue(this.data.lastName);
        this.valIds.lastName.changed = false;
        break;
      case 'gender':
        this.form.controls.gender.setValue(this.data.gender);
        this.valIds.gender.changed = false;
        break;
      case 'description':
        this.form.controls.description.setValue(this.data.description);
        this.valIds.description.changed = false;
        break;
      case 'birthDate':
        this.form.controls.birthDateStart.setValue(this.data.birthDateStart);
        this.form.controls.birthDateEnd.setValue(this.data.birthDateEnd);
        this.valIds.birthDate.changed = false;
        break;
      case 'deathDate':
        this.form.controls.deathDateStart.setValue(this.data.deathDateStart);
        this.form.controls.deathDateEnd.setValue(this.data.deathDateEnd);
        this.valIds.deathDate.changed = false;
        break;
      case 'extraInfo':
        this.form.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
      case 'lexias':
        console.log(this.data.lexias);
        console.log('== index:', index);
        this.getLexias().controls[index].setValue(this.data.lexias[index]);
        this.valIds.lexias[index].changed = false;
        break;
    }
  }

  save(): void {
    console.log('this.value:', this.value);

  }

  delete(): void {
    const confirmationConfig = new MatDialogConfig();
    confirmationConfig.autoFocus = true;
    confirmationConfig.disableClose = true;
    confirmationConfig.data = {
      title: 'Delete company',
      text: 'Do You really want to delete this comapany?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        console.log('lastmod', this.lastmod);
        this.knoraService.deleteResource(this.resId, 'person', this.lastmod, data.comment).subscribe(
            res => {
              this.working = false;
              this.location.back();
            },
            error => {
              this.snackBar.open('Error while deleting the company entry!', 'OK');
              console.log('deleteResource:ERROR:: ', error);
              this.working = false;
              this.location.back();
            });
      }
    });

  }
}
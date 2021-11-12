import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgControl, Validators} from '@angular/forms';
import {CompanyData, KnoraService, ListPropertyData, OptionType, PersonData} from '../../services/knora.service';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DateAdapter} from '@angular/material/core';
import {combineLatest, concat, forkJoin, Observable, of} from 'rxjs';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';
import {DateValue, DateValueComponent} from '../date-value/date-value.component';
import {toArray} from "rxjs/operators";

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
    <mat-card  class="maxw" >
      <mat-card-title>Person Editor</mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=600>
          <input matInput required
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

        <mat-form-field [style.width.px]=600>
          <input matInput required
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

        <mat-form-field [style.width.px]=600>
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

        <mat-form-field [style.width.px]=600>
          <input matInput required
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

        <mat-form-field [style.width.px]=600>
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

        <mat-form-field [style.width.px]=600>
          <input matInput required
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
        &nbsp;
        <mat-form-field appearance="fill"  [style.width.px]=600>
          <mat-label>Birthdate</mat-label>
          <app-knora-date-value matInput
                                formControlName="birthDate"
                                (ngModelChange)="_handleInput('birthDate')"></app-knora-date-value>
        </mat-form-field>
        <button *ngIf="valIds.birthDate.changed" mat-mini-fab (click)="_handleUndo('birthDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.birthDate.id !== undefined" mat-mini-fab (click)="_handleDelete('birthDate')">
          <mat-icon *ngIf="!valIds.birthDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.birthDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field appearance="fill"  [style.width.px]=600>
          <mat-label>Deathdate</mat-label>
          <app-knora-date-value matInput
                                formControlName="deathDate"
                                (ngModelChange)="_handleInput('deathDate')"></app-knora-date-value>
        </mat-form-field>&nbsp;
        <button *ngIf="valIds.deathDate.changed" mat-mini-fab (click)="_handleUndo('deathDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.deathDate.id !== undefined" mat-mini-fab (click)="_handleDelete('deathDate')">
          <mat-icon *ngIf="!valIds.deathDate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.deathDate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=600>
          <input matInput
                 class="full-width"
                 placeholder="Extra info"
                 formControlName="extraInfo"
                 (input)="_handleInput('extraInfo')">
        </mat-form-field>
        <button *ngIf="valIds.extraInfo.changed" mat-mini-fab (click)="_handleUndo('extraInfo')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.extraInfo.id !== undefined" mat-mini-fab (click)="_handleDelete('extraInfo')">
          <mat-icon *ngIf="!valIds.extraInfo.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.extraInfo.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="lexias">
          <mat-label>Lexias &rarr; (lexia)</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem"  [style.width.px]=600>
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
            <button *ngIf="valIds.lexias[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('lexias', i)">
              <mat-icon *ngIf="!valIds.lexias[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.lexias[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.lexias[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('lexias', i)">
              <mat-icon *ngIf="!valIds.lexias[i].toBeDeleted" color="basic">delete</mat-icon>
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
    '.maxw { min-width: 500px; max-width: 1000px; }',
  ]
})

export class EditPersonComponent implements OnInit {
  controlType = 'EditPerson';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: PersonData = new PersonData('', '', '', '', '',
      '', new DateValue(), new DateValue(), '', []);
  nLexias: number;
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
    this.dateAdapter.setLocale('de'); // dd/MM/yyyy
    this.inData = {};
    this.working = false;
    this.genderTypes = knoraService.genderTypes;
    this.nLexias = 0;
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
        this.form.controls.genderIri.value,
        this.form.controls.description.value,
        this.form.controls.birthDate.value,
        this.form.controls.deathDate.value,
        this.form.controls.extraInfo.value,
        lexiaValues,
    );
  }

  set value(knoraVal: PersonData | null) {
    const {
      label, internalId, firstName, lastName, genderIri, description, birthDate, deathDate, extraInfo, lexias
    }
        = knoraVal || new PersonData('', '', '', '', '',
        '', new DateValue(), new DateValue(), '', [{lexiaName: '', lexiaIri: ''}]);
    this.form.setValue({
      label, internalId, firstName, lastName, genderIri, description, birthDate, deathDate, extraInfo, lexias
    });
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.personIri = arr[0].iri;
      }

      if (this.inData.personIri !== undefined) {
        this.knoraService.getResource(this.inData.personIri).subscribe((data) => {
          if (this.inData.personIri !== undefined) {
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
                  this.data.genderIri = tmp.nodeIris[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasDescription': {
                  this.form.controls.description.setValue(ele.values[0]);
                  this.valIds.description = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.description = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasBirthDate': {
                  const dateValue = DateValue.parseDateValueFromKnora(ele.values[0]);
                  console.log('dateValue', dateValue);
                  this.form.controls.birthDate.setValue(dateValue);
                  this.valIds.birthDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.birthDate = dateValue;
                  break;
                }
                case this.knoraService.wwOntology + 'hasDeathDate': {
                  const dateValue = DateValue.parseDateValueFromKnora(ele.values[0]);
                  this.form.controls.deathDate.setValue(dateValue);
                  this.valIds.deathDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.deathDate = dateValue;
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
        genderIri: [this.data.genderIri, [Validators.required]],
        description: [this.data.description, [Validators.required]],
        birthDate: [this.data.birthDate, []],
        deathDate: [this.data.deathDate, []],
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
    this.nLexias++;
  }

  removeLexia(index: number): void {
    const tmp = this.getLexias();
    tmp.removeAt(index);
    this.valIds.lexias.splice(index, 1);
    this.data.lexias.splice(index, 1);
    this.nLexias--;
  }

  onChange = (_: any) => {};

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'lexias':
        const lexias = this.getLexias();
        const lexiaName = lexias.value[index].lexiaName;

        this.valIds.lexias[index].changed = true;
        if (lexiaName.length >= 3) {
          this.knoraService.getResourcesByLabel(lexiaName, this.knoraService.wwOntology + 'lexia').subscribe(
              res => {
                this.options = res;
                this.form.value.lexias[index].lexiaName = res[0].label;
                this.form.value.lexias[index].lexiaIri =  res[0].id;
              }
          );
        }
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
            this.form.value.birthDate,
            //this.form.value.birthDateEnd,
            this.form.value.deathDate,
            //this.form.value.deathDateEnd,
            this.form.value.extraInfo,
            this.form.value.lexias,
        );
        break;
    }
    this.options = [];
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
        if (this.valIds.lexias[index].id !== undefined) {
          this.valIds.lexias[index].toBeDeleted = !this.valIds.lexias[index].toBeDeleted;
          if (this.valIds.lexias[index].toBeDeleted) {
            this.nLexias--;
          } else {
            this.nLexias++;
          }
        } else {
          this.removeLexia(index);
        }
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
        this.form.controls.gender.setValue(this.data.genderIri);
        this.valIds.gender.changed = false;
        break;
      case 'description':
        this.form.controls.description.setValue(this.data.description);
        this.valIds.description.changed = false;
        break;
      case 'birthDate':
        this.form.controls.birthDate.setValue(this.data.birthDate);
        //this.form.controls.birthDateEnd.setValue(this.data.birthDateEnd);
        this.valIds.birthDate.changed = false;
        break;
      case 'deathDate':
        this.form.controls.deathDate.setValue(this.data.deathDate);
        //this.form.controls.deathDateEnd.setValue(this.data.deathDateEnd);
        this.valIds.deathDate.changed = false;
        break;
      case 'extraInfo':
        this.form.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
      case 'lexias':
        this.getLexias().controls[index].setValue(this.data.lexias[index]);
        this.valIds.lexias[index].changed = false;
        break;
    }
  }

  save(): void {
    this.working = true;
    console.log('this.value:', this.value);
    if (this.inData.personIri === undefined) {
      this.knoraService.createPerson(this.value).subscribe(
          res => {
            console.log('CREATE_RESULT:', res);
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Error storing the person object!', 'OK');
            console.log('EditPerson.save(): ERROR', error);
            this.working = false;
            this.location.back();
          }
      );
    } else {
      console.log('this.valIds:', this.valIds);

      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
            this.resId,
            this.knoraService.wwOntology + 'company',
            this.form.value.label,
            this.lastmod);
        obs.push(gaga);
      }

      if (this.valIds.internalId.toBeDeleted && this.valIds.internalId.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasPersonInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasPersonInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasPersonInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      if (this.valIds.firstName.toBeDeleted && this.valIds.firstName.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.firstName.id as string,
            this.knoraService.wwOntology + 'hasFirstName');
        obs.push(gaga);
      } else if (this.valIds.firstName.changed) {
        let gaga: Observable<string>;
        if (this.valIds.firstName.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasFirstName',
              this.value.firstName);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.firstName.id as string,
              this.knoraService.wwOntology + 'hasFirstName',
              this.value.firstName);
        }
        obs.push(gaga);
      }

      if (this.valIds.lastName.toBeDeleted && this.valIds.lastName.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.lastName.id as string,
            this.knoraService.wwOntology + 'hasLastName');
        obs.push(gaga);
      } else if (this.valIds.lastName.changed) {
        let gaga: Observable<string>;
        if (this.valIds.lastName.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasLastName',
              this.value.lastName);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.lastName.id as string,
              this.knoraService.wwOntology + 'hasLastName',
              this.value.lastName);
        }
        obs.push(gaga);
      }

      if (this.valIds.gender.toBeDeleted && this.valIds.gender.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteListValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.gender.id as string,
            this.knoraService.wwOntology + 'hasGender');
        obs.push(gaga);
      } else if (this.valIds.gender.changed) {
        let gaga: Observable<string>;
        if (this.valIds.gender.id === undefined) {
          gaga = this.knoraService.createListValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasGender',
              this.form.value.genderIri);
        } else {
          gaga = this.knoraService.updateListValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.gender.id as string,
              this.knoraService.wwOntology + 'hasGender',
              this.form.value.genderIri);
        }
        obs.push(gaga);
      }

      if (this.valIds.description.toBeDeleted && this.valIds.description.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.description.id as string,
            this.knoraService.wwOntology + 'hasDescription');
        obs.push(gaga);
      } else if (this.valIds.description.changed) {
        let gaga: Observable<string>;
        if (this.valIds.description.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasDescription',
              this.value.description);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.description.id as string,
              this.knoraService.wwOntology + 'hasDescription',
              this.value.description);
        }
        obs.push(gaga);
      }

      if (this.valIds.birthDate.toBeDeleted && this.valIds.birthDate.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteDateValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.birthDate.id as string,
            this.knoraService.wwOntology + 'hasBirthDate');
        obs.push(gaga);
      } else if (this.valIds.birthDate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.birthDate.id === undefined) {
          const birthDate = this.form.value.birthDate;
          const birthDateValue = new DateValue(
              birthDate.calendar,
              birthDate.timeSpan,
              birthDate.startYear,
              birthDate.startMonth,
              birthDate.startDay,
              birthDate.endYear,
              birthDate.endMonth,
              birthDate.endDay);
          gaga = this.knoraService.createDateValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasBirthDate',
              birthDateValue);
          console.log('gaga:', gaga);
        } else {
          const birthDate = this.form.value.birthDate;
          const birthDateValue = new DateValue(
              birthDate.calendar,
              birthDate.timeSpan,
              birthDate.startYear,
              birthDate.startMonth,
              birthDate.startDay,
              birthDate.endYear,
              birthDate.endMonth,
              birthDate.endDay);
          console.log('CHANGED:', birthDateValue);
          gaga = this.knoraService.updateDateValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.birthDate.id as string,
              this.knoraService.wwOntology + 'hasBirthDate',
              birthDateValue);
        }
        obs.push(gaga);
      }

      if (this.valIds.deathDate.toBeDeleted && this.valIds.deathDate.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteDateValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.deathDate.id as string,
            this.knoraService.wwOntology + 'hasDeathDate');
        obs.push(gaga);
      } else if (this.valIds.deathDate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.deathDate.id === undefined) {
          const deathDate = this.form.value.deathDate;
          const deathDateValue = new DateValue(
              deathDate.calendar,
              deathDate.timeSpan,
              deathDate.startYear,
              deathDate.startMonth,
              deathDate.startDay,
              deathDate.endYear,
              deathDate.endMonth,
              deathDate.endDay);
          gaga = this.knoraService.createDateValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasDeathDate',
              deathDateValue);
          console.log('gaga:', gaga);
        } else {
          const deathDate = this.form.value.deathDate;
          const deathDateValue = new DateValue(
              deathDate.calendar,
              deathDate.timeSpan,
              deathDate.startYear,
              deathDate.startMonth,
              deathDate.startDay,
              deathDate.endYear,
              deathDate.endMonth,
              deathDate.endDay);
          console.log('CHANGED:', deathDateValue);
          gaga = this.knoraService.updateDateValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.deathDate.id as string,
              this.knoraService.wwOntology + 'hasDeathDate',
              deathDateValue);
        }
        obs.push(gaga);
      }

      console.log('this.valIds.extraInfo:', this.valIds.extraInfo);
      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'person',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasPersonExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.knoraService.wwOntology + 'hasPersonExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasPersonExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.lexias) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'person',
              valId.id as string,
              this.knoraService.wwOntology + 'isLexiaPersonValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'person',
                this.knoraService.wwOntology + 'isLexiaPersonValue',
                this.value.lexias[index].lexiaIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'person',
                valId.id as string,
                this.knoraService.wwOntology + 'isLexiaPersonValue',
                this.value.lexias[index].lexiaIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      concat(...obs).pipe(toArray()).subscribe(res => {
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Fehler beim Speichern der Daten des person-Eintrags!', 'OK');
            this.working = false;
            this.location.back();
          });

    }
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

import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, forkJoin, Observable} from 'rxjs';
import {CompanyData, KnoraService, LexiaData, OptionType} from "../../services/knora.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';
import {DateValue} from '../date-value/date-value.component';


interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class LexiaIds {
  public label: ValInfo;
  public title: ValInfo;
  public internalId: ValInfo;
  public formalClasses: ValInfo[];
  public images: ValInfo[];
  public displayedTitle: ValInfo;
  public extraInfo: ValInfo;

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.formalClasses = [];
    this.images = [];
    this.displayedTitle = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
  }
}

@Component({
  selector: 'app-edit-lexia',
  template: `
  <mat-card>
    <mat-card-title>Lexia Editor</mat-card-title>
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
               placeholder="Title"
               formControlName="title"
               (input)="_handleInput('title')">
        <mat-error *ngIf="form.controls.title.errors?.required">Title required!</mat-error>
        <mat-error *ngIf="form.controls.title.errors?.minlength">Title must have at least 5 characters!</mat-error>
      </mat-form-field>
      <button *ngIf="valIds.title.changed" mat-mini-fab (click)="_handleUndo('title')">
        <mat-icon color="warn">cached</mat-icon>
      </button>
      <br/>

      <mat-form-field [style.width.px]=400>
        <input matInput
               class="full-width"
               placeholder="Internald id"
               formControlName="internalId"
               (input)="_handleInput('internalId')">
        <mat-error *ngIf="form.controls.internalId.errors?.required">Internal id required!</mat-error>
      </mat-form-field>
      <button *ngIf="valIds.internalId.changed" mat-mini-fab (click)="_handleUndo('internalId')">
        <mat-icon color="warn">cached</mat-icon>
      </button>
      <br/>

      <div formArrayName="formalClasses">
        <mat-label>Formal class</mat-label>
        <div *ngFor="let formalClassItem of getFormalClasses().controls; let i=index">
          <mat-form-field [style.width.px]=600>
            <mat-select matInput required
                        placeholder="formalClass"
                        formControlName="formalClassIri"
                        (selectionChange)="_handleInput('formalClass', i)">
              <mat-option *ngFor="let lt of formalClassTypes" [value]="lt.iri">
                {{lt.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button *ngIf="valIds.formalClass.changed" mat-mini-fab (click)="_handleUndo('formalClass')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
        </div>
      </div>

      <br/>

    </mat-card-content>
  </mat-card>
  `,
  styles: [
  ]
})
export class EditLexiaComponent implements OnInit {
  controlType = 'EditLexia';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: LexiaData = new LexiaData('', '', '', [], [],
      '', '');
  working: boolean;
  public valIds: LexiaIds = new LexiaIds();
  public formalClassTypes: Array<OptionType>;
  public imageTypes: Array<OptionType>;

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) { }

  @Input()
  get value(): LexiaData | null {
    const formalClasses: FormArray = this.getFormalClasses();
    const formalClassIriValues: string[] = [];
    for (const x of formalClasses.controls) {
      formalClassIriValues.push(x.value);
    }
    return new LexiaData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.title.value,
        formalClassIriValues,
        [],
        '',
        this.form.controls.extraInfo.value
    );
  }

  set value(knoraVal: LexiaData | null) {
    const {label, internalId, title, formalClassIris, imageIris, extraInfo}
        = knoraVal || new LexiaData('', '', '', [],
        [], '');
    this.form.setValue({label, internalId, title, formalClassIris, imageIris, extraInfo});
  }

  ngOnInit(): void {
    this.inData = {};
    this.working = false;
  }

  getFormalClasses() {
    return this.form.controls.formalClasses as FormArray;
  }

  addFormalClass(formalClassIri?: string) {
    const formalClassIris = this.getFormalClasses();
    if (formalClassIri === undefined) {
      formalClassIris.push(this.fb.group({formalClassIri: ''}));
      this.data.formalClassIris.push('');
      this.valIds.formalClasses.push({id: undefined, changed: false, toBeDeleted: false});
    }
    else {
      formalClassIris.push(this.fb.group({formalClassIri}));
      this.data.formalClassIris.push(formalClassIri);
      this.valIds.formalClasses.push({id: formalClassIri, changed: false, toBeDeleted: false});
    }
    console.log('addFormalClass::', this.data.formalClassIris);
  }


}

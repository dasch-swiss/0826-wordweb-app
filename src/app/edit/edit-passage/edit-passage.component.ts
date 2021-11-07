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
import {
  CompanyData,
  KnoraService,
  LexiaData,
  ListPropertyData,
  OptionType,
  PassageData
} from "../../services/knora.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';


interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class PassageIds {
  public label: ValInfo;
  public internalId: ValInfo;
  public displayedTitle: ValInfo;
  public functionVoices: ValInfo[];
  public markings: ValInfo[];
  public researchField: ValInfo;
  public status: ValInfo;
  public text: ValInfo;
  public occursIn: ValInfo;
  public contributedBy: ValInfo;
  public contains: ValInfo[];
  public internalComments: ValInfo[];
  public page: ValInfo;
  public pageHist: ValInfo;
  public comment: ValInfo;
  public extraInfo: ValInfo;
  public prefixTitle: ValInfo;
  public textHist: ValInfo;
  public mentionedIn: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.displayedTitle = {id: undefined, changed: false, toBeDeleted: false};
    this.functionVoices = [];
    this.markings = [];
    this.researchField = {id: undefined, changed: false, toBeDeleted: false};
    this.status = {id: undefined, changed: false, toBeDeleted: false};
    this.text = {id: undefined, changed: false, toBeDeleted: false};
    this.occursIn = {id: undefined, changed: false, toBeDeleted: false};
    this.contributedBy = {id: undefined, changed: false, toBeDeleted: false};
    this.contains = [];
    this.internalComments = [];
    this.page = {id: undefined, changed: false, toBeDeleted: false};
    this.pageHist = {id: undefined, changed: false, toBeDeleted: false};
    this.comment = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.prefixTitle = {id: undefined, changed: false, toBeDeleted: false};
    this.textHist = {id: undefined, changed: false, toBeDeleted: false};
    this.mentionedIn = [];
  }
}

@Component({
  selector: 'app-edit-passage',
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
                 placeholder="Internald id"
                 formControlName="internalId"
                 (input)="_handleInput('internalId')">
          <mat-error *ngIf="form.controls.internalId.errors?.required">Internal id required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.internalId.changed" mat-mini-fab (click)="_handleUndo('internalId')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Displayed Title"
                 formControlName="displayedTitle"
                 (input)="_handleInput('displayedTitle')">
        </mat-form-field>
        <button *ngIf="valIds.displayedTitle.changed" mat-mini-fab (click)="_handleUndo('displayedTitle')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.displayedTitle.id !== undefined" mat-mini-fab (click)="_handleDelete('displayedTitle')">
          <mat-icon *ngIf="!valIds.displayedTitle.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.displayedTitle.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="markings">
          <mat-label>Markings</mat-label>
          <div *ngFor="let markingItem of getMArkings().controls; let i=index">
            <mat-form-field [formGroup]="markingItem" [style.width.px]=300>
              <mat-select matInput
                          placeholder="marking"
                          formControlName="markingIri"
                          (selectionChange)="_handleInput('markings', i)">
                <mat-option *ngFor="let lt of markingTypes" [value]="lt.iri">
                  {{lt.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <button *ngIf="valIds.markings[i].changed" mat-mini-fab (click)="_handleUndo('makrings', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.markings[i].id !== undefined && (nMarkings > 1 || valIds.markings[i].toBeDeleted)"
                    mat-mini-fab (click)="_handleDelete('markings', i)">
              <mat-icon *ngIf="!valIds.markings[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.markings[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.markings[i].id === undefined && nMarkings > 1"
                    mat-mini-fab (click)="_handleDelete('markings', i)">
              <mat-icon *ngIf="!valIds.markings[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addMarking()">
            <mat-icon>add</mat-icon>
          </button>

        </div>
        <br/>
        <div>&nbsp;</div>
        
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})
export class EditPassageComponent implements OnInit {
  controlType = 'EditPassage';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: PassageData = new PassageData('', '', '',[], [], '',
      '', '', {occursInName: '', occursInIri: ''},
      {contributedByName: '', contributedByIri: ''}, [], '', '', '',
      '', '', '', '', []);
  nFunctionVoices: number;
  nMarkings: number;
  nContains: number;
  working: boolean;
  public valIds: PassageIds = new PassageIds();
  public functionVoiceTypes: Array<OptionType>;
  public markingTypes: Array<OptionType>;
  public researchFieldTypes: Array<OptionType>;
  public statusTypes: Array<OptionType>;

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
    this.functionVoiceTypes = knoraService.functionVoiceTypes;
    this.markingTypes = knoraService.markingTypes;
    this.researchFieldTypes = knoraService.researchFieldTypes;
    this.statusTypes = knoraService.statusTypes;
    this.nFunctionVoices = 0;
    this.nMarkings = 0;
    this.nContains = 0;
  }

  ngOnInit(): void {
  }

}

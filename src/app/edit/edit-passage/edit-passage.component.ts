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
import {combineLatest, concat, forkJoin, Observable} from 'rxjs';
import {
  CompanyData,
  KnoraService,
  LexiaData,
  ListPropertyData,
  OptionType,
  PassageData
} from '../../services/knora.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';
import {toArray} from "rxjs/operators";


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
  public internalComment: ValInfo;
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
    this.internalComment = {id: undefined, changed: false, toBeDeleted: false};
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
      <mat-card-title>Passage Editor</mat-card-title>
      <mat-card-content [formGroup]="form">
        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Label"
                 formControlName="label"
                 (input)="_handleInput('label')">
          <mat-error *ngIf="form.controls.label.errors?.required">Label erforderlich!</mat-error>
          <mat-error *ngIf="form.controls.label.errors?.minlength">Label muss mindestens aus 5 Buchstaben bestehen!
          </mat-error>
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Internal id"
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

        <div formArrayName="functionVoices">
          <mat-label>Function voices</mat-label>
          <div *ngFor="let functionVoiceItem of getFunctionVoices().controls; let i=index">
            <mat-form-field [formGroup]="functionVoiceItem" [style.width.px]=300>
              <mat-select matInput
                          placeholder="functionVoices"
                          formControlName="functionVoiceIri"
                          (selectionChange)="_handleInput('functionVoices', i)">
                <mat-option *ngFor="let lt of functionVoiceTypes" [value]="lt.iri">
                  {{lt.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <button *ngIf="valIds.functionVoices[i].changed" mat-mini-fab (click)="_handleUndo('functionVoices', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button
                *ngIf="valIds.functionVoices[i].id !== undefined && (nFunctionVoices > 1 || valIds.functionVoices[i].toBeDeleted)"
                mat-mini-fab (click)="_handleDelete('functionVoices', i)">
              <mat-icon *ngIf="!valIds.functionVoices[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.functionVoices[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.functionVoices[i].id === undefined && nFunctionVoices > 1"
                    mat-mini-fab (click)="_handleDelete('functionVoices', i)">
              <mat-icon *ngIf="!valIds.functionVoices[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addFunctionVoice()">
            <mat-icon>add</mat-icon>
          </button>

        </div>
        <br/>
        <div>&nbsp;</div>

        <div formArrayName="markings">
          <mat-label>Markings</mat-label>
          <div *ngFor="let markingItem of getMarkings().controls; let i=index">
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
            <button *ngIf="valIds.markings[i].changed" mat-mini-fab (click)="_handleUndo('markings', i)">
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

        <mat-form-field [style.width.px]=600>
          <mat-select matInput required
                      placeholder="Research field"
                      formControlName="researchField"
                      (selectionChange)="_handleInput('researchField')">
            <mat-option *ngFor="let lt of researchFieldTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.researchField.changed" mat-mini-fab (click)="_handleUndo('researchField')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=600>
          <mat-select matInput required
                      placeholder="Status"
                      formControlName="status"
                      (selectionChange)="_handleInput('status')">
            <mat-option *ngFor="let lt of statusTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.status.changed" mat-mini-fab (click)="_handleUndo('status')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=600>
          <textarea matInput text required
                 class="full-width tarows"
                 placeholder="Text"
                 formControlName="text"
                    (input)="_handleInput('text')"></textarea>
          <mat-error *ngIf="form.controls.text.errors?.required">Text erforderlich!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('text')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]="400">
          <input matInput [matAutocomplete]="autoOccursIn"
                 required
                 formControlName="occursInName"
                 class="knora-link-input-element klnkie-val full-width"
                 placeholder="Occurs in (book)"
                 aria-label="Value"
                 (change)="_handleInput('occursIn')"
                 (input)="_handleLinkInput('occursIn')">
          <input matInput formControlName="occursInIri" [hidden]="true" ><br/>
          <mat-autocomplete #autoOccursIn="matAutocomplete" (optionSelected)="_optionSelected($event.option.value, 'occursIn')">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <button *ngIf="valIds.occursIn.changed" mat-mini-fab (click)="_handleUndo('occursIn')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]="400">
          <input matInput [matAutocomplete]="autoContributedBy"
                 required
                 formControlName="contributedByName"
                 class="knora-link-input-element klnkie-val full-width"
                 placeholder="Contributed by (person)"
                 aria-label="Value"
                 (change)="_handleInput('contributedBy')"
                 (input)="_handleLinkInput('contributedBy')">
          <input matInput formControlName="contributedByIri" [hidden]="true" ><br/>
          <mat-autocomplete #autoContributedBy="matAutocomplete" (optionSelected)="_optionSelected($event.option.value, 'contributedBy')">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <button *ngIf="valIds.contributedBy.changed" mat-mini-fab (click)="_handleUndo('contributedBy')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <div formArrayName="contains">
          <mat-label>Contains (lexias)</mat-label>
          <div *ngFor="let containsItem of getContains().controls; let i=index">
            <mat-form-field [formGroup]="containsItem">
              <input matInput [matAutocomplete]="autoContains"
                     required
                     formControlName="containsName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Contains (lexia)"
                     aria-label="Value"
                     (change)="_handleInput('contains', i)"
                     (input)="_handleLinkInput('contains', i)">
              <input matInput formControlName="containsIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoContains="matAutocomplete" (optionSelected)="_optionSelected($event.option.value, 'contains', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.contains[i].changed" mat-mini-fab (click)="_handleUndo('contains', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.contains[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('contains', i)">
              <mat-icon *ngIf="!valIds.contains[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.contains[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.contains[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('contains', i)">
              <mat-icon *ngIf="!valIds.contains[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addContains()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div>&nbsp;</div>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Internal comment"
                 formControlName="internalComment"
                 (input)="_handleInput('internalComment')">
        </mat-form-field>
        <button *ngIf="valIds.internalComment.changed" mat-mini-fab (click)="_handleUndo('internalComment')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.internalComment.id !== undefined" mat-mini-fab (click)="_handleDelete('internalComment')">
          <mat-icon *ngIf="!valIds.internalComment.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.internalComment.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Page"
                 formControlName="page"
                 (input)="_handleInput('page')">
        </mat-form-field>
        <button *ngIf="valIds.page.changed" mat-mini-fab (click)="_handleUndo('page')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.page.id !== undefined" mat-mini-fab (click)="_handleDelete('page')">
          <mat-icon *ngIf="!valIds.page.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.page.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Page history"
                 formControlName="pageHist"
                 (input)="_handleInput('pageHist')">
        </mat-form-field>
        <button *ngIf="valIds.pageHist.changed" mat-mini-fab (click)="_handleUndo('pageHist')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.pageHist.id !== undefined" mat-mini-fab (click)="_handleDelete('pageHist')">
          <mat-icon *ngIf="!valIds.pageHist.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.pageHist.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Comment"
                 formControlName="comment"
                 (input)="_handleInput('comment')">
        </mat-form-field>
        <button *ngIf="valIds.comment.changed" mat-mini-fab (click)="_handleUndo('comment')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.comment.id !== undefined" mat-mini-fab (click)="_handleDelete('comment')">
          <mat-icon *ngIf="!valIds.comment.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.comment.toBeDeleted" color="warn">delete</mat-icon>
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

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Prefix title"
                 formControlName="prefixTitle"
                 (input)="_handleInput('prefixTitle')">
        </mat-form-field>
        <button *ngIf="valIds.prefixTitle.changed" mat-mini-fab (click)="_handleUndo('prefixTitle')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.prefixTitle.id !== undefined" mat-mini-fab (click)="_handleDelete('prefixTitle')">
          <mat-icon *ngIf="!valIds.prefixTitle.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.prefixTitle.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=600>
          <textarea matInput
                 class="full-width tarows"
                 placeholder="Text history"
                 formControlName="textHist"
                 (input)="_handleInput('textHist')"></textarea>
        </mat-form-field>
        <button *ngIf="valIds.textHist.changed" mat-mini-fab (click)="_handleUndo('textHist')">
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.textHist.id !== undefined" mat-mini-fab (click)="_handleDelete('textHist')">
          <mat-icon *ngIf="!valIds.textHist.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.textHist.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="mentionedIn">
          <mat-label>MentionedIn (passage)</mat-label>
          <div *ngFor="let mentionedInItem of getMentionedIn().controls; let i=index">
            <mat-form-field [formGroup]="mentionedInItem">
              <input matInput [matAutocomplete]="autoMentionedIn"
                     formControlName="mentionedInName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Mentioned in (passage)"
                     aria-label="Value"
                     (change)="_handleInput('mentionedIn', i)"
                     (input)="_handleLinkInput('mentionedIn', i)">
              <input matInput formControlName="mentionedInIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoMentionedIn="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'mentionedIn', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.mentionedIn[i].changed" mat-mini-fab (click)="_handleUndo('mentionedIn', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.mentionedIn[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('mentionedIn', i)">
              <mat-icon *ngIf="!valIds.mentionedIn[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.mentionedIn[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.mentionedIn[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('mentionedIn', i)">
              <mat-icon *ngIf="!valIds.mentionedIn[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addMentionedIn()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div>&nbsp;</div>
      </mat-card-content>

      <mat-card-actions>
        <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
        <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        <button *ngIf="inData.passageIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
        <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
      </mat-card-actions>

    </mat-card>
  `,
  styles: [
      '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }',
    '.tarows { height: 5em;}'
  ]
})


export class EditPassageComponent implements OnInit {
  controlType = 'EditPassage';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: PassageData = new PassageData('', '', '',[], [], {researchFieldIri: ''},
      {statusIri: ''}, '', {occursInName: '', occursInIri: ''},
      {contributedByName: '', contributedByIri: ''}, [], '', '', '',
      '', '', '', '', []);
  nFunctionVoices: number;
  nMarkings: number;
  nContains: number;
  nMentionedIn: number;
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
    this.nMentionedIn = 0;
  }

  @Input()
  get value(): PassageData | null {
    const functionVoices: FormArray = this.getFunctionVoices();
    const functionVoiceIriValues: {functionVoiceIri: string }[] = [];
    for (const x of functionVoices.controls) {
      const y = x as FormGroup;
      functionVoiceIriValues.push({functionVoiceIri: y.controls.functionVoiceIri.value});
    }
    const markings: FormArray = this.getMarkings();
    const markingIriValues: {markingIri: string}[] = [];
    for (const x of markings.controls) {
      const y = x as FormGroup;
      markingIriValues.push({markingIri: y.controls.markingIri.value});
    }
    const tmpContains: FormArray = this.getContains();
    const containsValues: {containsName: string; containsIri: string}[] = [];
    for (const x of tmpContains.controls) {
      containsValues.push(x.value);
    }
    const tmpMentionedIn: FormArray = this.getMentionedIn();
    const mentionedInValues: {mentionedInName: string; mentionedInIri: string}[] = [];
    for (const x of tmpMentionedIn.controls) {
      mentionedInValues.push(x.value);
    }
    return new PassageData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.displayedTitle.value,
        functionVoiceIriValues,
        markingIriValues,
        {researchFieldIri: this.form.controls.researchField.value},
        {statusIri: this.form.controls.status.value},
        this.form.controls.text.value,
        {
          occursInName: this.form.controls.occursInName.value,
          occursInIri: this.form.controls.occursInIri.value
        },
        {
          contributedByName: this.form.controls.contributedByName.value,
          contributedByIri: this.form.controls.contributedByIri.value
        },
        containsValues,
        this.form.controls.internalComment.value,
        this.form.controls.page.value,
        this.form.controls.pageHist.value,
        this.form.controls.comment.value,
        this.form.controls.extraInfo.value,
        this.form.controls.prefixTitle.value,
        this.form.controls.textHist.value,
        mentionedInValues
    );
  }

  set value(knoraVal: PassageData | null) {
    const {label, internalId, displayedTitle, functionVoices, markings, researchField, status, text, occursIn,
    contributedBy, contains, internalComment, page, pageHist, comment, extraInfo, prefixTitle, textHist, mentionedIn}
        = knoraVal || new PassageData('', '', '', [],
        [], {researchFieldIri: ''}, {statusIri: ''}, '', {occursInName: '', occursInIri: ''},
        {contributedByName: '', contributedByIri: ''},
        [{containsName: '', containsIri: ''}], '',
        '', '', '', '', '', '',
        [{mentionedInName: '', mentionedInIri: ''}]);
    this.form.setValue({label, internalId, displayedTitle, functionVoices, markings, researchField,
      status, text, occursInName: occursIn.occursInName, occursInIri: occursIn.occursInIri,
      contributedByName: contributedBy.contributedByName, contributedByIri: contributedBy.contributedByIri,
      contains, internalComment, page, pageHist, comment, extraInfo, prefixTitle, textHist, mentionedIn});
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.passageIri = arr[0].iri;
      }
      if (this.inData.passageIri !== undefined) {
        this.knoraService.getResource(this.inData.passageIri).subscribe((data) => {
          if (this.inData.passageIri !== undefined) {
            console.log('DATA: ', data);
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.wwOntology + 'hasPassageInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasDisplayedTitle': {
                  this.form.controls.displayedTitle.setValue(ele.values[0]);
                  this.valIds.displayedTitle = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.displayedTitle = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasFunctionVoice': {
                  const tmp = ele as ListPropertyData;
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addFunctionVoice({id: tmp.ids[i], iri: tmp.nodeIris[i]});
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasMarking': {
                  const tmp = ele as ListPropertyData;
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addMarking({id: tmp.ids[i], iri: tmp.nodeIris[i]});
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasResearchField': {
                  const tmp = ele as ListPropertyData;
                  this.form.controls.researchField.setValue(tmp.nodeIris[0]);
                  this.valIds.researchField = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                  this.data.researchField = {researchFieldIri: tmp.nodeIris[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'hasStatus': {
                  const tmp = ele as ListPropertyData;
                  this.form.controls.status.setValue(tmp.nodeIris[0]);
                  this.valIds.status = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                  this.data.status = {statusIri: tmp.nodeIris[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'hasText': {
                  this.form.controls.text.setValue(ele.values[0]);
                  this.valIds.text = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.text = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'occursInValue': {
                  this.form.controls.occursInName.setValue(ele.values[0]);
                  this.form.controls.occursInIri.setValue(ele.ids[0]);
                  this.valIds.occursIn = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.occursIn = {occursInName: ele.values[0], occursInIri: ele.ids[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'wasContributedByValue': {
                  this.form.controls.contributedByName.setValue(ele.values[0]);
                  this.form.controls.contributedByIri.setValue(ele.ids[0]);
                  this.valIds.contributedBy = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.contributedBy = {contributedByName: ele.values[0], contributedByIri: ele.ids[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'containsValue': {
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addContains({containsName: ele.values[i], containsIri: ele.ids[i]});
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasInternalComment': {
                  this.form.controls.internalComment.setValue(ele.values[0]);
                  this.valIds.internalComment = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalComment = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPage': {
                  this.form.controls.page.setValue(ele.values[0]);
                  this.valIds.page = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.page = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPageHist': {
                  this.form.controls.pageHist.setValue(ele.values[0]);
                  this.valIds.pageHist = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.pageHist = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPassageComment': {
                  this.form.controls.comment.setValue(ele.values[0]);
                  this.valIds.comment = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.comment = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPassageExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPrefixDisplayedTitle': {
                  this.form.controls.prefixTitle.setValue(ele.values[0]);
                  this.valIds.prefixTitle = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.prefixTitle = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasTextHist': {
                  this.form.controls.textHist.setValue(ele.values[0]);
                  this.valIds.textHist = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.textHist = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'isMentionedInValue': {
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addMentionedIn({mentionedInName: ele.values[i], mentionedInIri: ele.ids[i]});
                  }
                  break;
                }
              }
            }
          }
        });
      }
      let fvInitial;
      if (this.inData.passageIri === undefined) {
        this.valIds.functionVoices[0] = {id: this.functionVoiceTypes[0].iri, changed: false, toBeDeleted: false};
        fvInitial = [
          this.fb.group({
            functionVoiceIri: [this.functionVoiceTypes[0].iri, [Validators.required]]
          })
        ];
      } else {
        fvInitial = [];
      }
      let mInitial;
      if (this.inData.passageIri === undefined) {
        this.valIds.markings[0] = {id: this.markingTypes[0].iri, changed: false, toBeDeleted: false};
        mInitial = [
          this.fb.group({
            markingIri: [this.markingTypes[0].iri, [Validators.required]]
          })
        ];
      } else {
        mInitial = [];
      }
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        displayedTitle: [this.data.displayedTitle, []],
        functionVoices: this.fb.array(fvInitial),
        markings: this.fb.array(mInitial),
        researchField: [this.data.researchField?.researchFieldIri || this.researchFieldTypes[0].iri, [Validators.required]],
        status: [this.data.status?.statusIri || this.statusTypes[0].iri, [Validators.required]],
        text: [this.data.label, [Validators.required]],
        occursInName: this.data.occursIn.occursInName,
        occursInIri: this.data.occursIn.occursInIri,
        contributedByName: this.data.contributedBy.contributedByName,
        contributedByIri: this.data.contributedBy.contributedByIri,
        contains: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
        internalComment: [this.data.internalComment, []],
        page: [this.data.page, []],
        pageHist: [this.data.pageHist, []],
        comment: [this.data.comment, []],
        extraInfo: [this.data.extraInfo, []],
        prefixTitle: [this.data.prefixTitle, []],
        textHist: [this.data.textHist, []],
        mentionedIn: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ])
      });
     });
  }

  getFunctionVoices(): FormArray {
    return this.form.controls.functionVoices as FormArray;
  }

  addFunctionVoice(functionVoice?: {id: string; iri: string }): void {
    const functionVoices = this.getFunctionVoices();
    if (functionVoice.iri === undefined) {
      functionVoices.push(this.fb.group({functionVoiceIri: this.functionVoiceTypes[0].iri}));
      this.data.functionVoices.push({functionVoiceIri: this.functionVoiceTypes[0].iri});
      this.valIds.functionVoices.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      functionVoices.push(this.fb.group({functionVoiceIri: functionVoice.iri}));
      this.data.functionVoices.push({functionVoiceIri: functionVoice.iri});
      this.valIds.functionVoices.push({id: functionVoice.id, changed: false, toBeDeleted: false});
    }
    this.nFunctionVoices++;
  }

  removeFunctionVoice(index: number): void {
    const functionVoices = this.getFunctionVoices();
    functionVoices.removeAt(index);
    this.valIds.functionVoices.splice(index, 1);
    this.data.functionVoices.splice(index, 1);
    this.nFunctionVoices--;
  }

  getMarkings(): FormArray {
    return this.form.controls.markings as FormArray;
  }

  addMarking(marking?: {id: string; iri: string }): void {
    const markings = this.getMarkings();
    if (marking.iri === undefined) {
      markings.push(this.fb.group({markingIri: this.markingTypes[0].iri}));
      this.data.markings.push({markingIri: this.markingTypes[0].iri});
      this.valIds.markings.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      markings.push(this.fb.group({markingIri: marking.iri}));
      this.data.markings.push({markingIri: marking.iri});
      this.valIds.markings.push({id: marking.id, changed: false, toBeDeleted: false});
    }
    this.nMarkings++;
  }

  removeMarking(index: number): void {
    const markings = this.getMarkings();
    markings.removeAt(index);
    this.valIds.markings.splice(index, 1);
    this.data.markings.splice(index, 1);
    this.nMarkings--;
  }

  getContains() {
    return this.form.controls.contains as FormArray;
  }

  addContains(contains?: {containsName: string; containsIri: string}) {
    const tmp = this.getContains();
    if (contains === undefined) {
      tmp.push(this.fb.group({containsName: '', containsIri: ''}));
      this.data.contains.push({containsName: '', containsIri: ''});
      this.valIds.contains.push({id: undefined, changed: false, toBeDeleted: false});
    }
    else {
      tmp.push(this.fb.group({containsName: contains.containsName, containsIri: contains.containsIri}));
      this.data.contains.push({containsName: contains.containsName, containsIri: contains.containsIri});
      this.valIds.contains.push({id: contains.containsIri, changed: false, toBeDeleted: false});
    }
    this.nContains++;
  }

  removeContains(index: number): void {
    const tmp = this.getContains();
    tmp.removeAt(index);
    this.valIds.contains.splice(index, 1);
    this.data.contains.splice(index, 1);
    this.nContains--;
  }

  getMentionedIn() {
    return this.form.controls.mentionedIn as FormArray;
  }

  addMentionedIn(mentionedIn?: {mentionedInName: string; mentionedInIri: string}) {
    const tmp = this.getMentionedIn();
    if (mentionedIn === undefined) {
      tmp.push(this.fb.group({mentionedInName: '', mentionedInIri: ''}));
      this.data.mentionedIn.push({mentionedInName: '', mentionedInIri: ''});
      this.valIds.mentionedIn.push({id: undefined, changed: false, toBeDeleted: false});
    }
    else {
      tmp.push(this.fb.group({mentionedInName: mentionedIn.mentionedInName, mentionedInIri: mentionedIn.mentionedInIri}));
      this.data.mentionedIn.push({mentionedInName: mentionedIn.mentionedInName, mentionedInIri: mentionedIn.mentionedInIri});
      this.valIds.mentionedIn.push({id: mentionedIn.mentionedInIri, changed: false, toBeDeleted: false});
    }
    this.nMentionedIn++;
  }

  removeMentionedIn(index: number): void {
    const tmp = this.getMentionedIn();
    tmp.removeAt(index);
    this.valIds.mentionedIn.splice(index, 1);
    this.data.mentionedIn.splice(index, 1);
    this.nMentionedIn--;
  }

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'occursIn':
        const occursInName = this.form.controls.occursInName.value;
        this.valIds.occursIn.changed = true;
        if (occursInName.length >= 3) {
          this.knoraService.getResourcesByLabel(occursInName, this.knoraService.wwOntology + 'book').subscribe(
              res => {
                this.options = res;
                this.form.value.occursInName = res[0].label;
                this.form.value.occursInIri =  res[0].id;
              }
          );
        }
        break;
      case 'contributedBy':
        const contributedByName = this.form.controls.contributedByName.value;
        this.valIds.contributedBy.changed = true;
        if (contributedByName.length >= 3) {
          this.knoraService.getResourcesByLabel(contributedByName, this.knoraService.wwOntology + 'person').subscribe(
              res => {
                this.options = res;
                this.form.value.contributedByName = res[0].label;
                this.form.value.contributedByIri =  res[0].id;
              }
          );
        }
        break;
      case 'contains':
        const contains = this.getContains();
        const containsName = contains.value[index].containsName;

        this.valIds.contains[index].changed = true;
        if (containsName >= 3) {
          this.knoraService.getResourcesByLabel(containsName, this.knoraService.wwOntology + 'lexia').subscribe(
              res => {
                this.options = res;
                this.form.value.contains[index].containsName = res[0].label;
                this.form.value.contains[index].containsIri =  res[0].id;
              }
          );
        }
        break;
      case 'mentionedIn':
        const mentionedIn = this.getMentionedIn();
        const mentionedInName = mentionedIn.value[index].mentionedInName;

        this.valIds.mentionedIn[index].changed = true;
        this.knoraService.getResourcesByLabel(mentionedInName, this.knoraService.wwOntology + 'passage').subscribe(
            res => {
              this.options = res;
              this.form.value.mentionedIn[index].mentionedInName = res[0].label;
              this.form.value.mentionedIn[index].mentionedInIri =  res[0].id;
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
      case 'occursIn':
        this.form.value.occursInName = res[0].label;
        this.form.value.occursInIri =  res[0].id;
        break;
      case 'contributedBy':
        this.form.value.contributedByName = res[0].label;
        this.form.value.contributedByIri =  res[0].id;
        break;
      case 'contains':
        this.form.value.contains[index].containsName = res[0].label;
        this.form.value.contains[index].containsIri = res[0].id;
        break;
      case 'mentionedIn':
        this.form.value.mentionedIn[index].mentionedInName = res[0].label;
        this.form.value.mentionedIn[index].mentionedInIri = res[0].id;
        break;
    }
    this.value = new PassageData(
        this.form.value.label,
        this.form.value.internalId,
        this.form.value.displayedTitle,
        this.form.value.functionVoices,
        this.form.value.markings,
        this.form.value.researchField,
        this.form.value.status,
        this.form.value.text,
        {occursInName: this.form.value.occursInName, occursInIri: this.form.value.occursInIri},
        {contributedByName: this.form.value.contributedByName, contributedByIri: this.form.value.contributedByIri},
        this.form.value.contains,
        this.form.value.internalComment,
        this.form.value.page,
        this.form.value.pageHist,
        this.form.value.comment,
        this.form.value.extraInfo,
        this.form.value.prefixTitle,
        this.form.value.textHist,
        this.form.value.mentionedIn
    );
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
      case 'displayedTitle':
        this.valIds.displayedTitle.changed = true;
        break;
      case 'functionVoices':
        this.valIds.functionVoices[index].changed = true;
        break;
      case 'markings':
        this.valIds.markings[index].changed = true;
        break;
      case 'researchField':
        this.valIds.researchField.changed = true;
        break;
      case 'status':
        this.valIds.status.changed = true;
        break;
      case 'text':
        this.valIds.text.changed = true;
        break;
      case 'occursIn':
        this.valIds.occursIn.changed = true;
        break;
      case 'contributedBy':
        this.valIds.contributedBy.changed = true;
        break;
      case 'contains':
        this.valIds.contains[index].changed = true;
        break;
      case 'internalComment':
        this.valIds.internalComment.changed = true;
        break;
      case 'page':
        this.valIds.page.changed = true;
        break;
      case 'pageHist':
        this.valIds.pageHist.changed = true;
        break;
      case 'comment':
        this.valIds.comment.changed = true;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.changed = true;
        break;
      case 'prefixTitle':
        this.valIds.prefixTitle.changed = true;
        break;
      case 'textHist':
        this.valIds.textHist.changed = true;
        break;
      case 'mentionedIn':
        this.valIds.mentionedIn[index].changed = true;
        break;
    }
  }

  _handleDelete(what: string, index?: number): void {
    switch(what) {
      case 'functionVoices':
        if (this.valIds.functionVoices[index].id !== undefined) {
          this.valIds.functionVoices[index].toBeDeleted = !this.valIds.functionVoices[index].toBeDeleted;
          if (this.valIds.functionVoices[index].toBeDeleted) {
            this.nFunctionVoices--;
          } else {
            this.nFunctionVoices++;
          }
        } else {
          this.removeFunctionVoice(index);
        }
        break;
      case 'markings':
        if (this.valIds.markings[index].id !== undefined) {
          this.valIds.markings[index].toBeDeleted = !this.valIds.markings[index].toBeDeleted;
          if (this.valIds.markings[index].toBeDeleted) {
            this.nMarkings--;
          } else {
            this.nMarkings++;
          }
        } else {
          this.removeMarking(index);
        }
        break;
      case 'contains':
        if (this.valIds.contains[index].id !== undefined) {
          this.valIds.contains[index].toBeDeleted = !this.valIds.contains[index].toBeDeleted;
          if (this.valIds.contains[index].toBeDeleted) {
            this.nContains--;
          } else {
            this.nContains++;
          }
        } else {
          this.removeContains(index);
        }
        break;
      case 'internalComment':
        this.valIds.internalComment.toBeDeleted = !this.valIds.internalComment.toBeDeleted;
        break;
      case 'page':
        this.valIds.page.toBeDeleted = !this.valIds.page.toBeDeleted;
        break;
      case 'pageHist':
        this.valIds.pageHist.toBeDeleted = !this.valIds.pageHist.toBeDeleted;
        break;
      case 'comment':
        this.valIds.comment.toBeDeleted = !this.valIds.comment.toBeDeleted;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
        break;
      case 'prefixTitle':
        this.valIds.prefixTitle.toBeDeleted = !this.valIds.prefixTitle.toBeDeleted;
        break;
      case 'textHist':
        this.valIds.textHist.toBeDeleted = !this.valIds.textHist.toBeDeleted;
        break;
      case 'mentionedIn':
        if (this.valIds.mentionedIn[index].id !== undefined) {
          this.valIds.mentionedIn[index].toBeDeleted = !this.valIds.mentionedIn[index].toBeDeleted;
          if (this.valIds.mentionedIn[index].toBeDeleted) {
            this.nMentionedIn--;
          } else {
            this.nMentionedIn++;
          }
        } else {
          this.removeMentionedIn(index);
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
      case 'displayedTitle':
        this.form.controls.displayedTitle.setValue(this.data.displayedTitle);
        this.valIds.displayedTitle.changed = false;
        break;
      case 'functionVoices':
        const functionVoices = this.getFunctionVoices().controls[index] as FormGroup;
        functionVoices.controls.functionVoiceIri.setValue(this.data.functionVoices[index].functionVoiceIri);
        this.valIds.functionVoices[index].changed = false;
        break;
      case 'markings':
        const markings = this.getMarkings().controls[index] as FormGroup;
        markings.controls.markingIri.setValue(this.data.markings[index].markingIri);
        this.valIds.markings[index].changed = false;
        break;
      case 'researchField':
        this.form.controls.researchField.setValue(this.data.researchField.researchFieldIri);
        this.valIds.researchField.changed = false;
        break;
      case 'status':
        this.form.controls.status.setValue(this.data.status.statusIri);
        this.valIds.status.changed = false;
        break;
      case 'text':
        this.form.controls.text.setValue(this.data.text);
        this.valIds.text.changed = false;
        break;
      case 'occursIn':
        this.form.controls.occursInName.setValue(this.data.occursIn.occursInName);
        this.form.controls.occursInIri.setValue(this.data.occursIn.occursInIri);
        this.valIds.occursIn.changed = false;
        break;
      case 'contributedBy':
        this.form.controls.contributedByName.setValue(this.data.contributedBy.contributedByName);
        this.form.controls.contributedByIri.setValue(this.data.contributedBy.contributedByIri);
        this.valIds.occursIn.changed = false;
        break;
      case 'contains':
        this.getContains().controls[index].setValue(this.data.contains[index]);
        this.valIds.contains[index].changed = false;
        break;
      case 'internalComment':
        this.form.controls.internalComment.setValue(this.data.internalComment);
        this.valIds.internalComment.changed = false;
        break;
      case 'page':
        this.form.controls.page.setValue(this.data.page);
        this.valIds.page.changed = false;
        break;
      case 'pageHist':
        this.form.controls.pageHist.setValue(this.data.pageHist);
        this.valIds.pageHist.changed = false;
        break;
      case 'comment':
        this.form.controls.comment.setValue(this.data.comment);
        this.valIds.comment.changed = false;
        break;
      case 'extraInfo':
        this.form.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
      case 'prefixTitle':
        this.form.controls.prefixTitle.setValue(this.data.prefixTitle);
        this.valIds.prefixTitle.changed = false;
        break;
      case 'textHist':
        this.form.controls.textHist.setValue(this.data.textHist);
        this.valIds.textHist.changed = false;
        break;
      case 'mentionedIn':
        this.getMentionedIn().controls[index].setValue(this.data.mentionedIn[index]);
        this.valIds.mentionedIn[index].changed = false;
        break;
    }
  }

  save(): void {
    this.working = true;
    console.log('this.value:', this.value);
    if (this.inData.passageIri === undefined) {
      this.knoraService.createPassage(this.value).subscribe(
          res => {
            console.log('CREATE_RESULT:', res);
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Error storing the passage object!', 'OK');
            console.log('EditCompany.save(): ERROR', error);
            this.working = false;
            this.location.back();
          }
      );
    } else {
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
            this.knoraService.wwOntology + 'passage',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasPassageInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPassageInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasPassageInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      if (this.valIds.displayedTitle.toBeDeleted && this.valIds.displayedTitle.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.displayedTitle.id as string,
            this.knoraService.wwOntology + 'hasDisplayedTitle');
        obs.push(gaga);
      } else if (this.valIds.displayedTitle.changed) {
        let gaga: Observable<string>;
        if (this.valIds.displayedTitle.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasDisplayedTitle',
              this.value.displayedTitle);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.displayedTitle.id as string,
              this.knoraService.wwOntology + 'hasDisplayedTitle',
              this.value.displayedTitle);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.functionVoices) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              valId.id as string,
              this.knoraService.wwOntology + 'hasFunctionVoice');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                this.knoraService.wwOntology + 'hasFunctionVoice',
                this.value.functionVoices[index].functionVoiceIri);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                valId.id as string,
                this.knoraService.wwOntology + 'hasFunctionVoice',
                this.value.functionVoices[index].functionVoiceIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.markings) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              valId.id as string,
              this.knoraService.wwOntology + 'hasMarking');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                this.knoraService.wwOntology + 'hasMarking',
                this.value.markings[index].markingIri);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                valId.id as string,
                this.knoraService.wwOntology + 'hasMarking',
                this.value.markings[index].markingIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      if (this.valIds.researchField.toBeDeleted && this.valIds.researchField.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteListValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.researchField.id as string,
            this.knoraService.wwOntology + 'hasResearchField');
        obs.push(gaga);
      } else if (this.valIds.researchField.changed) {
        let gaga: Observable<string>;
        if (this.valIds.researchField.id === undefined) {
          gaga = this.knoraService.createListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasResearchField',
              this.form.value.researchField);
        } else {
          gaga = this.knoraService.updateListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.researchField.id as string,
              this.knoraService.wwOntology + 'hasResearchField',
              this.form.value.researchField);
        }
        obs.push(gaga);
      }

      if (this.valIds.status.toBeDeleted && this.valIds.status.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteListValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.status.id as string,
            this.knoraService.wwOntology + 'hasStatus');
        obs.push(gaga);
      } else if (this.valIds.status.changed) {
        let gaga: Observable<string>;
        if (this.valIds.status.id === undefined) {
          gaga = this.knoraService.createListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasStatus',
              this.form.value.status);
        } else {
          gaga = this.knoraService.updateListValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.status.id as string,
              this.knoraService.wwOntology + 'hasStatus',
              this.form.value.status);
        }
        obs.push(gaga);
      }

      if (this.valIds.text.toBeDeleted && this.valIds.text.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.text.id as string,
            this.knoraService.wwOntology + 'hasText');
        obs.push(gaga);
      } else if (this.valIds.text.changed) {
        let gaga: Observable<string>;
        if (this.valIds.text.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasText',
              this.value.text);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.text.id as string,
              this.knoraService.wwOntology + 'hasText',
              this.value.text);
        }
        obs.push(gaga);
      }

      if (this.valIds.occursIn.toBeDeleted && this.valIds.occursIn.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteLinkValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.occursIn.id as string,
            this.knoraService.wwOntology + 'occursInValue');
        obs.push(gaga);
      } else if (this.valIds.occursIn.changed) {
        let gaga: Observable<string>;
        if (this.valIds.occursIn.id === undefined) {
          gaga = this.knoraService.createLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'occursInValue',
              this.form.value.occursInIri);
        } else {
          gaga = this.knoraService.updateLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.occursIn.id as string,
              this.knoraService.wwOntology + 'occursInValue',
              this.form.value.occursInIri);
        }
        obs.push(gaga);
      }

      if (this.valIds.contributedBy.toBeDeleted && this.valIds.contributedBy.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteLinkValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.contributedBy.id as string,
            this.knoraService.wwOntology + 'wasContributedByValue');
        obs.push(gaga);
      } else if (this.valIds.contributedBy.changed) {
        let gaga: Observable<string>;
        if (this.valIds.contributedBy.id === undefined) {
          gaga = this.knoraService.createLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'wasContributedByValue',
              this.form.value.contributedByIri);
        } else {
          gaga = this.knoraService.updateLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.contributedBy.id as string,
              this.knoraService.wwOntology + 'wasContributedByValue',
              this.form.value.contributedByIri);
        }
        obs.push(gaga);
      }

      index = 0;
      for (const valId of this.valIds.contains) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              valId.id as string,
              this.knoraService.wwOntology + 'containsValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                this.knoraService.wwOntology + 'containsValue',
                this.value.contains[index].containsIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                valId.id as string,
                this.knoraService.wwOntology + 'containsValue',
                this.value.contains[index].containsIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      if (this.valIds.internalComment.toBeDeleted && this.valIds.internalComment.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.internalComment.id as string,
            this.knoraService.wwOntology + 'hasInternalComment');
        obs.push(gaga);
      } else if (this.valIds.internalComment.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalComment.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasInternalComment',
              this.value.internalComment);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.internalComment.id as string,
              this.knoraService.wwOntology + 'hasInternalComment',
              this.value.internalComment);
        }
        obs.push(gaga);
      }

      if (this.valIds.page.toBeDeleted && this.valIds.page.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.page.id as string,
            this.knoraService.wwOntology + 'hasPage');
        obs.push(gaga);
      } else if (this.valIds.page.changed) {
        let gaga: Observable<string>;
        if (this.valIds.page.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPage',
              this.value.page);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.page.id as string,
              this.knoraService.wwOntology + 'hasPage',
              this.value.page);
        }
        obs.push(gaga);
      }

      if (this.valIds.pageHist.toBeDeleted && this.valIds.pageHist.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.pageHist.id as string,
            this.knoraService.wwOntology + 'hasPageHist');
        obs.push(gaga);
      } else if (this.valIds.pageHist.changed) {
        let gaga: Observable<string>;
        if (this.valIds.pageHist.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPageHist',
              this.value.pageHist);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.pageHist.id as string,
              this.knoraService.wwOntology + 'hasPageHist',
              this.value.pageHist);
        }
        obs.push(gaga);
      }

      if (this.valIds.comment.toBeDeleted && this.valIds.comment.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.comment.id as string,
            this.knoraService.wwOntology + 'hasPassageComment');
        obs.push(gaga);
      } else if (this.valIds.comment.changed) {
        let gaga: Observable<string>;
        if (this.valIds.comment.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPassageComment',
              this.value.comment);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.comment.id as string,
              this.knoraService.wwOntology + 'hasPassageComment',
              this.value.comment);
        }
        obs.push(gaga);
      }

      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasPassageExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPassageExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasPassageExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      if (this.valIds.prefixTitle.toBeDeleted && this.valIds.prefixTitle.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.prefixTitle.id as string,
            this.knoraService.wwOntology + 'hasPrefixDisplayedTitle');
        obs.push(gaga);
      } else if (this.valIds.prefixTitle.changed) {
        let gaga: Observable<string>;
        if (this.valIds.prefixTitle.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasPrefixDisplayedTitle',
              this.value.prefixTitle);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.prefixTitle.id as string,
              this.knoraService.wwOntology + 'hasPrefixDisplayedTitle',
              this.value.prefixTitle);
        }
        obs.push(gaga);
      }

      if (this.valIds.textHist.toBeDeleted && this.valIds.textHist.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'passage',
            this.valIds.textHist.id as string,
            this.knoraService.wwOntology + 'hasTextHist');
        obs.push(gaga);
      } else if (this.valIds.textHist.changed) {
        let gaga: Observable<string>;
        if (this.valIds.textHist.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.knoraService.wwOntology + 'hasTextHist',
              this.value.textHist);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              this.valIds.textHist.id as string,
              this.knoraService.wwOntology + 'hasTextHist',
              this.value.textHist);
        }
        obs.push(gaga);
      }

      index = 0;
      for (const valId of this.valIds.mentionedIn) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'passage',
              valId.id as string,
              this.knoraService.wwOntology + 'isMentionedInValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                this.knoraService.wwOntology + 'isMentionedInValue',
                this.value.mentionedIn[index].mentionedInIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'passage',
                valId.id as string,
                this.knoraService.wwOntology + 'isMentionedInValue',
                this.value.mentionedIn[index].mentionedInIri);
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
            this.snackBar.open('Fehler beim Speichern der Daten des company-Eintrags!', 'OK');
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
      title: 'Delete passage',
      text: 'Do You really want to delete this passage?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        console.log('lastmod', this.lastmod);
        this.knoraService.deleteResource(this.resId, 'passage', this.lastmod, data.comment).subscribe(
            res => {
              this.working = false;
              this.location.back();
            },
            error => {
              this.snackBar.open('Error while deleting the passage entry!', 'OK');
              console.log('deleteResource:ERROR:: ', error);
              this.working = false;
              this.location.back();
            });
      }
    });

  }
}


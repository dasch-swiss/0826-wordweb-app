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
import {combineLatest, forkJoin, concat, Observable} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {
  CompanyData,
  KnoraService,
  LexiaData,
  ListPropertyData,
  OptionType,
  BookData
} from '../../services/knora.service';
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

class BookIds {
  public label: ValInfo;
  public internalId: ValInfo;
  public title: ValInfo;
  public creationDate: ValInfo;
  public edition: ValInfo;
  public genres: ValInfo[];
  public language: ValInfo;
  public writtenBy: ValInfo[];
  public comment: ValInfo;
  public extraInfo: ValInfo;
  public editionHist: ValInfo;
  public firstPerformance: ValInfo;
  public prefixTitle: ValInfo;
  public pubdate: ValInfo;
  public subjects: ValInfo[];
  public lexias: ValInfo[];
  public performedBy: ValInfo[];
  public performedByActor: ValInfo[];
  public performedIn: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.creationDate = {id: undefined, changed: false, toBeDeleted: false};
    this.edition = {id: undefined, changed: false, toBeDeleted: false};
    this.genres = [];
    this.language = {id: undefined, changed: false, toBeDeleted: false};
    this.writtenBy = [];
    this.comment = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.editionHist = {id: undefined, changed: false, toBeDeleted: false};
    this.firstPerformance = {id: undefined, changed: false, toBeDeleted: false};
    this.prefixTitle = {id: undefined, changed: false, toBeDeleted: false};
    this.pubdate = {id: undefined, changed: false, toBeDeleted: false};
    this.subjects = [];
    this.lexias = [];
    this.performedBy = [];
    this.performedByActor = [];
    this.performedIn = [];
  }
}

@Component({
  selector: 'app-edit-book',
  template: `
    <mat-card>
      <mat-card-title>Book Editor</mat-card-title>

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
          <input matInput required
                 class="full-width"
                 placeholder="Title"
                 formControlName="title"
                 (input)="_handleInput('title')">
          <mat-error *ngIf="form.controls.title.errors?.required">Title required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.title.changed" mat-mini-fab (click)="_handleUndo('title')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field appearance="fill"  [style.width.px]=600>
          <mat-label>Creation date</mat-label>
          <app-knora-date-value matInput required
                                formControlName="creationDate"
                                (ngModelChange)="_handleInput('creationDate')"></app-knora-date-value>
        </mat-form-field>
        <button *ngIf="valIds.creationDate.changed" mat-mini-fab (click)="_handleUndo('creationDate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=600>
          <textarea matInput required
                 class="full-width tarows"
                 placeholder="Edition"
                 formControlName="edition"
                    (input)="_handleInput('edition')"></textarea>
          <mat-error *ngIf="form.controls.edition.errors?.required">Edition required!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.edition.changed" mat-mini-fab (click)="_handleUndo('edition')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <div formArrayName="genres">
          <mat-label>Genres</mat-label>
          <div *ngFor="let genreItem of getGenres().controls; let i=index">
            <mat-form-field [formGroup]="genreItem" [style.width.px]=300>
              <mat-select matInput
                          placeholder="Genre"
                          formControlName="genreIri"
                          (selectionChange)="_handleInput('genres', i)">
                <mat-option *ngFor="let lt of genreTypes" [value]="lt.iri">
                  {{lt.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <button *ngIf="valIds.genres[i].changed" mat-mini-fab (click)="_handleUndo('genres', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button
                *ngIf="valIds.genres[i].id !== undefined && (nGenres > 1 || valIds.genres[i].toBeDeleted)"
                mat-mini-fab (click)="_handleDelete('genres', i)">
              <mat-icon *ngIf="!valIds.genres[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.genres[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.genres[i].id === undefined && nGenres > 1"
                    mat-mini-fab (click)="_handleDelete('genres', i)">
              <mat-icon *ngIf="!valIds.genres[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addGenre()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <br/>
        <div>&nbsp;</div>

        <mat-form-field [style.width.px]=600>
          <mat-select matInput required
                      placeholder="Language"
                      formControlName="language"
                      (selectionChange)="_handleInput('language')">
            <mat-option *ngFor="let lt of languageTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.language.changed" mat-mini-fab (click)="_handleUndo('language')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <div formArrayName="writtenBy">
          <mat-label>Written by (person)</mat-label>
          <div *ngFor="let writtenByItem of getWrittenBys().controls; let i=index">
            <mat-form-field [formGroup]="writtenByItem">
              <input matInput [matAutocomplete]="autoWrittenBy"
                     formControlName="writtenByName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Written by (person)"
                     aria-label="Value"
                     (change)="_handleInput('writtenBy', i)"
                     (input)="_handleLinkInput('writtenBy', i)">
              <input matInput formControlName="writtenByIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoWrittenBy="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'writtenBy', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.writtenBy[i].changed" mat-mini-fab (click)="_handleUndo('writtenBy', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button
                *ngIf="valIds.writtenBy[i].id !== undefined && (nWrittenBy > 1 || valIds.writtenBy[i].toBeDeleted)"
                mat-mini-fab (click)="_handleDelete('writtenBy', i)">
              <mat-icon *ngIf="!valIds.writtenBy[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.writtenBy[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.writtenBy[i].id === undefined && nWrittenBy > 1"
                    mat-mini-fab (click)="_handleDelete('writtenBy', i)">
              <mat-icon *ngIf="!valIds.writtenBy[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addWrittenBy()">
            <mat-icon>add</mat-icon>
          </button>
        </div>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Comment"
                 formControlName="comment"
                 (input)="_handleInput('comment')">
        </mat-form-field>
        <button *ngIf="valIds.comment.changed" mat-mini-fab (click)="_handleUndo('comment')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.comment.id !== undefined" mat-mini-fab (click)="_handleDelete('comment')">
          <mat-icon *ngIf="!valIds.comment.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.comment.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Extra Info"
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

        <mat-form-field appearance="fill"  [style.width.px]=600>
          <mat-label>First performance</mat-label>
          <app-knora-date-value matInput
                                formControlName="firstPerformance"
                                (ngModelChange)="_handleInput('firstPerformance')"></app-knora-date-value>
        </mat-form-field>
        <button *ngIf="valIds.firstPerformance.changed" mat-mini-fab (click)="_handleUndo('firstPerformance')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.firstPerformance.id !== undefined" mat-mini-fab (click)="_handleDelete('firstPerformance')">
          <mat-icon *ngIf="!valIds.firstPerformance.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.firstPerformance.toBeDeleted" color="warn">delete</mat-icon>
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
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.prefixTitle.id !== undefined" mat-mini-fab (click)="_handleDelete('prefixTitle')">
          <mat-icon *ngIf="!valIds.prefixTitle.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.prefixTitle.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field appearance="fill"  [style.width.px]=600>
          <mat-label>Publication date</mat-label>
          <app-knora-date-value matInput
                                formControlName="pubdate"
                                (ngModelChange)="_handleInput('pubdate')"></app-knora-date-value>
        </mat-form-field>
        <button *ngIf="valIds.pubdate.changed" mat-mini-fab (click)="_handleUndo('pubdate')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <button *ngIf="valIds.pubdate.id !== undefined" mat-mini-fab (click)="_handleDelete('pubdate')">
          <mat-icon *ngIf="!valIds.pubdate.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.pubdate.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="subjects">
          <mat-label>Subjects</mat-label>
          <div *ngFor="let subjectItem of getSubjects().controls; let i=index">
            <mat-form-field [formGroup]="subjectItem" [style.width.px]=300>
              <mat-select matInput
                          placeholder="Subject"
                          formControlName="subjectIri"
                          (selectionChange)="_handleInput('subjects', i)">
                <mat-option *ngFor="let lt of subjectTypes" [value]="lt.iri">
                  {{lt.name}}
                </mat-option>
              </mat-select>
            </mat-form-field>
            <button *ngIf="valIds.subjects[i].changed" mat-mini-fab (click)="_handleUndo('subjects', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button
                *ngIf="valIds.subjects[i].id !== undefined"
                mat-mini-fab (click)="_handleDelete('subjects', i)">
              <mat-icon *ngIf="!valIds.subjects[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.subjects[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.subjects[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('subjects', i)">
              <mat-icon *ngIf="!valIds.subjects[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addSubject()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <br/>
        <div>&nbsp;</div>

        <div formArrayName="lexias">
          <mat-label>Is Lexia (lexia)</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem">
              <input matInput [matAutocomplete]="autoLexia"
                     formControlName="lexiaName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Mentioned in (passage)"
                     aria-label="Value"
                     (change)="_handleInput('lexias', i)"
                     (input)="_handleLinkInput('lexias', i)">
              <input matInput formControlName="lexiaIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoLexia="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'lexias', i)">
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
        <div>&nbsp;</div>

        <div formArrayName="performedBy">
          <mat-label>Performed by (company)</mat-label>
          <div *ngFor="let performedByItem of getPerformedBys().controls; let i=index">
            <mat-form-field [formGroup]="performedByItem">
              <input matInput [matAutocomplete]="autoPerformedBy"
                     formControlName="performedByName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Performed by (company)"
                     aria-label="Value"
                     (change)="_handleInput('performedBy', i)"
                     (input)="_handleLinkInput('performedBy', i)">
              <input matInput formControlName="performedByIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoPerformedBy="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'performedBy', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.performedBy[i].changed" mat-mini-fab (click)="_handleUndo('performedBy', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.performedBy[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('performedBy', i)">
              <mat-icon *ngIf="!valIds.performedBy[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.performedBy[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.performedBy[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('performedBy', i)">
              <mat-icon *ngIf="!valIds.performedBy[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addPerformedBy()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div>&nbsp;</div>

        <div formArrayName="performedByActor">
          <mat-label>Performed by actor (person)</mat-label>
          <div *ngFor="let performedByActorItem of getPerformedByActors().controls; let i=index">
            <mat-form-field [formGroup]="performedByActorItem">
              <input matInput [matAutocomplete]="autoPerformedByActor"
                     formControlName="performedByActorName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Performed by actor (person)"
                     aria-label="Value"
                     (change)="_handleInput('performedByActor', i)"
                     (input)="_handleLinkInput('performedByActor', i)">
              <input matInput formControlName="performedByActorIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoPerformedByActor="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'performedByActor', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.performedByActor[i].changed" mat-mini-fab (click)="_handleUndo('performedByActor', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.performedByActor[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('performedByActor', i)">
              <mat-icon *ngIf="!valIds.performedByActor[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.performedByActor[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.performedByActor[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('performedByActor', i)">
              <mat-icon *ngIf="!valIds.performedByActor[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addPerformedByActor()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div>&nbsp;</div>

        <div formArrayName="performedIn">
          <mat-label>Performed in (venue)</mat-label>
          <div *ngFor="let performedInItem of getPerformedIns().controls; let i=index">
            <mat-form-field [formGroup]="performedInItem">
              <input matInput [matAutocomplete]="autoPerformedIn"
                     formControlName="performedInName"
                     class="knora-link-input-element klnkie-val full-width"
                     placeholder="Performed in (venue)"
                     aria-label="Value"
                     (change)="_handleInput('performedIn', i)"
                     (input)="_handleLinkInput('performedIn', i)">
              <input matInput formControlName="performedInIri" [hidden]="true" ><br/>
              <mat-autocomplete #autoPerformedIn="matAutocomplete"
                                (optionSelected)="_optionSelected($event.option.value, 'performedIn', i)">
                <mat-option *ngFor="let option of options" [value]="option.label">
                  {{ option.label }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>

            <button *ngIf="valIds.performedIn[i].changed" mat-mini-fab (click)="_handleUndo('performedIn', i)">
              <mat-icon color="warn">cached</mat-icon>
            </button>
            <button *ngIf="valIds.performedIn[i].id !== undefined"
                    mat-mini-fab (click)="_handleDelete('performedIn', i)">
              <mat-icon *ngIf="!valIds.performedIn[i].toBeDeleted" color="basic">delete</mat-icon>
              <mat-icon *ngIf="valIds.performedIn[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>
            <button *ngIf="valIds.performedIn[i].id === undefined"
                    mat-mini-fab (click)="_handleDelete('performedIn', i)">
              <mat-icon *ngIf="!valIds.performedIn[i].toBeDeleted" color="basic">delete</mat-icon>
            </button>
          </div>
          <button mat-mini-fab (click)="addPerformedIn()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <div>&nbsp;</div>

      </mat-card-content>

      <mat-card-actions>
        <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
        <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
        <button *ngIf="inData.bookIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
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
export class EditBookComponent implements OnInit {
  controlType = 'EditBook';
  inData: any;
  form: FormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  data: BookData = new BookData('', '', '', new DateValue(), '', [], {languageIri: ''},
      [], '', '', '', new DateValue(), '', new DateValue(), [],
      [], [], [], []);
  nGenres: number;
  nWrittenBy: number;
  nSubjects: number;
  nLexias: number;
  nPerformedBy: number;
  nPerformedByActor: number;
  nPerformedIn: number;
  working: boolean;
  public valIds: BookIds = new BookIds();
  public genreTypes: Array<OptionType>;
  public languageTypes: Array<OptionType>;
  public subjectTypes: Array<OptionType>;

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
    this.genreTypes = knoraService.genreTypes;
    console.log(this.genreTypes);
    this.languageTypes = knoraService.languageTypes;
    this.subjectTypes = knoraService.subjectTypes;
    this.nGenres = 0;
    this.nWrittenBy = 0;
    this.nSubjects = 0;
    this.nLexias = 0;
    this.nPerformedBy = 0;
    this.nPerformedByActor = 0;
    this.nPerformedIn = 0;
  }

  @Input()
  get value(): BookData | null {
    const genres: FormArray = this.getGenres();
    const genreIriValues: { genreIri: string }[] = [];
    for (const x of genres.controls) {
      const y = x as FormGroup;
      genreIriValues.push({genreIri: y.controls.genreIri.value});
    }
    const writtenBys: FormArray = this.getWrittenBys();
    const writtenByValues: { writtenByName: string; writtenByIri: string }[] = [];
    for (const x of writtenBys.controls) {
      writtenByValues.push(x.value);
    }
    const subjects: FormArray = this.getSubjects();
    const subjectIriValues: { subjectIri: string }[] = [];
    for (const x of subjects.controls) {
      const y = x as FormGroup;
      subjectIriValues.push({subjectIri: y.controls.subjectIri.value});
    }
    const lexias: FormArray = this.getLexias();
    const lexiaValues: { lexiaName: string; lexiaIri: string }[] = [];
    for (const x of lexias.controls) {
      lexiaValues.push(x.value);
    }
    const performedBys: FormArray = this.getPerformedBys();
    const performedByValues: { performedByName: string; performedByIri: string }[] = [];
    for (const x of performedBys.controls) {
      performedByValues.push(x.value);
    }
    const performedByActors: FormArray = this.getPerformedByActors();
    const performedByActorValues: { performedByActorName: string; performedByActorIri: string }[] = [];
    for (const x of performedByActors.controls) {
      performedByActorValues.push(x.value);
    }
    const performedIns: FormArray = this.getPerformedIns();
    const performedInValues: { performedInName: string; performedInIri: string }[] = [];
    for (const x of performedIns.controls) {
      performedInValues.push(x.value);
    }
    return new BookData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.title.value,
        this.form.controls.creationDate.value,
        this.form.controls.edition.value,
        genreIriValues,
        {languageIri: this.form.controls.language.value},
        writtenByValues,
        this.form.controls.comment.value,
        this.form.controls.extraInfo.value,
        this.form.controls.editionHist.value,
        this.form.controls.firstPerformance.value,
        this.form.controls.prefixTitle.value,
        this.form.controls.pubdate.value,
        subjectIriValues,
        lexiaValues,
        performedByValues,
        performedByActorValues,
        performedInValues
    );
  }

  set value(knoraVal: BookData | null) {
    const {
      label, internalId, title, creationDate, edition, genres, language, writtenBy, comment,
      extraInfo, editionHist, firstPerformance, prefixTitle, pubdate, subjects, lexias, performedBy,
      performedByActor, performedIn
    }
        = knoraVal || new BookData('', '', '', new DateValue(),
        '', [], {languageIri: ''}, [], '', '',
        '', new DateValue(), '', new DateValue(), [], [], [],
        [], []);
    this.form.setValue({
      label, internalId, title, creationDate, edition, genres,
      language, writtenBy, comment, extraInfo, editionHist, firstPerformance, prefixTitle,
      pubdate, subjects, lexias, performedBy, performedByActor, performedIn
    });

  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.bookIri = arr[0].iri;
      }
      if (this.inData.bookIri !== undefined) {
        this.knoraService.getResource(this.inData.bookIri).subscribe((data) => {
          if (this.inData.bookIri !== undefined) {
              console.log('DATA: ', data);
              this.resId = data.id;
              this.lastmod = data.lastmod;
              this.form.controls.label.setValue(data.label);
              this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
              this.data.label = data.label;
              for (const ele of data.properties) {
                switch (ele.propname) {
                  case this.knoraService.wwOntology + 'hasBookInternalId': {
                    this.form.controls.internalId.setValue(ele.values[0]);
                    this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.internalId = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasBookTitle': {
                      this.form.controls.title.setValue(ele.values[0]);
                      this.valIds.title = {id: ele.ids[0], changed: false, toBeDeleted: false};
                      this.data.title = ele.values[0];
                      break;
                  }
                  case this.knoraService.wwOntology + 'hasCreationDate': {
                    const dateValue = DateValue.parseDateValueFromKnora(ele.values[0]);
                    this.form.controls.creationDate.setValue(dateValue);
                    this.valIds.creationDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.creationDate = dateValue;
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasEdition': {
                    this.form.controls.edition.setValue(ele.values[0]);
                    this.valIds.edition = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.edition = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasGenre': {
                    const tmp = ele as ListPropertyData;
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addGenre({id: tmp.ids[i], iri: tmp.nodeIris[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasLanguage': {
                    const tmp = ele as ListPropertyData;
                    this.form.controls.language.setValue(tmp.nodeIris[0]);
                    this.valIds.language = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                    this.data.language = {languageIri: tmp.nodeIris[0]};
                    break;
                  }
                  case this.knoraService.wwOntology + 'isWrittenByValue': {
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addWrittenBy({writtenByName: ele.values[i], writtenByIri: ele.ids[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasBookComment': {
                    this.form.controls.comment.setValue(ele.values[0]);
                    this.valIds.comment = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.comment = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasBookExtraInfo': {
                    this.form.controls.extraInfo.setValue(ele.values[0]);
                    this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.extraInfo = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasEditionHistory': {
                    this.form.controls.editionHist.setValue(ele.values[0]);
                    this.valIds.editionHist = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.editionHist = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasFirstPerformanceDate': {
                    const dateValue = DateValue.parseDateValueFromKnora(ele.values[0]);
                    this.form.controls.firstPerformance.setValue(dateValue);
                    this.valIds.firstPerformance = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.firstPerformance = dateValue;
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasPrefixBookTitle': {
                    this.form.controls.prefixTitle.setValue(ele.values[0]);
                    this.valIds.prefixTitle = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.prefixTitle = ele.values[0];
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasPublicationDate': {
                    const dateValue = DateValue.parseDateValueFromKnora(ele.values[0]);
                    this.form.controls.pubdate.setValue(dateValue);
                    this.valIds.pubdate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                    this.data.pubdate = dateValue;
                    break;
                  }
                  case this.knoraService.wwOntology + 'hasSubject': {
                    const tmp = ele as ListPropertyData;
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addSubject({id: tmp.ids[i], iri: tmp.nodeIris[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'isLexiaBookValue': {
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addLexia({lexiaName: ele.values[i], lexiaIri: ele.ids[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'performedByValue': {
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addPerformedBy({performedByName: ele.values[i], performedByIri: ele.ids[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'performedByActorValue': {
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addPerformedByActor({performedByActorName: ele.values[i], performedByActorIri: ele.ids[i]});
                    }
                    break;
                  }
                  case this.knoraService.wwOntology + 'performedInValue': {
                    for (let i = 0; i < ele.values.length; i++) {
                      this.addPerformedIn({performedInName: ele.values[i], performedInIri: ele.ids[i]});
                    }
                    break;
                  }
                }
              }
            }
        });
      }
      let gInitial;
      if (this.inData.bookIri === undefined) {
        this.valIds.genres[0] = {id: this.genreTypes[0].iri, changed: false, toBeDeleted: false};
        gInitial = [
          this.fb.group({
            genreIri: [this.genreTypes[0].iri, [Validators.required]]
          })
        ];
      } else {
        gInitial = [];
      }
      let wbInitial;
      if (this.inData.bookIri === undefined) {
        this.valIds.writtenBy[0] = {id: '', changed: false, toBeDeleted: false};
        wbInitial = [
          this.fb.group({
            writtenByIri: ['', [Validators.required]], writtenByName: [, []]
          })
        ];
      } else {
        wbInitial = [];
      }
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        title: [this.data.title, [Validators.required]],
        creationDate: [this.data.creationDate, [Validators.required]],
        edition: [this.data.edition, [Validators.required]],
        genres: this.fb.array(gInitial),
        language: [this.data.language?.languageIri || this.languageTypes[0].iri, [Validators.required]],
        writtenBy: this.fb.array(wbInitial),
        comment: [this.data.comment, []],
        extraInfo: [this.data.extraInfo, []],
        editionHist: [this.data.editionHist, []],
        firstPerformance: [this.data.firstPerformance, []],
        prefixTitle: [this.data.prefixTitle, []],
        pubdate: [this.data.pubdate, []],
        subjects: this.fb.array([]), //this.fb.array(sInitial),
        lexias: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
        performedBy: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
        performedByActor: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
        performedIn: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
      });
      //this.addWrittenBy();
    });
  }

  getGenres(): FormArray {
    return this.form.controls.genres as FormArray;
  }

  addGenre(genre?: { id: string; iri: string }): void {
    const genres = this.getGenres();
    if (genre?.iri === undefined) {
      genres.push(this.fb.group({genreIri: this.genreTypes[0].iri}));
      this.data.genres.push({genreIri: this.genreTypes[0].iri});
      this.valIds.genres.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      genres.push(this.fb.group({genreIri: genre.iri}));
      this.data.genres.push({genreIri: genre.iri});
      this.valIds.genres.push({id: genre.id, changed: false, toBeDeleted: false});
    }
    this.nGenres++;
  }

  removeGenre(index: number): void {
    const genres = this.getGenres();
    genres.removeAt(index);
    this.valIds.genres.splice(index, 1);
    this.data.genres.splice(index, 1);
    this.nGenres--;
  }

  getWrittenBys() {
    return this.form.controls.writtenBy as FormArray;
  }

  addWrittenBy(writtenBy?: { writtenByName: string; writtenByIri: string }) {
    const tmp = this.getWrittenBys();
    if (writtenBy === undefined) {
      tmp.push(this.fb.group({writtenByName: '', writtenByIri: ''}));
      this.data.writtenBy.push({writtenByName: '', writtenByIri: ''});
      this.valIds.writtenBy.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      tmp.push(this.fb.group({writtenByName: writtenBy.writtenByName, writtenByIri: writtenBy.writtenByIri}));
      this.data.writtenBy.push({writtenByName: writtenBy.writtenByName, writtenByIri: writtenBy.writtenByIri});
      this.valIds.writtenBy.push({id: writtenBy.writtenByIri, changed: false, toBeDeleted: false});
    }
    this.nWrittenBy++;
  }

  removeWrittenBy(index: number): void {
    const tmp = this.getWrittenBys();
    tmp.removeAt(index);
    this.valIds.writtenBy.splice(index, 1);
    this.data.writtenBy.splice(index, 1);
    this.nWrittenBy--;
  }

  getSubjects(): FormArray {
    return this.form.controls.subjects as FormArray;
  }

  addSubject(subject?: { id: string; iri: string }): void {
    const subjects = this.getSubjects();
    if (subject?.iri === undefined) {
      subjects.push(this.fb.group({subjectIri: this.subjectTypes[0].iri}));
      this.data.subjects.push({subjectIri: this.subjectTypes[0].iri});
      this.valIds.subjects.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      subjects.push(this.fb.group({subjectIri: subject.iri}));
      this.data.subjects.push({subjectIri: subject.iri});
      this.valIds.subjects.push({id: subject.id, changed: false, toBeDeleted: false});
    }
    this.nSubjects++;
  }

  removeSubject(index: number): void {
    const subjects = this.getSubjects();
    subjects.removeAt(index);
    this.valIds.subjects.splice(index, 1);
    this.data.subjects.splice(index, 1);
    this.nSubjects--;
  }

  getLexias() {
    return this.form.controls.lexias as FormArray;
  }

  addLexia(lexia?: { lexiaName: string; lexiaIri: string }) {
    const tmp = this.getLexias();
    if (lexia === undefined) {
      tmp.push(this.fb.group({lexiaName: '', lexiaIri: ''}));
      this.data.lexias.push({lexiaName: '', lexiaIri: ''});
      this.valIds.lexias.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      tmp.push(this.fb.group({lexiaName: lexia.lexiaName, lexiaIri: lexia.lexiaIri}));
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

  getPerformedBys() {
    return this.form.controls.performedBy as FormArray;
  }

  addPerformedBy(performedBy?: { performedByName: string; performedByIri: string }) {
    const tmp = this.getPerformedBys();
    if (performedBy === undefined) {
      tmp.push(this.fb.group({performedByName: '', performedByIri: ''}));
      this.data.performedBy.push({performedByName: '', performedByIri: ''});
      this.valIds.performedBy.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      tmp.push(this.fb.group({
        performedByName: performedBy.performedByName,
        performedByIri: performedBy.performedByIri
      }));
      this.data.performedBy.push({
        performedByName: performedBy.performedByName,
        performedByIri: performedBy.performedByIri
      });
      this.valIds.performedBy.push({id: performedBy.performedByIri, changed: false, toBeDeleted: false});
    }
    this.nPerformedBy++;
  }

  removePerformedBy(index: number): void {
    const tmp = this.getPerformedBys();
    tmp.removeAt(index);
    this.valIds.performedBy.splice(index, 1);
    this.data.performedBy.splice(index, 1);
    this.nPerformedBy--;
  }

  getPerformedByActors() {
    return this.form.controls.performedByActor as FormArray;
  }

  addPerformedByActor(performedByActor?: { performedByActorName: string; performedByActorIri: string }) {
    const tmp = this.getPerformedByActors();
    if (performedByActor === undefined) {
      tmp.push(this.fb.group({performedByActorName: '', performedByActorIri: ''}));
      this.data.performedByActor.push({performedByActorName: '', performedByActorIri: ''});
      this.valIds.performedByActor.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      tmp.push(this.fb.group({
        performedByActorName: performedByActor.performedByActorName,
        performedByActorIri: performedByActor.performedByActorIri
      }));
      this.data.performedByActor.push({
        performedByActorName: performedByActor.performedByActorName,
        performedByActorIri: performedByActor.performedByActorIri
      });
      this.valIds.performedByActor.push({id: performedByActor.performedByActorIri, changed: false, toBeDeleted: false});
    }
    this.nPerformedByActor++;
  }

  removePerformedByActor(index: number): void {
    const tmp = this.getPerformedBys();
    tmp.removeAt(index);
    this.valIds.performedByActor.splice(index, 1);
    this.data.performedByActor.splice(index, 1);
    this.nPerformedByActor--;
  }

  getPerformedIns() {
    return this.form.controls.performedIn as FormArray;
  }

  addPerformedIn(performedIn?: { performedInName: string; performedInIri: string }) {
    const tmp = this.getPerformedIns();
    if (performedIn === undefined) {
      tmp.push(this.fb.group({performedInName: '', performedInIri: ''}));
      this.data.performedIn.push({performedInName: '', performedInIri: ''});
      this.valIds.performedIn.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      tmp.push(this.fb.group({
        performedInName: performedIn.performedInName,
        performedInIri: performedIn.performedInIri
      }));
      this.data.performedIn.push({
        performedInName: performedIn.performedInName,
        performedInIri: performedIn.performedInIri
      });
      this.valIds.performedIn.push({id: performedIn.performedInIri, changed: false, toBeDeleted: false});
    }
    this.nPerformedIn++;
  }

  removePerformedIn(index: number): void {
    const tmp = this.getPerformedIns();
    tmp.removeAt(index);
    this.valIds.performedIn.splice(index, 1);
    this.data.performedIn.splice(index, 1);
    this.nPerformedIn--;
  }

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

  _handleLinkInput(what: string, index?: number): void {
    switch (what) {
      case 'writtenBy':
        const writtenBy = this.getWrittenBys();
        const writtenByName = writtenBy.value[index].writtenByName;

        this.valIds.writtenBy[index].changed = true;
        if (writtenByName.length >= 3) {
          this.knoraService.getResourcesByLabel(writtenByName, this.knoraService.wwOntology + 'person').subscribe(
              res => {
                this.options = res;
                this.form.value.writtenBy[index].writtenByName = res[0].label;
                this.form.value.writtenBy[index].writtenByIri =  res[0].id;
              }
          );
          break;
        }
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
      case 'performedBy':
        const performedBy = this.getPerformedBys();
        const performedByName = performedBy.value[index].performedByName;

        this.valIds.performedBy[index].changed = true;
        if (performedByName.length >= 3) {
          this.knoraService.getResourcesByLabel(performedByName, this.knoraService.wwOntology + 'company').subscribe(
              res => {
                this.options = res;
                this.form.value.performedBy[index].performedByName = res[0].label;
                this.form.value.performedBy[index].performedByIri =  res[0].id;
              }
          );
        }
        break;
      case 'performedByActor':
        const performedByActor = this.getPerformedByActors();
        const performedByActorName = performedByActor.value[index].performedByActorName;

        this.valIds.performedByActor[index].changed = true;
        if (performedByActorName.length >= 3) {
          this.knoraService.getResourcesByLabel(performedByActorName, this.knoraService.wwOntology + 'person').subscribe(
              res => {
                this.options = res;
                this.form.value.performedByActor[index].performedByActorName = res[0].label;
                this.form.value.performedByActor[index].performedByActorIri =  res[0].id;
              }
          );
        }
        break;
      case 'performedIn':
        const performedIn = this.getPerformedIns();
        const performedInName = performedIn.value[index].performedInName;

        this.valIds.performedIn[index].changed = true;
        if (performedInName >= 3) {
          this.knoraService.getResourcesByLabel(performedInName, this.knoraService.wwOntology + 'venue').subscribe(
              res => {
                this.options = res;
                this.form.value.performedIn[index].performedInName = res[0].label;
                this.form.value.performedIn[index].performedInIri =  res[0].id;
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
    switch (what) {
      case 'writtenBy':
        this.form.value.writtenBy[index].writtenByName = res[0].label;
        this.form.value.writtenBy[index].writtenByIri = res[0].id;
        break;
      case 'lexias':
        this.form.value.lexias[index].lexiaName = res[0].label;
        this.form.value.lexias[index].lexiaIri = res[0].id;
        break;
      case 'performedBy':
        this.form.value.performedBy[index].performedByName = res[0].label;
        this.form.value.performedBy[index].performedByIri = res[0].id;
        break;
      case 'performedByActor':
        this.form.value.performedByActor[index].performedByActorName = res[0].label;
        this.form.value.performedByActor[index].performedByActorIri = res[0].id;
        break;
      case 'performedIn':
        this.form.value.performedIn[index].performedInName = res[0].label;
        this.form.value.performedIn[index].performedInIri = res[0].id;
        break;
    }
    this.value = new BookData(
        this.form.value.label,
        this.form.value.internalId,
        this.form.value.title,
        this.form.value.creationDate,
        this.form.value.edition,
        this.form.value.genres,
        this.form.value.language,
        this.form.value.writtenBy,
        this.form.value.comment,
        this.form.value.extraInfo,
        this.form.value.editionHist,
        this.form.value.firstPerformance,
        this.form.value.prefixTitle,
        this.form.value.pubdate,
        this.form.value.subjects,
        this.form.value.lexias,
        this.form.value.performedBy,
        this.form.value.performedByActor,
        this.form.value.performedIn
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
      case 'title':
        this.valIds.title.changed = true;
        break;
      case 'creationDate':
        this.valIds.creationDate.changed = true;
        break;
      case 'edition':
        this.valIds.edition.changed = true;
        break;
      case 'genres':
        this.valIds.genres[index].changed = true;
        break;
      case 'language':
        this.valIds.language.changed = true;
        break;
      case 'writtenBy':
        this.valIds.writtenBy[index].changed = true;
        break;
      case 'comment':
        this.valIds.comment.changed = true;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.changed = true;
        break;
      case 'editionHist':
        this.valIds.editionHist.changed = true;
        break;
      case 'firstPerformance':
        this.valIds.firstPerformance.changed = true;
        break;
      case 'prefixTitle':
        this.valIds.prefixTitle.changed = true;
        break;
      case 'pubdate':
        this.valIds.pubdate.changed = true;
        break;
      case 'subjects':
        this.valIds.subjects[index].changed = true;
        break;
      case 'lexias':
        this.valIds.lexias[index].changed = true;
        break;
      case 'performedBy':
        this.valIds.performedBy[index].changed = true;
        break;
      case 'performedByActor':
        this.valIds.performedByActor[index].changed = true;
        break;
      case 'performedIn':
        this.valIds.performedIn[index].changed = true;
        break;
    }
  }

  _handleDelete(what: string, index?: number): void {
    switch (what) {
      case 'genres':
        if (this.valIds.genres[index].id !== undefined) {
          this.valIds.genres[index].toBeDeleted = !this.valIds.genres[index].toBeDeleted;
          if (this.valIds.genres[index].toBeDeleted) {
            this.nGenres--;
          } else {
            this.nGenres++;
          }
        } else {
          this.removeGenre(index);
        }
        break;
      case 'writtenBy':
        if (this.valIds.writtenBy[index].id !== undefined) {
          this.valIds.writtenBy[index].toBeDeleted = !this.valIds.writtenBy[index].toBeDeleted;
          if (this.valIds.writtenBy[index].toBeDeleted) {
            this.nWrittenBy--;
          } else {
            this.nWrittenBy++;
          }
        } else {
          this.removeWrittenBy(index);
        }
        break;
      case 'comment':
        this.valIds.comment.toBeDeleted = !this.valIds.comment.toBeDeleted;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
        break;
      case 'editionHist':
        this.valIds.editionHist.toBeDeleted = !this.valIds.editionHist.toBeDeleted;
        break;
      case 'firstPerformance':
        this.valIds.firstPerformance.toBeDeleted = !this.valIds.firstPerformance.toBeDeleted;
        break;
      case 'prefixTitle':
        this.valIds.prefixTitle.toBeDeleted = !this.valIds.prefixTitle.toBeDeleted;
        break;
      case 'pubdate':
        this.valIds.pubdate.toBeDeleted = !this.valIds.pubdate.toBeDeleted;
        break;
      case 'subjects':
        if (this.valIds.subjects[index].id !== undefined) {
          this.valIds.subjects[index].toBeDeleted = !this.valIds.subjects[index].toBeDeleted;
          if (this.valIds.subjects[index].toBeDeleted) {
            this.nSubjects--;
          } else {
            this.nSubjects++;
          }
        } else {
          this.removeSubject(index);
        }
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
      case 'performedBy':
        if (this.valIds.performedBy[index].id !== undefined) {
          this.valIds.performedBy[index].toBeDeleted = !this.valIds.performedBy[index].toBeDeleted;
          if (this.valIds.performedBy[index].toBeDeleted) {
            this.nPerformedBy--;
          } else {
            this.nPerformedBy++;
          }
        } else {
          this.removePerformedBy(index);
        }
        break;
      case 'performedByActor':
        if (this.valIds.performedByActor[index].id !== undefined) {
          this.valIds.performedByActor[index].toBeDeleted = !this.valIds.performedByActor[index].toBeDeleted;
          if (this.valIds.performedByActor[index].toBeDeleted) {
            this.nPerformedByActor--;
          } else {
            this.nPerformedByActor++;
          }
        } else {
          this.removePerformedByActor(index);
        }
        break;
      case 'performedIn':
        if (this.valIds.performedIn[index].id !== undefined) {
          this.valIds.performedIn[index].toBeDeleted = !this.valIds.performedIn[index].toBeDeleted;
          if (this.valIds.performedIn[index].toBeDeleted) {
            this.nPerformedIn--;
          } else {
            this.nPerformedIn++;
          }
        } else {
          this.removePerformedIn(index);
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
      case 'title':
        this.form.controls.title.setValue(this.data.title);
        this.valIds.title.changed = false;
        break;
      case 'creationDate':
        this.form.controls.creationDate.setValue(this.data.creationDate);
        this.valIds.creationDate.changed = false;
        break;
      case 'edition':
        this.form.controls.edition.setValue(this.data.edition);
        this.valIds.edition.changed = false;
        break;
      case 'genres':
        const genres = this.getGenres().controls[index] as FormGroup;
        genres.controls.genreIri.setValue(this.data.genres[index].genreIri);
        this.valIds.genres[index].changed = false;
        break;
      case 'language':
        this.form.controls.language.setValue(this.data.language.languageIri);
        this.valIds.language.changed = false;
        break;
      case 'comment':
        this.form.controls.comment.setValue(this.data.comment);
        this.valIds.comment.changed = false;
        break;
      case 'editionHist':
        this.form.controls.editionHist.setValue(this.data.editionHist);
        this.valIds.editionHist.changed = false;
        break;
      case 'firstPerformance':
        this.form.controls.firstPerformance.setValue(this.data.firstPerformance);
        this.valIds.firstPerformance.changed = false;
        break;
      case 'prefixTitle':
        this.form.controls.prefixTitle.setValue(this.data.prefixTitle);
        this.valIds.prefixTitle.changed = false;
        break;
      case 'pubdate':
        this.form.controls.pubdate.setValue(this.data.pubdate);
        this.valIds.pubdate.changed = false;
        break;
      case 'subjects':
        const subjects = this.getSubjects().controls[index] as FormGroup;
        subjects.controls.subjectIri.setValue(this.data.subjects[index].subjectIri);
        this.valIds.subjects[index].changed = false;
        break;
      case 'lexias':
        this.getLexias().controls[index].setValue(this.data.lexias[index]);
        this.valIds.lexias[index].changed = false;
        break;
      case 'performedBy':
        this.getPerformedBys().controls[index].setValue(this.data.performedBy[index]);
        this.valIds.performedBy[index].changed = false;
        break;
      case 'performedByActor':
        this.getPerformedByActors().controls[index].setValue(this.data.performedByActor[index]);
        this.valIds.performedByActor[index].changed = false;
        break;
      case 'performedIn':
        this.getPerformedIns().controls[index].setValue(this.data.performedIn[index]);
        this.valIds.performedIn[index].changed = false;
        break;
    }
  }

  save(): void {
    this.working = true;
    console.log('this.value:', this.value);
    if (this.inData.bookIri === undefined) {
      this.knoraService.createBook(this.value).subscribe(
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
            this.knoraService.wwOntology + 'book',
            this.form.value.label,
            this.lastmod);
        obs.push(gaga);
      }

      if (this.valIds.internalId.toBeDeleted && this.valIds.internalId.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasBookInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasBookInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasBookInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      if (this.valIds.title.toBeDeleted && this.valIds.title.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.title.id as string,
            this.knoraService.wwOntology + 'hasBookTitle');
        obs.push(gaga);
      } else if (this.valIds.title.changed) {
        let gaga: Observable<string>;
        if (this.valIds.title.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasBookTitle',
              this.value.title);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.title.id as string,
              this.knoraService.wwOntology + 'hasBookTitle',
              this.value.title);
        }
        obs.push(gaga);
      }

      if (this.valIds.creationDate.toBeDeleted && this.valIds.creationDate.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteDateValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.creationDate.id as string,
            this.knoraService.wwOntology + 'hasCreationDate');
        obs.push(gaga);
      } else if (this.valIds.creationDate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.creationDate.id === undefined) {
          const creationDate = this.form.value.creationDate;
          const creationDateValue = new DateValue(
              creationDate.calendar,
              creationDate.timeSpan,
              creationDate.startYear,
              creationDate.startMonth,
              creationDate.startDay,
              creationDate.endYear,
              creationDate.endMonth,
              creationDate.endDay);
          gaga = this.knoraService.createDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasCreationDate',
              creationDateValue);
          console.log('gaga:', gaga);
        } else {
          const creationDate = this.form.value.creationDate;
          const creationDateValue = new DateValue(
              creationDate.calendar,
              creationDate.timeSpan,
              creationDate.startYear,
              creationDate.startMonth,
              creationDate.startDay,
              creationDate.endYear,
              creationDate.endMonth,
              creationDate.endDay);
          console.log('CHANGED:', creationDateValue);
          gaga = this.knoraService.updateDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.creationDate.id as string,
              this.knoraService.wwOntology + 'hasCreationDate',
              creationDateValue);
        }
        obs.push(gaga);
      }

      if (this.valIds.edition.toBeDeleted && this.valIds.edition.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.edition.id as string,
            this.knoraService.wwOntology + 'hasEdition');
        obs.push(gaga);
      } else if (this.valIds.edition.changed) {
        let gaga: Observable<string>;
        if (this.valIds.edition.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasEdition',
              this.value.edition);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.edition.id as string,
              this.knoraService.wwOntology + 'hasEdition',
              this.value.edition);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.genres) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'hasGenre');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'hasGenre',
                this.value.genres[index].genreIri);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'hasGenre',
                this.value.genres[index].genreIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      if (this.valIds.language.toBeDeleted && this.valIds.language.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteListValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.language.id as string,
            this.knoraService.wwOntology + 'hasLanguage');
        obs.push(gaga);
      } else if (this.valIds.language.changed) {
        let gaga: Observable<string>;
        if (this.valIds.language.id === undefined) {
          gaga = this.knoraService.createListValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasLanguage',
              this.form.value.language);
        } else {
          gaga = this.knoraService.updateListValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.language.id as string,
              this.knoraService.wwOntology + 'hasLanguage',
              this.form.value.language);
        }
        obs.push(gaga);
      }

      index = 0;
      for (const valId of this.valIds.writtenBy) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'isWrittenByValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'isWrittenByValue',
                this.value.writtenBy[index].writtenByIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'isWrittenByValue',
                this.value.writtenBy[index].writtenByIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      if (this.valIds.comment.toBeDeleted && this.valIds.comment.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.comment.id as string,
            this.knoraService.wwOntology + 'hasBookComment');
        obs.push(gaga);
      } else if (this.valIds.comment.changed) {
        let gaga: Observable<string>;
        if (this.valIds.comment.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasBookComment',
              this.value.comment);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.comment.id as string,
              this.knoraService.wwOntology + 'hasBookComment',
              this.value.comment);
        }
        obs.push(gaga);
      }

      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasBookExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasBookExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasBookExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      if (this.valIds.editionHist.toBeDeleted && this.valIds.editionHist.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.editionHist.id as string,
            this.knoraService.wwOntology + 'hasEditionHistory');
        obs.push(gaga);
      } else if (this.valIds.editionHist.changed) {
        let gaga: Observable<string>;
        if (this.valIds.editionHist.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasEditionHistory',
              this.value.editionHist);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.editionHist.id as string,
              this.knoraService.wwOntology + 'hasEditionHistory',
              this.value.editionHist);
        }
        obs.push(gaga);
      }

      if (this.valIds.firstPerformance.toBeDeleted && this.valIds.firstPerformance.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteDateValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.firstPerformance.id as string,
            this.knoraService.wwOntology + 'hasFirstPerformanceDate');
        obs.push(gaga);
      } else if (this.valIds.firstPerformance.changed) {
        let gaga: Observable<string>;
        if (this.valIds.firstPerformance.id === undefined) {
          const firstPerformance = this.form.value.firstPerformance;
          const firstPerformanceValue = new DateValue(
              firstPerformance.calendar,
              firstPerformance.timeSpan,
              firstPerformance.startYear,
              firstPerformance.startMonth,
              firstPerformance.startDay,
              firstPerformance.endYear,
              firstPerformance.endMonth,
              firstPerformance.endDay);
          gaga = this.knoraService.createDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasFirstPerformanceDate',
              firstPerformanceValue);
          console.log('gaga:', gaga);
        } else {
          const firstPerformance = this.form.value.firstPerformance;
          const firstPerformanceValue = new DateValue(
              firstPerformance.calendar,
              firstPerformance.timeSpan,
              firstPerformance.startYear,
              firstPerformance.startMonth,
              firstPerformance.startDay,
              firstPerformance.endYear,
              firstPerformance.endMonth,
              firstPerformance.endDay);
          console.log('CHANGED:', firstPerformanceValue);
          gaga = this.knoraService.updateDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.firstPerformance.id as string,
              this.knoraService.wwOntology + 'hasFirstPerformanceDate',
              firstPerformanceValue);
        }
        obs.push(gaga);
      }

      if (this.valIds.prefixTitle.toBeDeleted && this.valIds.prefixTitle.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.prefixTitle.id as string,
            this.knoraService.wwOntology + 'hasPrefixBookTitle');
        obs.push(gaga);
      } else if (this.valIds.prefixTitle.changed) {
        let gaga: Observable<string>;
        if (this.valIds.prefixTitle.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasPrefixBookTitle',
              this.value.prefixTitle);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.prefixTitle.id as string,
              this.knoraService.wwOntology + 'hasPrefixBookTitle',
              this.value.prefixTitle);
        }
        obs.push(gaga);
      }

      if (this.valIds.pubdate.toBeDeleted && this.valIds.pubdate.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteDateValue(
            this.resId,
            this.knoraService.wwOntology + 'book',
            this.valIds.pubdate.id as string,
            this.knoraService.wwOntology + 'hasPublicationDate');
        obs.push(gaga);
      } else if (this.valIds.pubdate.changed) {
        let gaga: Observable<string>;
        if (this.valIds.pubdate.id === undefined) {
          const pubdate = this.form.value.pubdate;
          const pubdateValue = new DateValue(
              pubdate.calendar,
              pubdate.timeSpan,
              pubdate.startYear,
              pubdate.startMonth,
              pubdate.startDay,
              pubdate.endYear,
              pubdate.endMonth,
              pubdate.endDay);
          gaga = this.knoraService.createDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.knoraService.wwOntology + 'hasPublicationDate',
              pubdateValue);
          console.log('gaga:', gaga);
        } else {
          const pubdate = this.form.value.pubdate;
          const pubdateValue = new DateValue(
              pubdate.calendar,
              pubdate.timeSpan,
              pubdate.startYear,
              pubdate.startMonth,
              pubdate.startDay,
              pubdate.endYear,
              pubdate.endMonth,
              pubdate.endDay);
          console.log('CHANGED:', pubdateValue);
          gaga = this.knoraService.updateDateValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              this.valIds.pubdate.id as string,
              this.knoraService.wwOntology + 'hasPublicationDate',
              pubdateValue);
        }
        obs.push(gaga);
      }

      index = 0;
      for (const valId of this.valIds.subjects) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'hasSubject');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'hasSubject',
                this.value.subjects[index].subjectIri);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'hasSubject',
                this.value.subjects[index].subjectIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.lexias) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'isLexiaBookValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'isLexiaBookValue',
                this.value.lexias[index].lexiaIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'isLexiaBookValue',
                this.value.lexias[index].lexiaIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.performedBy) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'performedByValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'performedByValue',
                this.value.performedBy[index].performedByIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'performedByValue',
                this.value.performedBy[index].performedByIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.performedByActor) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'performedByActorValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'performedByActorValue',
                this.value.performedByActor[index].performedByActorIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'performedByActorValue',
                this.value.performedByActor[index].performedByActorIri);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.performedIn) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'book',
              valId.id as string,
              this.knoraService.wwOntology + 'performedInValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                this.knoraService.wwOntology + 'performedInValue',
                this.value.performedIn[index].performedInIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'book',
                valId.id as string,
                this.knoraService.wwOntology + 'performedInValue',
                this.value.performedIn[index].performedInIri);
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
            this.snackBar.open('Fehler beim Speichern der Daten des book-Eintrags!', 'OK');
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
      title: 'Delete book',
      text: 'Do You really want to delete this book?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        console.log('lastmod', this.lastmod);
        this.knoraService.deleteResource(this.resId, 'book', this.lastmod, data.comment).subscribe(
            res => {
              this.working = false;
              this.location.back();
            },
            error => {
              this.snackBar.open('Error while deleting the book entry!', 'OK');
              console.log('deleteResource:ERROR:: ', error);
              this.working = false;
              this.location.back();
            });
      }
    });

  }
}

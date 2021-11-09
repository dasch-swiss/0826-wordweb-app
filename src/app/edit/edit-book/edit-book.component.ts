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
  BookData, PassageData
} from '../../services/knora.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';
import {DateValue} from "../date-value/date-value.component";


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

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Edition"
                 formControlName="edition"
                 (input)="_handleInput('edition')">
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
                 placeholder="Extra Info"
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
                 placeholder="First performance"
                 formControlName="firstPerformance"
                 (input)="_handleInput('firstPerformance')">
        </mat-form-field>
        <button *ngIf="valIds.firstPerformance.changed" mat-mini-fab (click)="_handleUndo('firstPerformance')">
          <mat-icon>cached</mat-icon>
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
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.prefixTitle.id !== undefined" mat-mini-fab (click)="_handleDelete('prefixTitle')">
          <mat-icon *ngIf="!valIds.prefixTitle.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.prefixTitle.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]=400>
          <input matInput
                 class="full-width"
                 placeholder="Publication date"
                 formControlName="pubdate"
                 (input)="_handleInput('pubdate')">
        </mat-form-field>
        <button *ngIf="valIds.pubdate.changed" mat-mini-fab (click)="_handleUndo('pubdate')">
          <mat-icon>cached</mat-icon>
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
                          (selectionChange)="_handleInput('subject', i)">
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
export class EditBookComponent implements OnInit {
  controlType = 'EditPassage';
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
        this.form.controls.title.value,
        this.form.controls.internalId.value,
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
  }

  getGenres(): FormArray {
    return this.form.controls.genres as FormArray;
  }

  addGenre(genre?: { id: string; iri: string }): void {
    const genres = this.getGenres();
    if (genre.iri === undefined) {
      genres.push(this.fb.group({functionVoiceIri: this.genreTypes[0].iri}));
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
    if (subject.iri === undefined) {
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
        this.knoraService.getResourcesByLabel(writtenByName, this.knoraService.wwOntology + 'person').subscribe(
            res => {
              this.options = res;
              this.form.value.writtenBy[index].writtenByName = res[0].label;
              this.form.value.writtenBy[index].writtenByIri =  res[0].id;
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
    switch (what) {
      case 'writtenBy':
        this.form.value.writtenBy[index].writtenByName = res[0].label;
        this.form.value.writtenBy[index].writtenByIri = res[0].id;
        break;
    }
    this.value = new BookData(
        this.form.value.label,
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
    }
  }

  _handleDelete(what: string, index?: number): void {
    switch (what) {
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
        genres.controls.functionVoiceIri.setValue(this.data.genres[index].genreIri);
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
    }
  }

  save(): void {
    //this.working = true;
    console.log('this.value:', this.value);
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

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
          <mat-form-field [formGroup]="formalClassItem" [style.width.px]=300>
            <mat-select matInput
                        placeholder="formalClass"
                        formControlName="formalClassIri"
                        (selectionChange)="_handleInput('formalClasses', i)">
              <mat-option *ngFor="let lt of formalClassTypes" [value]="lt.iri">
                {{lt.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button *ngIf="valIds.formalClasses[i].changed" mat-mini-fab (click)="_handleUndo('formalClasses')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <button *ngIf="valIds.formalClasses[i].id !== undefined" mat-mini-fab (click)="_handleDelete('formalClasses', i)">
            <mat-icon *ngIf="!valIds.formalClasses[i].toBeDeleted" color="basic">delete</mat-icon>
            <mat-icon *ngIf="valIds.formalClasses[i].toBeDeleted" color="warn">delete</mat-icon>
          </button>
        </div>
        <button mat-mini-fab (click)="addFormalClass()">
          <mat-icon>add</mat-icon>
        </button>

      </div>
      <br/>

      <div formArrayName="images">
        <mat-label>Image</mat-label>
        <div *ngFor="let imageItem of getImages().controls; let i=index">
          <mat-form-field [formGroup]="imageItem" [style.width.px]=300>
            <mat-select matInput required
                        placeholder="Image"
                        formControlName="imageIri"
                        (selectionChange)="_handleInput('images', i)">
              <mat-option *ngFor="let lt of imageTypes" [value]="lt.iri">
                {{lt.name}}
              </mat-option>
            </mat-select>
          </mat-form-field>
          <button *ngIf="valIds.images[i].changed" mat-mini-fab (click)="_handleUndo('images')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
        </div>
        <button mat-mini-fab (click)="addImage()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
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
      <br/>

    </mat-card-content>

    <mat-card-actions>
      <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
      <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
      <button *ngIf="inData.companyIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
      <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
    </mat-card-actions>

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
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
    this.formalClassTypes = knoraService.formalClassTypes;
    console.log('formalClassTypes:', this.formalClassTypes);
    this.imageTypes = knoraService.imageTypes;
  }

  @Input()
  get value(): LexiaData | null {
    const formalClasses: FormArray = this.getFormalClasses();
    const formalClassIriValues: string[] = [];
    for (const x of formalClasses.controls) {
      formalClassIriValues.push(x.value);
    }
    const images: FormArray = this.getImages();
    const imagesIriValues: string[] = [];
    for (const x of images.controls) {
      imagesIriValues.push(x.value);
    }
    return new LexiaData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.title.value,
        formalClassIriValues,
        imagesIriValues,
        this.form.controls.displayedTitle.value,
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
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.lexiaIri = arr[0].iri;
      }
      if (this.inData.lexiaIri !== undefined) {
        this.knoraService.getResource(this.inData.lexiaIri).subscribe((data) => {
          if (this.inData.lexiaIri !== undefined) {
            console.log('DATA: ', data);
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.wwOntology + 'hasLexiaTitle': {
                  this.form.controls.title.setValue(ele.values[0]);
                  this.valIds.title = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.title = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasLexiaInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasLexiaExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasFormalClass': {
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addFormalClass(ele.values[i]);
                  }
                }
              }
            }
          }
        });
      }
      this.valIds.formalClasses[0] = {id: undefined, changed: false, toBeDeleted: false};
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        title: [this.data.title, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        formalClasses: this.fb.array([
          this.fb.group({
            formalClassIri: ['http://rdfh.ch/lists/0826/a2YTLJSYRqmQ_TLH4BwV_Q', [Validators.required]]
          })
        ]),
        images: this.fb.array([
          /*this.fb.group({formalClassIri: ''}),*/
        ]),
        displayedTitle: [this.data.displayedTitle, []],
        extraInfo: [this.data.extraInfo, []],
      });
      console.log('this.form:', this.form);
    });
  }

  getFormalClasses() {
    return this.form.controls.formalClasses as FormArray;
  }

  addFormalClass(formalClassIri?: string) {
    const formalClasses = this.getFormalClasses();
    if (formalClassIri === undefined) {
      formalClasses.push(this.fb.group({formalClassIri: ''}));
      this.data.formalClassIris.push('');
      this.valIds.formalClasses.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      formalClasses.push(this.fb.group({formalClassIri}));
      this.data.formalClassIris.push(formalClassIri);
      this.valIds.formalClasses.push({id: formalClassIri, changed: false, toBeDeleted: false});
    }
  }

  getImages() {
    return this.form.controls.images as FormArray;
  }

  addImage(imageIri?: string) {
    const images = this.getImages();
    if (imageIri === undefined) {
      images.push(this.fb.group({imageIri: ''}));
      this.data.imageIris.push('');
      this.valIds.images.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      images.push(this.fb.group({imageIri}));
      this.data.imageIris.push(imageIri);
      this.valIds.images.push({id: imageIri, changed: false, toBeDeleted: false});
    }
  }

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

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
      case 'formalClasses':
        this.valIds.formalClasses[index].changed = true;
        break;
      case 'images':
        this.valIds.images[index].changed = true;
        break;
      case 'displayedTitle':
        this.valIds.displayedTitle.changed = true;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.changed = true;
        break;
    }
  }

  _handleDelete(what: string, index?: number): void {
    switch (what) {
      case 'formalClasses':
        this.valIds.formalClasses[index].toBeDeleted = !this.valIds.formalClasses[index].toBeDeleted;
        break;
      case 'images':
        this.valIds.images[index].toBeDeleted = !this.valIds.images[index].toBeDeleted;
        break;
      case 'displayedTitle':
        this.valIds.displayedTitle.toBeDeleted = !this.valIds.displayedTitle.toBeDeleted;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
        console.log('_handleDelete("extraInfo")');
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
      case 'formalClasses':
        this.getFormalClasses().controls[index].setValue(this.data.formalClassIris[index]);
        this.valIds.formalClasses[index].changed = false;
        break;
      case 'images':
        this.getImages().controls[index].setValue(this.data.imageIris[index]);
        this.valIds.images[index].changed = false;
        break;
      case 'displayedTitle':
        this.form.controls.displayedTitle.setValue(this.data.displayedTitle);
        this.valIds.displayedTitle.changed = false;
        break;
      case 'extraInfo':
        this.form.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
    }
  }

  save(): void {
    console.log('this.value:', this.value);
  }

  delete(): void {
    console.log('DELETE!');
  }
}

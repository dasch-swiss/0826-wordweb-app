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
import {CompanyData, KnoraService, LexiaData, ListPropertyData, OptionType} from "../../services/knora.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';


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

      <mat-form-field [style.width.px]=400>
        <input matInput required
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
          <button *ngIf="valIds.formalClasses[i].changed" mat-mini-fab (click)="_handleUndo('formalClasses', i)">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <button *ngIf="valIds.formalClasses[i].id !== undefined && (nFormalClasses > 1 || valIds.formalClasses[i].toBeDeleted)"
                  mat-mini-fab (click)="_handleDelete('formalClasses', i)">
            <mat-icon *ngIf="!valIds.formalClasses[i].toBeDeleted" color="basic">delete</mat-icon>
            <mat-icon *ngIf="valIds.formalClasses[i].toBeDeleted" color="warn">delete</mat-icon>
          </button>
          <button *ngIf="valIds.formalClasses[i].id === undefined && nFormalClasses > 1"
                  mat-mini-fab (click)="_handleDelete('formalClasses', i)">
            <mat-icon *ngIf="!valIds.formalClasses[i].toBeDeleted" color="basic">delete</mat-icon>
          </button>
        </div>
        <button mat-mini-fab (click)="addFormalClass()">
          <mat-icon>add</mat-icon>
        </button>

      </div>
      <br/>

      <div>&nbsp;</div>
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
          <button *ngIf="valIds.images[i].changed" mat-mini-fab (click)="_handleUndo('images', i)">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <button *ngIf="valIds.images[i].id !== undefined"
                  mat-mini-fab (click)="_handleDelete('images', i)">
            <mat-icon *ngIf="!valIds.images[i].toBeDeleted" color="basic">delete</mat-icon>
            <mat-icon *ngIf="valIds.images[i].toBeDeleted" color="warn">delete</mat-icon>
          </button>
          <button *ngIf="valIds.images[i].id === undefined"
                  mat-mini-fab (click)="_handleDelete('images', i)">
            <mat-icon *ngIf="!valIds.images[i].toBeDeleted" color="basic">delete</mat-icon>
          </button>
        </div>
        <button mat-mini-fab (click)="addImage()">
          <mat-icon>add</mat-icon>
        </button>
      </div>
      <br/>
      <div>&nbsp;</div>
      
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

    </mat-card-content>

    <mat-card-actions>
      <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
      <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
      <button *ngIf="inData.lexiaIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
      <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
    </mat-card-actions>

  </mat-card>
  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
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
  nFormalClasses: number;
  nImages: number;
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
    this.imageTypes = knoraService.imageTypes;
    this.nFormalClasses = 0;
    this.nImages = 0;
  }

  @Input()
  get value(): LexiaData | null {
    const formalClasses: FormArray = this.getFormalClasses();
    const formalClassIriValues: string[] = [];
    for (const x of formalClasses.controls) {
      const y = x as FormGroup;
      formalClassIriValues.push(y.controls.formalClassIri.value);
    }
    const images: FormArray = this.getImages();
    const imagesIriValues: string[] = [];
    for (const x of images.controls) {
      const y = x as FormGroup;
      imagesIriValues.push(y.controls.imageIri.value);
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
                case this.knoraService.wwOntology + 'hasFormalClass': {
                  const tmp = ele as ListPropertyData;
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addFormalClass(tmp.nodeIris[i]);
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasImage': {
                  const tmp = ele as ListPropertyData;
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addImage(tmp.nodeIris[i]);
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasLexiaDisplayedTitle': {
                  this.form.controls.displayedTitle.setValue(ele.values[0]);
                  this.valIds.displayedTitle = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.displayedTitle = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasLexiaExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
              }
            }
          }
        });
      }
      //this.valIds.formalClasses[0] = {id: undefined, changed: false, toBeDeleted: false};
      let fcInitial;
      if (this.inData.lexiaIri === undefined) {
        this.valIds.formalClasses[0] = {id: this.formalClassTypes[0].iri, changed: false, toBeDeleted: false};
        fcInitial = [
          this.fb.group({
            formalClassIri: [this.formalClassTypes[0].iri, [Validators.required]]
          })
        ];
      } else {
        fcInitial = [];
      }
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        title: [this.data.title, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        formalClasses: this.fb.array(fcInitial),
        images: this.fb.array([
          /*this.fb.group({formalClassIri: ''}),*/
        ]),
        displayedTitle: [this.data.displayedTitle, []],
        extraInfo: [this.data.extraInfo, []],
      });
      console.log('this.form:', this.form);
    });
  }

  getFormalClasses(): FormArray {
    return this.form.controls.formalClasses as FormArray;
  }

  addFormalClass(formalClassIri?: string): void {
    const formalClasses = this.getFormalClasses();
    if (formalClassIri === undefined) {
      formalClasses.push(this.fb.group({formalClassIri: this.formalClassTypes[0].iri}));
      this.data.formalClassIris.push(this.formalClassTypes[0].iri);
      this.valIds.formalClasses.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      formalClasses.push(this.fb.group({formalClassIri}));
      this.data.formalClassIris.push(formalClassIri);
      this.valIds.formalClasses.push({id: formalClassIri, changed: false, toBeDeleted: false});
    }
    this.nFormalClasses++;
  }

  removeFormalClass(index: number): void {
    const formalClasses = this.getFormalClasses();
    formalClasses.removeAt(index);
    this.valIds.formalClasses.splice(index, 1);
    this.data.formalClassIris.splice(index, 1);
    this.nFormalClasses--;
  }

  getImages(): FormArray {
    return this.form.controls.images as FormArray;
  }

  addImage(imageIri?: string): void {
    const images = this.getImages();
    if (imageIri === undefined) {
      images.push(this.fb.group({imageIri: this.imageTypes[0].iri}));
      this.data.imageIris.push(this.imageTypes[0].iri);
      this.valIds.images.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      images.push(this.fb.group({imageIri}));
      this.data.imageIris.push(imageIri);
      this.valIds.images.push({id: imageIri, changed: false, toBeDeleted: false});
    }
    this.nImages++;
  }

  removeImage(index: number): void {
    const images = this.getImages();
    images.removeAt(index);
    this.valIds.images.splice(index, 1);
    this.data.imageIris.splice(index, 1);
    this.nImages--;
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
        if (this.valIds.formalClasses[index].id !== undefined) {
          this.valIds.formalClasses[index].toBeDeleted = !this.valIds.formalClasses[index].toBeDeleted;
          if (this.valIds.formalClasses[index].toBeDeleted) {
            this.nFormalClasses--;
          } else {
            this.nFormalClasses++;
          }
        } else {
          this.removeFormalClass(index);
        }
        break;
      case 'images':
        if (this.valIds.images[index].id !== undefined) {
          this.valIds.images[index].toBeDeleted = !this.valIds.images[index].toBeDeleted;
          if (this.valIds.images[index].toBeDeleted) {
            this.nImages--;
          } else {
            this.nImages++;
          }
        } else {
          this.removeImage(index);
        }
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
        const formalClasses = this.getFormalClasses().controls[index] as FormGroup;
        formalClasses.controls.formalClassIri.setValue(this.data.formalClassIris[index]);
        this.valIds.formalClasses[index].changed = false;
        break;
      case 'images':
        const images = this.getImages().controls[index] as FormGroup;
        images.controls.imageIri.setValue(this.data.imageIris[index]);
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
    this.working = true;
    console.log('this.value:', this.value);
    if (this.inData.lexiaIri === undefined) {
      this.knoraService.createLexia(this.value).subscribe(
          res => {
            console.log('CREATE_RESULT:', res);
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Error storing the lexia object!', 'OK');
            console.log('EditLexia.save(): ERROR', error);
            this.working = false;
            this.location.back();
          }
      );
    } else {
      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
            this.resId,
            this.knoraService.wwOntology + 'lexia',
            this.form.value.label);
        obs.push(gaga);
      }

      if (this.valIds.title.toBeDeleted && this.valIds.title.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'lexia',
            this.valIds.title.id as string,
            this.knoraService.wwOntology + 'hasLexiaTitle');
        obs.push(gaga);
      } else if (this.valIds.title.changed) {
        let gaga: Observable<string>;
        if (this.valIds.title.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.knoraService.wwOntology + 'hasLexiaTitle',
              this.value.title);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.valIds.title.id as string,
              this.knoraService.wwOntology + 'hasLexiaTitle',
              this.value.title);
        }
        obs.push(gaga);
      }

      if (this.valIds.internalId.toBeDeleted && this.valIds.internalId.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'lexia',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasLexiaInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.knoraService.wwOntology + 'hasLexiaInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasLexiaInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.formalClasses) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              valId.id as string,
              this.knoraService.wwOntology + 'hasFormalClass');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'lexia',
                this.knoraService.wwOntology + 'hasFormalClass',
                this.value.formalClassIris[index]);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'lexia',
                valId.id as string,
                this.knoraService.wwOntology + 'hasFormalClass',
                this.value.formalClassIris[index]);
          }
          obs.push(gaga);
        }
        index++;
      }

      index = 0;
      for (const valId of this.valIds.images) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteListValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              valId.id as string,
              this.knoraService.wwOntology + 'hasImage');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createListValue(
                this.resId,
                this.knoraService.wwOntology + 'lexia',
                this.knoraService.wwOntology + 'hasImage',
                this.value.imageIris[index]);
          } else {
            gaga = this.knoraService.updateListValue(
                this.resId,
                this.knoraService.wwOntology + 'lexia',
                valId.id as string,
                this.knoraService.wwOntology + 'hasImage',
                this.value.imageIris[index]);
          }
          obs.push(gaga);
        }
        index++;
      }

      if (this.valIds.displayedTitle.toBeDeleted && this.valIds.displayedTitle.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'lexia',
            this.valIds.displayedTitle.id as string,
            this.knoraService.wwOntology + 'hasLexiaDisplayedTitle');
        obs.push(gaga);
      } else if (this.valIds.displayedTitle.changed) {
        let gaga: Observable<string>;
        if (this.valIds.displayedTitle.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.knoraService.wwOntology + 'hasLexiaDisplayedTitle',
              this.value.displayedTitle);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.valIds.displayedTitle.id as string,
              this.knoraService.wwOntology + 'hasLexiaDisplayedTitle',
              this.value.displayedTitle);
        }
        obs.push(gaga);
      }

      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'lexia',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasLexiaExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.knoraService.wwOntology + 'hasLexiaExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'lexia',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasLexiaExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      forkJoin(obs).subscribe(res => {
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Fehler beim Speichern der Daten des lexia-Eintrags!', 'OK');
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
      title: 'Delete lexia',
      text: 'Do You really want to delete this lexia?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        console.log('lastmod', this.lastmod);
        this.knoraService.deleteResource(this.resId, 'lexia', this.lastmod, data.comment).subscribe(
            res => {
              this.working = false;
              this.location.back();
            },
            error => {
              this.snackBar.open('Error while deleting the lexia entry!', 'OK');
              console.log('deleteResource:ERROR:: ', error);
              this.working = false;
              this.location.back();
            });
      }
    });
  }
}

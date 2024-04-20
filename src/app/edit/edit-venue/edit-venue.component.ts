import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, concat, Observable} from 'rxjs';
import {toArray} from 'rxjs/operators';
import {
  KnoraService,
  ListPropertyData,
  OptionType,
  VenueData
} from '../../services/knora.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmationComponent, ConfirmationResult} from '../confirmation/confirmation.component';


interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class VenueIds {
  public label: ValInfo;
  public internalId: ValInfo;
  public place: ValInfo;
  public extraInfo: ValInfo;
  public lexias: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.place = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.lexias = [];
  }

}

@Component({
  selector: 'app-edit-venue',
  template: `
    <div *ngIf="knoraService.loggedin" class="container">
    <mat-card>
      <mat-card-title>Venue Editor</mat-card-title>
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

        <mat-form-field [style.width.px]=600>
          <mat-select matInput required
                      placeholder="Place"
                      formControlName="place"
                      (selectionChange)="_handleInput('place')">
            <mat-option *ngFor="let lt of placeTypes" [value]="lt.iri">
              {{lt.name}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <button *ngIf="valIds.place.changed" mat-mini-fab (click)="_handleUndo('place')">
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
          <mat-icon>cached</mat-icon>
        </button>
        <button *ngIf="valIds.extraInfo.id !== undefined" mat-mini-fab (click)="_handleDelete('extraInfo')">
          <mat-icon *ngIf="!valIds.extraInfo.toBeDeleted">delete</mat-icon>
          <mat-icon *ngIf="valIds.extraInfo.toBeDeleted" color="warn">delete</mat-icon>
        </button>
        <br/>

        <div formArrayName="lexias">
          <mat-label>Is Lexia &rarr; (lexia)</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem">
              <input matInput [matAutocomplete]="autoLexia" required
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

      </mat-card-content>
      
      <mat-card-actions>
        <button appBackButton mat-raised-button matTooltip="Zurück ohne zu sichern" (click)="location.back()">Cancel</button>
        <button type="submit" mat-raised-button color="primary" (click)="save()">Save</button>
        <button *ngIf="inData.venueIri" type="submit" mat-raised-button color="warn" (click)="delete()">Delete</button>
        <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
      </mat-card-actions>
    </mat-card>
    </div>
    <div *ngIf="!knoraService.loggedin" class="container">
      <mat-card><mat-card-title>No access!</mat-card-title></mat-card>
    </div>
  `,
  styles: [
    'mat-card { margin: 2rem; padding: 1rem;}',
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }',
    '.tarows { height: 5em;}'
  ]
})
export class EditVenueComponent implements OnInit {
  controlType = 'EditVenue';
  inData: any;
  form: UntypedFormGroup;
  options: Array<{ id: string; label: string }> = [];
  resId: string;
  lastmod: string;
  working: boolean;
  data: VenueData = new VenueData('', '', {placeIri: ''}, '', []);
  nLexias: number;
  public valIds: VenueIds = new VenueIds();
  public placeTypes: Array<OptionType>;

  constructor(public knoraService: KnoraService,
              private fb: UntypedFormBuilder,
              public route: ActivatedRoute,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
    this.placeTypes = this.knoraService.venuePlaceTypes;
    this.nLexias = 0;
  }

  @Input()
  get value(): VenueData | null {
    const lexias: UntypedFormArray = this.getLexias();
    const lexiaValues: { lexiaName: string; lexiaIri: string }[] = [];
    for (const x of lexias.controls) {
      lexiaValues.push(x.value);
    }
    return new VenueData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        {placeIri: this.form.controls.place.value},
        this.form.controls.extraInfo.value,
        lexiaValues,
    );
  }

  set value(knoraVal: VenueData | null) {
    const {
      label, internalId, place, extraInfo, lexias
    }
        = knoraVal || new VenueData('', '', {placeIri: ''}, '', []);
    this.form.setValue({
      label, internalId, place, extraInfo, lexias
    });

  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr => {
      if (arr[0].iri !== undefined) {
        this.inData.venueIri = arr[0].iri;
      }
      if (this.inData.venueIri !== undefined) {
        this.knoraService.getResource(this.inData.venueIri).subscribe((data) => {
          if (this.inData.venueIri !== undefined) {
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.wwOntology + 'hasVenueInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasPlaceVenue': {
                  const tmp = ele as ListPropertyData;
                  this.form.controls.place.setValue(tmp.nodeIris[0]);
                  this.valIds.place = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                  this.data.place = {placeIri: tmp.nodeIris[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'hasVenueExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'isLexiaVenueValue': {
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
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        place: [this.data.place?.placeIri || this.placeTypes[0].iri, [Validators.required]],
        extraInfo: [this.data.extraInfo, []],
        lexias: this.fb.array([
          /*this.fb.group({containsName: '', containsIri: ''}),*/
        ]),
      });

    });
  }

  getLexias() {
    return this.form.controls.lexias as UntypedFormArray;
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

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

  _handleLinkInput(what: string, index?: number): void {
    switch (what) {
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
    switch (what) {
      case 'lexias':
        this.form.value.lexias[index].lexiaName = res[0].label;
        this.form.value.lexias[index].lexiaIri = res[0].id;
        this.value.lexias = this.form.value.lexias;
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
      case 'place':
        this.valIds.place.changed = true;
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
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
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
      case 'place':
        this.form.controls.place.setValue(this.data.place.placeIri);
        this.valIds.place.changed = false;
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
    if (this.inData.venueIri === undefined) {
      if (this.form.valid) {
        this.knoraService.createVenue(this.value).subscribe(
            res => {
              this.working = false;
              if (res === 'error') {
                this.snackBar.open('Error storing the venue object!', 'OK', {duration: 10000});
              } else {
                this.location.back();
              }
            },
            error => {
              this.snackBar.open('Error storing the venue object!', 'OK', {duration: 10000});
              console.log('EditVenue.save(): ERROR', error);
              this.working = false;
              this.location.back();
            }
        );
      } else {
        this.snackBar.open('Invalid/incomplete data in form – Please check!',
            'OK',
            {duration: 10000});
        this.working = false;
      }
    } else {
      const obs: Array<Observable<string>> = [];

      if (this.valIds.label.changed) {
        const gaga: Observable<string> = this.knoraService.updateLabel(
            this.resId,
            this.knoraService.wwOntology + 'venue',
            this.form.value.label,
            this.lastmod);
        obs.push(gaga);
      }

      if (this.valIds.internalId.toBeDeleted && this.valIds.internalId.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'venue',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasVenueInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.knoraService.wwOntology + 'hasVenueInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasVenueInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      if (this.valIds.place.toBeDeleted && this.valIds.place.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteListValue(
            this.resId,
            this.knoraService.wwOntology + 'venue',
            this.valIds.place.id as string,
            this.knoraService.wwOntology + 'hasPlaceVenue');
        obs.push(gaga);
      } else if (this.valIds.place.changed) {
        let gaga: Observable<string>;
        if (this.valIds.place.id === undefined) {
          gaga = this.knoraService.createListValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.knoraService.wwOntology + 'hasPlaceVenue',
              this.form.value.place);
        } else {
          gaga = this.knoraService.updateListValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.valIds.place.id as string,
              this.knoraService.wwOntology + 'hasPlaceVenue',
              this.form.value.place);
        }
        obs.push(gaga);
      }

      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'venue',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasVenueExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.knoraService.wwOntology + 'hasVenueExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasVenueExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.lexias) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'venue',
              valId.id as string,
              this.knoraService.wwOntology + 'isLexiaVenueValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'venue',
                this.knoraService.wwOntology + 'isLexiaVenueValue',
                this.value.lexias[index].lexiaIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'venue',
                valId.id as string,
                this.knoraService.wwOntology + 'isLexiaVenueValue',
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
            this.snackBar.open('Fehler beim Speichern der Daten des venue-Eintrags!', 'OK', {duration: 10000});
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
      title: 'Delete Venue',
      text: 'Do You really want to delete this venue?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        this.knoraService.deleteResource(this.resId, 'venue', this.lastmod, data.comment).subscribe(
            res => {
              this.working = false;
              if (res === 'error') {
                this.snackBar.open('Error while deleting the venue entry!', 'OK', {duration: 10000});
              }
              this.location.back();
            },
            error => {
              this.snackBar.open('Error while deleting the venue entry!', 'OK', {duration: 10000});
              console.log('deleteResource:ERROR:: ', error);
              this.working = false;
              this.location.back();
            });
      }
    });

  }

}

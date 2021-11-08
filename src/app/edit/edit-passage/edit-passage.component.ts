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

        <mat-form-field [style.width.px]=400>
          <input matInput required
                 class="full-width"
                 placeholder="Text"
                 formControlName="text"
                 (input)="_handleInput('text')">
          <mat-error *ngIf="form.controls.text.errors?.required">Text erforderlich!</mat-error>
        </mat-form-field>
        <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('text')">
          <mat-icon color="warn">cached</mat-icon>
        </button>
        <br/>

        <mat-form-field [style.width.px]="400">
          <input matInput [matAutocomplete]="autoOccursIn"
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
  data: PassageData = new PassageData('', '', '',[], [], {researchFieldIri: ''},
      {statusIri: ''}, '', {occursInName: '', occursInIri: ''},
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
    return new PassageData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.displayedTitle.value,
        functionVoiceIriValues,
        markingIriValues,
        {researchFieldIri: this.form.controls.researchField.value},
        {statusIri: this.form.controls.status.value},
        this.form.controls.text.value,
        {occursInName: '', occursInIri: ''},
        {contributedByName: '', contributedByIri: ''},
        [],
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        []
    );
  }

  set value(knoraVal: PassageData | null) {
    const {label, internalId, displayedTitle, functionVoices, markings, researchField, status, text, occursIn}
        = knoraVal || new PassageData('', '', '', [],
        [], {researchFieldIri: ''}, {statusIri: ''}, '', {occursInName: '', occursInIri: ''},
        {contributedByName: '', contributedByIri: ''}, [], '',
        '', '', '', '', '', '', []);
    console.log('!!!!!!', occursIn);
    this.form.setValue({label, internalId, displayedTitle, functionVoices, markings, researchField,
      status, text, occursInName: occursIn.occursInName, occursInIri: occursIn.occursInIri});
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
                    this.addFunctionVoice(tmp.nodeIris[i]);
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'hasMarking': {
                  const tmp = ele as ListPropertyData;
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addMarking(tmp.nodeIris[i]);
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
                case this.knoraService.wwOntology + 'occursIn': {
                  this.form.controls.occursInName.setValue(ele.values[0]);
                  this.form.controls.occursInIri.setValue(ele.ids[0]);
                  this.valIds.text = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.occursIn = {occursInName: ele.values[0], occursInIri: ele.ids[0]};
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
      });
     });
  }

  getFunctionVoices(): FormArray {
    return this.form.controls.functionVoices as FormArray;
  }

  addFunctionVoice(functionVoiceIri?: string): void {
    const functionVoices = this.getFunctionVoices();
    if (functionVoiceIri === undefined) {
      functionVoices.push(this.fb.group({functionVoiceIri: this.functionVoiceTypes[0].iri}));
      this.data.functionVoices.push({functionVoiceIri: this.functionVoiceTypes[0].iri});
      this.valIds.functionVoices.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      functionVoices.push(this.fb.group({functionVoiceIri}));
      this.data.functionVoices.push({functionVoiceIri});
      this.valIds.functionVoices.push({id: functionVoiceIri, changed: false, toBeDeleted: false});
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

  addMarking(markingIri?: string): void {
    const markings = this.getMarkings();
    if (markingIri === undefined) {
      markings.push(this.fb.group({markingIri: this.markingTypes[0].iri}));
      this.data.markings.push({markingIri: this.markingTypes[0].iri});
      this.valIds.markings.push({id: undefined, changed: false, toBeDeleted: false});
    } else {
      markings.push(this.fb.group({markingIri}));
      this.data.markings.push({markingIri});
      this.valIds.markings.push({id: markingIri, changed: false, toBeDeleted: false});
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

  onChange = (_: any) => {
  };

  onTouched = () => {
  };

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'occursIn':
        const occursInName = this.form.controls.occursInName.value;

        this.valIds.occursIn.changed = true;
        this.knoraService.getResourcesByLabel(occursInName, this.knoraService.wwOntology + 'book').subscribe(
            res => {
              this.options = res;
              this.form.value.occursInName = res[0].label;
              this.form.value.occursInIri =  res[0].id;
            }
        );
        break;
    }
  }

  _optionSelected(val: any, what: string, index?: number): void {
    console.log('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*>>>>>>> _optionSelected()');
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    console.log(res);
    switch(what) {
      case 'occursIn':
        //this.form.value.occursInName = res[0].label;
        //this.form.value.occursInIri =  res[0].id;
        this.form.controls.occursInName.setValue(res[0].label);
        this.form.controls.occursInIri.setValue(res[0].id);
        console.log(this.form.value.occursInName);
        console.log(this.form.value.occursInIri);

        this.value = new PassageData(
            this.form.value.label,
            this.form.value.internalId,
            this.form.value.displayedTitle,
            this.form.value.functionVoices,
            this.form.value.markings,
            this.form.value.researchField,
            this.form.value.status,
            this.form.value.text,
            {occursInName: 'GAGA', occursInIri: 'GUGUS'},
            {contributedByName: '', contributedByIri: ''}, // ToDo: complete
            [],  // ToDo: complete
            '', // ToDo: complete
            '',  // ToDo: complete
            '',  // ToDo: complete
            '',  // ToDo: complete
            '',  // ToDo: complete
            '',  // ToDo: complete
            '',
            []
        );
        console.log('_optionSelected', this.value);

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
        this.form.controls.occursInName.setValue(this.data.occursIn.occursInName); // ToDo: check if correct
        this.form.controls.occursInIri.setValue(this.data.occursIn.occursInIri); // ToDo: check if correct
        this.valIds.occursIn.changed = false;
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


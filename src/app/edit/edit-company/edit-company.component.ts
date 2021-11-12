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
import {combineLatest, concat, forkJoin, Observable} from "rxjs";
import {CompanyData, KnoraService} from '../../services/knora.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {Location} from '@angular/common';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ConfirmationComponent, ConfirmationResult} from "../confirmation/confirmation.component";
import {toArray} from "rxjs/operators";


interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class CompanyIds {
  public label: ValInfo;
  public title: ValInfo;
  public internalId: ValInfo;
  public extraInfo: ValInfo;
  public members: ValInfo[];
  public lexias: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.members = [];
    this.lexias = [];
  }
}

@Component({
  selector: 'app-edit-company',
  template: `
    <div *ngIf="knoraService.loggedin" class="container">
    <mat-card>
      <mat-card-title>Company Editor</mat-card-title>
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
            <input matInput required
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

          <div formArrayName="members">
            <mat-label>Members &rarr; (person)</mat-label>
            <div *ngFor="let memberItem of getMembers().controls; let i=index">
              <mat-form-field [formGroup]="memberItem">
                <input matInput [matAutocomplete]="autoMember"
                       formControlName="memberName"
                       class="knora-link-input-element klnkie-val full-width"
                       placeholder="Has member"
                       aria-label="Value"
                       (change)="_handleInput('members', i)"
                       (input)="_handleLinkInput('members', i)">
                <input matInput formControlName="memberIri" [hidden]="true" ><br/>
                <mat-autocomplete #autoMember="matAutocomplete" (optionSelected)="_optionSelected($event.option.value, 'members', i)">
                  <mat-option *ngFor="let option of options" [value]="option.label">
                    {{ option.label }}
                  </mat-option>
                </mat-autocomplete>
              </mat-form-field>

              <button *ngIf="valIds.members[i].changed" mat-mini-fab (click)="_handleUndo('members', i)">
                <mat-icon color="warn">cached</mat-icon>
              </button>
              <button *ngIf="valIds.members[i].id !== undefined"
                      mat-mini-fab (click)="_handleDelete('members', i)">
                <mat-icon *ngIf="!valIds.members[i].toBeDeleted" color="basic">delete</mat-icon>
                <mat-icon *ngIf="valIds.members[i].toBeDeleted" color="warn">delete</mat-icon>
              </button>
              <button *ngIf="valIds.members[i].id === undefined"
                      mat-mini-fab (click)="_handleDelete('members', i)">
                <mat-icon *ngIf="!valIds.members[i].toBeDeleted" color="basic">delete</mat-icon>
              </button>

            </div>
            <button mat-mini-fab (click)="addMember()">
              <mat-icon>add</mat-icon>
            </button>
          </div>

        <div formArrayName="lexias">
          <mat-label>Lexias &rarr; (lexia)</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem">
              <input matInput [matAutocomplete]="autoLexia"
                     required
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
        <button *ngIf="inData.companyIri" type="submit" class="mat-raised-button" (click)="delete()">Delete</button>
        <mat-progress-bar *ngIf="working" mode="indeterminate"></mat-progress-bar>
      </mat-card-actions>
    </mat-card>
    </div>
    <div *ngIf="!knoraService.loggedin" class="container">
      <mat-card><mat-card-title>No access!</mat-card-title></mat-card>
    </div>
  `,
  styles: [
    '.maxw { min-width: 500px; max-width: 1000px; }',
    '.wide { width: 100%; }',
    '.ck-editor__editable_inline { min-height: 500px; }',
    '.full-width { width: 100%; }'
  ]
})

export class EditCompanyComponent implements OnInit {
  controlType = 'EditCompany';
  inData: any;
  form: FormGroup;
  options: Array<{id: string; label: string}> = [];
  resId: string;
  lastmod: string;
  data: CompanyData = new CompanyData('', '', '', '',
      [], []);
  nMembers: number;
  nLexias: number;
  working: boolean;
  public valIds: CompanyIds = new CompanyIds();

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
    this.nMembers = 0;
    this.nLexias = 0;
  }

  @Input()
  get value(): CompanyData | null {
    const members: FormArray = this.getMembers();
    const memberValues: {memberName: string; memberIri: string}[] = [];
    for (const x of members.controls) {
      memberValues.push(x.value);
    }
    const lexias: FormArray = this.getLexias();
    const lexiaValues: {lexiaName: string; lexiaIri: string}[] = [];
    for (const x of lexias.controls) {
      lexiaValues.push(x.value);
    }
    return new CompanyData(
        this.form.controls.label.value,
        this.form.controls.title.value,
        this.form.controls.internalId.value,
        this.form.controls.extraInfo.value,
        memberValues,
        lexiaValues,
    );
  }

  set value(knoraVal: CompanyData | null) {
    const {label, title, internalId, extraInfo, members, lexias}
        = knoraVal || new CompanyData('', '', '', '',
        [{memberName: '', memberIri: ''}], [{lexiaName: '', lexiaIri: ''}]);
    this.form.setValue({label, title, internalId, extraInfo, members, lexias});
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr  => {
      if (arr[0].iri !== undefined) {
        this.inData.companyIri = arr[0].iri;
      }
      if (this.inData.companyIri !== undefined) {
        this.knoraService.getResource(this.inData.companyIri).subscribe((data) => {
          if (this.inData.companyIri !== undefined) {
            console.log('DATA: ', data);
            this.resId = data.id;
            this.lastmod = data.lastmod;
            this.form.controls.label.setValue(data.label);
            this.valIds.label = {id: data.label, changed: false, toBeDeleted: false};
            this.data.label = data.label;
            for (const ele of data.properties) {
              switch (ele.propname) {
                case this.knoraService.wwOntology + 'hasCompanyTitle': {
                  this.form.controls.title.setValue(ele.values[0]);
                  this.valIds.title = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.title = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasCompanyInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasCompanyExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasMemberValue': {
                  for (let i = 0; i < ele.values.length; i++) {
                    this.addMember({memberName: ele.values[i], memberIri: ele.ids[i]});
                  }
                  break;
                }
                case this.knoraService.wwOntology + 'isLexiaCompanyValue': {
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
        title: [this.data.title, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        extraInfo: this.data.extraInfo,
        members: this.fb.array([
            /*this.fb.group({memberName: '', memberIri: ''}),*/
        ]),
        lexias: this.fb.array([
          /*this.fb.group({lexiaName: '', lexiaIri: ''}),*/
        ]),
      });
      console.log(this.form);
    });
  }

  getMembers() {
    return this.form.controls.members as FormArray;
  }

  addMember(member?: {memberName: string; memberIri: string}) {
    const members = this.getMembers();
    if (member === undefined) {
      members.push(this.fb.group({memberName: '', memberIri: ''}));
      this.data.members.push({memberName: '', memberIri: ''});
      this.valIds.members.push({id: undefined, changed: false, toBeDeleted: false});
    }
    else {
      members.push(this.fb.group({memberName: member.memberName, memberIri: member.memberIri}));
      this.data.members.push({memberName: member.memberName, memberIri: member.memberIri});
      this.valIds.members.push({id: member.memberIri, changed: false, toBeDeleted: false});
    }
    this.nMembers++;
    console.log('addMember::', this.data.members);
  }

  removeMembers(index: number): void {
    const tmp = this.getMembers();
    tmp.removeAt(index);
    this.valIds.members.splice(index, 1);
    this.data.members.splice(index, 1);
    this.nMembers--;
  }

  getLexias() {
    return this.form.controls.lexias as FormArray;
  }

  addLexia(lexia?: {lexiaName: string; lexiaIri: string}) {
    const lexias = this.getLexias();
    if (lexia === undefined) {
      lexias.push(this.fb.group({lexiaName: '', lexiaIri: ''}));
      this.data.lexias.push({lexiaName: '', lexiaIri: ''});
      this.valIds.lexias.push({id: undefined, changed: false, toBeDeleted: false});
    }
    else {
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

  onTouched = () => {};

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'members':

        const members = this.getMembers();
        const memberName = members.value[index].memberName;

        this.valIds.members[index].changed = true;
        if (memberName.length >= 3) {
          this.knoraService.getResourcesByLabel(memberName, this.knoraService.wwOntology + 'person').subscribe(
              res => {
                this.options = res;
                this.form.value.members[index].memberName = res[0].label;
                this.form.value.members[index].memberIri =  res[0].id;
              }
          );
        }
        break;
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
      case 'members':
        this.form.value.members[index].memberName = res[0].label;
        this.form.value.members[index].memberIri =  res[0].id;
        this.value = new CompanyData(
            this.form.value.label,
            this.form.value.title,
            this.form.value.internalId,
            this.form.value.extraInfo,
            this.form.value.members,
            this.form.value.lexias,
        );
        break;
      case 'lexias':
        this.form.value.lexias[index].lexiaName = res[0].label;
        this.form.value.lexias[index].lexiaIri =  res[0].id;
        this.value = new CompanyData(
            this.form.value.label,
            this.form.value.title,
            this.form.value.internalId,
            this.form.value.extraInfo,
            this.form.value.members,
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
      case 'title':
        this.valIds.title.changed = true;
        break;
      case 'internalId':
        this.valIds.internalId.changed = true;
        break;
      case 'extraInfo':
        this.valIds.extraInfo.changed = true;
        break;
      case 'members':
        this.valIds.members[index].changed = true;
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
      case 'members':
        if (this.valIds.members[index].id !== undefined) {
          this.valIds.members[index].toBeDeleted = !this.valIds.members[index].toBeDeleted;
          if (this.valIds.members[index].toBeDeleted) {
            this.nMembers--;
          } else {
            this.nMembers++;
          }
        } else {
          this.removeMembers(index);
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
    }
  }

  _handleUndo(what: string, index?: number): void {
    switch (what) {
      case 'label':
        this.form.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      case 'title':
        this.form.controls.title.setValue(this.data.title);
        this.valIds.title.changed = false;
        break;
      case 'internalId':
        this.form.controls.internalId.setValue(this.data.internalId);
        this.valIds.internalId.changed = false;
        break;
      case 'extraInfo':
        this.form.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
      case 'members':
        console.log(this.data.members);
        console.log('== index:', index);
        this.getMembers().controls[index].setValue(this.data.members[index]);
        this.valIds.members[index].changed = false;
        break;
      case 'lexias':
        console.log(this.data.lexias);
        console.log('== index:', index);
        this.getLexias().controls[index].setValue(this.data.lexias[index]);
        this.valIds.lexias[index].changed = false;
        break;
    }
  }

  save(): void {
    this.working = true;
    console.log('this.value:', this.value);
    if (this.inData.companyIri === undefined) {
      this.knoraService.createCompany(this.value).subscribe(
          res => {
            console.log('CREATE_RESULT:', res);
            this.working = false;
            this.location.back();
          },
          error => {
            this.snackBar.open('Error storing the company object!', 'OK');
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

      if (this.valIds.title.toBeDeleted && this.valIds.title.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'company',
            this.valIds.title.id as string,
            this.knoraService.wwOntology + 'hasCompanyTitle');
        obs.push(gaga);
      } else if (this.valIds.title.changed) {
        let gaga: Observable<string>;
        if (this.valIds.title.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.knoraService.wwOntology + 'hasCompanyTitle',
              this.value.title);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.valIds.title.id as string,
              this.knoraService.wwOntology + 'hasCompanyTitle',
              this.value.title);
        }
        obs.push(gaga);
      }

      if (this.valIds.internalId.toBeDeleted && this.valIds.internalId.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'company',
            this.valIds.internalId.id as string,
            this.knoraService.wwOntology + 'hasCompanyInternalId');
        obs.push(gaga);
      } else if (this.valIds.internalId.changed) {
        let gaga: Observable<string>;
        if (this.valIds.internalId.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.knoraService.wwOntology + 'hasCompanyInternalId',
              this.value.internalId);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.valIds.internalId.id as string,
              this.knoraService.wwOntology + 'hasCompanyInternalId',
              this.value.internalId);
        }
        obs.push(gaga);
      }

      console.log('this.valIds.extraInfo:', this.valIds.extraInfo);
      if (this.valIds.extraInfo.toBeDeleted && this.valIds.extraInfo.id !== undefined) {
        const gaga: Observable<string> = this.knoraService.deleteTextValue(
            this.resId,
            this.knoraService.wwOntology + 'company',
            this.valIds.extraInfo.id as string,
            this.knoraService.wwOntology + 'hasCompanyExtraInfo');
        obs.push(gaga);
      } else if (this.valIds.extraInfo.changed) {
        let gaga: Observable<string>;
        if (this.valIds.extraInfo.id === undefined) {
          gaga = this.knoraService.createTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.knoraService.wwOntology + 'hasCompanyExtraInfo',
              this.value.extraInfo);
        } else {
          gaga = this.knoraService.updateTextValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              this.valIds.extraInfo.id as string,
              this.knoraService.wwOntology + 'hasCompanyExtraInfo',
              this.value.extraInfo);
        }
        obs.push(gaga);
      }

      let index = 0;
      for (const valId of this.valIds.members) {
        if (valId.toBeDeleted && valId.id !== undefined) {
          const gaga: Observable<string> = this.knoraService.deleteLinkValue(
              this.resId,
              this.knoraService.wwOntology + 'company',
              valId.id as string,
              this.knoraService.wwOntology + 'hasMemberValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'company',
                this.knoraService.wwOntology + 'hasMemberValue',
                this.value.members[index].memberIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'company',
                valId.id as string,
                this.knoraService.wwOntology + 'hasMemberValue',
                this.value.members[index].memberIri);
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
              this.knoraService.wwOntology + 'company',
              valId.id as string,
              this.knoraService.wwOntology + 'isLexiaCompanyValue');
          obs.push(gaga);
        } else if (valId.changed) {
          let gaga: Observable<string>;
          if (valId.id === undefined) {
            gaga = this.knoraService.createLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'company',
                this.knoraService.wwOntology + 'isLexiaCompanyValue',
                this.value.lexias[index].lexiaIri);
          } else {
            gaga = this.knoraService.updateLinkValue(
                this.resId,
                this.knoraService.wwOntology + 'company',
                valId.id as string,
                this.knoraService.wwOntology + 'isLexiaCompanyValue',
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
      title: 'Delete company',
      text: 'Do You really want to delete this comapany?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, confirmationConfig);
    this.working = true;
    dialogRef.afterClosed().subscribe((data: ConfirmationResult) => {
      if (data.status) {
        console.log('lastmod', this.lastmod);
        this.knoraService.deleteResource(this.resId, 'company', this.lastmod, data.comment).subscribe(
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

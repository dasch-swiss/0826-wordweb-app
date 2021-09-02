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
import {combineLatest} from 'rxjs';
import {CompanyData, KnoraService} from '../../services/knora.service';

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
  public members: [ValInfo];
  public lexias: [ValInfo];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.members = [{id: undefined, changed: false, toBeDeleted: false}];
    this.lexias = [{id: undefined, changed: false, toBeDeleted: false}];
  }
}

@Component({
  selector: 'app-edit-company',
  template: `
    <mat-card>
      <mat-card-title>Company Editor</mat-card-title>
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
            <mat-label>Members</mat-label>
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
              <button *ngIf="valIds.members[i].id !== undefined" mat-mini-fab (click)="_handleDelete('members', i)">
                <mat-icon *ngIf="!valIds.members[i].toBeDeleted">delete</mat-icon>
                <mat-icon *ngIf="valIds.members[i].toBeDeleted" color="warn">delete</mat-icon>
              </button>

            </div>
            <button mat-mini-fab (click)="addMember()">
              <mat-icon>add</mat-icon>
            </button>
          </div>

        <div formArrayName="lexias">
          <mat-label>Lexias</mat-label>
          <div *ngFor="let lexiaItem of getLexias().controls; let i=index">
            <mat-form-field [formGroup]="lexiaItem">
              <input matInput [matAutocomplete]="autoLexia"
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
            <button *ngIf="valIds.lexias[i].id !== undefined" mat-mini-fab (click)="_handleDelete('lexias', i)">
              <mat-icon *ngIf="!valIds.lexias[i].toBeDeleted">delete</mat-icon>
              <mat-icon *ngIf="valIds.lexias[i].toBeDeleted" color="warn">delete</mat-icon>
            </button>

          </div>
          <button mat-mini-fab (click)="addLexia()">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </mat-card-content>

      <mat-card-actions>
        <button appBackButton class="mat-raised-button" matTooltip="Zurück ohne zu sichern">Cancel</button>
        <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Save</button>
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

export class EditCompanyComponent implements OnInit {
  controlType = 'EditCompany';
  inData: any;
  form: FormGroup;
  options: Array<{id: string; label: string}> = [];
  resId: string;
  lastmod: string;
  data: CompanyData = new CompanyData('', '', '', '',
      [], []);
  working: boolean;
  public valIds: CompanyIds = new CompanyIds();

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              @Optional() @Self() public ngControl: NgControl) {
    this.inData = {};
    this.working = false;
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
    }
    else {
      members.push(this.fb.group({memberName: member.memberName, memberIri: member.memberIri}));
      this.data.members.push({memberName: member.memberName, memberIri: member.memberIri});
    }
    this.valIds.members.push({id: undefined, changed: false, toBeDeleted: false});
    console.log('addMember::', this.data.members);
  }

  getLexias() {
    return this.form.controls.lexias as FormArray;
  }

  addLexia(lexia?: {lexiaName: string; lexiaIri: string}) {
    const lexias = this.getLexias();
    if (lexia === undefined) {
      lexias.push(this.fb.group({lexiaName: '', lexiaIri: ''}));
      this.data.lexias.push({lexiaName: '', lexiaIri: ''});
    }
    else {
      lexias.push(this.fb.group({lexiaName: lexia.lexiaName, lexiaIri: lexia.lexiaIri}));
      this.data.lexias.push({lexiaName: lexia.lexiaName, lexiaIri: lexia.lexiaIri});
    }
    this.valIds.lexias.push({id: undefined, changed: false, toBeDeleted: false});
  }


  onChange = (_: any) => {};

  onTouched = () => {};

  _handleLinkInput(what: string, index?: number): void {
    switch(what) {
      case 'members':
        const members = this.getMembers();
        const memberName = members.value[index].memberName;

        this.valIds.members[index].changed = true;
        this.knoraService.getResourcesByLabel(memberName, this.knoraService.wwOntology + 'person').subscribe(
            res => {
              this.options = res;
              this.form.value.members[index].memberName = res[0].label;
              this.form.value.members[index].memberIri =  res[0].id;
            }
        );
        break;
      case 'lexias':
        const lexias = this.getLexias();
        const lexiaName = lexias.value[index].lexiaName;

        this.valIds.lexias[index].changed = true;
        this.knoraService.getResourcesByLabel(lexiaName, this.knoraService.wwOntology + 'lexia').subscribe(
            res => {
              this.options = res;
              this.form.value.lexias[index].lexiaName = res[0].label;
              this.form.value.lexias[index].lexiaIri =  res[0].id;
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
            this.form.value.lexias,
            this.form.value.lexias,
        );
        break;
    }
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
        this.valIds.members[index].toBeDeleted = !this.valIds.members[index].toBeDeleted;
        break;
      case 'lexias':
        this.valIds.lexias[index].toBeDeleted = !this.valIds.lexias[index].toBeDeleted;
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

  save() {
    //this.working = true;
    console.log('this.value:', this.value);
  }

}

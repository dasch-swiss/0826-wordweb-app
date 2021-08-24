import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {combineLatest} from "rxjs";
import {CompanyData, KnoraService} from "../../services/knora.service";

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
  public member: [ValInfo];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.title = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.member = [{id: undefined, changed: false, toBeDeleted: false}];
  }
}

@Component({
  selector: 'app-edit-company',
  template: `
    <mat-card>
      <mat-card-title>Company Editor</mat-card-title>
      <mat-card-content>
        <div [formGroup]="labelForm">
          <mat-form-field [style.width.px]=400>
            <input matInput
                   class="full-width"
                   placeholder="Label"
                   formControlName="label"
                   (input)="_handleInput('label')">
            <mat-error *ngIf="labelForm.controls.label.errors?.required">Label erforderlich!</mat-error>
            <mat-error *ngIf="labelForm.controls.label.errors?.minlength">Label muss mindestens aus 5 Buchstaben bestehen!</mat-error>
          </mat-form-field>
          <button *ngIf="valIds.label.changed" mat-mini-fab (click)="_handleUndo('label')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <br/>
        </div>

        <div  [formGroup]="titleForm">
          <mat-form-field [style.width.px]=400>
            <input matInput
                   class="full-width"
                   placeholder="Title"
                   formControlName="title"
                   (input)="_handleInput('title')">
            <mat-error *ngIf="titleForm.controls.title.errors?.required">Title required!</mat-error>
            <mat-error *ngIf="titleForm.controls.title.errors?.minlength">Title must have at least 5 characters!</mat-error>
          </mat-form-field>
          <button *ngIf="valIds.title.changed" mat-mini-fab (click)="_handleUndo('title')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <br/>
        </div>

        <div [formGroup]="internalIdForm">
          <mat-form-field [style.width.px]=400>
            <input matInput
                   class="full-width"
                   placeholder="Internald id"
                   formControlName="internalId"
                   (input)="_handleInput('internalId')">
            <mat-error *ngIf="internalIdForm.controls.internalId.errors?.required">Internal id required!</mat-error>
          </mat-form-field>
          <button *ngIf="valIds.internalId.changed" mat-mini-fab (click)="_handleUndo('internalId')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          <br/>
        </div>

        <div [formGroup]="extraInfoForm">
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
        </div>

        <div [formGroup]="memberForm">
          <mat-form-field *ngIf="inData.member === undefined" [style.width.px]=400>
            <input matInput [matAutocomplete]="auto"
                   class="knora-link-input-element klnkie-val"
                   placeholder="Has member"
                   formControlName="member"
                   aria-label="Value"
                   (change)="_handleInput('member')"
                   (input)="_handleLinkInput('member')">
            <input matInput style="width: 100%" [hidden]="true" formControlName="memberIri">
            <mat-autocomplete #auto="matAutocomplete" (optionSelected)="_optionSelected($event.option.value)">
              <mat-option *ngFor="let option of options" [value]="option.label">
                {{ option.label }}
              </mat-option>
            </mat-autocomplete>
          </mat-form-field>
          <mat-form-field *ngIf="inData.memberIri !== undefined" [style.width.px]=400>
            <input matInput
                   placeholder="Has member"
                   formControlName="member"
                   aria-label="Value">
          </mat-form-field>
          &nbsp;
          <button *ngIf="valIds.member.changed" mat-mini-fab (click)="_handleUndo('member')">
            <mat-icon color="warn">cached</mat-icon>
          </button>
          &nbsp;
          <button *ngIf="valIds.member.id !== undefined" mat-mini-fab (click)="_handleDelete('member')">
            <mat-icon *ngIf="!valIds.member.toBeDeleted">delete</mat-icon>
            <mat-icon *ngIf="valIds.member.toBeDeleted" color="warn">delete</mat-icon>
          </button>
          <button mat-mini-fab>
            <mat-icon>add</mat-icon>
          </button>
          <br/>
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
  // form: FormGroup;
  labelForm: FormGroup;
  titleForm: FormGroup;
  internalIdForm: FormGroup;
  extraInfoForm: FormGroup;
  memberForm: FormGroup;
  memberItems: FormArray;


  options: Array<{id: string, label: string}> = [];

  data: CompanyData = new CompanyData('', '', '', '');
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
    //const {value: {label, title, internalId, extraInfo, member, memberIri}} = this.form;
    //return new CompanyData(label, title, internalId, extraInfo, member, memberIri);
    return new CompanyData(
        this.labelForm.controls.label.value,
        this.titleForm.controls.title.value,
        this.internalIdForm.controls.internalId.value,
        this.extraInfoForm.controls.extraInfo.value,
        this.memberForm.controls.member.value,
        this.memberForm.controls.memberIri.value
    );
  }
  set value(knoraVal: CompanyData | null) {
    const {label, title, internalId, extraInfo, member, memberIri}
        = knoraVal || new CompanyData('', '', '', '');
    //this.form.setValue({label, title, internalId, extraInfo, member, memberIri});
    this.labelForm.setValue({label});
    this.titleForm.setValue({title});
    this.internalIdForm.setValue({internalId});
    this.extraInfoForm.setValue({extraInfo});
    this.memberForm.setValue({member, memberIri});
  }

  createMemberItem(value?: {name; iri}): FormGroup {
    if (value === undefined) {
      return this.fb.group({
        name: ['', []],
        iri: ['', []]
      });
    } else {
      return this.fb.group({
        name: [value.name, []],
        iri: [value.iri, []]
      });
    }
  }

  addMemberItem(): void {
    this.memberItems = this.memberForm.get('items') as FormArray;
    this.memberItems.push(this.createMemberItem());
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr  => {
      if (arr[0].iri !== undefined) {
        this.inData.companyIri = arr[0].iri;
      }
      if (this.inData.companyIri !== undefined) {

      }
      /*
      this.form = this.fb.group({
        label: [this.data.label, [Validators.required, Validators.minLength(5)]],
        title: [this.data.title, [Validators.required, Validators.minLength(5)]],
        internalId: [this.data.internalId, [Validators.required]],
        extraInfo: [this.data.extraInfo, []],
        member: [this.data.member, []],
        memberIri: [this.data.memberIri, []],
      });
       */
      this.labelForm = this.fb.group({ label: [this.data.label, [Validators.required, Validators.minLength(5)]]});
      this.titleForm = this.fb.group({title: [this.data.title, [Validators.required, Validators.minLength(5)]]});
      this.internalIdForm = this.fb.group({internalId: [this.data.internalId, [Validators.required]]});
      this.extraInfoForm = this.fb.group({extraInfo: [this.data.extraInfo, []]});
      this.memberForm = this.fb.group({memberItems: this.fb.array([this.createMemberItem()])});
    });
  }

  onChange = (_: any) => {};

  onTouched = () => {};

  _handleLinkInput(what: string): void {
    console.log('_handleLinkInput: ', this.memberForm.value.member);
    this.valIds.member.changed = true;
    this.knoraService.getResourcesByLabel(this.memberForm.value.member, this.knoraService.wwOntology + 'person').subscribe(
        res => {
          this.options = res;
          this.memberForm.value.member = res[0].label;
          this.memberForm.value.memberIri = res[0].id;
          this.onChange(this.memberForm.value);
        }
    );
  }

  _optionSelected(val): void {
    const res = this.options.filter(tmp => tmp.label === val);
    if (res.length !== 1) {
      console.log('BIG ERROR...');
    }
    this.value = new CompanyData(
        this.labelForm.value.label,
        this.titleForm.value.title,
        this.internalIdForm.value.internalId,
        this.extraInfoForm.value.extraInfo,
        res[0].label, // member
        res[0].id,    // memberIri
    );
  }

  _handleInput(what: string): void {
    switch (what) {
      case 'label':
        this.onChange(this.labelForm.value);
        this.valIds.label.changed = true;
        break;
      case 'title':
        this.onChange(this.titleForm.value);
        this.valIds.title.changed = true;
        break;
      case 'internalId':
        this.onChange(this.internalIdForm.value);
        this.valIds.internalId.changed = true;
        break;
      case 'extraInfo':
        this.onChange(this.extraInfoForm.value);
        this.valIds.extraInfo.changed = true;
        break;
      case 'member':
        this.onChange(this.memberForm.value);
        this.valIds.member.changed = true;
        break;
    }
  }

  _handleDelete(what: string): void {
    switch (what) {
      case 'extraInfo':
        this.valIds.extraInfo.toBeDeleted = !this.valIds.extraInfo.toBeDeleted;
        break;
      case 'member':
        this.valIds.member.toBeDeleted = !this.valIds.member.toBeDeleted;
        break;
    }
  }

  _handleUndo(what: string): void {
    switch (what) {
      case 'label':
        this.labelForm.controls.label.setValue(this.data.label);
        this.valIds.label.changed = false;
        break;
      case 'title':
        this.titleForm.controls.title.setValue(this.data.title);
        this.valIds.title.changed = false;
        break;
      case 'internalId':
        this.internalIdForm.controls.internalId.setValue(this.data.internalId);
        this.valIds.internalId.changed = false;
        break;
      case 'extraInfo':
        this.extraInfoForm.controls.extraInfo.setValue(this.data.extraInfo);
        this.valIds.extraInfo.changed = false;
        break;
      case 'member':
        this.memberForm.controls.member.setValue(this.data.member);
        this.memberForm.controls.memberIri.setValue(this.data.memberIri);
        this.valIds.member.changed = false;
        break;
    }
  }

  save() {
    //this.working = true;
    console.log('this.value:', this.value);
  }

}

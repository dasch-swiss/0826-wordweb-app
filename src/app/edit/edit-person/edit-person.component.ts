import {Component, Input, OnInit, Optional, Self} from "@angular/core";
import {FormArray, FormBuilder, FormGroup, NgControl, Validators} from "@angular/forms";
import {CompanyData, KnoraService, ListPropertyData, PersonData} from "../../services/knora.service";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {combineLatest} from "rxjs";

interface ValInfo {
  id?: string;
  changed: boolean;
  toBeDeleted: boolean;
}

class PersonIds {
  public label: ValInfo;
  public internalId: ValInfo;
  public firstName: ValInfo;
  public lastName: ValInfo;
  public gender: ValInfo;
  public description: ValInfo;
  public birthDate: ValInfo;
  public deathDate: ValInfo;
  public extraInfo: ValInfo;
  public lexias: ValInfo[];

  constructor() {
    this.label = {id: undefined, changed: false, toBeDeleted: false};
    this.internalId = {id: undefined, changed: false, toBeDeleted: false};
    this.firstName = {id: undefined, changed: false, toBeDeleted: false};
    this.lastName = {id: undefined, changed: false, toBeDeleted: false};
    this.gender = {id: undefined, changed: false, toBeDeleted: false};
    this.description = {id: undefined, changed: false, toBeDeleted: false};
    this.birthDate = {id: undefined, changed: false, toBeDeleted: false};
    this.deathDate = {id: undefined, changed: false, toBeDeleted: false};
    this.extraInfo = {id: undefined, changed: false, toBeDeleted: false};
    this.lexias = [];
  }
}


@Component({
  selector: 'app-edit-person',
  template: `
    <p>
      edit-person works!
    </p>
  `,
  styles: [
  ]
})
export class EditPersonComponent implements OnInit {
  inData: any;
  form: FormGroup;
  options: Array<{id: string; label: string}> = [];
  resId: string;
  lastmod: string;
  data: PersonData = new PersonData('', '', '', '', {gender: '', genderIri: ''},
      '', new Date(), new Date(), new Date(), new Date(), []);
  working: boolean;
  public valIds: PersonIds = new PersonIds();

  constructor(public knoraService: KnoraService,
              private fb: FormBuilder,
              public route: ActivatedRoute,
              private dateAdapter: DateAdapter<Date>,
              public location: Location,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              @Optional() @Self() public ngControl: NgControl) {
    this.dateAdapter.setLocale('de'); // dd/MM/yyyy
    this.inData = {};
    this.working = false;
  }

  @Input()
  get value(): PersonData | null {
    const lexias: FormArray = this.getLexias();
    const lexiaValues: {lexiaName: string; lexiaIri: string}[] = [];
    for (const x of lexias.controls) {
      lexiaValues.push(x.value);
    }
    return new PersonData(
        this.form.controls.label.value,
        this.form.controls.internalId.value,
        this.form.controls.firstName.value,
        this.form.controls.lastName.value,
        this.form.controls.gender.value, // ToDo: is this correct??
        this.form.controls.description.value,
        this.form.controls.birthDateStart.value,
        this.form.controls.birthDateEnd.value,
        this.form.controls.deathDateStart.value,
        this.form.controls.deathDateEnd.value,
        this.form.controls.extraInfo.value,
        lexiaValues,
    );
  }

  set value(knoraVal: PersonData | null) {
    const {label, internalId, firstName, lastName, gender, description, birthDateStart, birthDateEnd,
      deathDateStart, deathDateEnd, extraInfo, lexias}
        = knoraVal || new PersonData('', '', '', '', {gender: '', genderIri: ''},
        '', new Date(), new Date(),new Date(), new Date(),'', [{lexiaName: '', lexiaIri: ''}]);
    this.form.setValue({label, internalId, firstName, lastName, gender, description,
      birthDateStart, birthDateEnd, deathDateStart, deathDateEnd, extraInfo, lexias});
  }

  ngOnInit(): void {
    this.working = false;
    combineLatest([this.route.params, this.route.queryParams]).subscribe(arr  => {
      if (arr[0].iri !== undefined) {
        this.inData.personIri = arr[0].iri;
      }
      if (this.inData.personIri !== undefined) {
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
                case this.knoraService.wwOntology + 'hasPersonInternalId': {
                  this.form.controls.internalId.setValue(ele.values[0]);
                  this.valIds.internalId = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.internalId = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasFirstName': {
                  this.form.controls.firstName.setValue(ele.values[0]);
                  this.valIds.firstName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.firstName = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasLastName': {
                  this.form.controls.lastName.setValue(ele.values[0]);
                  this.valIds.lastName = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.lastName = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasGender': { // ToDo: Check if correct!!
                  const tmp = ele as ListPropertyData;
                  this.form.controls.genderIri.setValue(tmp.nodeIris[0]);
                  this.valIds.gender = {id: tmp.ids[0], changed: false, toBeDeleted: false};
                  this.data.gender = {gender: tmp.values[0], genderIri: tmp.nodeIris[0]};
                  break;
                }
                case this.knoraService.wwOntology + 'hasDescription': {
                  this.form.controls.description.setValue(ele.values[0]);
                  this.valIds.description = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.description = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasDescription': {
                  this.form.controls.description.setValue(ele.values[0]);
                  this.valIds.description = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.description = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'hasBirthDate': {
                  const regex = 'GREGORIAN:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE';
                  const found = ele.values[0].match(regex);
                  if (found !== null) {
                    const startYear = parseInt(found[1], 10);
                    const startMonth = parseInt(found[2], 10) - 1;
                    const startDay = parseInt(found[3], 10);
                    const startDate = new Date(startYear, startMonth, startDay);
                    this.form.controls.birthDateStart.setValue(startDate);
                    const endYear = parseInt(found[4], 10);
                    const endMonth = parseInt(found[5], 10) - 1;
                    const endDay = parseInt(found[6], 10);
                    const endDate = new Date(endYear, endMonth, endDay);
                    this.form.controls.birthDateEnd.setValue(endDate);
                    this.data.birthDateStart = startDate;
                    this.data.birthDateEnd = endDate;
                  }
                  this.valIds.birthDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                }
                case this.knoraService.wwOntology + 'hasDeathDate': {
                  const regex = 'GREGORIAN:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE:([0-9]{4})-([0-9]{2})-([0-9]{2}) CE';
                  const found = ele.values[0].match(regex);
                  if (found !== null) {
                    const startYear = parseInt(found[1], 10);
                    const startMonth = parseInt(found[2], 10) - 1;
                    const startDay = parseInt(found[3], 10);
                    const startDate = new Date(startYear, startMonth, startDay);
                    this.form.controls.deathDateStart.setValue(startDate);
                    const endYear = parseInt(found[4], 10);
                    const endMonth = parseInt(found[5], 10) - 1;
                    const endDay = parseInt(found[6], 10);
                    const endDate = new Date(endYear, endMonth, endDay);
                    this.form.controls.deathDateEnd.setValue(endDate);
                    this.data.deathDateStart = startDate;
                    this.data.deathDateStart = endDate;
                  }
                  this.valIds.deathDate = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  break;
                }
                case this.knoraService.wwOntology + 'hasPersonExtraInfo': {
                  this.form.controls.extraInfo.setValue(ele.values[0]);
                  this.valIds.extraInfo = {id: ele.ids[0], changed: false, toBeDeleted: false};
                  this.data.extraInfo = ele.values[0];
                  break;
                }
                case this.knoraService.wwOntology + 'isLexiaPersonValue': {
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
        firstName: [this.data.firstName, [Validators.required, Validators.minLength(5)]],
        lastName: [this.data.lastName, [Validators.required, Validators.minLength(5)]],
        genderIri: [this.data.gender.genderIri, [Validators.required]],
        description: [this.data.description, [Validators.required]],
        birthDateStart: [this.data.birthDateStart, []],
        birthDateEnd: [this.data.birthDateEnd, []],
        deathDateStart: [this.data.deathDateStart, []],
        deathDateEnd: [this.data.deathDateEnd, []],
        internalId: [this.data.internalId, [Validators.required]],
        extraInfo: this.data.extraInfo,
        lexias: this.fb.array([
          /*this.fb.group({lexiaName: '', lexiaIri: ''}),*/
        ]),
      });
      console.log(this.form);
    });
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
  }

  onChange = (_: any) => {};

  

}

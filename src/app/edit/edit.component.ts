import { Component, OnInit } from '@angular/core';
import {KnoraService} from "../services/knora.service";
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
  Validators
} from '@angular/forms';
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit',
  template: `
    <mat-card>
      <mat-card-title>Company</mat-card-title>
      <mat-card-content>
        <button mat-raised-button>New</button><br><br>
        <mat-form-field>
          <input matInput
                 placeholder="Select company"
                 aria-label="Value"
                 [matAutocomplete]="autoCompany"
                 [(ngModel)]="company"
                 (change)="_handleInput('company')"
                 (input)="_handleLinkInput('company')">
          <input matInput [(ngModel)]="companyIri" [hidden]="true">
          <mat-autocomplete #autoCompany="matAutocomplete"
                            (optionSelected)="_optionSelected($event.option.value,
                          'company')">
            <mat-option *ngFor="let option of options" [value]="option.label">
              {{ option.label }}
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>
        <button mat-raised-button
                [disabled]="companyEditDisabled"
                (click)="editCompany()">Edit</button>
      </mat-card-content>
    </mat-card>
    
    <mat-card>
      <mat-card-title>Lexia</mat-card-title>
      <mat-card-content>
        Edit Lexias
      </mat-card-content>
    </mat-card>

  `,
  styles: [
  ]
})
export class EditComponent implements OnInit {
  company = '';
  companyIri = '';
  companyEditDisabled = true;
  options: Array<{id: string; label: string}> = [];

  constructor(public knoraService: KnoraService,
              private router: Router) { }

  ngOnInit(): void {
  }

  onChange = (_: any) => {};

  _handleInput(what: string): void {
    this.onChange(this.company);
    this.onChange(this.companyIri);
  }

  _handleLinkInput(what: string): void {
    switch(what) {
      case 'company':
        if (this.companyIri !== '') {
          this.companyIri = '';
        }
        this.companyEditDisabled = true;
        console.log(this.company);
        this.knoraService.getResourcesByLabel(this.company, this.knoraService.wwOntology + 'company').subscribe(
            res => {
              this.options = res;
              console.log('_handleLinkInput:res=', res);
            }
        );
        break;
    }
  }

  _optionSelected(val: any, what: string) {
    const res = this.options.filter(tmp => tmp.label === val);
    this.company = res[0].label;
    this.companyIri = res[0].id;
    this.companyEditDisabled = false;
    console.log('_optionSelected:res', res);
  }

  editCompany() {
    this.router.navigate(['/edit/company', this.companyIri]);
  }


}

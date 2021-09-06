import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

export interface ConfirmationData {
  title: string;
  text: string;
}

export interface ConformationResult {
  status: boolean;
  comment?: string;
}

@Component({
  selector: 'app-confirmation',
  template: `
    <mat-dialog-content [formGroup]="form">
      <h1>{{title}}</h1>
      <div>{{text}}</div>
      <div>
        <mat-form-field>
          <input matInput
                 placeholder="Comment"
                 formControlName="comment">
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button type="button" mat-raised-button color="warn" (click)="yes()">Yes</button>
      <button type="submit" mat-raised-button mat-primary color="primary" (click)="no()">No</button>
    </mat-dialog-actions>
  `,
  styles: [
  ]
})
export class ConfirmationComponent implements OnInit {
  form: FormGroup;
  title: string;
  text: string;
  comment = '';

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) data: ConfirmationData) {
    this.title = data.title;
    this.text = data.text;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      comment: [this.comment, []]
    });

  }

  yes(): void {
    const result: ConformationResult = {status: true, comment: this.form.value.comment};
    this.dialogRef.close(result);
  }

  no(): void {
    const result: ConformationResult = {status: false};
    this.dialogRef.close(result);
  }

}

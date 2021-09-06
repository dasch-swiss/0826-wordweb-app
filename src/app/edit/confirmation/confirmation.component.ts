import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface ConfirmationData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-confirmation',
  template: `
    <mat-dialog-content>
      <h1>{{title}}</h1>
      <div>{{text}}</div>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button type="button" mat-primary class="mat-raised-button" (click)="yes()">Yes</button>
      <button type="submit" class="mat-raised-button mat-primary" (click)="no()">No</button>
    </mat-dialog-actions>
  `,
  styles: [
  ]
})
export class ConfirmationComponent implements OnInit {
  title: string;
  text: string;

  constructor(private dialogRef: MatDialogRef<ConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) data: ConfirmationData) { }

  ngOnInit(): void {
  }

  yes() {
    this.dialogRef.close(true);
  }

  no() {
    this.dialogRef.close(false);
  }

}

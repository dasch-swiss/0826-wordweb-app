import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';

export interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  template: `
    <h1 mat-dialog-title>Login</h1>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field>
        <input matInput
               placeholder="Email"
               formControlName="email">
      </mat-form-field>
      <br/>
      <mat-form-field>
        <input matInput
               type="password"
               placeholder="Password"
               formControlName="password">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button type="button" mat-primary class="mat-raised-button" (click)="close()">Cancel</button>
      <button type="submit" class="mat-raised-button mat-primary" (click)="save()">Login</button>
    </mat-dialog-actions>
  `,
  styles: [
    '.dialogdemoBasicUsage #popupContainer { position: relative; }',
    '#login-dialog { max-width: 90%; width: 500px; }'
  ]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  email: string;
  password: string;

  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<LoginComponent>,
              @Inject(MAT_DIALOG_DATA) data: LoginData) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [this.email, []],
      password: [this.password, []]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}

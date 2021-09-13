import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormGroup} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {calendars} from '../../classes/calender-helper';
import {IBaseDateValue} from "@dasch-swiss/dsp-js/src/models/v2/resources/values/type-specific-interfaces/base-date-value";

// https://material.angular.io/guide/creating-a-custom-form-field-control
export enum DateCalendar {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GREGORIAN = 'GREGORIAN',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JULIAN = 'JULIAN'
}

export enum DateEra {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  BCE = 'BCE',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CE = 'CE'
}

export enum DateMonth {
  undefinedMonth,
  january,
  february,
  march,
  april,
  may,
  june,
  july,
  august,
  september,
  october,
  november,
  december
}

class DateValue implements IBaseDateValue{
  calendar: string;
  startDay?: number;
  startMonth?: number;
  startYear: number;
  startEra?: string;
  endDay?: number;
  endMonth?: number;
  endYear: number;
  endEra?: string;

  constructor(calendar: string | undefined,
              startDay: number | string | undefined,
              startMonth: number | string | undefined,
              startYear: number | string,
              startEra?: string | undefined,
              endDay?: number | string | undefined,
              endMonth?: number | string | undefined,
              endYear?: number | string | undefined,
              endEra?: string | undefined) {
    if (calendar === undefined) {
      this.calendar = 'GREGORIAN';
    } else {
      switch (calendar.toUpperCase()) {
        case 'JULIAN': this.calendar = 'JULIAN'; break;
        case 'GREGORIAN': this.calendar = 'GREGORIAN'; break;
        case 'JEWISH': this.calendar = 'JEWISH'; break;
        default: throw TypeError('Invalid calendar: ' + calendar);
      }
    }
    this.startDay = this.getRange(startDay, 1, 31);
    this.startMonth = this.getRange(startMonth, 1, 12);
    this.startYear = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    this.startEra = this.getEra(startEra);
    this.endDay = this.getRange(endDay, 1, 31);
    this.endMonth = this.getRange(endMonth, 1, 12)
    this.endYear = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
    this.endEra = this.getEra(endEra);
  }

  parseDateValueFromKnora(datestr: string): DateValue {
    let calendar = DateCalendar.GREGORIAN;
    //const regex = '(GREGORIAN|JULIAN):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE)';
    const regex = '(GREGORIAN:|JULIAN:)?([0-9]{4})(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?(:[0-9]{4})?(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?';
    const found = datestr.match(datestr);
    if (found) {
      switch(found[1]) {
        case DateCalendar.JULIAN: calendar = DateCalendar.JULIAN; break;
        case DateCalendar.GREGORIAN: calendar = DateCalendar.GREGORIAN; break;
        case undefined: calendar = DateCalendar.GREGORIAN; break;
        default: throw TypeError('Invalid calendar string: ' + found[1]);
      }

      const startYear = typeof found[2] === 'string' ? parseInt(found[2], 10) : undefined;
      const startMonth = this.getRange(found[3], 1, 12);
      const startDay = this.getRange(found[4], 1, 31);
      const startEra = this.getEra(found[5]);

      const startYear = typeof found[2] === 'string' ? parseInt(found[2], 10) : undefined;
      const startMonth = this.getRange(found[3], 1, 12);
      const startDay = this.getRange(found[4], 1, 31);
      const startEra = this.getEra(found[5]);


      const endYear = parseInt(found[6], 10);
      const endMonth = parseInt(found[7], 10);
      const endDay = parseInt(found[8], 10);
      let endPeriod: DatePeriod;
      switch(found[9]) {
        case DatePeriod.BCE: endPeriod = DatePeriod.BCE; break;
        case DatePeriod.CE: endPeriod = DatePeriod.CE; break;
        default: throw TypeError('Invalid period string: ' + found[1]);
      }
      return new DateValue(calendar, startYear, startMonth, startDay, startPeriod, endYear, endMonth, endDay, endPeriod);
    }
  }

  private getRange(value: number | string | undefined, from: number, to: number): number | undefined {
    let v: number;
    if (typeof value === 'string') {
      v = parseInt(value, 10);
    }
    else if (typeof value === 'number') {
      v = value;
    }
    if (v < from || v > to) {
      return undefined;
    }
    else {
      return v;
    }
  }

  private getEra(era: string | undefined): string | undefined {
    if (era === undefined) {
      return undefined;
    }
    switch(era.toUpperCase()) {
      case 'CE': return 'CE';
      case 'BCE': return 'BCE';
      case 'BC': return 'BCE';
      case 'AD': return 'CE';
    }
    throw TypeError('Invalid era: ' + era);
  }

}

@Component({
  selector: 'knora-date-value',
  template: `
    <div [formGroup]="parts" class="knora-string-input-container">
      <mat-select formControlName="calendar"
                  aria-label="Calendar"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let dispNode in calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
      </mat-select>
      <br>
      <mat-select formControlName="startDay"
                  aria-label="Start day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in days" [value]="d">d</mat-option>
      </mat-select>
      -
      <mat-select formControlName="startMonth"
                  aria-label="Start month"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in months" [value]="d">d</mat-option>
      </mat-select>
      -
      <input formControlName="startYear" aria-label="Start year" (input)="_handleInput()"> :
      <mat-select formControlName="startEra"
                  aria-label="Start era"
                  (selectionChange)="_handleInput()">
        <mat-option value="CE">BC</mat-option>
        <mat-option value="BCE">BCE</mat-option>
      </mat-select>
      <br>
      <mat-select formControlName="endDay"
                  aria-label="End day"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in days" [value]="d">d</mat-option>
      </mat-select>
      -
      <mat-select formControlName="endMonth"
                  aria-label="End month"
                  (selectionChange)="_handleInput()">
        <mat-option *ngFor="let d in months" [value]="d">d</mat-option>
      </mat-select>
      -
      <input formControlName="endYear" aria-label="End year" (input)="_handleInput()">
      :
      <mat-select formControlName="endEra"
                  aria-label="End era"
                  (selectionChange)="_handleInput()">
        <mat-option value="CE">BC</mat-option>
        <mat-option value="BCE">BCE</mat-option>
      </mat-select>
    </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: DateValueComponent}],
  styles: [
  ]
})

export class DateValueComponent
    implements ControlValueAccessor, MatFormFieldControl<DateValue>, OnDestroy, OnInit {
  static nextId = 0;

  @Input()
  valueLabel: string;
  calendarNames = ['GREGORIAN', 'JULIAN', 'JEWISH'];
  days = ['-', '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
  months = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-date-value';
  id = `knora-date-value-${DateValueComponent.nextId++}`;
  describedBy = '';

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return !value && !comment;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  @Input()
  get value(): DateValue | null {
    const {value: {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return new DateValue(calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod);
  }
  set value(knoraVal: DateValue | null) {
    const now = new Date();
    const {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod} = knoraVal ||
    new DateValue(DateCalendar.GREGORIAN,
        now.getFullYear(), now.getMonth() + 1, now.getDate(), DatePeriod.CE,
        now.getFullYear(), now.getMonth() + 1, now.getDate(), DatePeriod.CE);
    this.parts.setValue({calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod});
    this.stateChanges.next();
  }


  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('input')!.focus();
    }
  }

  writeValue(knoraVal: KnoraListVal | null): void {
    this.value = knoraVal;
  }

  registerOnChange(fn: any): void {
    console.log('registerOnChange', fn);
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.add('bg');
    }
  }

  _handleInput(): void {
    this.onChange(this.parts.value);
  }

}

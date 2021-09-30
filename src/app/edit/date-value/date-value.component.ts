import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {IBaseDateValue} from '@dasch-swiss/dsp-js/src/models/v2/resources/values/type-specific-interfaces/base-date-value';
import {KnoraService} from '../../services/knora.service';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Calendar, DateCalendar} from '../../classes/calendar';
import {MatSnackBar} from "@angular/material/snack-bar";

// https://material.angular.io/guide/creating-a-custom-form-field-control

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

export class DateValue {
  calendar: string;
  timeSpan: boolean;
  startDay: string;
  startMonth: string;
  startYear: string;
  endDay: string;
  endMonth: string;
  endYear: string;
  startJd: number;
  endJd: number;

  constructor(calendar?: string | undefined,
              timeSpan?: boolean | undefined,
              startYear?: number | string | undefined,
              startMonth?: number | string | undefined,
              startDay?: number | string | undefined,
              endYear?: number | string | undefined,
              endMonth?: number | string | undefined,
              endDay?: number | string | undefined) {
    if (calendar === undefined) {
      this.calendar = 'GREGORIAN';
    } else {
      switch (calendar.toUpperCase()) {
        case 'GREGORIAN': this.calendar = 'GREGORIAN'; break;
        case 'JULIAN': this.calendar = 'JULIAN'; break;
        case 'ISLAMIC': this.calendar = 'ISLAMIC'; break;
        default: throw TypeError('Invalid calendar: ' + calendar);
      }
    }
    let sY = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    if ((sY === undefined) || isNaN(sY)) {
      const now = new Date();
      sY = now.getFullYear();
    }
    this.startYear = sY.toString(10);
    this.startMonth = DateValue.getRange(startMonth, 1, 12);
    this.startDay = DateValue.getRange(startDay, 1, 31);

    this.timeSpan = timeSpan || false;

    const eY = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
    if ((eY === undefined) || isNaN(eY)) {
      this.endYear = '';
    }
    else {
      this.endYear = sY.toString(10);
    }
    this.endMonth = DateValue.getRange(endMonth, 1, 12);
    this.endDay = DateValue.getRange(endDay, 1, 31);

    let sYear: string;
    let sMonth: string;
    let sDay: string;
    let eYear: string;
    let eMonth: string;
    let eDay: string;
    switch(this.calendar) {
      case DateCalendar.GREGORIAN:
        sYear = this.startYear || '1'; // we assign startYear=1 for undefined dates
        sMonth = this.startMonth === '-' ? '1' : this.startMonth;
        sDay = this.startDay === '-' ? '1' : this.startDay;
        this.startJd = Calendar.gregorian_to_jd(parseInt(sYear, 10), parseInt(sMonth, 10), parseInt(sDay, 10));
        eYear = this.endYear || sYear; // if endYear undefined, we assume same as startYear...
        eMonth = this.endMonth === '-' ? '12' : this.startMonth;
        eDay = this.endDay === '-' ? '31' : this.endDay;
        this.endJd = Calendar.gregorian_to_jd(parseInt(eYear, 10), parseInt(eMonth, 10), parseInt(eDay, 10));
        break;
      case DateCalendar.JULIAN:
        sYear = this.startYear || '1'; // we assign startYear=1 for undefined dates
        sMonth = this.startMonth === '-' ? '1' : this.startMonth;
        sDay = this.startDay === '-' ? '1' : this.startDay;
        this.startJd = Calendar.julian_to_jd(parseInt(sYear, 10), parseInt(sMonth, 10), parseInt(sDay, 10));
        eYear = this.endYear || sYear; // if endYear undefined, we assume same as startYear...
        eMonth = this.endMonth === '-' ? '12' : this.startMonth;
        eDay = this.startDay === '-' ? '31' : this.startDay;
        this.endJd = Calendar.julian_to_jd(parseInt(eYear, 10), parseInt(eMonth, 10), parseInt(eDay, 10));
        break;
      case DateCalendar.ISLAMIC:
        sYear = this.startYear || '1'; // we assign startYear=1 for undefined dates
        sMonth = this.startMonth === '-' ? '1' : this.startMonth;
        sDay = this.startDay === '-' ? '1' : this.startDay;
        this.startJd = Calendar.islamic_to_jd(parseInt(sYear, 10), parseInt(sMonth, 10), parseInt(sDay, 10));
        eYear = this.endYear || sYear; // if endYear undefined, we assume same as startYear...
        eMonth = this.endMonth === '-' ? '12' : this.startMonth;
        eDay = this.startDay === '-' ? '31' : this.startDay;
        this.endJd = Calendar.islamic_to_jd(parseInt(eYear, 10), parseInt(eMonth, 10), parseInt(eDay, 10));
        break;
    }
  }

  static parseDateValueFromKnora(datestr: string): DateValue {
    let calendar = DateCalendar.GREGORIAN;
    //const regex = '(GREGORIAN|JULIAN):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE):([0-9]{4})-([0-9]{2})-([0-9]{2}) (BCE|CE)';
    const regex = '(GREGORIAN:|JULIAN:)?([0-9]{4})(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?(:[0-9]{4})?(-[0-9]{2})?(-[0-9]{2})?( BCE| CE)?';
    const found = datestr.match(regex);
    if (found) {
      if (found[1]) {
        const cal = found[1].slice(0, -1);
        switch(cal) {
          case DateCalendar.JULIAN: calendar = DateCalendar.JULIAN; break;
          case DateCalendar.GREGORIAN: calendar = DateCalendar.GREGORIAN; break;
          case DateCalendar.ISLAMIC: calendar = DateCalendar.ISLAMIC; break;
          case undefined: calendar = DateCalendar.GREGORIAN; break;
          default: throw TypeError('Invalid calendar string: ' + found[1]);
        }
      }
      else {
        calendar = DateCalendar.GREGORIAN;
      }
      let startYear: number = typeof found[2] === 'string' ? parseInt(found[2], 10) : undefined;
      if (startYear && DateValue.isBCE(found[5])) {
        startYear = -startYear;
      }
      const startMonth = DateValue.getRange(found[3], 1, 12);
      const startDay = DateValue.getRange(found[4], 1, 31);

      const timeSpan = found[6] ? true : false;

      let endYear: number = typeof found[6] === 'string' ? parseInt(found[6], 10) : undefined;
      if (endYear && DateValue.isBCE(found[9])) {
        endYear = -endYear;
      }
      const endMonth = DateValue.getRange(found[7], 1, 12);
      const endDay = DateValue.getRange(found[8], 1, 31);
      return new DateValue(calendar, timeSpan, startYear, startMonth, startDay, endYear, endMonth, endDay);
    }
  }

  private static getRange(value: number | string | undefined, from: number, to: number): string {
    if (value === undefined) {
      return '-';
    }
    let v: number;
    if (typeof value === 'string') {
      if (value === '-') {
        return '-';
      }
      v = parseInt(value, 10);
      if (isNaN(v)) {
        throw new TypeError('Invalid range (1): ' + value);
      }
    } else if (typeof value === 'number') {
      v = value;
    }
    if (v < from || v > to) {
      throw new TypeError('Invalid range (2): ' + value);
    } else {
      return v.toString(10);
    }
  }

  private static isBCE(era: string | undefined): boolean {
    if (era === undefined) {
      return false;
    }
    switch(era.toUpperCase().trim()) {
      case 'CE': return false; break;
      case 'BCE': return true; break;
      case 'BC': return true; break;
      case 'AD': return false; break;
    }
    throw TypeError('Invalid era: ' + era);
  }

}

@Component({
  selector: 'app-knora-date-value',
  template: `
    <div [formGroup]="parts" class="datecontainer" >
      <mat-form-field class="calsel">
        <mat-label>Calendar</mat-label>
        <mat-select class="dval" matTooltip="Select one of the Calendars"
                    matNativeControl
                    formControlName="calendar"
                    aria-label="Calendar"
                    (selectionChange)="_handleCalendarChange()">
          <mat-option *ngFor="let dispNode of calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
        </mat-select>
      </mat-form-field>
        <mat-checkbox formControlName="timeSpan" (change)="_handleTimeSpanChange()">Time span</mat-checkbox>
      <br>
      <mat-form-field class="yearsel">
        <mat-label>Year</mat-label>
        <input matInput class="dval"
               type="number"
               matTooltip="Enter BCE as negative year. Note: JULIAN does not have year 0!"
               formControlName="startYear"
               aria-label="Start year"
               (input)="_handleInput('startYear')">
      </mat-form-field>
      <mat-form-field class="rangesel">
        <mat-label>Month</mat-label>
        <mat-select class="dval"
                    formControlName="startMonth"
                    aria-label="Start month"
                    (selectionChange)="_handleInput('startMonth')">
          <mat-option *ngFor="let d of months" [value]="d[0]">{{d[0]}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field  class="rangesel">
        <mat-label>Day</mat-label>
        <mat-select class="dval"
                    formControlName="startDay"
                    aria-label="Start day"
                    (selectionChange)="_handleInput()">
          <mat-option *ngFor="let d of startDays" [value]="d[0]">{{d[0]}}</mat-option>
        </mat-select>
      </mat-form-field>
      <span  *ngIf="parts.controls.timeSpan.value">&nbsp;-&nbsp;</span>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="yearsel">
        <mat-label>Year</mat-label>
        <input matInput
               type="number"
               matTooltip="Enter BCE as negative year. Note: JULIAN does not have year 0!"
               class="dval"
               formControlName="endYear"
               aria-label="End year"
               (input)="_handleInput('endYear')">
      </mat-form-field>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="rangesel">
        <mat-label>Month</mat-label>
        <mat-select class="dval"
                    formControlName="endMonth"
                    aria-label="End month"
                    (selectionChange)="_handleInput('endMonth')">
          <mat-option *ngFor="let d of months" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="rangesel">
        <mat-label>Day</mat-label>
        <mat-select class="dval"
                    formControlName="endDay"
                    aria-label="End day"
                    (selectionChange)="_handleInput()">
          <mat-option *ngFor="let d of endDays" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <input hidden matInput type="number" formControlName="startJd">
      <input hidden matInput type="number" formControlName="endJd">
     </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: DateValueComponent}],
  styles: [
      '.bg {background-color: lightgrey;}',
      '.calsel {width: 120px; padding-left: 2px; padding-right: 2px;}',
      '.rangesel {width: 80px; padding-left: 2px; padding-right: 2px;}',
      '.yearsel {width: 80px; padding-left: 2px; padding-right: 2px;}',
      '.erasel {width: 80px; padding-left: 2px; padding-right: 2px;}',
  ]
})

export class DateValueComponent
    implements ControlValueAccessor, MatFormFieldControl<DateValue>, OnDestroy, OnInit {
  static nextId = 0;

  @Input()
  valueLabel: string;
  calendarNames = ['GREGORIAN', 'JULIAN', 'ISLAMIC'];
  startDays: string[] = [];
  endDays: string[] = [];
  months: [string,boolean][] = [['-', true], ['1', true], ['2', true], ['3', true], ['4', true], ['5', true],
    ['6', true], ['7', true], ['8', true], ['9', true], ['10', true], ['11', true], ['12', true]];

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-date-value';
  id = `knora-date-value-${DateValueComponent.nextId++}`;
  describedBy = '';
  timeSpan: FormGroup;

  private placeholderL: string;
  private requiredL = false;
  private disabledL = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {calendar, startDay, startMonth, startYear, endDay, endMonth, endYear}} = this.parts;
    return !startYear;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this.placeholderL;
  }
  set placeholder(value: string) {
    this.placeholderL = value;
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this.requiredL;
  }
  set required(value: boolean) {
    this.requiredL = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this.disabledL;
  }
  set disabled(value: boolean) {
    this.disabledL = coerceBooleanProperty(value);
    if (this.disabledL) {
      this.parts.disable();
    } else {
      this.parts.enable();
    }
    this.stateChanges.next();
  }

  @Input()
  get value(): DateValue | null {
    const {value: {calendar, timeSpan, startYear, startMonth, startDay, endYear, endMonth, endDay, startJd, endJd}} = this.parts;
    return new DateValue(calendar, timeSpan, startYear, startMonth, startDay, endYear, endMonth, endDay);
  }

  set value(knoraVal: DateValue | null) {
    const now = new Date();
    // eslint-disable-next-line prefer-const
    let {calendar, timeSpan, startYear, startMonth, startDay, endYear, endMonth, endDay, startJd, endJd} = knoraVal ||
    new DateValue(DateCalendar.GREGORIAN, false,
        now.getFullYear(), now.getMonth() + 1, now.getDate(), '', '-', '-');
    if (!startYear) {
      startMonth = '-';
      this.parts.controls.startMonth.disable();
    }
    if (!endYear) {
      endMonth = '-';
      this.parts.controls.endMonth.disable();
    }
    if (startMonth === '-') {
      startDay = '-';
      this.parts.controls.startDay.disable();
    }
    if (endMonth === '-') {
      endDay = '-';
      this.parts.controls.endDay.disable();
    }

    if (startYear && startMonth) {
      const days = Calendar.daycnt(this.parts.controls.calendar.value,
          this.parts.controls.startYear.value,
          this.parts.controls.startMonth.value);
      const startDays: string[] = ['-'];
      for (let i = 1; i <= days; i++) {
        startDays.push(i.toString(10));
      }
      this.startDays = startDays;
    }

    if (endYear && endMonth) {
      const days = Calendar.daycnt(this.parts.controls.calendar.value,
          this.parts.controls.endYear.value,
          this.parts.controls.endMonth.value);
      const endDays: string[] = ['-'];
      for (let i = 1; i <= days; i++) {
        endDays.push(i.toString(10));
      }
      this.endDays = endDays;
    }


    this.parts.setValue({calendar, timeSpan, startDay, startMonth, startYear, endDay, endMonth, endYear, startJd, endJd});
    this.stateChanges.next();
  }

  constructor(private formBuilder: FormBuilder,
              private knoraService: KnoraService,
              private focusMonitor: FocusMonitor,
              private snackBar: MatSnackBar,
              private elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl) {
    this.parts = this.formBuilder.group({
      calendar: ['GREGORIAN', []],
      timeSpan: false,
      startYear: ['', []],
      startMonth: ['-', []],
      startDay: ['-', []],
      endYear: '',
      endMonth: '-',
      endDay: '-',
      startJd: 0,
      endJd: 0
    });
    this.timeSpan = this.formBuilder.group({
      timeSpan: false
    });

    focusMonitor.monitor(elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    if (!this.valueLabel) { this.valueLabel = 'Value'; }
    this.parts.controls.startDay.setValue('-');
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
  }

  writeValue(knoraVal: DateValue | null): void {
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
      this.elementRef.nativeElement.querySelector('.dval')?.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this.elementRef.nativeElement.querySelector('.dval')?.classList.add('bg');
    }
  }

  _handleTimeSpanChange(): void {
    if (this.parts.controls.timeSpan.value) {
      const sYear = this.parts.controls.startYear.value;
      this.parts.controls.endYear.setValue(sYear);
      this.parts.controls.endYear.enable();

      const sMonth = this.parts.controls.startMonth.value;
      this.parts.controls.endMonth.setValue(sMonth);
      this.parts.controls.endMonth.enable();

      const sDay = this.parts.controls.startDay.value;
      const daycnt = Calendar.daycnt(this.parts.controls.calendar.value,
          this.parts.controls.endYear.value,
          this.parts.controls.endMonth.value);
      const endDays: string[] = ['-'];
      for (let i = 1; i <= daycnt; i++) {
        endDays.push(i.toString(10));
      }
      this.endDays = endDays;
      const eday = parseInt(this.parts.controls.endDay.value, 10);
      if (!isNaN(eday)) {
        if (eday > daycnt) {
          this.parts.controls.startDay.setValue(String(daycnt));
        }
      }
      if (sMonth !== '-') {
        this.parts.controls.endDay.enable();
      } else {
        this.parts.controls.endDay.disable();
      }
      this.parts.controls.endDay.setValue(sDay);
    } else {
      this.parts.controls.endYear.setValue('');
      this.parts.controls.endYear.disable();
      this.parts.controls.endMonth.setValue('-');
      this.parts.controls.endMonth.disable();
      this.parts.controls.endDay.setValue('-');
      this.parts.controls.endDay.disable();
    }
  }

  _handleCalendarChange(): void {
    if (this.parts.controls.startDay.value) {
      const sDay = parseInt(this.parts.controls.startDay.value, 10);
      if (!isNaN(sDay)) {
        const sMonth = parseInt(this.parts.controls.startMonth.value, 10);
        const sYear = parseInt(this.parts.controls.startYear.value, 10);
        const sJd = Number(this.parts.controls.startJd.value);
        let newSDateArr: number[];
        switch (this.parts.controls.calendar.value) {
          case DateCalendar.GREGORIAN:
            newSDateArr = Calendar.jd_to_gregorian(sJd);
            break;
          case DateCalendar.JULIAN:
            newSDateArr = Calendar.jd_to_julian(sJd);
            break;
          case DateCalendar.ISLAMIC:
            newSDateArr = Calendar.jd_to_islamic(sJd);
            break;
        }
        this.parts.controls.startYear.setValue(String(newSDateArr[0]));
        this.parts.controls.startMonth.setValue(String(newSDateArr[1]));
        this.parts.controls.startDay.setValue(String(newSDateArr[2]));
      }
    }
    if (this.parts.controls.endDay.value) {
      const eDay = parseInt(this.parts.controls.endDay.value, 10);
      if (!isNaN(eDay)) {
        const eMonth = parseInt(this.parts.controls.endMonth.value, 10);
        const sYear = parseInt(this.parts.controls.endYear.value, 10);
        const eJd = Number(this.parts.controls.endJd.value);
        let newEDateArr: number[];
        switch (this.parts.controls.calendar.value) {
          case DateCalendar.GREGORIAN:
            newEDateArr = Calendar.jd_to_gregorian(eJd);
            break;
          case DateCalendar.JULIAN:
            newEDateArr = Calendar.jd_to_julian(eJd);
            break;
          case DateCalendar.ISLAMIC:
            newEDateArr = Calendar.jd_to_islamic(eJd);
            break;
        }
        this.parts.controls.endYear.setValue(String(newEDateArr[0]));
        this.parts.controls.endMonth.setValue(String(newEDateArr[1]));
        this.parts.controls.endDay.setValue(String(newEDateArr[2]));
      }
    }
  }

  _handleInput(what?: string): void {
    if (what !== undefined) {
      let daycnt: number;
      switch(what) {
        case 'startYear':
          if (this.parts.controls.startYear.value === '') {
            this.parts.controls.startMonth.disable();
          }
          else {
            this.parts.controls.startMonth.enable();
          }
          break;
        case 'endYear':
          if (this.parts.controls.endYear.value === '') {
            this.parts.controls.endMonth.disable();
          }
          else {
            this.parts.controls.endMonth.enable();
          }
          if (Number(this.parts.controls.endYear.value) < Number(this.parts.controls.startYear.value)) {
            this.snackBar.open('End year or time span must by greater or equal start year!', 'OK');
            this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
          }
          break;
        case 'startMonth':
          if (this.parts.controls.startMonth.value === '-') {
            this.parts.controls.startDay.disable();
            this.parts.controls.startDay.setValue('-');
          }
          else {
            this.parts.controls.startDay.enable();
          }
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value,
              this.parts.controls.startYear.value,
              this.parts.controls.startMonth.value);
          const startDays: string[] = ['-'];
          for (let i = 1; i <= daycnt; i++) {
            startDays.push(i.toString(10));
          }
          this.startDays = startDays;
          const sday = parseInt(this.parts.controls.startDay.value, 10);
          if (!isNaN(sday)) {
            if (sday > daycnt) {
              this.parts.controls.startDay.setValue(String(daycnt));
            }
          }
          break;
        case 'endMonth':
          if (this.parts.controls.endMonth.value === '-') {
            this.parts.controls.endDay.disable();
            this.parts.controls.endDay.setValue('-');
          }
          else {
            this.parts.controls.endDay.enable();
          }
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value,
              this.parts.controls.endYear.value,
              this.parts.controls.endMonth.value);
          const endDays: string[] = ['-'];
          for (let i = 1; i <= daycnt; i++) {
            endDays.push(i.toString(10));
          }
          this.endDays = endDays;
          const eday = parseInt(this.parts.controls.endDay.value, 10);
          if (!isNaN(eday)) {
            if (eday > daycnt) {
              this.parts.controls.startDay.setValue(String(daycnt));
            }
          }
          break;
      }
    }
    const dval = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
        this.parts.controls.startYear.value, this.parts.controls.startMonth.value, this.parts.controls.startDay.value,
        this.parts.controls.endYear.value, this.parts.controls.endMonth.value, this.parts.controls.endDay.value);
    this.parts.controls.startJd.setValue(dval.startJd);
    this.parts.controls.endJd.setValue(dval.endJd);
    this.onChange(this.parts.value);
  }

}

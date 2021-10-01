import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {KnoraService} from '../../services/knora.service';
import {FocusMonitor} from '@angular/cdk/a11y';
import {Calendar, DateCalendar} from '../../classes/calendar';
import {MatSnackBar} from '@angular/material/snack-bar';
//import {timestamp} from 'rxjs/operators';

// https://material.angular.io/guide/creating-a-custom-form-field-control

export class DateValue {
  calendar: DateCalendar;
  timeSpan: boolean;
  startYear: number;
  startMonth?: number;
  startDay?: number;
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  startJd?: number;
  endJd?: number;

  constructor(calendar?: string | DateCalendar | undefined,
              timeSpan?: boolean | undefined,
              startYear?: number | string | undefined,
              startMonth?: number | string | undefined,
              startDay?: number | string | undefined,
              endYear?: number | string | undefined,
              endMonth?: number | string | undefined,
              endDay?: number | string | undefined) {
    if (calendar === undefined) {
      this.calendar = DateCalendar.GREGORIAN;
    } else if (typeof calendar === 'string') {
      switch (calendar.toUpperCase()) {
        case 'GREGORIAN': this.calendar = DateCalendar.GREGORIAN; break;
        case 'JULIAN': this.calendar = DateCalendar.JULIAN; break;
        case 'ISLAMIC': this.calendar = DateCalendar.ISLAMIC; break;
        default: throw TypeError('Invalid calendar: ' + calendar);
      }
    } else {
      this.calendar = calendar;
    }

    //
    // we fill the structure that we can calcalulate the period start and end using JD
    //
    this.startYear = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    if (isNaN(this.startYear)) {
      this.startYear = undefined;
      this.startMonth = undefined;
      this.startDay = undefined;
      this.endYear = undefined;
      this.endMonth = undefined;
      this.endDay = undefined;
      this.startJd = undefined;
      this.endJd = undefined;
      return;
    }

    this.endYear = this.startYear;
    this.startMonth = DateValue.getRange(startMonth, 1, 12);
    if (this.startMonth) {
      this.endMonth = this.startMonth;
      const sDaycnt = Calendar.daycnt(this.calendar, this.startYear, this.startMonth);
      this.startDay = DateValue.getRange(startDay, 1, sDaycnt);
      if (this.startDay) {
        this.endDay = this.startDay;
      } else {
        this.startDay = 1;
        const eDaycnt = Calendar.daycnt(this.calendar, this.endYear, this.endMonth);
        this.endDay = eDaycnt;
      }
    } else {
      this.startMonth = 1;
      this.endMonth = 12;
      this.startDay = 1;
      this.endDay = Calendar.daycnt(this.calendar, this.endYear, this.endMonth);
    }

    this.timeSpan = timeSpan || false;

    if (this.timeSpan) {
      let eY = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
      if (isNaN(eY)) {
        eY = undefined;
      }
      if (eY) {
        if (eY >= this.startYear) {
          this.endYear = eY;
        } else {
          throw TypeError('Invalid date: startYear > endYear!');
        }
        const eM = DateValue.getRange(endMonth, 1, 12) || 12;
        const eD = DateValue.getRange(endDay, 1, 31) || Calendar.daycnt(this.calendar, this.endYear, eM);
        if (this.startYear === this.endYear) {
          if (eM < this.startMonth) {
            throw TypeError('Invalid date: startYear/startMonth > endYear/endMonth!');
          } else {
            this.endMonth = eM;
          }
          if (this.startMonth === this.endMonth) {
            if (eD < this.startDay) {
              throw TypeError('Invalid date: startYear/startMonth/startDay > endYear/endMonth/endDay!');
            } else {
              this.endDay = eD;
            }
          } else {
            this.endDay = eD;
          }
        } else {
          this.endMonth = eM;
          this.endDay = eD;
        }
      }
    }

    switch(this.calendar) {
      case DateCalendar.GREGORIAN:
        this.startJd = Calendar.gregorian_to_jd(this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.gregorian_to_jd(this.startYear, this.startMonth, this.startDay);
        break;
      case DateCalendar.JULIAN:
        this.startJd = Calendar.julian_to_jd(this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.julian_to_jd(this.startYear, this.startMonth, this.startDay);
        break;
      case DateCalendar.ISLAMIC:
        this.startJd = Calendar.islamic_to_jd(this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.islamic_to_jd(this.startYear, this.startMonth, this.startDay);
        break;
    }
  }

  static parseDateValueFromKnora(datestr: string): DateValue {
    let calendar = DateCalendar.GREGORIAN;
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

      let startYear: number = parseInt(found[2], 10);
      if (isNaN(startYear)) { startYear = undefined; }
      if (startYear && DateValue.isBCE(found[5])) {
        startYear = -startYear;
      }
      const startMonth = DateValue.getRange(found[3], 1, 12);
      const startDay = DateValue.getRange(found[4], 1, 31);

      const timeSpan = !!found[6];

      let endYear: number = parseInt(found[6], 10);
      if (isNaN(endYear)) { endYear = undefined; }
      if (endYear && DateValue.isBCE(found[9])) {
        endYear = -endYear;
      }
      const endMonth = DateValue.getRange(found[7], 1, 12);
      const endDay = DateValue.getRange(found[8], 1, 31);
      return new DateValue(calendar, timeSpan, startYear, startMonth, startDay, endYear, endMonth, endDay);
    }
  }

  private static getRange(value: number | string | undefined, from: number, to: number): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    let v: number;
    if (typeof value === 'string') {
      if (value === '-') {
        return undefined;
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
      return v;
    }
  }

  private static isBCE(era: string | undefined): boolean {
    if (era === undefined) {
      return false;
    }
    switch(era.toUpperCase().trim()) {
      case 'CE': return false;
      case 'BCE': return true;
      case 'BC': return true;
      case 'AD': return false;
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
          <mat-option *ngFor="let d of sMonths" [value]="d[0]" [disabled]="d[1]">{{d[0]}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field  class="rangesel">
        <mat-label>Day</mat-label>
        <mat-select class="dval"
                    formControlName="startDay"
                    aria-label="Start day"
                    (selectionChange)="_handleInput()">
          <mat-option *ngFor="let d of startDays" [value]="d" >{{d}}</mat-option>
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
          <mat-option *ngFor="let d of eMonths" [value]="d[0]" [disabled]="d[1]">{{d[0]}}</mat-option>
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
  startDays: [string,boolean][] = [];
  endDays: [string,boolean][] = [];
  sMonths: [string,boolean][] = [];
  eMonths: [string,boolean][] = [];

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

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    return !this.parts.controls.startYear.value;
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

    if (startYear) {
      this.parts.controls.startMonth.enable();
      if (startMonth) {
        this.parts.controls.startDay.enable();
      } else {
        this.parts.controls.startDay.disable();
      }
    } else {
      this.parts.controls.startMonth.disable();
      this.parts.controls.startDay.disable();
    }
    const sYear = startYear ? String(startYear) : '';
    const sMonth = startMonth ? String(startMonth) : '-';
    const sDay = startDay ? String(startDay) : '-';

    if (timeSpan) {
      if (endMonth) {
        this.parts.controls.endDay.enable();
      } else {
        this.parts.controls.endDay.disable();
      }
    }
    const eYear = String(endYear) || '';
    const eMonth = String(endMonth) || '-';
    const eDay = String(endDay) || '-';

    if (timeSpan) {
      this.parts.controls.timeSpan.setValue(true);
      this.parts.controls.endYear.enable();
      if (!endYear) { endYear = startYear; }
      if (startYear === endYear) {
        if (startMonth) {
          if (!endMonth) { endMonth = startMonth; }
          this.sMonths = this.monthsListTo(endMonth);
          this.eMonths = this.monthsListFrom(startMonth);
          if (startDay) {
            if (!endDay) { endDay = startDay; }
            const nStartDays = Calendar.daycnt(calendar, startYear, startMonth);
            this.startDays = this.daysListTo(nStartDays, endDay);
            const nEndDays = Calendar.daycnt(calendar, endYear, endMonth);
            this.endDays = this.daysListFrom(nEndDays, startMonth);
          }
        } else {
          this.sMonths = this.monthsListTo();
          this.eMonths = this.monthsListFrom();
          this.startDays = this.daysListTo(31);
          this.endDays = this.daysListFrom(31);
        }
      } else {
        this.sMonths = this.monthsListTo();
        this.eMonths = this.monthsListFrom();
        const nStartDays = startMonth ? Calendar.daycnt(calendar, startYear, startMonth) : 31;
        this.startDays = this.daysListTo(nStartDays);
        const nEndDays = endMonth ? Calendar.daycnt(calendar, endYear, endMonth) : 31;
        this.startDays = this.daysListTo(nEndDays);
      }
    } else {
      this.sMonths = this.monthsListTo();
      this.eMonths = this.monthsListFrom();
      const nStartDays = startMonth ? Calendar.daycnt(calendar, startYear, startMonth) : 31;
      this.startDays = this.daysListTo(nStartDays);
      const nEndDays = endMonth ? Calendar.daycnt(calendar, endYear, endMonth) : 31;
      this.startDays = this.daysListTo(nEndDays);
    }

    this.parts.setValue({calendar, timeSpan, sYear, sMonth, sDay, eYear, eMonth, eDay, startJd, endJd});
    this.stateChanges.next();
  }


  monthsListFrom(from?: number): [string,boolean][] {
    const ml: [string,boolean][] = [['-', false]];
    if (!from) { from = 1; }
    for (let i = 1; i <= 12; i++) {
      ml.push([String(i), i < from ? true : false]);
    }
    return ml;
  }

  monthsListTo(to?: number): [string,boolean][] {
    const ml: [string,boolean][] = [['-', false]];
    if (!to) {
      to = 12;
    }
    for (let i = 1; i <= 12; i++) {
      ml.push([String(i), i > to ? true : false]);
    }
    return ml;
  }

  daysListFrom(total: number, from?: number): [string,boolean][] {
    const dl: [string,boolean][] = [['-', false]];
    if (!from) { from = 1; }
    for (let i = 1; i <= total; i++) {
      dl.push([String(i), i < from ? true : false]);
    }
    return dl;
  }

  daysListTo(total: number, to?: number): [string,boolean][] {
    const dl: [string,boolean][] = [['-', false]];
    if (!to) { to = 1; }
    for (let i = 1; i <= total; i++) {
      dl.push([String(i), i > to ? true : false]);
    }
    return dl;
  }

  ngOnInit(): void {
    this.sMonths = this.monthsListFrom();
    this.eMonths = this.monthsListFrom();
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
    this.parts.controls.endYear.enable();
    if (this.parts.controls.timeSpan.value) {
      const startYear = Number(this.parts.controls.startYear.value);
      const endYear = startYear;
      this.parts.controls.endYear.setValue('');

      if (isNaN(endYear)) {
        this.parts.controls.endMonth.disable();
        this.eMonths = this.monthsListTo();
        this.parts.controls.endMonth.setValue('-');
        this.parts.controls.endDay.disable();
        this.parts.controls.endDay.setValue('-');
      } else {
        this.parts.controls.endMonth.enable();
        const startMonth = Number(this.parts.controls.startMonth.value);
        if (isNaN(startMonth)) {
          this.eMonths = this.monthsListTo();
          this.parts.controls.endMonth.setValue('-');
          this.endDays = this.daysListFrom(1);
          this.parts.controls.endDay.disable();
          this.parts.controls.endDay.setValue('-');
        } else {
          const endMonth = startMonth;
          this.eMonths = this.monthsListTo(endMonth);
          this.parts.controls.endMonth.setValue(this.parts.controls.startMonth.value);
          const startDay = Number(this.parts.controls.startDay.value);
          const daycnt = Calendar.daycnt(this.parts.controls.calendar.value, endYear, endMonth);
          if (isNaN(startDay)) {
            this.endDays = this.daysListFrom(daycnt);
            this.parts.controls.endDay.disable();
            this.parts.controls.endDay.setValue('-');
          } else {
            this.endDays = this.daysListFrom(daycnt, startDay);
            this.parts.controls.endDay.enable();
            this.parts.controls.endDay.setValue(this.parts.controls.startDay.value);
          }
        }
      }
    } else {
      this.parts.controls.endYear.setValue('');
      this.parts.controls.endYear.disable();
      this.parts.controls.endMonth.setValue('-');
      this.parts.controls.endMonth.disable();
      this.parts.controls.endDay.setValue('-');
      this.parts.controls.endDay.disable();
      this.eMonths = this.monthsListTo();
    }
  }

  _handleCalendarChange(): void {
    if (this.parts.controls.startDay.value) {
      const startDay = parseInt(this.parts.controls.startDay.value, 10);
      if (!isNaN(startDay)) {
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
          this.startDays = this.daysListTo(daycnt);
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
          this.endDays = this.daysListTo(daycnt);
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

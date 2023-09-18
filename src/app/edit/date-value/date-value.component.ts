import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormBuilder,
  UntypedFormGroup,
  NgControl
} from '@angular/forms';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
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
    // we fill the structure that we can calculate the period start and end using JD
    //
    this.startYear = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    if (isNaN(this.startYear)) {
      this.timeSpan = false;
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
        this.endDay = Calendar.daycnt(this.calendar, this.endYear, this.endMonth);
      }
    } else {
      this.startMonth = 1;
      this.endMonth = 12;
      this.startDay = 1;
      this.endDay = Calendar.daycnt(this.calendar, this.endYear, this.endMonth);
    }

    this.timeSpan = timeSpan || endYear !== undefined;

    if (this.timeSpan) {
      this.endYear = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
      if (isNaN(this.endYear)) {
        this.endYear = undefined;
      }
      if (this.endYear) {
        if (this.endYear < this.startYear) {
          throw TypeError('Invalid date: startYear > endYear!');
        }
        this.endMonth = DateValue.getRange(endMonth, 1, 12);
        if (!this.endMonth) {
          this.endMonth = 12;
        }
        const dcnt = Calendar.daycnt(this.calendar, this.endYear, this.endMonth);
        this.endDay = DateValue.getRange(endDay, 1, dcnt);
        if (!this.endDay) {
          this.endDay = dcnt;
        }
        if (this.startYear === this.endYear) {
          if (this.endMonth < this.startMonth) {
            throw TypeError('Invalid date: startYear/startMonth > endYear/endMonth!');
          }
          if (this.startMonth === this.endMonth) {
            if (this.endDay < this.startDay) {
              throw TypeError('Invalid date: startYear/startMonth/startDay > endYear/endMonth/endDay!');
            }
          }
        }
      }
    }
    switch(this.calendar) {
      case DateCalendar.GREGORIAN:
        this.startJd = Calendar.gregorian_to_jd(this.startYear < 1 ? this.startYear + 1 : this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.gregorian_to_jd(this.endYear < 1 ? this.endYear + 1 : this.endYear, this.endMonth, this.endDay);
        break;
      case DateCalendar.JULIAN:
        this.startJd = Calendar.julian_to_jd(this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.julian_to_jd(this.endYear, this.endMonth, this.endDay);
        break;
      case DateCalendar.ISLAMIC:
        this.startJd = Calendar.islamic_to_jd(this.startYear, this.startMonth, this.startDay);
        this.endJd = Calendar.islamic_to_jd(this.endYear, this.endMonth, this.endDay);
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
      const startMonth = DateValue.getRange(found[3]?.substring(1), 1, 12);
      const startDay = DateValue.getRange(found[4]?.substring(1), 1, 31);

      const timeSpan = !!found[6];

      let endYear: number = parseInt(found[6]?.substring(1), 10);
      if (isNaN(endYear)) { endYear = undefined; }
      if (endYear && DateValue.isBCE(found[9])) {
        endYear = -endYear;
      }
      const endMonth = DateValue.getRange(found[7]?.substring(1), 1, 12);
      const endDay = DateValue.getRange(found[8]?.substring(1), 1, 31);
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

  isEmpty(): boolean {
    return this.startYear === undefined || this.startYear === null;
  }
}

@Component({
  selector: 'app-knora-date-value',
  template: `
    <div role="group"
         [formGroup]="parts"
         class="datecontainer"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <mat-form-field class="calsel">
        <mat-label>Calendar</mat-label>
        <mat-select class="dval" matTooltip="Select one of the Calendars"
                    formControlName="calendar"
                    aria-label="Calendar"
                    (selectionChange)="_handleCalendarChange()">
          <mat-option *ngFor="let dispNode of calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
        </mat-select>
      </mat-form-field>
        <mat-checkbox formControlName="timeSpan"
                      (change)="_handleTimeSpanChange()">Time span</mat-checkbox>
      <br>
      <mat-form-field class="yearsel">
        <mat-label>Year</mat-label>
        <input matInput class="dval"
               type="number"
               matTooltip="Enter BCE as negative year. Note: Historic numbering: no year '0'!"
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
          <mat-option *ngFor="let d of startDays" [value]="d[0]" [disabled]="d[1]">{{d[0]}}</mat-option>
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
          <mat-option *ngFor="let d of endDays" [value]="d[0]" [disabled]="d[1]">{{d[0]}}</mat-option>
        </mat-select>
      </mat-form-field>
      <input hidden matInput type="number" formControlName="startJd">
      <input hidden matInput type="number" formControlName="endJd">
     </div>
  `,
  providers: [
      {provide: MatFormFieldControl, useExisting: DateValueComponent},
  ],
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
  @ViewChild('calendar') calendarInput: HTMLInputElement;
  @ViewChild('startYear') startYearInput: HTMLInputElement;
  @ViewChild('startMonth') startMonthInput: HTMLInputElement;
  @ViewChild('startDay') startDayInput: HTMLInputElement;
  @ViewChild('endYear') endYearInput: HTMLInputElement;
  @ViewChild('endMonth') endMonthInput: HTMLInputElement;
  @ViewChild('endDay') endDayInput: HTMLInputElement;

  @Input()
  valueLabel: string;

  calendarNames = ['GREGORIAN', 'JULIAN', 'ISLAMIC'];
  startDays: [string,boolean][] = [];
  endDays: [string,boolean][] = [];
  sMonths: [string,boolean][] = [];
  eMonths: [string,boolean][] = [];

  parts: UntypedFormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  touched = false;
  errorState = false;
  controlType = 'knora-date-value';
  id = `knora-date-value-${DateValueComponent.nextId++}`;

  private placeholderL: string;
  private requiredL = false;
  private disabledL = false;

  constructor(private formBuilder: UntypedFormBuilder,
              private knoraService: KnoraService,
              private focusMonitor: FocusMonitor,
              private snackBar: MatSnackBar,
              private elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl,
              @Optional() @Inject(MAT_FORM_FIELD) public formField: MatFormField,
              ) {
    this.parts = this.formBuilder.group({
      calendar: ['GREGORIAN', []],
      timeSpan: false,
      startYear: [null, []],
      startMonth: ['-', []],
      startDay: ['-', []],
      endYear: null,
      endMonth: '-',
      endDay: '-',
      startJd: 0,
      endJd: 0
    });

    if (this.ngControl != null) {
      // Setting the value accessor directly (instead of using
      // the providers) to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    focusMonitor.monitor(elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    return !this.parts.controls.startYear.value;
  }

  @Input('aria-describedby') userAriaDescribedBy: string;

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
    this.setFormControls(startJd, endJd, calendar);
  }

  setFormControls(sJd: number, eJd: number, calendar: DateCalendar) {
    this.parts.controls.startJd.setValue(sJd);
    this.parts.controls.endJd.setValue(eJd);
    this.parts.controls.calendar.setValue(calendar);
    if (!isNaN(sJd) && !isNaN(eJd)) {
      let newSDateArr: number[];
      //switch (this.parts.controls.calendar.value) {
      switch (calendar) {
        case DateCalendar.GREGORIAN:
          newSDateArr = Calendar.jd_to_gregorian(sJd);
          if (newSDateArr[0] < 1) {
            newSDateArr[0]--;
          }
          break;
        case DateCalendar.JULIAN:
          newSDateArr = Calendar.jd_to_julian(sJd);
          break;
        case DateCalendar.ISLAMIC:
          newSDateArr = Calendar.jd_to_islamic(sJd);
          break;
      }
      let newEDateArr: number[];
      switch (this.parts.controls.calendar.value) {
        case DateCalendar.GREGORIAN:
          newEDateArr = Calendar.jd_to_gregorian(eJd);
          if (newEDateArr[0] < 1) {
            newEDateArr[0]--;
          }
          break;
        case DateCalendar.JULIAN:
          newEDateArr = Calendar.jd_to_julian(eJd);
          break;
        case DateCalendar.ISLAMIC:
          newEDateArr = Calendar.jd_to_islamic(eJd);
          break;
      }
      const sY = newSDateArr[0];
      const sM = newSDateArr[1];
      const sD = newSDateArr[2];
      const eY = newEDateArr[0];
      const eM = newEDateArr[1];
      const eD = newEDateArr[2];
      if (sY === eY) {
        if (sM === eM) {
          if (sD === eD) {
            // exact date (yyyy/mm/dd) -> no timespan, sY, sM, sD defined
            this.parts.controls.timeSpan.setValue(false);
            this.parts.controls.startYear.setValue(sY);
            this.parts.controls.startYear.enable();
            this.sMonths = this.monthsListTo();
            this.parts.controls.startMonth.setValue(String(sM));
            this.parts.controls.startMonth.enable();
            this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
            this.parts.controls.startDay.setValue(String(sD));
            this.parts.controls.startDay.enable();
            this.parts.controls.endYear.setValue('');
            this.parts.controls.endYear.disable();
            this.eMonths = this.monthsListFrom(sM);
            this.parts.controls.endMonth.setValue('-');
            this.parts.controls.endMonth.disable();
            this.endDays = this.daysListFrom(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM), sD);
            this.parts.controls.endDay.setValue('-');
            this.parts.controls.endDay.disable();
          } else {
            // sY === eY, sM === eM, sD !== eD
            if (sD === 1 && eD === Calendar.daycnt(this.parts.controls.calendar.value, eY, eM)) {
              // exact date, month precision (yyyy/mm/-)
              this.parts.controls.timeSpan.setValue(false);
              this.parts.controls.startYear.setValue(sY);
              this.parts.controls.startYear.enable();
              this.sMonths = this.monthsListTo();
              this.parts.controls.startMonth.setValue(String(sM));
              this.parts.controls.startMonth.enable();
              this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
              this.parts.controls.startDay.setValue('-');
              this.parts.controls.startDay.enable();
              this.parts.controls.endYear.setValue('');
              this.parts.controls.endYear.disable();
              this.eMonths = this.monthsListFrom();
              this.parts.controls.endMonth.setValue('-');
              this.parts.controls.endMonth.disable();
              this.endDays = this.daysListFrom(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM));
              this.parts.controls.endDay.setValue('-');
              this.parts.controls.endDay.disable();
            } else {
              // timespan with same year/month (yyyy/mm/d1 - yyyy/mm/d2)
              this.parts.controls.timeSpan.setValue(true);
              this.parts.controls.startYear.setValue(sY);
              this.parts.controls.startYear.enable();
              this.sMonths = this.monthsListTo(eM);
              this.parts.controls.startMonth.setValue(String(sM));
              this.parts.controls.startMonth.enable();
              this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM), eD);
              this.parts.controls.startDay.setValue(String(sD));
              this.parts.controls.startDay.enable();
              this.parts.controls.endYear.setValue(eY);
              this.parts.controls.endYear.enable();
              this.eMonths = this.monthsListFrom(sM);
              this.parts.controls.endMonth.setValue(String(eM));
              this.parts.controls.endMonth.enable();
              this.endDays = this.daysListFrom(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM), sD);
              this.parts.controls.endDay.setValue(String(eD));
              this.parts.controls.endDay.enable();
            }
          }
        } else { // sY === eY, sM !== eM
          if (sM === 1 && sD === 1 && eM === 12 && eD === Calendar.daycnt(this.parts.controls.calendar.value, eY, 12)) {
            // exact date with year only (yyyy)
            this.parts.controls.timeSpan.setValue(false);
            this.parts.controls.startYear.setValue(sY);
            this.parts.controls.startYear.enable();
            this.sMonths = this.monthsListTo();
            this.parts.controls.startMonth.setValue('-');
            this.parts.controls.startMonth.enable();
            this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
            this.parts.controls.startDay.setValue('-');
            this.parts.controls.startDay.disable();
            this.parts.controls.endYear.setValue('');
            this.parts.controls.endYear.disable();
            this.eMonths = this.monthsListFrom();
            this.parts.controls.endMonth.setValue('-');
            this.parts.controls.endMonth.disable();
            this.endDays = this.daysListFrom(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM));
            this.parts.controls.endDay.setValue('-');
            this.parts.controls.endDay.disable();
          } else {
            // timespan (yyyy/m1/dd - yyyy/m2/-)
            // timespan (yyyy/m1/- - yyyy/m2/dd)
            // timespan (yyyy/m1/- - yyyy/m2/-)
            this.parts.controls.timeSpan.setValue(true);
            this.parts.controls.startYear.setValue(sY);
            this.parts.controls.startYear.enable();
            if (eD > sD) {
              this.sMonths = this.monthsListTo(eM);
            } else {
              this.sMonths = this.monthsListTo(eM - 1);
            }
            this.parts.controls.startMonth.setValue(String(sM));
            this.parts.controls.startMonth.enable();
            this.parts.controls.endYear.setValue(eY);
            this.parts.controls.endYear.enable();
            if (eD > sD) {
              this.eMonths = this.monthsListFrom(sM);
            } else {
              this.eMonths = this.monthsListFrom(sM + 1);
            }
            this.parts.controls.endMonth.setValue(String(eM));
            this.parts.controls.endMonth.enable();
            if (sD === 1) {
              this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
              this.parts.controls.startDay.setValue('-');
            } else {
              this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
              this.parts.controls.startDay.setValue(String(sD));
            }
            this.parts.controls.startDay.enable();
            if (eD === Calendar.daycnt(this.parts.controls.calendar.value, eY, eM)) {
              this.endDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM));
              this.parts.controls.endDay.setValue('-');
            } else {
              this.endDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM));
              this.parts.controls.endDay.setValue(String(eD));
            }
            this.parts.controls.endDay.enable();
          }
        }
      } else { // sY !== eY
        // timespan (yyyy/mm/dd - yyyy/mm/dd)
        // timespan (yyyy/mm/-  - yyyy/mm/dd)
        // timespan (yyyy/-/-   - yyyy/mm/dd)
        // timespan (yyyy/mm/dd - yyyy/mm/-)
        // timespan (yyyy/mm/-  - yyyy/mm/-)
        // timespan (yyyy/-/-   - yyyy/mm/-)
        // timespan (yyyy/mm/dd - yyyy/-/-)
        // timespan (yyyy/mm/-  - yyyy/-/-)
        // timespan (yyyy/-/-   - yyyy/-/-)
        this.parts.controls.timeSpan.setValue(true);
        this.parts.controls.startYear.setValue(sY);
        this.parts.controls.startYear.enable();
        this.sMonths = this.monthsListTo();
        this.startDays = this.daysListTo(Calendar.daycnt(this.parts.controls.calendar.value, sY, sM));
        if (sM === 1 && sD === 1) {
          this.parts.controls.startMonth.setValue('-');
          this.parts.controls.startMonth.enable();
          this.parts.controls.startDay.setValue('-');
          this.parts.controls.startDay.disable();
        } else if (sD === 1) {
          this.parts.controls.startMonth.setValue(String(sM));
          this.parts.controls.startMonth.enable();
          this.parts.controls.startDay.setValue('-');
          this.parts.controls.startDay.enable();
        } else {
          this.parts.controls.startMonth.setValue(String(sM));
          this.parts.controls.startMonth.enable();
          this.parts.controls.startDay.setValue(String(sD));
          this.parts.controls.startDay.enable();
        }
        this.parts.controls.endYear.setValue(eY);
        this.parts.controls.endYear.enable();
        this.eMonths = this.monthsListFrom();
        this.endDays = this.daysListFrom(Calendar.daycnt(this.parts.controls.calendar.value, eY, eM));
        if (eM === 12 && eD === Calendar.daycnt(this.parts.controls.calendar.value, eY, eM)) {
          this.parts.controls.endMonth.setValue('-');
          this.parts.controls.endMonth.enable();
          this.parts.controls.endDay.setValue('-');
          this.parts.controls.endDay.disable();
        } else if (eD === Calendar.daycnt(this.parts.controls.calendar.value, eY, eM)) {
          this.parts.controls.endMonth.setValue(String(eM));
          this.parts.controls.endMonth.enable();
          this.parts.controls.endDay.setValue('-');
          this.parts.controls.endDay.enable();
        } else {
          this.parts.controls.endMonth.setValue(String(eM));
          this.parts.controls.endMonth.enable();
          this.parts.controls.endDay.setValue(String(eD));
          this.parts.controls.endDay.enable();
        }
      }
    } else {
      this.parts.controls.timeSpan.setValue(false);
      this.parts.controls.startYear.setValue('');
      this.parts.controls.startYear.enable();
      this.parts.controls.startMonth.setValue('-');
      this.parts.controls.startMonth.disable();
      this.parts.controls.startDay.setValue('-');
      this.parts.controls.startDay.disable();
      this.parts.controls.endYear.setValue('');
      this.parts.controls.endYear.disable();
      this.parts.controls.endMonth.setValue('-');
      this.parts.controls.endMonth.disable();
      this.parts.controls.endDay.setValue('-');
      this.parts.controls.endDay.disable();
    }
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
    if (!to) { to = total; }
    for (let i = 1; i <= total; i++) {
      dl.push([String(i), i > to ? true : false]);
    }
    return dl;
  }

  getJd(calendar: string | DateCalendar, y: number, m: number, d: number): number {
    let jd: number;
    switch (calendar) {
      case DateCalendar.GREGORIAN:
        jd = Calendar.gregorian_to_jd(y < 1 ? y + 1 : y, m, d);
        break;
      case DateCalendar.JULIAN:
        jd = Calendar.julian_to_jd(y, m, d);
        break;
      case DateCalendar.ISLAMIC:
        jd = Calendar.islamic_to_jd(y, m, d);
        break;
    }
    return jd;
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

  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this.focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
    if (control.value.length < 1) {
      this.focusMonitor.focusVia(prevElement, 'program');
    }
  }

  onFocusOut(event: FocusEvent) {
    if (!this.elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }
  setDescribedByIds(ids: string[]) {
      const controlElement = this.elementRef.nativeElement.querySelector('.date-value-input-container');
      controlElement?.setAttribute('aria-describedby', ids.join(' '));
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      // tslint:disable-next-line:no-non-null-assertion
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
  }

  writeValue(dateVal: DateValue | null): void {
    this.value = dateVal;
  }

  registerOnChange(fn: any): void {
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
      const sJd = Number(this.parts.controls.startJd.value);
      const sY = parseInt(this.parts.controls.startYear.value, 10);
      const sM = parseInt(this.parts.controls.startMonth.value, 10);
      const sD = parseInt(this.parts.controls.startDay.value, 10);
      let eY;
      let eM;
      let eD;
      if (isNaN(sM) && isNaN(sD)) { // yyyy/-/-  => yyyy++
        eY = sY + 1;
        eM = 12;
        eD = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
      } else if (isNaN(sD)) { // yyyy/mm/-  => mm++
        eY = sY;
        eM = sM + 1;
        if (eM > 12) {
          eY = eY + 1;
          eM = 1;
        }
        eD = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
      } else { // yyyy/mm/dd
        eY = sY;
        eM = sM;
        eD = sD + 1;
        if (eD > Calendar.daycnt(this.parts.controls.calendar.value, eY, eM)) {
          eM = sM + 1;
          if (eM > 12) {
            eY = eY + 1;
            eM = 1;
          }
          eD = 1;
        }
      }
      const eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
      this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
      this.value = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
          sY, sM, sD, eY, eM, eD)
    } else {
      const sJd = Number(this.parts.controls.startJd.value);

      const sY = parseInt(this.parts.controls.startYear.value, 10);
      const eY = sY;
      let sM = parseInt(this.parts.controls.startMonth.value, 10);
      let eM = sM;
      let sD = parseInt(this.parts.controls.startDay.value, 10);
      let eD = sD;
      if (isNaN(sM)) {
        sM = 1;
      }
      if (isNaN(eM)) {
        eM = 12;
      }
      if (isNaN(sD)) {
        sD = 1;
      }
      if (isNaN(eD)) {
        eD = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
      }

      const eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
      this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
      this.value = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
          sY, sM, sD, eY, eM, eD);
    }
    this.onChange(this.value);
  }

  _handleCalendarChange(): void {
    const sJd = Number(this.parts.controls.startJd.value);
    const eJd = Number(this.parts.controls.endJd.value);

    this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
    const sY = parseInt(this.parts.controls.startYear.value, 10);
    let sM = parseInt(this.parts.controls.startMonth.value, 10);
    if (isNaN(sM)) { sM = 1; }
    let sD = parseInt(this.parts.controls.startDay.value, 10);
    if (isNaN(sD)) { sD = 1; }
    let eY = parseInt(this.parts.controls.endYear.value, 10);
    if (isNaN(eY)) { eY = sY; }
    let eM = parseInt(this.parts.controls.endMonth.value, 10);
    if (isNaN(eM)) { eM = 12; }
    let eD = parseInt(this.parts.controls.endDay.value, 10);
    if (isNaN(eD)) { eD = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM); }

    this.value = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
        sY, sM, sD, eY, eM, eD);
    this.onChange(this.value);
  }

  _handleInput(what?: string): void {
    if (what !== undefined) {
      let daycnt: number;
      const sY = parseInt(this.parts.controls.startYear.value, 10);
      let sM = parseInt(this.parts.controls.startMonth.value, 10);
      if (isNaN(sM)) { sM = 1; }
      let sD = parseInt(this.parts.controls.startDay.value, 10);
      if (isNaN(sD)) { sD = 1; }
      let eY = parseInt(this.parts.controls.endYear.value, 10);
      if (isNaN(eY)) { eY = sY; }
      let eM = parseInt(this.parts.controls.endMonth.value, 10);
      if (isNaN(eM)) { eM = 12; }
      let eD = parseInt(this.parts.controls.endDay.value, 10);
      if (isNaN(eD)) { eD = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM); }
      let sJd: number;
      let eJd: number;
      switch(what) {
        case 'startYear':
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value, sY, sM);
          if (sD > daycnt) { sD = daycnt; }
          if (this.parts.controls.timeSpan.value) {
            if (sY > eY) {
              this.snackBar.open('Start year must be less or equal end year!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              sJd = Number(this.parts.controls.startJd.value);
            } else if (sY === eY && sM > eM) {
              this.snackBar.open('Start year/month must be less or equal end year/month!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              sJd = Number(this.parts.controls.startJd.value);
            } else if (sY === eY && sM === eM && sD > eD) {
              this.snackBar.open('Start year/month/day must be less or equal end year/month/day!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              sJd = Number(this.parts.controls.startJd.value);
            } else {
              sJd = this.getJd(this.parts.controls.calendar.value, sY, sM, sD);
            }
            eJd = Number(this.parts.controls.endJd.value);
          } else {
            sJd = this.getJd(this.parts.controls.calendar.value, sY, sM, sD);
            eY = sY;
            if (this.parts.controls.startMonth.value === '-') {
              eM = 12;
            } else {
              eM = sM;
            }
            if (this.parts.controls.startDay.value === '-') {
              daycnt = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
              if (eD > daycnt) { eD = daycnt; }
            } else {
              eD = sD;
            }
            eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
          }
          this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
          break;
        case 'endYear':
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
          if (eD > daycnt) { eD = daycnt; }
          if (this.parts.controls.timeSpan.value) {
            if (eY < sY) {
              this.snackBar.open('End year must be greater or equal start year!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = parseInt(this.parts.controls.endJd.value, 10);
            } else if (eY === sY && eM < sM) {
              this.snackBar.open('End year/month must be greater or equal start year/month!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = parseInt(this.parts.controls.endJd.value, 10);
            } else if (eY === sY && eM === sM && eD < sD) {
              this.snackBar.open('End year/month/day must be greater or equal start year/month/day!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = Number(this.parts.controls.endJd.value);
            } else {
              eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
            }
            sJd = Number(this.parts.controls.startJd.value);
          }
          this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
          break;
        case 'startMonth':
          if (this.parts.controls.startMonth.value === '-') {
            this.parts.controls.startDay.setValue('-');
            this.parts.controls.startDay.disable();
          }
          else {
            this.parts.controls.startDay.enable();
          }
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value, sY, sM);
          if (sD > daycnt) { sD = daycnt; }
          if (this.parts.controls.timeSpan.value) {
            if (sY === eY && sM > eM) {
              this.snackBar.open('Start year/month must be less or equal end year/month!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              sJd = Number(this.parts.controls.startJd.value);
            } else if (sY === eY && sM === eM && sD > eD) {
              this.snackBar.open('Start year/month/day must be less or equal end year/month/day!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              sJd = Number(this.parts.controls.startJd.value);
            } else {
              sJd = this.getJd(this.parts.controls.calendar.value, sY, sM, sD);
            }
            eJd = Number(this.parts.controls.endJd.value);
          } else {
            if (this.parts.controls.startMonth.value === '-') {
              sM = 1;
              eM = 12;
            } else {
              eM = sM;
            }
            sJd = this.getJd(this.parts.controls.calendar.value, sY, sM, sD);
            eY = sY;
            daycnt = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
            if (eD > daycnt) { eD = daycnt; }
            eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
          }
          this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
          break;
        case 'endMonth':
          if (this.parts.controls.endMonth.value === '-') {
            this.parts.controls.endDay.setValue('-');
            this.parts.controls.endDay.disable();
          }
          else {
            this.parts.controls.endDay.enable();
          }
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value, eY, eM);
          if (eD > daycnt) { eD = daycnt; }
          if (this.parts.controls.timeSpan.value) {
            if (sY === eY && eM < sM) {
              this.snackBar.open('Start year/month must be less or equal end year/month!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = Number(this.parts.controls.endJd.value);
            } else if (sY === eY && eM === sM && eD < sD) {
              this.snackBar.open('Start year/month/day must be less or equal end year/month/day!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = Number(this.parts.controls.endJd.value);
            } else {
              eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
            }
            sJd = Number(this.parts.controls.startJd.value);
          }
          this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
          break;
        case 'startDay':
          daycnt = Calendar.daycnt(this.parts.controls.calendar.value, sY, sM);
          if (sD > daycnt) { sD = daycnt; }
          if (this.parts.controls.timeSpan.value) {
            if (eY === sY && eM === sM && eD < sD) {
              this.snackBar.open('End year/month/day must be greater or equal start year/month/day!', 'OK');
              this.parts.controls.endYear.setValue(this.parts.controls.startYear.value);
              eJd = Number(this.parts.controls.endJd.value);
            } else {
              eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
            }
            sJd = Number(this.parts.controls.startJd.value);
          } else {
            if (this.parts.controls.startDay.value === '-') {
              eD = daycnt;
            } else {
              eD = sD;
            }
            sJd = this.getJd(this.parts.controls.calendar.value, sY, sM, sD);
            eJd = this.getJd(this.parts.controls.calendar.value, eY, eM, eD);
          }
          this.setFormControls(sJd, eJd, this.parts.controls.calendar.value);
          break;
      }
      const dval = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
          sY, sM, sD, eY, eM, eD);
      this.parts.controls.startJd.setValue(dval.startJd);
      this.parts.controls.endJd.setValue(dval.endJd);
      this.value = dval;
      //this.onChange(this.parts.value);
      this.onChange(this.value);
    }
    /*
    const dval = new DateValue(this.parts.controls.calendar.value, this.parts.controls.timeSpan.value,
        this.parts.controls.startYear.value, this.parts.controls.startMonth.value, this.parts.controls.startDay.value,
        this.parts.controls.endYear.value, this.parts.controls.endMonth.value, this.parts.controls.endDay.value);
     */
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/member-ordering
  static ngAcceptInputType_disabled: BooleanInput;
  // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/member-ordering
  static ngAcceptInputType_required: BooleanInput;
}

import {Component, ElementRef, Input, OnDestroy, OnInit, Optional, Self} from '@angular/core';
import {MatFormFieldControl} from '@angular/material/form-field';
import {ControlValueAccessor, FormBuilder, FormGroup, NgControl} from '@angular/forms';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Subject} from 'rxjs';
import {calendars} from '../../classes/calender-helper';
import {IBaseDateValue} from "@dasch-swiss/dsp-js/src/models/v2/resources/values/type-specific-interfaces/base-date-value";
import {KnoraService} from "../../services/knora.service";
import {FocusMonitor} from "@angular/cdk/a11y";
import {CalenderHelper} from "../../classes/calender-helper";
import {CalendarDate, JDNConvertibleCalendar, JDNConvertibleConversionModule} from "jdnconvertiblecalendar";
import gregorianToJDC = JDNConvertibleConversionModule.gregorianToJDC;
import julianToJDC = JDNConvertibleConversionModule.julianToJDC;
import gregorianToJDN = JDNConvertibleConversionModule.gregorianToJDN;
import julianToJDN = JDNConvertibleConversionModule.julianToJDN;
import {TypeDefinitionsModule} from "jdnconvertiblecalendar/dist/src/TypeDefinitions";

// https://material.angular.io/guide/creating-a-custom-form-field-control
export enum DateCalendar {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GREGORIAN = 'GREGORIAN',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JULIAN = 'JULIAN',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  JEWISH = 'JEWISH'
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

export class DateValue {
  calendar: string;
  timeSpan: boolean;
  startDay: string;
  startMonth: string;
  startYear: string;
  startEra: string;
  endDay: string;
  endMonth: string;
  endYear: string;
  endEra: string;
  startJd: number;
  endJd: number;

  constructor(calendar?: string | undefined,
              timeSpan?: boolean | undefined,
              startDay?: number | string | undefined,
              startMonth?: number | string | undefined,
              startYear?: number | string | undefined,
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
    this.timeSpan = timeSpan || false;
    this.startDay = DateValue.getRange(startDay, 1, 31);
    this.startMonth = DateValue.getRange(startMonth, 1, 12);
    let sY = typeof startYear === 'string' ? parseInt(startYear, 10) : startYear;
    if ((sY === undefined) || isNaN(sY)) {
      const now = new Date();
      sY = now.getFullYear();
    }
    this.startYear = sY.toString(10);
    this.startEra = DateValue.getEra(startEra);
    this.endDay = DateValue.getRange(endDay, 1, 31);
    this.endMonth = DateValue.getRange(endMonth, 1, 12);
    let eY = typeof endYear === 'string' ? parseInt(endYear, 10) : endYear;
    if ((eY === undefined) || isNaN(eY)) {
      this.endYear = '';
    }
    else {
      this.endYear = sY.toString(10);
    }
    this.endEra = DateValue.getEra(endEra);
    let sYear: string;
    let sMonth: string;
    let sDay: string;
    let eYear: string;
    let eMonth: string;
    let eDay: string;
    let tmpCalendarDate: CalendarDate;
    switch(this.calendar) {
      case DateCalendar.GREGORIAN:
        sYear = this.startYear || '1'; // we assign startYear=1 for undefined dates
        sMonth = this.startMonth === '-' ? '1' : this.startMonth;
        sDay = startDay === '-' ? '1' : this.startDay;
        tmpCalendarDate = new CalendarDate(parseInt(sYear, 10), parseInt(sMonth, 10), parseInt(sDay, 10));
        this.startJd = gregorianToJDN(tmpCalendarDate);
        eYear = this.endYear || sYear; // if endYear undefined, we assume same as startYear...
        eMonth = this.startMonth === '-' ? '12' : this.startMonth;
        eDay = startDay === '-' ? '31' : this.startDay;
        tmpCalendarDate = new CalendarDate(parseInt(eYear, 10), parseInt(eMonth, 10), parseInt(eDay, 10));
        this.endJd = gregorianToJDN(tmpCalendarDate);
        break;
      case DateCalendar.JULIAN:
        sYear = this.startYear || '1'; // we assign startYear=1 for undefined dates
        sMonth = this.startMonth === '-' ? '1' : this.startMonth;
        sDay = startDay === '-' ? '1' : this.startDay;
        tmpCalendarDate = new CalendarDate(parseInt(sYear, 10), parseInt(sMonth, 10), parseInt(sDay, 10));
        this.startJd = julianToJDN(tmpCalendarDate);
        eYear = this.endYear || sYear; // if endYear undefined, we assume same as startYear...
        eMonth = this.startMonth === '-' ? '12' : this.startMonth;
        eDay = startDay === '-' ? '31' : this.startDay;
        tmpCalendarDate = new CalendarDate(parseInt(eYear, 10), parseInt(eMonth, 10), parseInt(eDay, 10));
        this.endJd = gregorianToJDN(tmpCalendarDate);
        break;
    }
  }

  static parseDateValueFromKnora(datestr: string): DateValue {
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
      const timeSpan = found[6] ? true : false;
      const startYear = typeof found[2] === 'string' ? parseInt(found[2], 10) : undefined;
      const startMonth = DateValue.getRange(found[3], 1, 12);
      const startDay = DateValue.getRange(found[4], 1, 31);
      const startEra = DateValue.getEra(found[5]);

      const endYear = typeof found[6] === 'string' ? parseInt(found[6], 10) : undefined;
      const endMonth = DateValue.getRange(found[7], 1, 12);
      const endDay = DateValue.getRange(found[8], 1, 31);
      const endEra = DateValue.getEra(found[9]);

      return new DateValue(calendar, timeSpan, startYear, startMonth, startDay, startEra, endYear, endMonth, endDay, endEra);
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
        throw new TypeError('Invalid range: ' + value);
      }
    }
    else if (typeof value === 'number') {
      v = value;
    }
    if (v < from || v > to) {
      throw new TypeError('Invalid range: ' + value);
    }
    else {
      return v.toString(10);
    }
  }

  private static getEra(era: string | undefined): string {
    if (era === undefined) {
      return 'CE';
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
    <div [formGroup]="parts" class="datecontainer">
      <mat-form-field class="calsel">
        <mat-label>Calendar</mat-label>
        <mat-select matNativeControl
                    formControlName="calendar"
                    aria-label="Calendar"
                    (selectionChange)="_handleInput('calendar')">
          <mat-option *ngFor="let dispNode of calendarNames" [value]="dispNode">{{dispNode}}</mat-option>
        </mat-select>
      </mat-form-field>
        <mat-checkbox formControlName="timeSpan">Time span</mat-checkbox>
      <br>
      <mat-form-field class="yearsel">
        <mat-label>Year</mat-label>
        <input matInput formControlName="startYear" aria-label="Start year" (input)="_handleInput('startYear')">
      </mat-form-field>
      <mat-form-field class="rangesel">
        <mat-label>Month</mat-label>
        <mat-select formControlName="startMonth"
                    aria-label="Start month"
                    (selectionChange)="_handleInput('startMonth')">
          <mat-option *ngFor="let d of months" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field  class="rangesel">
        <mat-label>Day</mat-label>
        <mat-select formControlName="startDay"
                    aria-label="Start day"
                    (selectionChange)="_handleInput()">
          <mat-option *ngFor="let d of startDays" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field  class="rangesel">
        <mat-label>Era</mat-label>
        <mat-select formControlName="startEra"
                    aria-label="Start era"
                    (selectionChange)="_handleInput()">
          <mat-option value="CE">BC</mat-option>
          <mat-option value="BCE">BCE</mat-option>
        </mat-select>
      </mat-form-field>
      <br>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="yearsel">
        <mat-label>Year</mat-label>
        <input matInput formControlName="endYear" aria-label="End year" (input)="_handleInput('endYear')">
      </mat-form-field>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="rangesel">
        <mat-label>Month</mat-label>
        <mat-select formControlName="endMonth"
                    aria-label="End month"
                    (selectionChange)="_handleInput('endMonth')">
          <mat-option *ngFor="let d of months" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="rangesel">
        <mat-label>Day</mat-label>
        <mat-select formControlName="endDay"
                    aria-label="End day"
                    (selectionChange)="_handleInput()">
          <mat-option *ngFor="let d of endDays" [value]="d">{{d}}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field *ngIf="parts.controls.timeSpan.value" class="rangesel">
        <mat-label>Era</mat-label>
        <mat-select formControlName="endEra"
                    aria-label="End era"
                    (selectionChange)="_handleInput()">
          <mat-option value="CE">BC</mat-option>
          <mat-option value="BCE">BCE</mat-option>
        </mat-select>
      </mat-form-field>
     </div>
  `,
  providers: [{provide: MatFormFieldControl, useExisting: DateValueComponent}],
  styles: [
      '.bg {background-color: lightgrey;}',
      '.calsel {width: 120px; padding-left: 2px; padding-right: 2px;}',
      '.rangesel {width: 80px; padding-left: 2px; padding-right: 2px;}',
      '.yearsel {width: 80px; padding-left: 2px; padding-right: 2px;}',
      '.erasel {width: 80px; padding-left: 2px; padding-right: 2px;}',
//      '.datecontainer {width: 700px;}'
  ]
})

export class DateValueComponent
    implements ControlValueAccessor, MatFormFieldControl<DateValue>, OnDestroy, OnInit {
  static nextId = 0;

  @Input()
  valueLabel: string;
  calendarNames = ['GREGORIAN', 'JULIAN', 'JEWISH'];
  startDays: string[] = [];
  endDays: string[] = [];
  months = ['-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];

  parts: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'knora-date-value';
  id = `knora-date-value-${DateValueComponent.nextId++}`;
  describedBy = '';
  timeSpan: FormGroup;

  private _placeholder: string;
  private _required = false;
  private _disabled = false;

  onChange = (_: any) => {};
  onTouched = () => {};

  get empty() {
    const {value: {calendar, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return !startYear;
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
    const {value: {calendar, timeSpan, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod}} = this.parts;
    return new DateValue(calendar, timeSpan, startDay, startMonth, startYear, startPeriod, endDay, endMonth, endYear, endPeriod);
  }
  set value(knoraVal: DateValue | null) {
    const now = new Date();
    let {calendar, timeSpan, startDay, startMonth, startYear, startEra, endDay, endMonth, endYear, endEra} = knoraVal ||
    new DateValue(DateCalendar.GREGORIAN, false,
        now.getFullYear(), now.getMonth() + 1, now.getDate(), 'CE',
        '', '-', '-', 'CE');
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
      const dcs = this.calenderHelper.daycnt(this.parts.controls.calendar.value,
          this.parts.controls.startYear.value,
          this.parts.controls.startMonth.value);
      const startDays: string[] = ['-'];
      for (let i = 1; i <= dcs.days; i++) {
        startDays.push(i.toString(10));
      }
      this.startDays = startDays;
    }

    if (endYear && endMonth) {
      const dcs = this.calenderHelper.daycnt(this.parts.controls.calendar.value,
          this.parts.controls.endYear.value,
          this.parts.controls.endMonth.value);
      const endDays: string[] = ['-'];
      for (let i = 1; i <= dcs.days; i++) {
        endDays.push(i.toString(10));
      }
      this.endDays = endDays;
    }


    this.parts.setValue({calendar, timeSpan, startDay, startMonth, startYear,
        startEra, endDay, endMonth, endYear, endEra});
    this.stateChanges.next();
  }

  constructor(private formBuilder: FormBuilder,
              private knoraService: KnoraService,
              private calenderHelper: CalenderHelper,
              private _focusMonitor: FocusMonitor,
              private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl: NgControl) {
    this.parts = this.formBuilder.group({
      calendar: ['GREGORIAN', []],
      timeSpan: false,
      startDay: ['-', []],
      startMonth: ['-', []],
      startYear: ['', []],
      startEra: ['CE', []],
      endDay: '-',
      endMonth: '-',
      endYear: '',
      endEra: 'CE'
    });
    this.timeSpan = this.formBuilder.group({
      timeSpan: false
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
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
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.remove('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.remove('bg');
    } else {
      // tslint:disable-next-line:no-non-null-assertion
      this._elementRef.nativeElement.querySelector('.klie-val')!.classList.add('bg');
      this._elementRef.nativeElement.querySelector('.klie-com')!.classList.add('bg');
    }
  }

  _handleInput(what?: string): void {
    if (what !== undefined) {
      switch(what) {
        case 'calendar':
          break;
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
          break;
        case 'startMonth':
          if (this.parts.controls.startMonth.value === '-') {
            this.parts.controls.startDay.disable();
          }
          else {
            this.parts.controls.startDay.enable();
          }
          const dcs = this.calenderHelper.daycnt(this.parts.controls.calendar.value,
              this.parts.controls.startYear.value,
              this.parts.controls.startMonth.value);
          const startDays: string[] = ['-'];
          for (let i = 1; i <= dcs.days; i++) {
            startDays.push(i.toString(10));
          }
          this.startDays = startDays;
          break;
        case 'endMonth':
          if (this.parts.controls.endMonth.value === '-') {
            this.parts.controls.endDay.disable();
          }
          else {
            this.parts.controls.endDay.enable();
          }
          const dce = this.calenderHelper.daycnt(this.parts.controls.calendar.value,
              this.parts.controls.endYear.value,
              this.parts.controls.endMonth.value);
          const endDays: string[] = ['-'];
          for (let i = 1; i <= dce.days; i++) {
            endDays.push(i.toString(10));
          }
          this.endDays = endDays;
          break;
      }
    }
    this.onChange(this.parts.value);
  }

}

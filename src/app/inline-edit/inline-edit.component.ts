import {Component, Host, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {SatPopover} from "@ncstate/sat-popover";

@Component({
  selector: "app-inline-edit",
  templateUrl: "./inline-edit.component.html",
  styleUrls: ["./inline-edit.component.scss"]
})
export class InlineEditComponent implements OnInit {
  form: FormGroup;

  @Input() value: string | number;
  @Input() type: string;

  constructor( @Host() public popover: SatPopover) { }

  ngOnInit() {
    this.form = new FormGroup({
      property: new FormControl(this.value, [])
    });
  }

  submit() {
    console.log("submit");
    if (this.popover) {
      this.popover.close();
    }
  }

  cancel() {
    console.log("cancel");
    if (this.popover) {
      this.popover.close();
    }
  }

}

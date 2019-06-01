import {Component, EventEmitter, Host, Input, OnInit, Output} from "@angular/core";
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
    @Output() newValue: EventEmitter<string|number> = new EventEmitter();

    constructor(@Host() public popover: SatPopover) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            property: new FormControl(this.value, [])
        });
    }

    save() {
        this.newValue.emit(this.form.get("property").value);
    }

    cancel() {
        console.log("cancel");
        if (this.popover) {
            this.popover.close();
        }
    }

}

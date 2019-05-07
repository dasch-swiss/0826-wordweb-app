import {Component, Host, Input, OnInit} from "@angular/core";
import {SatPopover} from "@ncstate/sat-popover";
import {ApiService, Author} from "../api.service";

@Component({
  selector: "app-inline-edit-multiple",
  templateUrl: "./inline-edit-multiple.component.html",
  styleUrls: ["./inline-edit-multiple.component.css"]
})
export class InlineEditMultipleComponent implements OnInit {

  @Input() values: any[];
  copyValues: any[];
  addingModus: boolean;
  list: Author[];
  filteredList: Author[];

  value: string;
  valueChanged: boolean;

  constructor(@Host() public popover: SatPopover, private apiService: ApiService) { }

  ngOnInit() {
    this.copyValues = [...this.values];
    this.addingModus = false;
    this.list = this.apiService.getAuthors();
    this.filteredList = [...this.list];
    this.valueChanged = false;
  }

  addAuthors() {
    this.addingModus = true;
  }

  addAuthor(author: Author) {
    this.copyValues.push(author);
    this.valueChanged = true;
  }

  removeAuthor(id: number) {
    console.log(id);
    this.copyValues = this.copyValues.filter((author) => author.id !== id);
    this.valueChanged = true;
  }

  applyFilter(value: string) {
    this.filteredList = this.list.filter((author) => (author.firstName.toLowerCase().indexOf(value.toLowerCase()) > -1) || (author.lastName.toLowerCase().indexOf(value.toLowerCase()) > -1));
  }

  isValidToAdd(id: number): boolean {
    return this.copyValues.filter((author) => author.id === id).length !== 0;
  }

  clear() {
    this.value = "";
    this.filteredList = [...this.list];
  }

  close() {
    this.addingModus = false;
  }

  cancel() {
    if (this.popover) {
      this.popover.close();
    }
  }

  save() {
    console.log("Save");
    if (this.popover) {
      this.popover.close();
    }
  }

}

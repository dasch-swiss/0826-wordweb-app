import { Component, OnInit } from "@angular/core";
import {ApiService} from "../../api.service";
import { Node} from "ng-material-treetable";

export interface Task {
  name: string;
  completed: boolean;
  owner: HTMLElement;
}

@Component({
  selector: "app-genre",
  templateUrl: "./genre.component.html",
  styleUrls: ["./genre.component.scss"]
})
export class GenreComponent implements OnInit {
  value: string;

  data: Node<Task>[];
  btn: HTMLElement;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    // this.data = this.apiService.getGenres();
    console.log(this.data);
    this.btn = document.createElement("button") as HTMLElement;
    this.btn.innerText = "Edit";
    this.btn.onclick = function() {
      console.log("Ich wurde erzeugt");
    };

    this.data = [
      {
        value: {
          name: "Fiction",
          completed: true,
          owner: this.btn
        },
        children: [
          {
            value: {
              name: "Prose",
              completed: true,
              owner: this.btn
              // owner: "Marco"
            },
            children: []
          },
          {
            value: {
              name: "Drama: Theatre",
              completed: true,
              // owner: "Jane"
              owner: this.btn
            },
            children: [
              {
                value: {
                  name: "Tragedy",
                  completed: true,
                  owner: this.btn
                  // owner: "Bob"
                },
                children: []
              }
            ]
          }
        ]
      },
      {
        value: {
          name: "Non-Fiction",
          completed: false,
          owner: this.btn
          // owner: "Erika",
        },
        children: [
          {
            value: {
              name: "Journalism",
              completed: false,
              owner: this.btn
              // owner: "Marco"
            },
            children: []
          },
          {
            value: {
              name: "Essay",
              completed: true,
              owner: this.btn
              // owner: "James"
            },
            children: []
          }
        ]
      }
    ];

  }

  applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clear() {
    // this.dataSource.filter = this.value = "";
  }

  rowCount() {
    // return this.dataSource.filteredData.length;
  }

  openCreateGenre() {
  }
}

import { Component, OnInit } from "@angular/core";
import {ApiService} from "../../api.service";

@Component({
  selector: "app-genre",
  templateUrl: "./genre.component.html",
  styleUrls: ["./genre.component.scss"]
})
export class GenreComponent implements OnInit {
  data: any;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.data = this.apiService.getGenres();
  }

}

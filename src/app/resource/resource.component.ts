import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {mergeMap, tap} from "rxjs/operators";
import {KnoraService} from "../services/knora.service";
import {Observable} from "rxjs";

@Component({
    selector: "app-resource",
    templateUrl: "./resource.component.html",
    styleUrls: ["./resource.component.scss"]
})
export class ResourceComponent implements OnInit {
    $resource: Observable<any>;

    constructor(private route: ActivatedRoute, private knoraService: KnoraService) {
        this.$resource = route.paramMap
            .pipe(
                tap(data => console.log(typeof (data))),
                mergeMap((data: any) => knoraService.getPassageRes(data.params.id))
            );
    }

    ngOnInit(): void {
    }

}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogConfig as MatDialogConfig } from '@angular/material/legacy-dialog';
import { LoginComponent } from './edit/login/login.component';
import { KnoraService } from './services/knora.service';
import packageInfo from '../../package.json';

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    @ViewChild('drawer')
    myDrawer: ElementRef;
    title = 'Musikalisches Lexikon der Schweiz (MLS)';
    logininfo = '';
    loggedin = false;
    public version: string = packageInfo.version;

    constructor(public dialog: MatDialog,
                public knoraService: KnoraService) {
    }

    private openLoginDialog(): void {
        const loginConfig = new MatDialogConfig();
        loginConfig.autoFocus = true;
        loginConfig.disableClose = true;
        loginConfig.data = {
            email: '',
            password: ''
        };

        const dialogRef = this.dialog.open(LoginComponent, loginConfig);

        dialogRef.afterClosed().subscribe(
            data => {
                this.knoraService.login(data.email, data.password).subscribe(data => {
                    if (!data.success) {
                        console.log('LOGIN-ERROR:', data);
                        this.openLoginDialog();
                    } else {
                        this.logininfo = data.user;
                        this.loggedin = true;
                    }
                });
            });
    }

    ngOnInit() {
        const udata = this.knoraService.restoreToken();
        if (udata !== undefined) {
            this.logininfo = udata.user;
            this.loggedin = true;
        }
    }

    logout(): void {
        this.knoraService.logout().subscribe(data => {
            this.loggedin = false;
        });
    }

    account(): void {
        if (this.loggedin) {
            this.logout();
        } else {
            this.openLoginDialog();
        }
    }
}

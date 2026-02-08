import { Component, inject } from '@angular/core';
import { LoaderComponent } from "../../../shared/loader/loader.component";
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterModule } from "@angular/router";
import { LoaderService } from '../../../core/services/loader/loader.service';
import { AuthService } from '../../../core/services/AUth/auth.service';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [LoaderComponent, RouterModule],
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.css'
})
export class DashComponent {
 openMenu: string | null = null;
  constructor(private router: Router, private loader: LoaderService , private auth:AuthService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loader.show();
      }

      if (
        event instanceof NavigationEnd||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.loader.hide();
        }, 400);
      }
    });
  }

  toggle(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  logout(){
    this.auth.logout()
    this.router.navigateByUrl('/login')
  }
}

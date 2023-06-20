import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  navActive: boolean = false;
  selectedItem: string = '';
  menuItems = [
    /* { icon: 'fa-solid fa-house', title: 'Home', href: '/home' }, */
    { icon: 'fa-solid fa-truck', title: 'Costear', href: '/costeo' },
    { icon: 'fa-solid fa-sack-dollar', title: 'Comprobar', href: '/comprobar' },
    { icon: 'fa-solid fa-route', title: 'Distancia', href: '/distancia' },
    { icon: 'fa-solid fa-money-bill', title: 'Peajes', href: '/peajes' },
    { icon: 'fa-solid fa-map', title: 'Compensación', href: '/compensacion' },
    { icon: 'fa-solid fa-layer-group', title: 'Grupos', href: '/grupos' }
  ];

  constructor(private router: Router) {
    // Suscríbete a los eventos de cambio de ruta.
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.selectedItem = this.router.url;
      }
    });
  }

  ngOnInit() {
    this.selectedItem = this.router.url;
  }

  toggleMenu() {
    this.navActive = !this.navActive;
  }
}
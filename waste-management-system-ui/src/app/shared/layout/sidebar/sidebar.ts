import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  user: any = null;
  constructor(private auth: Auth) {}
  isCollapsed = false;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.auth.logout().subscribe(() => {
      console.log('Logged out successfully');
    });
}
}

import { Component } from '@angular/core';
import { Sidebar } from '../../shared/layout/sidebar/sidebar';
import { Navbar } from '../../shared/layout/navbar/navbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [Sidebar, Navbar, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css',
})
export class DashboardLayout {

}

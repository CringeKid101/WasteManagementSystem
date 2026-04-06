import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import  {MatIconModule} from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Stats as StatsService } from './services/stats';
import { DatePipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { DashboardStats } from '../../core/models/dashboard-stats.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatDividerModule, DatePipe, NgClass, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dashboardData: DashboardStats | null = null;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getDashboardData().subscribe(res => {
      this.dashboardData = res;
      console.log('Dashboard data:', this.dashboardData); 
    });
  }
}

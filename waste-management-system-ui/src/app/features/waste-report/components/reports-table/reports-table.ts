import { Component  } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common'; // Import NgClass

@Component({
  selector: 'app-reports-table',
  imports: [MatPaginator, MatTableModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './reports-table.html',
  styleUrl: './reports-table.css',
})
export class ReportsTable {
  displayedColumns: string[] = [
  'image',
  'location',
  'description',
  'reporter',
  'status',
  'date',
  'actions'
];

dataSource = [
  {
    image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807',
    location: 'MG Road Park',
    description: 'Large plastic waste pile near park entrance',
    reporter: 'Arjun N',
    status: 'Pending',
    date: 'Mar 16, 2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f',
    location: 'Indiranagar 12th Main',
    description: 'Garbage bags dumped beside the road',
    reporter: 'Priya K',
    status: 'Approved',
    date: 'Mar 15, 2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9',
    location: 'Whitefield Lake Area',
    description: 'Plastic bottles scattered near lake',
    reporter: 'Rahul S',
    status: 'Resolved',
    date: 'Mar 14, 2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1581579185169-76d3d7c6f4e3',
    location: 'Koramangala 5th Block',
    description: 'Construction debris blocking sidewalk',
    reporter: 'Megha P',
    status: 'Pending',
    date: 'Mar 13, 2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1595260287262-5c5d7ad9b8f6',
    location: 'Jayanagar Park',
    description: 'Organic waste dumped near playground',
    reporter: 'Vikram T',
    status: 'Approved',
    date: 'Mar 12, 2026'
  },
  {
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    location: 'Electronic City Phase 1',
    description: 'Mixed waste pile behind bus stop',
    reporter: 'Sneha M',
    status: 'Resolved',
    date: 'Mar 10, 2026'
  }
];
  openReportDialog(report: any) {
    // Logic to open the report dialog
  }
}

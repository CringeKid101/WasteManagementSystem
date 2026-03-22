import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-organizer-request-card',
  imports: [MatIconModule, MatCardModule, MatButtonModule ],
  templateUrl: './organizer-request-card.html',
  styleUrl: './organizer-request-card.css',
})
export class OrganizerRequestCard {
  @Input() request: any;

}

import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('waste-management-system-ui');
  constructor(private authService: Auth) { }

  ngOnInit(): void {
    this.authService.loadUser().subscribe({
    error: () => {
      console.log('Not logged in');
    }
  });
  }
  
}

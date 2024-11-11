import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginsComponent } from './logins/logins/logins.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet],


})
export class AppComponent implements OnInit {

  ngOnInit() {
  }
}

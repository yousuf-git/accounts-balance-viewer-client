import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() signOut = new EventEmitter<void>();

  constructor(public authSerivce: AuthService) {
  }

  ngOnInit(): void {
  }

  public onSignOut() {
    this.authSerivce.signOut();
  }

}

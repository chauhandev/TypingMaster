import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService } from 'src/app/services/websocket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isLoggedIn = false;
  showProfileInfo = false;
  userProfilePic = '';
  userName = '';

  constructor(private authService: UserService,private router : Router, private webSocketService : WebsocketService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.getUserInfo();
      }
    });
  }

  getUserInfo(): void {
    this.userProfilePic = localStorage.getItem('profilePic') || '';
    this.userName = localStorage.getItem('username')||'';
  }

  toggleProfileInfo(): void {
    this.showProfileInfo = !this.showProfileInfo;
  }

  logout(): void {
    localStorage.clear();
    this.authService.loggedIn(false);
    this.router.navigate(['/login']);
    this.webSocketService.disconnectSocket();
  }
}

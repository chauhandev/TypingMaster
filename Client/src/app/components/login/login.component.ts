import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { WebsocketService ,Connection } from 'src/app/services/websocket.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,private userService :UserService ,private router:Router,private webSocketService : WebsocketService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value).subscribe((data: any) => {
        if(data.error){
          alert(data.error);
        }
        localStorage.setItem('token',data.token);
        localStorage.setItem('username',data.fullName);
        localStorage.setItem('profilePic',data.profilePic);
        // console.log(data);
        this.userService.loggedIn(true);
        this.router.navigate(['/dashboard']);
        //this.webSocketService.emitToServer("connection", {})
        this.webSocketService.establishConnection();
      });
    }
  }

}

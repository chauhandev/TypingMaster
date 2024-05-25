import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm!: FormGroup; 

  constructor(private userService: UserService,private formBuilder: FormBuilder,private router:Router) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], // Add confirmPassword field
      gender: ['', Validators.required]
    }, { validator: this.passwordMatchValidator }); // Add custom validator
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }


  onSubmit() {
      this.userService.signup(this.signupForm.value).subscribe(response => {
            this.userService.loggedIn(true);
            this.router.navigate(['login']);
      }, error => {
        console.log(error);
      });
    }
  
}

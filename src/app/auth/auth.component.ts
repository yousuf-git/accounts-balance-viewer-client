import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

interface AuthForm {
  username: string,
  password: string
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public authForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }

  public onSubmit() {
    console.log(this.authForm.value);
  }
}

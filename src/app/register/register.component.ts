import { Router } from '@angular/router';
import { AlertifyService } from './../_services/alertify.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { User } from '../_models/user';
import { NgModule } from '@angular/core';
import { RegisterUserDto } from '../_models/registerUserDto';
import { LoginDto } from '../_models/loginDto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private user: RegisterUserDto;
  @Output() cancelRegister = new EventEmitter();
  protected registerForm: FormGroup;
  protected submitted = false;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        userName: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        sourceName: ['',Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')!.value === g.get('confirmPassword')!.value
      ? null
      : { mismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    const formParam = Object.assign({}, this.registerForm.value);
    this.user = {
      firstName: formParam.firstName,
      lastName: formParam.lastName,
      password: formParam.password,
      sourceName: formParam.sourceName,
      userName: formParam.userName,
      sourceId: null
    }
    this.authService.register(this.user).subscribe(() => {
      this.alertify.success('Registration successfully');
    }, error => {
      this.alertify.error(error);
    }, () => {
      const userForLogin: LoginDto = {
        username: this.user.userName,
        password: this.user.password,
      };
      this.authService.login(userForLogin).subscribe(() => {
        const sourceId = this.authService.getSourceFromStorage();
        this.router.navigate(['/source/',sourceId]);
      });
    });
    
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}

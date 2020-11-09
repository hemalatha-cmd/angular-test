import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AccountService, AlertService } from '@app/_services';
import { LoginComponent } from './login.component';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from '@app/_models';

const accountServiceSpy = jasmine.createSpyObj('AccountService', ['login']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);


describe('Login Component Shallow Test', () => {

  let fixture: ComponentFixture<LoginComponent>;
  let alertService;

  function updateForm(userEmail) {
    fixture.componentInstance.form.controls['username'].setValue(userEmail);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule],
      providers: [ 
        {provide: AccountService, useValue: accountServiceSpy},
        FormBuilder,
        AlertService,
        { provide: Router, useValue: routerSpy }
      ],
      declarations: [LoginComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    alertService = TestBed.get(AlertService);

  }));

  it('created a form with username and password input and login button', () => {
    const usernameContainer = fixture.debugElement.nativeElement.querySelector('#username');
    const loginBtnContainer = fixture.debugElement.nativeElement.querySelector('#login-btn');
    expect(usernameContainer).toBeDefined();
    expect(loginBtnContainer).toBeDefined();
  });

  it('When email is invalid, should display error message', () => {
    accountServiceSpy.login.and.returnValue(of([]));
    setTimeout(() => { }, 1000);
    updateForm('invalid_email');
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges(); 
    

    const usernameErrorMsg = fixture.debugElement.nativeElement.querySelector('.alert-dismissable');
    expect(usernameErrorMsg).toBeDefined();
  });

 
  it('When email is valid, should redirect to posts page', () => {
    let user  = new User();
    user.id = "1";
    accountServiceSpy.login.and.returnValue(of([user]));

    updateForm('test@account.com');
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalled();
    const navArgs = routerSpy.navigate.calls.first().args[0];
    // expecting to navigate to id of the component's first hero
    expect(navArgs[0]).toBe('/posts', 'should nav to Posts Page');

  });

  it('When email is blank, should display error message ', () => {
    updateForm('');
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    const inputs = fixture.debugElement.nativeElement.querySelectorAll('input');
    const usernameInput = inputs[0]; 

    expect(usernameInput.classList).toContain('is-invalid');
  });


});
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AccountService } from '@app/_services';
import { ListComponent } from './list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { User } from '@app/_models';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('Login Component Shallow Test', () => {

  let fixture: ComponentFixture<ListComponent>;
  let accountService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule],
      providers: [ 
        AccountService
      ],
      declarations: [ListComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ListComponent);
    accountService = TestBed.get(AccountService);

  }));

  it('should populate user details when page is loaded', () => {
    let user  = new User();
    user.id = "1";
    user.name ='Test User';
    user.phone ='123-8874-333';
    user.email ='test@account.com';
    user.address = {};
    user.address.suite = 'Apt. 556'
    user.address.street ='Kulas'
    user.address.city ='Gwenborough'
    user.address.zipcode ='92998'
    
    spyOnProperty(accountService, 'userValue', 'get').and.returnValue(user);
    fixture.componentInstance.ngOnInit();
    setTimeout(() => { }, 1000);
    
    fixture.detectChanges();

    const userName = fixture.debugElement.nativeElement.querySelector('#user_name');
    expect(userName.innerHTML).toContain('Test User');

    const email = fixture.debugElement.nativeElement.querySelector('#email');
    expect(email.innerHTML).toContain('test@account.com');

    const phone = fixture.debugElement.nativeElement.querySelector('#phone');
    expect(phone.innerHTML).toContain('123-8874-333');
  });

 

  
  it('should populate posts, comments when page is loaded', () => {
    let user  = new User();
    user.id = "1";

    const mockPostResponse: any = {
        id: "1",
        title: 'My first post'
      };

      const mockCommentResponse: any = {
        id: "1",
        title: 'My first comment'
      };
    spyOn(accountService, 'getPostsByUser').and.returnValue(of([mockPostResponse]));
    spyOn(accountService, 'getCommentsByPostId').and.returnValue(of([mockCommentResponse]));
    fixture.componentInstance.ngOnInit();
    setTimeout(() => { }, 1000);
    
    fixture.detectChanges();

    let posts = fixture.debugElement.nativeElement.querySelector("#posts");
    expect(posts.innerHTML).toContain('My first post');

  });


});
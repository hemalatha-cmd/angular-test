import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AccountService } from './account.service';
import { User } from '@app/_models';
import { first } from 'rxjs/operators';
import {Router} from '@angular/router';

describe('RegisterService', () => {

  let service: AccountService;
  let httpMock: HttpTestingController;
  let router = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountService,  {provide: Router, useValue: router}]
    });

    service = TestBed.get(AccountService);
    httpMock = TestBed.get(HttpTestingController);
    localStorage.removeItem('user');

  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('user');
  });

  describe('#loginUser tests', () => {
    it('Should return user Response and login user by making a GET request to the login url when vaid email name is given', () => {

      const email = 'test@account.com';

      const mockResponse: User = {
        id: "1",
        username: 'test_account'
      };
      service.login(email).pipe(first()).subscribe((res : any) => {
        let userinStorage = localStorage.getItem('user');
        expect(userinStorage).not.toBeNull();
        expect(userinStorage).not.toBeUndefined();
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users?email='+email);
      expect(req.request.method).toBe('GET');
      req.flush(new Array(mockResponse));
    });

    it('Should return empty Response and not login user by making a GET request to the login url when invali email name is given', () => {

        const email = 'invalid_email';
   
        service.login(email).pipe(first()).subscribe((res : any) => {
          let userinStorage = localStorage.getItem('user');
          expect(userinStorage).toBeNull();
        });
  
        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users?email='+email);
        expect(req.request.method).toBe('GET');
        req.flush(new Array());
    });
  });

  describe('#logout tests', () => {
    it('Should remove user details from storage when user is logged out. ', () => {

      service.logout();
      let userinStorage = localStorage.getItem('user');
      expect(userinStorage).toBeNull();

    });

  });

  describe('#posts tests', () => {
    it('Should return post details by making a GET request to the url', () => {

      const userId = '1';

      const mockResponse: any = {
        id: "1",
        title: 'My first post'
      };
      service.getPostsByUser(userId).subscribe((res : any) => {
        expect(res[0].id).toBe("1");
        expect(res[0].title).toBe("My first post");
      });

      const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts?userId='+userId);
      expect(req.request.method).toBe('GET');
      req.flush(new Array(mockResponse));
    });

    it('Should return comment posts by post id by making a GET request to the url', () => {

        const postId = '1';
  
        const mockResponse: any = {
          id: "1",
          title: 'My first comment'
        };
        service.getCommentsByPostId(postId).subscribe((res : any) => {
          expect(res[0].id).toBe("1");
          expect(res[0].title).toBe("My first comment");
        });
  
        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/comments?postId='+postId);
        expect(req.request.method).toBe('GET');
        req.flush(new Array(mockResponse));
      });
  });
});
import {TestBed, async} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {AuthGuard} from './auth.guard';
import { AccountService } from '@app/_services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { User } from '@app/_models';

describe('Logged in guard should', () => {
    let authGuard: AuthGuard;
    let accountService: AccountService;
    let router = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, CommonModule, HttpClientTestingModule],
            providers: [AuthGuard, AccountService,
                {provide: Router, useValue: router}
            ]
        })
            .compileComponents(); 
    }));

    beforeEach(() => {
        authGuard = TestBed.get(AuthGuard);
        accountService = TestBed.get(AccountService);
    });

    it('be able to hit route when user is logged in', () => {
        let user  = new User();
        user.id = "1";
        
        spyOnProperty(accountService, 'userValue', 'get').and.returnValue(user);
        expect(authGuard.canActivate(null, null)).toBe(true);
    });

    it('not be able to hit route when user is not logged in', () => {
        spyOnProperty(accountService, 'userValue', 'get').and.returnValue(null);
        expect(authGuard.canActivate(null, null)).toBe(false);
    });
});
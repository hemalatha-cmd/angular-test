﻿import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        if(localStorage.getItem('user') !=null) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user'))[0]);
        this.user = this.userSubject.asObservable();
        }else{
            this.userSubject = new BehaviorSubject<User>(new User());
            this.user = this.userSubject.asObservable();
        }
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username) {
        return this.http.get<User[]>(`${environment.apiUrl}users?email=`+username)
            .pipe(map(user => {

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                if(user.length >0)
                this.userSubject.next(user[0]);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }


    getPostsByUser(userId) {
        return this.http.get<User[]>(`${environment.apiUrl}posts?userId=`+userId);
    }

    getCommentsByPostId(postId) {
        return this.http.get<User[]>(`${environment.apiUrl}comments?postId=`+postId );
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    

  
}
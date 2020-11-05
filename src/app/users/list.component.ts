import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = null;
    user = null;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.user = this.accountService.userValue;
        this.accountService.getPostsByUser(this.user.id)
            .pipe(first())
            .subscribe(posts =>{ 
                this.posts = posts
                this.posts.forEach(post => {
                    console.log(post);
                    this.accountService.getCommentsByPostId(post.id).subscribe(commets =>{
                        post.comments = commets;
                    })
                });
                

            });
         
            
    }

    getCommentsByPostId(postId){
        return this.accountService.getCommentsByPostId(postId);
    }

 
}
import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BoxService } from './services/box.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public users = [
    {
      name: 'Project Owner',
      id: 'a69f4d0f-fc71-47da-865f-5a97c2c421d6',
    },
    {
      name: 'Project Collaborator 1',
      id: '11adfbd0-b6ac-4d07-a6e8-204eeb35d12b',
    },
  ];
  public selectedUserId: string;
  public token$: Observable<string>;
  public selectedItem: any;

  private userId = new Subject<string>();
  public constructor(private boxService: BoxService) {
    this.selectedUserId = this.users[0].id;
    this.token$ = this.userId.pipe(
      mergeMap((id) => this.boxService.getUserToken(id)),
      map((token) => token.token)
    );
  }

  public ngOnInit(): void {
    this.updateUser();
  }

  public updateUser() {
    this.selectedItem = null;
    this.token$ = this.boxService
      .getUserToken(this.selectedUserId)
      .pipe(map((token) => token.token));
  }

  public onItemSelected(file: any) {
    console.log(file);
    this.selectedItem = file;
  }
}

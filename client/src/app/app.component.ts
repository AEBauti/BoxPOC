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
      name: 'User 1',
      id: 'bdec861a-7fef-463d-a9aa-2652616958dd',
    },
    {
      name: 'User 2',
      id: '187bd69b-a2c4-4774-9612-f1452c5eefac',
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

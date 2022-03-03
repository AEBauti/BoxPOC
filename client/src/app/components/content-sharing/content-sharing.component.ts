import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BoxService } from 'src/app/services/box.service';

@Component({
  selector: 'app-contente-sharing',
  templateUrl: './content-sharing.component.html',
  styleUrls: ['./content-sharing.component.scss'],
})
export class ContentSharingComponent implements OnInit {
  @Input() sharingItem: any;
  public users$: Observable<any[]>;

  public permission: string;
  public shareWith: string;
  public shareLength: string;

  public filePermissions = [
    {
      name: 'Editor',
      code: 'editor',
    },
    {
      name: 'Viewer',
      code: 'viewer',
    },
  ];
  public folderPermissions = [
    {
      name: 'Co-owner',
      code: 'co-owner',
    },
    {
      name: 'Editor',
      code: 'editor',
    },
    {
      name: 'Viewer Uploader',
      code: 'viewer uploader',
    },
    {
      name: 'Previewer Uploader',
      code: 'previewer uploader',
    },
    {
      name: 'Viewer',
      code: 'viewer',
    },
    {
      name: 'Previewer',
      code: 'previewer',
    },
    {
      name: 'Uploader',
      code: 'uploader',
    },
  ];

  public constructor(private boxService: BoxService) {}

  public ngOnInit(): void {
    this.users$ = this.boxService.getUsers();
  }

  public share(): void {
    let duartionTime = +this.shareLength;
    if (isNaN(duartionTime)) {
      duartionTime = null;
    }
    const body = {
      itemType: this.sharingItem.type === 'file' ? 0 : 3,
      itemId: this.sharingItem.id,
      collaborator: this.shareWith,
      role: this.permission,
      duartionTime,
    };

    this.boxService.createCollab(body).subscribe((r) => console.log(r));
  }
}

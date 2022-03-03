declare var Box: any;
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-content-explorer',
  templateUrl: './content-explorer.component.html',
  styleUrls: ['./content-explorer.component.scss'],
})
export class ContentExplorerComponent implements OnInit {
  @Input() public set token(value: string) {
    if (!value) return;
    this._token = value;
    this.setContentExplorer();
  }
  @Output() public itemSelected = new EventEmitter<any>();
  private _contentExplorer: any;
  private _token: string;
  private _contentExplorerOpen = false;
  constructor() {}

  public ngOnInit(): void {
    this._contentExplorer = new Box.ContentExplorer();
  }

  private setContentExplorer() {
    if (this._contentExplorerOpen) {
      this._contentExplorer.hide();
    }
    this._contentExplorer.show('0', this._token, {
      container: '#my-box-content-explorer',
      canShare: false,
      logoUrl: 'assets/SUSTAINMENT_Logo_Full_DarkGray.png',
      contentPreviewProps: {
        contentSidebarProps: {
          detailsSidebarProps: {
            hasNotices: true,
            hasProperties: true,
            hasAccessStats: true,
            hasVersions: true,
          },
          hasActivityFeed: true,
        },
      },
    });
    this._contentExplorer.addListener('select', (e) => {
      if (e?.length) {
        this.itemSelected.emit(e[0]);
      }
    });
    this._contentExplorerOpen = true;
  }
}

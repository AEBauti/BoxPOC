declare var Box: any;
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-content-explorer',
  templateUrl: './content-explorer.component.html',
  styleUrls: ['./content-explorer.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  public ngOnInit(): void {
    this._contentExplorer = new Box.ContentExplorer();
  }

  private setContentExplorer() {
    if (this._contentExplorerOpen) {
      this._contentExplorer.hide();
    }
    this._contentExplorer.show('158985330911', /*'0',*/ this._token, {
      container: '#my-box-content-explorer',
      requestInterceptor: (config) => {
        if (config?.params && config.params['fields'])
          config.params['fields'] += ',metadata.enterprise_831410616.projects';
        return config;
      },
      responseInterceptor: (response) => {
        if (response.data?.entries) {
          response.data.entries.forEach((element) => {
            element.created_at = new Date(element.created_at).toDateString();
            element.size = this.formatBytes(element.size);
          });
        }
        console.log(response);
        return response;
      },
      canShare: false,
      logoUrl: 'assets/SUSTAINMENT_Logo_Full_DarkGray.png',
      canCreateNewFolder: false,
      // contentPreviewProps: {
      //   contentSidebarProps: {
      //     detailsSidebarProps: {
      //       hasNotices: true,
      //       hasProperties: true,
      //       hasAccessStats: true,
      //       hasVersions: true,
      //     },
      //     hasActivityFeed: true,
      //     hasMetadata: true,
      //     hasSkills: true,
      //   },
      // },
      metadataQuery: {
        from: 'enterprise_831410616.projects',
        ancestor_folder_id: '0',
        query: 'projectid = :arg1',
        query_params: {
          arg1: '2',
        },
        fields: [
          'id',
          'name',
          'type',
          'size',
          'parent',
          'extension',
          'permissions',
          'path_collection',
          'modified_at',
          'created_at',
          'modified_by',
          'has_collaborations',
          'is_externally_owned',
          'item_collection',
          'authenticated_download_url',
          'is_download_available',
          'representations',
          'url',
          'file_version',
          'sha1',
          'shared_link',
          'watermark_info',
          'metadata.enterprise_831410616.projects.projectid',
        ],
      },
      fieldsToShow: [
        { key: 'modified_at', displayName: 'Modified' },
        { key: 'size', displayName: 'Size' },
        { key: 'created_at', displayName: 'Upload Date' },
        {
          key: 'metadata.enterprise_831410616.projects.projectid',
          displayName: 'Project Id',
        },
      ],
      // defaultView: 'metadata',
    });

    this._contentExplorer.addListener('select', (e) => {
      if (e?.length) {
        this.itemSelected.emit(e[0]);
      }
    });
    this._contentExplorerOpen = true;
  }

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

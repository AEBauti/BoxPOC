import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ContentExplorerComponent } from './components/content-explorer/content-explorer.component';
import { ContentSharingComponent } from './components/content-sharing/content-sharing.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentExplorerComponent,
    ContentSharingComponent,
  ],
  imports: [HttpClientModule, FormsModule, BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

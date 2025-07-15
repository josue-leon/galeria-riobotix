import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ImageFormComponent } from './components/image-form/image-form.component';
import { ImageComponent } from './components/image/image.component';
import { ImageModalComponent } from './components/image-modal/image-modal.component';
import { ToastComponent } from './components/toast/toast.component';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { AdminViewComponent } from './views/admin-view/admin-view.component';
import { PublicViewComponent } from './views/public-view/public-view.component';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GalleryComponent,
    ImageFormComponent,
    ImageComponent,
    ImageModalComponent,
    ToastComponent,
    AdminViewComponent,
    PublicViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

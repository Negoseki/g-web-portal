import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '@gal/app-routing.module';
import { AppComponent } from '@gal/app.component';
import { CoreModule } from '@gal/core/core.module';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

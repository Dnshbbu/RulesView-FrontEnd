import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


// I have added below lines
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import {MaterialModule} from './material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { PapaParseModule } from 'ngx-papaparse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule }   from '@angular/forms';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";


//custom components
import { RiskConfigComponent } from './risk-config/risk-config.component';
import { ServerdataService } from './serverdata.service';
import { NewDesignComponent } from './new-design/new-design.component'



@NgModule({
  declarations: [
    AppComponent,
    RiskConfigComponent,
    NewDesignComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule,
    PapaParseModule,
    FormsModule,
    AngularDualListBoxModule,
    ToastrModule.forRoot(), // ToastrModule added
    NgxSpinnerModule
  ],
  providers: [RiskConfigComponent,ToastrModule,ServerdataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

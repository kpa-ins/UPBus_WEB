import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandlerService } from '../shared/service/error-handler.service';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule(
        {
                declarations: [],
                imports: [CommonModule,
                        FormsModule,
                        BsDropdownModule.forRoot(),
                        ModalModule.forRoot(),
                        PagesRoutingModule,
                        NgApexchartsModule,
                        ReactiveFormsModule,
                        DashboardsModule,
                        WidgetModule,
                        FullCalendarModule,
                        TabsModule.forRoot(),
                        TooltipModule.forRoot(),
                        CollapseModule.forRoot(),
                        AlertModule.forRoot(),
                        SimplebarAngularModule,
                        LightboxModule,
                        PickerModule,
                        NgxSpinnerModule,                
                
                ],
                providers: [
                        provideHttpClient(withInterceptorsFromDi()),
                        { provide: HTTP_INTERCEPTORS,  useClass: ErrorHandlerService,  multi: true }

                ]
        })
export class PagesModule { }

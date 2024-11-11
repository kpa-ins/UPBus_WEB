import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { WidgetModule } from './widget/widget.module';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WidgetModule,
    JwtModule
  ],
})

export class SharedModule { }

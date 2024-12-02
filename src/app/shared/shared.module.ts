import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetModule } from './widget/widget.module';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WidgetModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:7271","localhost:5138",],
        disallowedRoutes: []
      }
    }),
  ],
})

export class SharedModule { }

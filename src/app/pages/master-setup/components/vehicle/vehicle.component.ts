import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TransactionComponent } from 'src/app/shared/widget/transaction/transaction.component';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports:[
    VehicleComponent,
    PagetitleComponent,
    LoaderComponent,
    CommonModule,
    NgApexchartsModule,
    BsDropdownModule,
    ModalModule,
    TransactionComponent,
    FormsModule
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {

}

import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// module
import { MasterSetupRoutingModule } from './master-setup-routing.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditService, ExcelExportService, GridModule, PageService, PagerModule, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListAllModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons'
import { DialogModule } from '@syncfusion/ej2-angular-popups';

// bootstrap module
import { NgxSliderModule } from 'ngx-slider-v2';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';
// component

// dropzone
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    MasterSetupRoutingModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule,
    SlickCarouselModule,
    BsDropdownModule.forRoot(),
    ReactiveFormsModule,
    WidgetModule,
    NgxSliderModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DropzoneModule,
    PagetitleComponent,
    NgxSpinnerModule,
    GridModule,

    PagerModule,
    DropDownListAllModule,
    NumericTextBoxAllModule,
    DatePickerModule,
    TextBoxModule,
    DialogModule,
    MultiSelectModule,
    CheckBoxModule,
  ],
  providers: [PageService, SortService, EditService, ToolbarService, ExcelExportService, ResizeService]
})
export class MasterSetupModule { }

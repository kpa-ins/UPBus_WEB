import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// module
import { NgxSpinnerModule } from 'ngx-spinner';
import { EditService, ExcelExportService, GridModule, PageService, ResizeService, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

// bootstrap module
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';

// dropzone
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { AccountsRoutingModule } from './accounts-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    PagetitleComponent,
    NgxSpinnerModule,
    GridModule,
    DropDownListAllModule,
    TextBoxModule,
    DialogModule,
  ],
  providers: [PageService, SortService, EditService, ToolbarService, ExcelExportService, ResizeService]

})
export class AccountsModule { }

import { Component, ViewChild } from '@angular/core';
import { EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridModule, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ClickEventArgs } from '@syncfusion/ej2/navigations'
import { ToastrService } from 'ngx-toastr';
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { TripAccListService } from './trip-acc-list.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-trip-acc-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    DatePickerModule,
    DateTimePickerModule,
    NumericTextBoxAllModule,
  ],
  templateUrl: './trip-acc-list.component.html',
  styleUrl: './trip-acc-list.component.scss'
})
export class TripAccListComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: TripAccListService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getTripAccList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        console.log(result);
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
      args.cancel = true;
      this.router.navigate(["/daily-acc/trip-acc-form"]);
      return;
    }

    if (args.requestType === 'beginEdit') {
      args.cancel = true;
      const data: any = args.rowData;
      this.router.navigate(["/daily-acc/trip-acc-form"], { queryParams: { id: data.tripID }});
      return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].ownerID;
      this.deleteRecord(id);
      return;
    }
  }

  deleteRecord(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonText: 'No, cancel',
      confirmButtonText: 'Yes, delete it!',
    }).then((response: any) => {
      if (response.value) {
        this.spinner.show();
        this.service
          .deleteTripAcc(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Trip Acc', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Trip Acc', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Trip Acc', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'TripAcc.xlsx'});
    }
  }

  exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs ): void {
    if (args.column.headerText === '') {
      args.hyperLink = {
          target:  (args as any).data,
          displayText: (args as any).data
      };
    }
  }
}


import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, forkJoin, of } from 'rxjs';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2/navigations'
import { ToastrService } from 'ngx-toastr';
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { StockService } from '../stock.service';
@Component({
  selector: 'app-stock-main',
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
  templateUrl: './stock-main.component.html',
  styleUrl: './stock-main.component.scss'
})
export class StockMainComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add', 'Edit',
    { text: "Detail", tooltipText: "Detail", prefixIcon: "e-properties-2", id: "detail" },
    'Delete','Search'];
  submitClicked: boolean = false;

  stockForm: any;

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: StockService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }



  loadTableData() {
    this.spinner.show();
    this.service.getStockMainList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.grid.searchSettings.operator = "equal";
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.stockForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.stockForm = this.createFormGroup(args.rowData);
      return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.stockForm.valid) {
            let formData = this.stockForm.value;
            if (args.action === 'add') {
              this.createStockMain(formData);
            }
            else {
              this.updateStockMain(formData);
            }
           
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].stockCode;
      this.deleteStockMain(id);
    }
  }

  createStockMain(formData: any) {
    this.spinner.show();
    this.service
      .createStockMain(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        this.loadTableData();
        if (result.status) {
          this.showSuccess(result.messageContent);
        } else {
          Swal.fire('Error', result.messageContent, 'error');
          this.loadTableData(); 
        }
      });
  }

  updateStockMain(formData: any) {
    this.spinner.show();
    this.service
      .updateStockMain(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        this.loadTableData();
        if (result.status) {
          this.showSuccess(result.messageContent);
        } else {
          Swal.fire('Error', result.messageContent, 'error');
          this.loadTableData(); 
        }
      });
  }


  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        args.dialog.width = 500;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Stock': 'Add New Stock';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      stockCode: new FormControl(data.stockCode),
      stockName: new FormControl(data.stockName, Validators.required),
    });
  }

  deleteStockMain(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonText: 'No, keep it',
      confirmButtonText: 'Yes, I am sure!',
    }).then((response: any) => {
      if (response.value) {
        this.spinner.show();
        this.service
          .deleteStockMain(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            this.spinner.hide();
            if (result.status === true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              Swal.fire('Stock', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  } 

  validateControl(controlName: string) {
    const control = this.stockForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Stock', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Stock', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'Stock.xlsx'});
    }

    if (args.item.id === 'detail') {
      let selectedrecords: any[] = this.grid.getSelectedRecords();
      if (selectedrecords.length == 0) {
        Swal.fire('Stock', "Please select one row!", 'warning');
      } else {
        const id = selectedrecords[0].stockCode;
        this.router.navigate(["/daily-acc/stock-history"], { queryParams: { id: id }});
      }
      return;
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


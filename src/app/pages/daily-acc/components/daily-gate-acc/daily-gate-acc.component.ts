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
import { DailyGateAccService } from './daily-gate-acc.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-daily-gate-acc',
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
  templateUrl: './daily-gate-acc.component.html',
  styleUrl: './daily-gate-acc.component.scss'
})
export class DailyGateAccComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[] = ['Add',
    { text: "Expense", tooltipText: "Expense", prefixIcon: "e-add", id: "expense" },
    { text: "Income", tooltipText: "Income", prefixIcon: "e-add", id: "income" },
    'Delete','Search'];
  submitClicked: boolean = false;

  dailyGateAccForm: any;
  AccTypeList: any[] = [];
  gateList: any[] = [];
  accTypeList: any[] = ["Income", "Expense"];
  isEditMode: boolean = false;

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: DailyGateAccService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadTableData();
    this.getActiveGate();
  }

  getActiveGate() {
    this.service.getActiveGate()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.gateList = result;
        }
      });
  }

  loadTableData() {
    this.spinner.show();
    this.service.getDailyGateAccList()
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
        this.isEditMode = false;
        this.dailyGateAccForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.dailyGateAccForm.valid) {
            let formData = this.dailyGateAccForm.value;
            if (args.action === 'add') {
              formData.accDate = moment(formData.accDate).format('MM/DD/YYYY');
              this.createDailyGateAcc(formData);
            }
            else {
              formData.accDate = moment(formData.accDate).format('MM/DD/YYYY');

              this.updateDailyGateAcc(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const gate = data[0].gateCode;
      const date = data[0].accDate;
      this.deleteDailyGateAcc(gate, date);
    }
  }

  createDailyGateAcc(formData: any) {
    this.spinner.show();
    this.service
      .createDailyGateAcc(formData)
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


  updateDailyGateAcc(formData: any) {
    this.spinner.show();
    this.service
      .updateDailyGateAcc(formData)  // Pass the updated formData here
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after update
        if (result.status === true) {
          this.loadTableData(); // Refresh the table with updated data
          this.showSuccess(result.messageContent);  // Show success message
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if updating fails
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
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Daily Gate Acc': 'Add New Daily Gate Acc';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      gateCode: new FormControl('', Validators.required),
      accDate: new FormControl(new Date(), Validators.required),
     
    });
  }

  deleteDailyGateAcc(gate: any, date: any) {
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
          .deleteDailyGateAcc(gate, date)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            this.spinner.hide();
            if (result.status === true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              Swal.fire('Daily Gate Acc', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  } 

  validateControl(controlName: string) {
    const control = this.dailyGateAccForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Daily Gate Acc', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Daily Gate Acc', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'DailyGateAcc.xlsx'});
    }

    if (args.item.id === 'expense') {
      let selectedrecords: any[] = this.grid.getSelectedRecords();
      if (selectedrecords.length == 0) {
        Swal.fire('Daily Gate Acc', "Please select one row!", 'warning');
      } else {
        const date = this.datePipe.transform(selectedrecords[0].accDate, 'ddMMyy');
        const id = selectedrecords[0].gateCode + "-" + date;
        this.router.navigate(["/daily-acc/daily-gate-expense"], { queryParams: { id: id }});
      }
      return;
    }

    if (args.item.id === 'income') {
      let selectedrecords: any[] = this.grid.getSelectedRecords();
      if (selectedrecords.length == 0) {
        Swal.fire('Daily Gate Acc', "Please select one row!", 'warning');
      } else {
        const date = this.datePipe.transform(selectedrecords[0].accDate, 'ddMMyy');
        const id = selectedrecords[0].gateCode + "-" + date;
        this.router.navigate(["/daily-acc/daily-gate-income"], { queryParams: { id: id }});
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


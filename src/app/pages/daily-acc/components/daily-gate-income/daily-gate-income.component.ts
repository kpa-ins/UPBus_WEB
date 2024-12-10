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
import { DailyGateIncomeService } from './daily-gate-income.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-daily-gate-income',
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
  templateUrl: './daily-gate-income.component.html',
  styleUrl: './daily-gate-income.component.scss'
})
export class DailyGateIncomeComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;

  dailyGateAccForm: any;
  dailyGateIncomeForm: any;
  incTypeList: any[] = [];
  gateList: any[] = [];
  paidTypeList: any[] = ["Credit", "Paid"];
  isEditMode: boolean = false;
  gate: string;
  date: string;
  gateAccCode: string;
  currentYear: number;

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: DailyGateIncomeService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    const id = this.route.snapshot.queryParams['id'];
    this.gateAccCode = id;
    const strArr = id.split('-');
    this.gate = strArr[0];
    const d = strArr[1];

    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();  // Get the current year

    this.date = d.substring(2, 4)+ "/" + d.substring(0, 2) +"/"+ this.currentYear;

    this.dailyGateAccForm = new FormGroup({
      gateCode: new FormControl(''),
      accDate: new FormControl(''),
      incTotalAmt: new FormControl(''),
      expTotalAmt: new FormControl(''),
      incCreditAmt: new FormControl(''),
      incReceiveAmt: new FormControl(''),
      remark: new FormControl(''),
    });

    this.loadTableData();
    this.getDailyGateAccById();
    this.loadTableData();
    this.getActiveGate();
    this.getActiveIncomeType();
  }

  getDailyGateAccById() {
    this.spinner.show();
    this.service.getDailyGateAccById(this.gate, this.date)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.dailyGateAccForm.controls['gateCode'].setValue(result[0].gateCode);
          this.dailyGateAccForm.controls['accDate'].setValue(result[0].accDate);
          this.dailyGateAccForm.controls['incTotalAmt'].setValue(result[0].incTotalAmt);
          this.dailyGateAccForm.controls['expTotalAmt'].setValue(result[0].expTotalAmt);
          this.dailyGateAccForm.controls['incCreditAmt'].setValue(result[0].incCreditAmt);
          this.dailyGateAccForm.controls['incReceiveAmt'].setValue(result[0].incReceiveAmt);
          this.dailyGateAccForm.controls['remark'].setValue(result[0].remark);

          this.dailyGateAccForm.controls['gateCode'].disable();
          this.dailyGateAccForm.controls['accDate'].disable();
          this.dailyGateAccForm.controls['incTotalAmt'].disable();
          this.dailyGateAccForm.controls['expTotalAmt'].disable();
          this.dailyGateAccForm.controls['incCreditAmt'].disable();
          this.dailyGateAccForm.controls['incReceiveAmt'].disable();

        } else {
          Swal.fire('Daily Gate Acc', 'Data not found!', 'error');
        }

        this.spinner.hide();
    });
  }

  backToList() {
    this.router.navigate(["/daily-acc/daily-gate-acc"]);
  }

  onFormSubmit() {
    const formData = this.dailyGateAccForm.value;
    formData.gateCode = this.gate;
    formData.accDate = this.date;
    this.spinner.show();
    this.service
      .updateDailyGateAcc(formData)  // Pass the updated formData here
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after update
        if (result.status === true) {
          this.showSuccess(result.messageContent);  // Show success message
          this.getDailyGateAccById();
          this.loadTableData(); // Refresh the table with updated data
         
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if updating fails
          this.loadTableData(); 
        }
      });
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

  getActiveIncomeType() {
    this.service.getActiveIncomeType()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.incTypeList = result;
        }
      });
  }

  loadTableData() {
    this.spinner.show();
    this.service.getDailyGateIncomeList(this.gateAccCode)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.grid.searchSettings.operator = "equal";
        this.spinner.hide();
    });
  }

  onIncomeTypeChange(incCode: string) {
    if(incCode){
      const incList = this.incTypeList.filter(x=>x.incCode==incCode);
      this.dailyGateIncomeForm.controls['description'].setValue(incList[0].incName);
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.isEditMode = false;
        this.dailyGateIncomeForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.isEditMode = true;
      this.dailyGateIncomeForm = this.updateFormGroup(args.rowData);
      return;
  }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.dailyGateIncomeForm.valid) {
            let formData = this.dailyGateIncomeForm.value;
            formData.gateAccCode = this.gateAccCode;
            formData.accDate = this.date;
            if (args.action === 'add') {
              formData.expDate = moment(formData.expDate).format('MM/DD/YYYY');
              this.createDailyGateIncome(formData);
            }
            else {
              formData.expDate = moment(formData.expDate).format('MM/DD/YYYY');

              this.updateDailyGateIncome(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].incNo;
      this.deleteDailyGateIncome(id);
    }
  }

  createDailyGateIncome(formData: any) {
    this.spinner.show();
    this.service
      .createDailyGateIncome(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess(result.messageContent);
          this.getDailyGateAccById();
          this.loadTableData();
        } else {
          Swal.fire('Error', result.messageContent, 'error');
          this.loadTableData(); 
        }
      });
  }


  updateDailyGateIncome(formData: any) {
    this.spinner.show();
    this.service
      .updateDailyGateIncome(formData)  // Pass the updated formData here
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after update
        if (result.status === true) {
          this.showSuccess(result.messageContent);  // Show success message
          this.getDailyGateAccById();
          this.loadTableData(); // Refresh the table with updated data
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if updating fails
          this.loadTableData(); 
        }
      });
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        args.dialog.width = 800;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Daily Gate Income': 'Add New Daily Gate Income';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      gateCode: new FormControl(this.gate, Validators.required),
      incDate: new FormControl(new Date(), Validators.required),
      incCode: new FormControl('', Validators.required),
      paidType: new FormControl('', Validators.required),
      amount: new FormControl(0, Validators.required),
      description: new FormControl(''),   
      remark: new FormControl(''),
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      incNo: new FormControl(data.incNo, Validators.required),
      gateCode: new FormControl(data.gateCode, Validators.required),
      incDate: new FormControl(data.incDate, Validators.required),
      incCode: new FormControl(data.incCode, Validators.required),
      paidType: new FormControl(data.paidType, Validators.required),
      amount: new FormControl(data.amount, Validators.required),
      description: new FormControl(data.description),  
      remark: new FormControl(data.remark),
    });
  }


  deleteDailyGateIncome(id: any) {
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
          .deleteDailyGateIncome(id, this.date)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            this.spinner.hide();
            if (result.status === true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
              this.getDailyGateAccById(); // Refresh the table with updated data

            } else {
              Swal.fire('Daily Gate Income', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateNumberInput(event: any): void {
    let inputValue = event.target.value;
    
    // Check if input is a number and between 1 and 9
    if (inputValue < 0 ) {
      event.target.value = ''; // Clear invalid input
    }
  }

  validateControl(controlName: string) {
    const control = this.dailyGateIncomeForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Daily Gate Income', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Daily Gate Income', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'DailyGateIncome.xlsx'});
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


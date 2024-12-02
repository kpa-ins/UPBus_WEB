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
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DailyPlanService } from './daily-plan.service';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-daily-plan',
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    DatePickerModule,
    DateTimePickerModule

  ],
  templateUrl: './daily-plan.component.html',
  styleUrl: './daily-plan.component.scss'
})
export class DailyPlanComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;

  dailyPlanForm: any;
  tripCodeList: any[] = [];
  driverNameList: any[] = [];
  busList: any[] = [];
  dailyPlanList: any[] = ["မနက်", "ညနေ"];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: DailyPlanService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
    this.loadTripCodes();
    this.loadBusList();
  }

  loadTripCodes() {
    this.service.getTripCodes()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.tripCodeList = result;
        }
      });
  }

  loadBusList() {
    this.service.getBusList()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.busList = result;
        }
      });
  }

  loadTableData() {
    this.spinner.show();
    this.service.getDailyPlanList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.spinner.hide();
    });
  }

  onBusNoChange(busNo: string) {
    if (busNo) {
      this.service.getDriverByBusNo(busNo).subscribe((result: any) => {
        if (result && result.driverName) {
          this.dailyPlanForm.controls['driverName'].setValue(result.driverName);
          //this.dailyPlanForm.patchValue({ driverName: result.driverName });
          //this.dailyPlanForm.get('driverName')?.enable(); // Enable the driverName field
        } else {
          this.dailyPlanForm.patchValue({ driverName: '' });
          this.dailyPlanForm.get('driverName')?.disable(); // Disable the driverName field if no driver is found
        }
      });
    } else {
      this.dailyPlanForm.patchValue({ driverName: '' });
      this.dailyPlanForm.get('driverName')?.disable(); // Disable driverName if no busNo is selected
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.dailyPlanForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.dailyPlanForm = this.updateFormGroup(args.rowData);
      return;
  }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.dailyPlanForm.valid) {
            let formData = this.dailyPlanForm.value;
            if (args.action === 'add') {
              formData.tripDate = moment(formData.tripDate).format('MM/DD/YYYY hh:mm:ss');
              this.createDailyPlan(formData);
            }
            else {
              formData.tripDate = moment(formData.tripDate).format('MM/DD/YYYY hh:mm:ss');

              this.updateDailyPlan(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].dailyPlanID;
      this.deleteDailyPlan(id);
    }
  }

  createDailyPlan(formData: any) {
    this.spinner.show();
    this.service
      .saveDailyPlan(formData)
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


  updateDailyPlan(formData: any) {
    this.spinner.show();
    this.service
      .updateDailyPlan(formData)  // Pass the updated formData here
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
        args.dialog.width = 700;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Daily Plan': 'Add New Daily Plan';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      tripCode: new FormControl('', Validators.required),
      busNo: new FormControl('', Validators.required),
      driverName: new FormControl('', Validators.required),
      tripDate: new FormControl(new Date(), Validators.required),
      tripTime: new FormControl('', Validators.required),
      track: new FormControl('', Validators.required)
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      dailyPlanID: new FormControl(data.dailyPlanID, Validators.required),
      tripCode: new FormControl(data.tripCode, Validators.required),
      busNo: new FormControl(data.busNo, Validators.required),
      driverName: new FormControl(data.driverName, Validators.required),
      tripDate: new FormControl(data.tripDate, Validators.required),
      tripTime: new FormControl(data.tripTime, Validators.required),
      track: new FormControl(data.track, Validators.required)
    });
  }



  deleteDailyPlan(id: any) {
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
          .deleteDailyPlans(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            this.spinner.hide();
            if (result.status === true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              Swal.fire('Daily_Plan', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.dailyPlanForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'DailyPlan', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Daily_Plan', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'DailyPlan.xlsx'});
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


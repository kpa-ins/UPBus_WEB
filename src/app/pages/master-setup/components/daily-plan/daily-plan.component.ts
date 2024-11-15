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
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@Component({
  selector: 'app-daily-plan',
  standalone: true,
  imports:[

    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    DatePickerModule

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
    this.initializeForm(); // Initialize the form
  }

  initializeForm() {
    this.dailyPlanForm = new FormGroup({
      tripCode: new FormControl('', Validators.required),
      tripDate: new FormControl('', Validators.required),
      tripTime: new FormControl('', Validators.required),
      track: new FormControl('', Validators.required),
      busNo: new FormControl('', Validators.required),
      driverName: new FormControl({ value: '', disabled: true }, Validators.required), // Disabled by default
    });
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
          this.dailyPlanForm.patchValue({ driverName: result.driverName });
          this.dailyPlanForm.get('driverName')?.enable(); // Enable the driverName field
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
    if (args.requestType === 'add' || args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.initializeForm(); // Reinitialize form for a new entry or editing

      // If it's a new entry, enable the busNo and driverName fields properly
      this.dailyPlanForm.get('busNo')?.setValue(''); // You might want to clear this field initially
      this.dailyPlanForm.get('driverName')?.setValue(''); // Reset driverName
      this.dailyPlanForm.get('driverName')?.disable(); // Disable driverName initially

      return;
    }

    if (args.requestType === 'save') {
      this.submitClicked = true;

      // Extract the form data
      const formData = this.dailyPlanForm.getRawValue();  // Get all form data

      if (this.dailyPlanForm.valid) {
        // Ensure the date format is correct
        formData.tripDate = this.formatDate(formData.tripDate);

        // If it's an 'add' action, create a new entry
        if (args.action === 'add') {
          this.createDailyPlan(formData);  // Pass the formatted formData to create
        } else {
          this.updateDailyPlan(formData);  // Pass the formatted formData to update
        }
      } else {
        args.cancel = true;  // If form is invalid, prevent save
      }
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].tripCode;  // Assuming 'tripCode' is the identifier for deletion
      this.deleteDailyPlan(id);
    }
  }

  createDailyPlan(formData: any) {
    // Show the spinner while saving
    this.spinner.show();
    this.service
      .saveDailyPlan(formData)  // Call the service to save the formData
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after save
        this.loadTableData(); // Refresh the table with the updated data
        if (result.status) {
          this.showSuccess(result.messageContent);  // Show success message
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if saving fails
        }
      });
  }

  updateDailyPlan(formData: any) {
    // Show the spinner while updating
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

        // if (args.requestType === 'beginEdit') {
        //   (args.form.elements.namedItem('operatorName') as HTMLInputElement).focus();
        // }
        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Daily Plan': 'Add New Daily Plan';
    }
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      tripCode: new FormControl(data.tripCode, Validators.required),
      tripDate: new FormControl(data.tripDate, Validators.required),
      tripTime: new FormControl(data.tripTime, Validators.required),
      track: new FormControl(data.track, Validators.required),
      busNo: new FormControl(data.busNo, Validators.required),
      driverName: new FormControl(data.driverName, Validators.required),
    });
  }

  formatDate(date: any) {
    return date ? new Date(date).toISOString().split('T')[0] : null;
  }

  deleteDailyPlan(id: any) {
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
          .deleteDailyPlan(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
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
    // Swal.fire('Operator', msg, 'success');
    this.toastr.success(msg, 'DailyPlan', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Daily_Plan', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export'){
      this.grid.excelExport();
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

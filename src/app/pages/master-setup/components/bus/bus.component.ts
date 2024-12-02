import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, of } from 'rxjs';
import { Browser } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2/navigations'
import { ToastrService } from 'ngx-toastr';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { BusService } from './bus.service';
@Component({
  selector: 'app-bus',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    CheckBoxModule,
  ],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.scss'
})
export class BusComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;
  isEditMode: boolean = false;
  busForm: any;
  ownerList: any[] = ["UP", "Other"];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: BusService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getBusList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.spinner.hide();
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.isEditMode = false;
        this.busForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.isEditMode = true;
      this.busForm = this.updateFormGroup(args.rowData);
      return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.busForm.valid) {
            let formData = this.busForm.value;
            if (args.action === 'add') {
              this.createBus(formData);
            }
            else {
              this.updateBus(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const busNo = data[0].busNo;
      this.deleteBus(busNo);
      return;
    }
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
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Bus': 'Add New Bus';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      busNo: new FormControl('', Validators.required),
      driverName: new FormControl('', Validators.required),
      noOfSeat: new FormControl('', Validators.required),
      owner: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
      remark: new FormControl('')
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      busNo: new FormControl(data.busNo, Validators.required),
      driverName: new FormControl(data.driverName, Validators.required),
      noOfSeat: new FormControl(data.noOfSeat, Validators.required),
      owner: new FormControl(data.owner, Validators.required),
      active: new FormControl(data.active, Validators.required),
      remark: new FormControl(data.remark)
    });
  }

  validateNumberInput(event: any): void {
    let inputValue = event.target.value;
    
    // Check if input is a number and between 1 and 9
    if (inputValue < 1 ) {
      event.target.value = ''; // Clear invalid input
    }
  }


  rowDataBound(args): void {
    let data = args.data['active'];
    if (data === false) {
        args.row.classList.add('active');
    }
  }
  

  createBus(formData: any) {
    this.spinner.show();
    this.service
      .createBus(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Bus', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  updateBus(formData: any) {
    this.spinner.show();
    this.service
      .updateBus(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.loadTableData();
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Bus', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  deleteBus(id: any) {
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
          .deleteBus(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Bus', result.messageContent, 'error');
              this.loadTableData();
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.busForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Bus', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Bus', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'Bus.xlsx'});
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



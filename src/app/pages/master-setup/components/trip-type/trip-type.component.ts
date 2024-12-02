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
import { HttpErrorResponse } from '@angular/common/http';
import { ClickEventArgs } from '@syncfusion/ej2/navigations'
import { ToastrService } from 'ngx-toastr';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { TripTypeService } from './trip-type.service';
@Component({
  selector: 'app-trip-type',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    CheckBoxModule
  ],
  templateUrl: './trip-type.component.html',
  styleUrl: './trip-type.component.scss'
})
export class TripTypeComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;
  isEditMode: boolean = false;
  tripTypeForm: any;
  tripTypeList: any[] = ["UP", "DOWN"];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: TripTypeService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getTripTypeList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.spinner.hide();
    });
  }

  rowDataBound(args): void {
    let data = args.data['active'];
    if (data === false) {
        args.row.classList.add('active');
    }
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.isEditMode = false;
        this.tripTypeForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.isEditMode = true;
      this.tripTypeForm = this.updateFormGroup(args.rowData);
      return;
  }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.tripTypeForm.valid) {
            let formData = this.tripTypeForm.value;
            if (args.action === 'add') {
              formData.tripCode = "";
              this.createTripTypes(formData);
            }
            else {
              this.updateTripTypes(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const tripCode = data[0].tripCode; // Use gateCode instead of id
      this.deleteGate(tripCode);
    }

  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      args.dialog.width = 500;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        // if (args.requestType === 'beginEdit') {
        //   (args.form.elements.namedItem('operatorName') as HTMLInputElement).focus();
        // }
        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Trip Type': 'Add New Trip Type';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      tripName: new FormControl('', Validators.required),
      trpType: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      tripCode: new FormControl(data.tripCode),
      tripName: new FormControl(data.tripName, Validators.required),
      trpType: new FormControl(data.trpType, Validators.required),
      active: new FormControl(data.active, Validators.required),
    });
  }

  createTripTypes(formData: any) {
    this.spinner.show();
    this.service
      .saveTripType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Trip Type', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  updateTripTypes(formData: any) {
    this.spinner.show();
    this.service
      .updateTripType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.loadTableData();
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Trip Type', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  deleteGate(id: any) {
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
          .deleteTripType(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Trip Type', result.messageContent, 'error');
              this.loadTableData();
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.tripTypeForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Trip Type', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Trip Type', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'TripType.xlsx'});
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

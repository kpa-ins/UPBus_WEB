import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule,DialogEditEventArgs, EditSettingsModel, ExcelQueryCellInfoEventArgs, GridComponent, GridLine, PageSettingsModel, SaveEventArgs, ToolbarItems, filterDialogClose } from '@syncfusion/ej2-angular-grids';
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
import { IncomeTypeService } from './income-type.service';
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
  templateUrl: './income-type.component.html',
  styleUrl: './income-type.component.scss'
})
export class IncomeTypeComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;
  isEditMode: boolean = false;

  incomeTypeForm: any;
  incomeTypeList: any[] = ["GATE", "BUS","TRIP"];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: IncomeTypeService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getIncomeTypeList()
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
        this.incomeTypeForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.isEditMode = true;
      this.incomeTypeForm = this.updateFormGroup(args.rowData);
      return;
  }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.incomeTypeForm.valid) {
            let formData = this.incomeTypeForm.value;
            if (args.action === 'add') {
              formData.incCode = "";
              this.createIncomeTypes(formData);
            }
            else {
              this.updateIncomeTypes(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const incCode = data[0].incCode; // Use gateCode instead of id
      this.deleteGate(incCode);
    }

  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
      args.dialog.width = 500;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Income Type': 'Add New Income Type';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      incName: new FormControl('', Validators.required),
      incType: new FormControl('', Validators.required),
      active: new FormControl(true, Validators.required),
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      incCode: new FormControl(data.incCode),
      incName: new FormControl(data.incName, Validators.required),
      incType: new FormControl(data.incType, Validators.required),
      active: new FormControl(data.active, Validators.required),
    });
  }

  createIncomeTypes(formData: any) {
    this.spinner.show();
    this.service
      .saveIncomeType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Income Type', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  updateIncomeTypes(formData: any) {
    this.spinner.show();
    this.service
      .updateIncomeType(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.loadTableData();
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Income Type', result.messageContent, 'error');
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
          .deleteIncomeType(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Income Type', result.messageContent, 'error');
              this.loadTableData();
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.incomeTypeForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    // Swal.fire('Operator', msg, 'success');
    this.toastr.success(msg, 'IncomeType', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Income_Type', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'IncomeType.xlsx'});
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

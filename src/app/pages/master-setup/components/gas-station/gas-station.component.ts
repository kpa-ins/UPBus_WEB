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
import { NumericTextBoxAllModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { GasStationService } from './gas-station.service';
@Component({
  selector: 'app-gas-station',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
    CheckBoxModule,
    NumericTextBoxAllModule,
  ],
  templateUrl: './gas-station.component.html',
  styleUrl: './gas-station.component.scss'
})
export class GasStationComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: true, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Search'];
  submitClicked: boolean = false;
  isEditMode: boolean = false;
  gasStationForm: any;
  ownerList: any[] = ["UP", "Other"];

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: GasStationService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTableData();
  }

  loadTableData() {
    this.spinner.show();
    this.service.getGasStationList()
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
        this.gasStationForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.gasStationForm = this.updateFormGroup(args.rowData);
      return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.gasStationForm.valid) {
            let formData = this.gasStationForm.value;
            if (args.action === 'add') {
              this.createGasStation(formData);
            }
            else {
              this.updateGasStation(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].gsCode;
      this.deleteGasStation(id);
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

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Gas Station': 'Add New Gas Station';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      gsName: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      totalBalance: new FormControl(0, Validators.required),
      active: new FormControl(true, Validators.required),
      unit: new FormControl('', Validators.required)
    });
  }

  updateFormGroup(data: any): FormGroup {
    return new FormGroup({
      gsCode: new FormControl(data.gsCode),
      gsName: new FormControl(data.gsName, Validators.required),
      location: new FormControl(data.location, Validators.required),
      totalBalance: new FormControl(data.totalBalance, Validators.required),
      active: new FormControl(data.active, Validators.required),
      unit: new FormControl(data.unit, Validators.required)
    });
  }

  validateNumberInput(event: any): void {
    let inputValue = event.target.value;
    
    // Check if input is a number and between 1 and 9
    if (inputValue < 0 ) {
      event.target.value = ''; // Clear invalid input
    }
  }


  rowDataBound(args): void {
    let data = args.data['active'];
    if (data === false) {
        args.row.classList.add('inactive');
    }
  }
  

  createGasStation(formData: any) {
    this.spinner.show();
    this.service
      .createGasStation(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.loadTableData();
        if (result.status == true) {
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Gas Station', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  updateGasStation(formData: any) {
    this.spinner.show();
    this.service
      .updateGasStation(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.loadTableData();
          this.showSuccess(result.messageContent);
        } else {
          this.spinner.hide();
          Swal.fire('Gas Station', result.messageContent, 'error');
          this.loadTableData();
        }
      });
  }

  deleteGasStation(id: any) {
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
          .deleteGasStation(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('Gas Station', result.messageContent, 'error');
              this.loadTableData();
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.gasStationForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Gas Station', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Gas Station', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'GasStation.xlsx'});
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




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
import { ActivatedRoute, Router } from '@angular/router';
import { StockService } from '../stock.service';
@Component({
  selector: 'app-stock-history',
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
  templateUrl: './stock-history.component.html',
  styleUrl: './stock-history.component.scss'
})
export class StockHistoryComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: any[]= ['Add', 
    { text: "Cancel", tooltipText: "Cancel", prefixIcon: "e-cancel", id: "cancel" },
    'Search'];
  submitClicked: boolean = false;

  stockForm: any;
  stockHistoryForm: any;
  busList: any[] = [];
  stockTypeList: any[] = ["Receive", "Issue"];
  stTypeList: any[] = ["All","Receive", "Issue"];
  isEditMode: boolean = false;
  id: string;
  isShow: boolean = true;
  balance: number;
  oldQty:number;
  stockType: string = "All";
  bus: string="All";

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: StockService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.queryParams['id'];
  
    this.stockForm = new FormGroup({
      stockCode: new FormControl(''),
      stockName: new FormControl(''),
      balance: new FormControl(''),
      lastPrice: new FormControl(''),
     
    });

    this.loadTableData();
    this.getBusList();
    this.getStockMainById();

    this.bus = this.busList[0]?.busNo;
    
  }


  getStockMainById() {
    this.spinner.show();
    this.service.getStockMainById(this.id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.stockForm.controls['stockCode'].setValue(result[0].stockCode);
          this.stockForm.controls['stockName'].setValue(result[0].stockName);
          this.stockForm.controls['balance'].setValue(result[0].balance);
          this.stockForm.controls['lastPrice'].setValue(result[0].lastPrice);
        
          this.stockForm.controls['stockCode'].disable();
          this.stockForm.controls['balance'].disable();
          this.stockForm.controls['lastPrice'].disable();
          this.stockForm.controls['stockName'].disable();
         
          this.balance = result[0].balance;

        } else {
          Swal.fire('Stock', 'Data not found!', 'error');
        }

        this.spinner.hide();
    });
  }



  loadTableData() {
    this.spinner.show();
    this.service.getStockHistoryList(this.id, this.stockType, this.bus)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.grid.dataSource  = result;
        this.grid.searchSettings.operator = "equal";
        this.spinner.hide();
    });
  }

  getBusList() {
    this.service.getBusList()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.busList = result;
          this.busList.unshift({"busNo": "All"})
          this.bus = this.busList[0].busNo;
        }
      });
  }


  backToList() {
    this.router.navigate(["/daily-acc/stock-main"]);
  }

  onFormSubmit() {
    const formData = this.stockForm.value;
    formData.stockCode = this.id;
    this.spinner.show();
    this.service
      .updateStockMain(formData)  // Pass the updated formData here
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after update
        if (result.status === true) {
          this.showSuccess(result.messageContent);  // Show success message
          this.getStockMainById();
          this.loadTableData(); // Refresh the table with updated data
         
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if updating fails
          this.loadTableData(); 
        }
      });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.isEditMode = false;
        this.stockHistoryForm = this.createFormGroup(args.rowData);
        return;
    }

    if (args.requestType === 'beginEdit') {
      this.submitClicked = false;
      this.isEditMode = true;
      this.stockHistoryForm = this.updateFormGroup(args.rowData);
      return;
  }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.stockHistoryForm.valid) {
            let formData = this.stockHistoryForm.value;
            if (args.action === 'add') {
              formData.stockDate = moment(formData.stockDate).format('MM/DD/YYYY');
              if(formData.qty > this.balance && formData.stockType === "Issue"){
                Swal.fire('Error', 'Issue qty is greater than balance!', 'error');
              }
              else{
                this.createStockHistory(formData);
              }
            }
            else {
              if((formData.qty > (this.balance + this.oldQty)) && formData.stockType === "Issue"){
                Swal.fire('Error', 'Issue qty is greater than balance!', 'error');
              }
              else{
                this.updateStockHistory(formData);
              } 
            }
        } else {
            args.cancel = true;
        }
        return;
    }

  }

  createStockHistory(formData: any) {
    this.spinner.show();
    this.service
      .createStockHistory(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.spinner.hide();
        if (result.status) {
          this.showSuccess(result.messageContent);
          this.getStockMainById();
          this.loadTableData();
        } else {
          Swal.fire('Error', result.messageContent, 'error');
          this.loadTableData();
          this.getStockMainById();
        }
      });
  }


  updateStockHistory(formData: any) {
    this.spinner.show();
    this.service
      .updateStockHistory(formData)  // Pass the updated formData here
      .pipe(catchError((err) => of(this.showError(err))))  // Handle errors if any
      .subscribe((result) => {
        this.spinner.hide(); // Hide the spinner after update
        if (result.status === true) {
          this.showSuccess(result.messageContent);  // Show success message
          this.getStockMainById();
          this.loadTableData(); // Refresh the table with updated data
        } else {
          Swal.fire('Error', result.messageContent, 'error'); // Show error if updating fails
          this.loadTableData(); 
        }
      });
  }

  rowDataBound(args): void {
    let data = args.data['isCancel'];
  let stype = args.data['stockType'];

  // Check if both conditions are true and apply both classes
  if (data === true &&  (stype === "Receive" || stype === "Issue")) {
    args.row.classList.add('inactive');
  } else {
    // Add individual classes if conditions are separate
    if (data === true) {
      args.row.classList.add('inactive');
    }
    if (stype === "Receive") {
      args.row.classList.add('stockType');
    }
  }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if ((args.requestType === 'beginEdit' || args.requestType === 'add')) {
        args.dialog.width = 800;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();
        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'beginEdit' ? 'Edit Stock History': 'Add New Stock History';
    }
  }

  createFormGroup(data: any): FormGroup {
    return new FormGroup({
      stockCode: new FormControl(this.id, Validators.required),
      stockDate: new FormControl(new Date(), Validators.required),
      stockType: new FormControl('', Validators.required),
      qty: new FormControl(1, Validators.required),
      busNo: new FormControl(''),
      lastPrice: new FormControl(0),   
      remark: new FormControl(''),
    });
  }

  updateFormGroup(data: any): FormGroup {
    this.oldQty = data.qty;
    return new FormGroup({
      regNo: new FormControl(data.regNo),
      stockCode: new FormControl(data.stockCode, Validators.required),
      stockDate: new FormControl(data.stockDate, Validators.required),
      stockType: new FormControl(data.stockType, Validators.required),
      qty: new FormControl(data.qty, Validators.required),
      busNo: new FormControl(data.busNo),  
      lastPrice: new FormControl(data.lastPrice), 
      remark: new FormControl(data.remark),
    });
  }


  cancelStockHistory(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      //text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      cancelButtonText: 'No, keep it',
      confirmButtonText: 'Yes, I am sure!',
    }).then((response: any) => {
      if (response.value) {
        this.spinner.show();
        this.service
          .cancelStockHistory(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            this.spinner.hide();
            if (result.status === true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
              this.getStockMainById();
            } else {
              Swal.fire('Stock History', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }


  onStockTypeChange(type: string) {
    if(type === "Receive"){
      this.isShow= true;
    }
    else{
      this.isShow= false;
      this.stockHistoryForm.get("busNo").setValidators(Validators.required);
    }
  }

  validateNumberInput(event: any): void {
    let inputValue = event.target.value;
    
    // Check if input is a number and between 1 and 9
    if (inputValue < 1 ) {
      event.target.value = ''; // Clear invalid input
    }
  }

  validateControl(controlName: string) {
    const control = this.stockHistoryForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Stock History', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Stock History', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'StockHistory.xlsx'});
    }

    if (args.item.id === 'cancel') {
      let selectedrecords: any[] = this.grid.getSelectedRecords();
      if (selectedrecords.length == 0) {
        Swal.fire('Stock History', "Please select one row!", 'warning');
      } else {
        const id = selectedrecords[0].regNo;
        this.cancelStockHistory(id);
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
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
import { TripAccListService } from '../trip-acc-list/trip-acc-list.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-trip-acc-form',
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
  templateUrl: './trip-acc-form.component.html',
  styleUrl: './trip-acc-form.component.scss'
})
export class TripAccFormComponent {
  id: any;
  tripAccForm: any;
  busList: any[] = [];
  gateList: any[] = [];
  goBackUrl: string = "/master-setup/yard";

  
  title: string = "Add Trip Acc";
  opCode1: boolean=true;
  opCode2: boolean=false;

  constructor(
    private service: TripAccListService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    public toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.queryParams['id'];

    this.tripAccForm = new FormGroup({
      busNo: new FormControl('', Validators.required),
      driverName: new FormControl('', Validators.required),
      downDate: new FormControl(new Date(), Validators.required),
      dtrackName: new FormControl('', Validators.required),
      dgateCode: new FormControl('', Validators.required),
      dexpTotal: new FormControl(0),
      dincTotal: new FormControl(0),
      dremark: new FormControl(''),
      upDate: new FormControl(new Date(), Validators.required),
      utrackName: new FormControl('', Validators.required),
      ugateCode: new FormControl('', Validators.required),
      uexpTotal: new FormControl(0),
      uincTotal: new FormControl(0),
      uremark: new FormControl()
    });

    this.getBusData();
    this.getActiveGate();


    if (this.id) {
      this.title = "Update Trip Acc";
      this.getTripAccById();    }
  }

  onBusNoChange(busNo: string) {
    if(busNo){
      const bList = this.busList.filter(x=>x.busNo==busNo);
      this.tripAccForm.controls['driverName'].setValue(bList[0].driverName);
    }
  }

  getBusData() {
    this.service.getBusData()
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.busList = result;
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

  validateNumberInput(event: any): void {
    let inputValue = event.target.value;
    
    // Check if input is a number and between 1 and 9
    if (inputValue < 0 ) {
      event.target.value = ''; // Clear invalid input
    }
  }

  getTripAccById() {
    this.spinner.show();
    this.service.getTripAccById(this.id)
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result) {
          this.tripAccForm.controls['ownerID'].setValue(result.ownerID);
          this.tripAccForm.controls['ownerName'].setValue(result.ownerName);
          this.tripAccForm.controls['ownerType'].setValue(result.ownerType);
          this.tripAccForm.controls['contactPerson'].setValue(result.contactPerson);
          this.tripAccForm.controls['contactEmail'].setValue(result.contactEmail);
          this.tripAccForm.controls['contactPhone'].setValue(result.contactPhone);
          this.tripAccForm.controls['color'].setValue(result.color);
          this.tripAccForm.controls['status'].setValue(result.status);
          this.tripAccForm.controls['remark'].setValue(result.remark);


        } else {
          Swal.fire('Trip Acc', 'Data not found!', 'error');
        }

        this.spinner.hide();
    });
  }



  onFormSubmit() {
    if (!this.tripAccForm.valid) {
      return;
    }

    const formData = this.tripAccForm.value;

    if (this.id) {
      this.updateTripAcc(formData);
    } else {
      this.createTripAcc(formData);
    }
  }

  createTripAcc(formData: any) {
    this.spinner.show();
    this.service
      .createTripAcc(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.showSuccess(result.messageContent);
          this.backToList();
        } else {
          this.spinner.hide();
          Swal.fire('Trip Acc', result.messageContent, 'error');
        }
      });
  }

  updateTripAcc(formData: any) {
    formData.ownerID = this.id;
    this.spinner.show();
    this.service
      .updateTripAcc(formData)
      .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        if (result.status == true) {
          this.showSuccess(result.messageContent);
          this.backToList();
        } else {
          this.spinner.hide();
          Swal.fire('Trip Acc', result.messageContent, 'error');
        }
      });
  }

  validateControl(controlName: string) {
    const control = this.tripAccForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched));
  }

  backToList() {
    this.router.navigate(["/daily-acc/trip-acc-list"]);
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'Trip Acc', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('Trip Acc', error.toString(), 'error');
  }
}


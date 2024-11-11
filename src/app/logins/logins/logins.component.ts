import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';

import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TransactionComponent } from 'src/app/shared/widget/transaction/transaction.component';
import { PagetitleComponent } from 'src/app/shared/ui/pagetitle/pagetitle.component';
import { LoaderComponent } from 'src/app/shared/ui/loader/loader.component';
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
import { AuthResponseDto } from 'src/app/shared/interfaces/auth-response-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Component({
  selector: 'app-logins',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,

  ],
  templateUrl: './logins.component.html',
  styleUrl: './logins.component.scss',
  providers: [JwtHelperService]

})
export class LoginsComponent {
  submitted = false;
  error = '';
  returnUrl: string;
  errorMessage: string = '';
  showErrorMsg: boolean;
  loginForm:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
     private service: AuthService,
    private spinner: NgxSpinnerService,
   ) { }

    ngOnInit(): void {

      sessionStorage.clear();
      this.loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required)
      });
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

  onFormSubmit() {
    this.spinner.show();
    this.showErrorMsg = false;
    const formValues = this.loginForm.value;
    this.service.loginUser(formValues)
    .subscribe({
      next: (res:AuthResponseDto) => {
        localStorage.setItem("token", res.token);
        const name = this.service.getCurrentUser().name;
        const email = this.service.getCurrentUser().email;
        const role = this.service.getCurrentUser().role;
        localStorage.setItem("currentUser", email);
        localStorage.setItem("currentRole", role);
        localStorage.setItem("currentUserName", name);   
        this.service.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this.router.navigate([this.returnUrl]);
        this.spinner.hide();

    },
    error: (err: HttpErrorResponse) => {
      if(err.message.length>0)
        {
          this.errorMessage = "The user name or password are incorrect";
        }
        else
        {
          this.errorMessage = "API Error";
        }
      this.showErrorMsg = true;
      this.spinner.hide();
    }});
   }

   validateControl(controlName: string) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  hasError (controlName: string, errorName: string) {
    return this.loginForm.get(controlName).hasError(errorName)
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/service/auth-service.service';
import { PasswordConfirmationValidatorService } from 'src/app/shared/service/password-confirmation-validator-service.service';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: any;
  errorMessage: string = '';
  showErrorMsg: boolean;
  showSuccessMsg: boolean;

  constructor(
    private service: AuthService,
    private spinner: NgxSpinnerService,
    private passConfValidator: PasswordConfirmationValidatorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    const currentUser = this.service.getCurrentUser();
    const email = currentUser.email;

    this.resetPasswordForm = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl(''),
    });

    this.resetPasswordForm.get('confirmPassword').setValidators([Validators.required,
    this.passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);
  }

  onFormSubmit() {
    this.spinner.show();
    this.showErrorMsg = this.showSuccessMsg = false;
    const formValues = this.resetPasswordForm.value;
    this.service.resetPassword(formValues)
    .subscribe({
      next: (_) => this.showSuccessMsg = true,
      error: (err: HttpErrorResponse) => {
        this.showErrorMsg = true;
        this.errorMessage = err.message;
      }
    });
    this.spinner.hide();
    this.router.navigate(["/accounts/register"]);
  }

  validateControl(controlName: string) {
    return this.resetPasswordForm.get(controlName).invalid && this.resetPasswordForm.get(controlName).touched;
  }

  hasError (controlName: string, errorName: string) {
    return this.resetPasswordForm.get(controlName).hasError(errorName)
  }
}


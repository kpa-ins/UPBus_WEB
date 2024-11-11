import { Component, ViewChild } from '@angular/core';
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
import { AuthService } from 'src/app/shared/service/auth-service.service';
import { PasswordConfirmationValidatorService } from 'src/app/shared/service/password-confirmation-validator-service.service';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    GridModule,
    TextBoxModule,
    DropDownListAllModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  pageSettings: PageSettingsModel = { pageSize: 10 };
  editSettings: EditSettingsModel = { allowAdding: true, allowEditing: false, allowDeleting: true, mode: 'Dialog' };
  toolbar: ToolbarItems[]=['Add', 'Delete', 'ExcelExport', 'Search'];
  submitClicked: boolean = false;
  yardList:any[]=[];
  ownerList:any[]=[];
  roleList:any[]=[]
  registerForm: any;
  yard:string;
  yardCodeList:any[]=[];
  currentRole:string;

  @ViewChild('Grid') public grid: GridComponent;

  constructor(
    private service: AuthService,
    private spinner: NgxSpinnerService,
    public toastr:ToastrService,
    private passConfValidator: PasswordConfirmationValidatorService,

  ) {}

  ngOnInit(): void {

    this.currentRole=localStorage.getItem("currentRole");

    this.getRoleList();

    this.loadTableData();
  }

  loadTableData() {
    this.service.getUserList()
      .pipe(catchError((err) => of(this.showError(err))))
        .subscribe((result) => {
          this.grid.dataSource  = result;
          this.spinner.hide();
      });
  }

  getRoleList() {
    this.service.getRoleList()
    .pipe(catchError((err) => of(this.showError(err))))
      .subscribe((result) => {
        this.roleList  = result;
    });
  }

  actionBegin(args: SaveEventArgs): void {
    if (args.requestType === 'add') {
        this.submitClicked = false;
        this.registerForm = new FormGroup ({
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', Validators.required),
          confirmPassword: new FormControl('',Validators.required),
          role: new FormControl('', Validators.required),
        });

        this.registerForm.get('confirmPassword').setValidators([Validators.required,
        this.passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);
        return;
    }

    if (args.requestType === 'save') {
        this.submitClicked = true;
        if (this.registerForm.valid) {
            let formData = this.registerForm.value;
            formData.createdUser=localStorage.getItem("currentUser");
            if (args.action === 'add') {
              this.createUser(formData);
            }
        } else {
            args.cancel = true;
        }
        return;
    }

    if (args.requestType === 'delete') {
      args.cancel = true;
      const data = args.data as any[];
      const id = data[0].id;
      this.deleteUser(id);
      return;
    }
  }

  actionComplete(args: DialogEditEventArgs): void {
    if (args.requestType === 'add') {
      args.dialog.width = 600;
        if (Browser.isDevice) {
            args!.dialog!.height = window.innerHeight - 90 + 'px';
            (<Dialog>args.dialog).dataBind();

        }

        const dialog = args.dialog;
        dialog.header = args.requestType === 'add' ? 'Add New User Register': '';

    }
  }

  createUser(formData: any) {
    this.spinner.show();
    this.service.createUser(formData)
    .subscribe({
      next: (_) => {
        this.showSuccess("Successfully registered!");
        this.loadTableData();
      },
      error: (err: HttpErrorResponse) => {
        this.spinner.hide();
        Swal.fire('User Register', err.message, 'error');
        this.loadTableData();
      }
    })
  }

  deleteUser(id: any) {
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
          .deleteUser(id)
          .pipe(catchError((err) => of(this.showError(err))))
          .subscribe((result) => {
            if (result.status == true) {
              this.showSuccess(result.messageContent);
              this.loadTableData();
            } else {
              this.spinner.hide();
              Swal.fire('User Register', result.messageContent, 'error');
            }
          });
      } else if (response.dismiss === Swal.DismissReason.cancel) {
        Swal.close();
      }
    });
  }

  validateControl(controlName: string) {
    const control = this.registerForm.get(controlName);
    return (control.invalid && (control.dirty || control.touched)) || (control.invalid && this.submitClicked);
  }

  hasError (controlName: string, errorName: string) {
    return this.registerForm.get(controlName).hasError(errorName)
  }

  showSuccess(msg: string) {
    this.spinner.hide();
    this.toastr.success(msg, 'User Register', {
      timeOut: 2000,
    });
  }

  showError(error: HttpErrorResponse) {
    this.spinner.hide();
    Swal.fire('User Register', error.toString(), 'error');
  }

  toolbarClick(args: ClickEventArgs): void {
    if(args.item.text === 'Excel Export') {
      this.grid.excelExport({
        fileName:'Users.xlsx'});
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

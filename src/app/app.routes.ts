import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './extrapages/page404/page404.component';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { LayoutComponent } from './layouts/layout.component';
import { LoginsComponent } from './logins/logins/logins.component';
import { AuthGuard } from './shared/guards/auth-guard';

export const routes: Routes = [
    { path: "auth", loadChildren: () =>import("./account/account.module").then((m) => m.AccountModule),},
    { path: 'logins', component: LoginsComponent },
    { path: "", component: LayoutComponent, loadChildren: () =>import("./pages/pages.module").then((m) => m.PagesModule),canActivate: [AuthGuard],},
    { path: "pages", loadChildren: () =>import("./extrapages/extrapages.module").then((m) => m.ExtrapagesModule), canActivate: [AuthGuard],},
    { path: "crypto-ico-landing", component: CyptolandingComponent },
    { path: "**", component: Page404Component },
];



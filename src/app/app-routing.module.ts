import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './root/auth/auth.guard';


// Components
import { HomeComponent } from './root/home/home.component';
import { ShellIndexComponent } from './root/shell/index/shell-index.component';
import { CarburantComponent } from './root/shell/carburant/carburant.component';
import { LubrifiantComponent } from './root/shell/lubrifiant/lubrifiant.component';
import { LoyerComponent } from './root/shell/loyer/loyer.component';
import { AnalyseComponent } from './root/shell/analyse/analyse.component';
import { AvoirComponent } from './root/shell/avoir/avoir.component';
import { FacturesComponent } from './root/shell/factures/factures.component';
import { BankIndexComponent } from './root/bank/index/bank-index/bank-index.component';
import { PrelevementsComponent } from './root/bank/prelevements/prelevements.component';
import { OperationsComponent } from './root/bank/operations/operations.component';
import { RegisterComponent } from './root/auth/register/register.component';
import { LoginComponent } from './root/auth/login/login.component';
import { StatementComponent } from './root/bank/statement/statement.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Public
  { path: 'auth/register', component: RegisterComponent },
  { path: 'auth/login', component: LoginComponent },

  // Protected
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  {
    path: 'shell',
    component: ShellIndexComponent,
    canActivate: [AuthGuard],          // 👈 protects all children
    children: [
      { path: 'factures', component: FacturesComponent },
      { path: 'avoir', component: AvoirComponent },
      { path: 'carburant', component: CarburantComponent },
      { path: 'lubrifiant', component: LubrifiantComponent },
      { path: 'loyer', component: LoyerComponent },
      { path: 'analyse', component: AnalyseComponent },
    ]
  },

  {
    path: 'bank',
    component: BankIndexComponent,
    canActivate: [AuthGuard],          // 👈 protects all children
    children: [
      { path: 'prelevements', component: PrelevementsComponent },
      { path: 'operations', component: OperationsComponent },
      { path: 'statement', component: StatementComponent },
    ]
  },

  { path: '**', redirectTo: 'auth/login' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

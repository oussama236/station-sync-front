import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SideMenuComponent } from './shared/components/commun/side-menu/side-menu.component';
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


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'shell',
    component: ShellIndexComponent,
    children: [
      {
        path: 'factures',
        component: FacturesComponent,
      },
      {
        path: 'avoir',
        component: AvoirComponent
      },
      {
        path: 'carburant',
        component: CarburantComponent
      },
      {
        path: 'lubrifiant',
        component: LubrifiantComponent
      },
      {
        path: 'loyer',
        component: LoyerComponent
      },
      {
        path: 'analyse',
        component: AnalyseComponent
      },
    ]
  },
  {
    path: 'bank',
    component: BankIndexComponent,
    children:[
      {
        path: 'prelevements',
        component: PrelevementsComponent
      },

      {
        path: 'operations',
        component: OperationsComponent
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

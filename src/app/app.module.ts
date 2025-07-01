import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/components/commun/nav-bar/nav-bar.component';
import { SideMenuComponent } from './shared/components/commun/side-menu/side-menu.component';
import { FooterComponent } from './shared/components/commun/footer/footer.component';
import { HomeComponent } from './root/home/home.component';
import { PopupLoadingComponent } from './shared/components/commun/popup-loading/popup-loading.component';
import { ShellIndexComponent } from './root/shell/index/shell-index.component';
import { CarburantComponent } from './root/shell/carburant/carburant.component';
import { ListCarburantComponent } from './root/shell/carburant/list-carburant/list-carburant.component';
import { EditCarburantComponent } from './root/shell/carburant/edit-carburant/edit-carburant.component';
import { BreadcrumbComponent } from './shared/components/commun/breadcrumb/breadcrumb.component';
import { LubrifiantComponent } from './root/shell/lubrifiant/lubrifiant.component';
import { LoyerComponent } from './root/shell/loyer/loyer.component';
import { AnalyseComponent } from './root/shell/analyse/analyse.component';
import { AvoirComponent } from './root/shell/avoir/avoir.component';
import { FacturesComponent } from './root/shell/factures/factures.component';
import { FiltersComponent } from './shared/components/filters/filters.component';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroModule } from './shared/modules/ng-zorro/ng-zorro.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal'; // ✅ IMPORT AJOUTÉ
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PrelevementsComponent } from './root/bank/prelevements/prelevements.component';
import { BankIndexComponent } from './root/bank/index/bank-index/bank-index.component';
import { FiltersPrelevementsComponent } from './shared/components/filtersPrelevements/filters-prelevements/filters-prelevements.component';
import { PrelevementSimulationModalComponent } from './root/bank/prelevements/prelevement-simulation-modal/prelevement-simulation-modal.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FacturesAssocieesModalComponent } from './root/bank/prelevements/factures-associees-modal/factures-associees-modal.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { OperationsComponent } from './root/bank/operations/operations.component';
import { FiltreOperationsComponent } from './shared/components/filtre-operations/filtre-operations.component';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NgChartsModule } from 'ng2-charts';

registerLocaleData(localeFr);



@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SideMenuComponent,
    FooterComponent,
    HomeComponent,
    PopupLoadingComponent,
    ShellIndexComponent,
    CarburantComponent,
    ListCarburantComponent,
    EditCarburantComponent,
    BreadcrumbComponent,
    LubrifiantComponent,
    LoyerComponent,
    AnalyseComponent,
    AvoirComponent,
    FacturesComponent,
    FiltersComponent,
    PrelevementsComponent,
    BankIndexComponent,
    FiltersPrelevementsComponent,
    PrelevementSimulationModalComponent,
    FacturesAssocieesModalComponent,
    OperationsComponent,
    FiltreOperationsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule, // ✅ AJOUTÉ ICI
    NgZorroModule,
    NzToolTipModule,
    NzTableModule,
    NzSwitchModule,
    NgChartsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

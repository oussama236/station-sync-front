import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// NG-ZORRO & Charts
import { NgZorroModule } from './shared/modules/ng-zorro/ng-zorro.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NgChartsModule } from 'ng2-charts';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


// Components
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
import { PrelevementsComponent } from './root/bank/prelevements/prelevements.component';
import { BankIndexComponent } from './root/bank/index/bank-index/bank-index.component';
import { FiltersPrelevementsComponent } from './shared/components/filtersPrelevements/filters-prelevements/filters-prelevements.component';
import { PrelevementSimulationModalComponent } from './root/bank/prelevements/prelevement-simulation-modal/prelevement-simulation-modal.component';
import { FacturesAssocieesModalComponent } from './root/bank/prelevements/factures-associees-modal/factures-associees-modal.component';
import { OperationsComponent } from './root/bank/operations/operations.component';
import { FiltreOperationsComponent } from './shared/components/filtre-operations/filtre-operations.component';
import { LoginComponent } from './root/auth/login/login.component';
import { RegisterComponent } from './root/auth/register/register.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { StatementComponent } from './root/bank/statement/statement.component';




registerLocaleData(localeFr);


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


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
    LoginComponent,
    RegisterComponent,
    StatementComponent,


  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, // ✅ pour [formGroup]
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzToolTipModule,
    NzTableModule,
    NzSwitchModule,
    NzTabsModule,
    NzBadgeModule,
    NgChartsModule,
    NgZorroModule,
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [  
    StatementComponent
  ],
})
export class AppModule {}

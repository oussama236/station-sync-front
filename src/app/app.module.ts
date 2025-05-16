import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './shared/components/commun/nav-bar/nav-bar.component';
import { SideMenuComponent } from './shared/components/commun/side-menu/side-menu.component';
import { FooterComponent } from './shared/components/commun/footer/footer.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HomeComponent } from './root/home/home.component';
import { PopupLoadingComponent } from './shared/components/commun/popup-loading/popup-loading.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ShellIndexComponent } from './root/shell/index/shell-index.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CarburantComponent } from './root/shell/carburant/carburant.component';
import { ListCarburantComponent } from './root/shell/carburant/list-carburant/list-carburant.component';
import { EditCarburantComponent } from './root/shell/carburant/edit-carburant/edit-carburant.component';
import { BreadcrumbComponent } from './shared/components/commun/breadcrumb/breadcrumb.component';
import { LubrifiantComponent } from './root/shell/lubrifiant/lubrifiant.component';
import { LoyerComponent } from './root/shell/loyer/loyer.component';
import { AnalyseComponent } from './root/shell/analyse/analyse.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AvoirComponent } from './root/shell/avoir/avoir.component';
import { FacturesComponent } from './root/shell/factures/factures.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FiltersComponent } from './shared/components/filters/filters.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroModule } from './shared/modules/ng-zorro/ng-zorro.module';
import { CommonModule } from '@angular/common';

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
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgZorroModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { EditOutline, DeleteOutline } from '@ant-design/icons-angular/icons';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FiltersPrelevementsComponent } from 'src/app/shared/components/filtersPrelevements/filters-prelevements/filters-prelevements.component';


@NgModule({
  declarations: [],
  imports: [
    NzIconModule.forRoot([EditOutline, DeleteOutline])  // <-- this line initializes the icons
  ],
  exports:[
    NzLayoutModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule,
    NzSpinModule,
    NzCardModule,
    NzSkeletonModule,
    NzCollapseModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzDividerModule,
    NzTagModule,
    NzTabsModule,
    NzFormModule,
    NzDatePickerModule,
    NzSpaceModule,
    NzButtonModule,
    NzRadioModule,
    NzDrawerModule,
    NzModalModule
  ]
})
export class NgZorroModule { }

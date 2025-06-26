import { Component, Inject } from '@angular/core';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';




@Component({
  selector: 'app-factures-associees-modal',
  templateUrl: './factures-associees-modal.component.html',
  styleUrls: ['./factures-associees-modal.component.scss']
})
export class FacturesAssocieesModalComponent {

  

  constructor(@Inject(NZ_MODAL_DATA) public data: any) {}

}

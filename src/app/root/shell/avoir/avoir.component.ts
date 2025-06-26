import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

@Component({
  selector: 'app-avoir',
  templateUrl: './avoir.component.html',
  styleUrls: ['./avoir.component.scss']
})
export class AvoirComponent implements OnInit {

  shells: any[] = [];
  loadingSpinner = false;
  selectedStatut: string = 'ALL';
  selectedStation: string = 'ALL';

  constructor(
    private shellApiService: ShellApiService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  stationOptions: string[] = ['ZAHRA', 'BOUMHAL'];

  ngOnInit(): void {
    this.fetchAvoirs();
  }

  editId: number | null = null;

  fetchAvoirs(): void {
    this.loadingSpinner = true;

    const statutParam = this.selectedStatut !== 'ALL' ? this.selectedStatut : null;
    const stationParam = this.selectedStation !== 'ALL' ? this.selectedStation : null;

    this.shellApiService.getAvoirsByStatutAndStation(statutParam, stationParam).subscribe({
      next: (data: any) => {
        this.shells = data.shells ?? [];
        this.loadingSpinner = false;
      },
      error: () => {
        this.shells = [];
        this.loadingSpinner = false;
      }
    });
  }

  onFiltersChanged(filters: { statut: string, station: string }) {
    this.selectedStatut = filters.statut;
    this.selectedStation = filters.station;
    this.fetchAvoirs();
  }

  deleteFacture(facture: any): void {
    this.modal.confirm({
      nzTitle: 'Confirmation de suppression',
      nzContent: `Voulez-vous vraiment supprimer la facture n° ${facture.numeroFacture} ?`,
      nzOkText: 'Oui',
      nzCancelText: 'Annuler',
      nzOkDanger: true,
      nzWidth: '500px',
      nzCentered: true,
      nzOnOk: () =>
        this.shellApiService.deleteFacture(facture.idShell).subscribe({
          next: () => {
            this.message.success('Facture supprimée avec succès');
            this.fetchAvoirs(); // ✅ remplacer loadShells()
          },
          error: () => {
            this.message.error('Erreur lors de la suppression');
          }
        })
    });
  }

  
  saveFacture(facture: any): void {
    if (!facture.idShell) return;
  
    this.shellApiService.updateShell(facture.idShell, facture).subscribe({
      next: () => {
        this.message.success('Facture mise à jour avec succès');
        this.editId = null; // ⛔ on sort du mode édition
        this.fetchAvoirs();  // 🔁 recharge les données mises à jour
      },
      error: (err) => {
        this.message.error('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }

  cancelEdit() {
    this.editId = null;
    // Optionally re-fetch data if you want to discard changes:
    // this.loadShells(); 
  }

}

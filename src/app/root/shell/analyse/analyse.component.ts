import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.scss']
})
export class AnalyseComponent implements OnInit {

  monthlyStats: any[] = [];

  // Données du graphique
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  // Options du graphique
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const countArray = (context.dataset as any).count || [];
            const index = context.dataIndex;
            const count = countArray[index] ?? 0;
            return `${label}: ${value} DT (${count} facture${count > 1 ? 's' : ''})`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Mois',
          color: 'black',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Montant total (DT)',
          color: 'black',
          font: {
            size: 16,
            weight: 'bold'
          }
        }
      }
    }
  };
  
  

  constructor(private shellService: ShellApiService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.shellService.getMonthlyStats().subscribe((data) => {
      this.monthlyStats = data;
      this.buildChartData(data);
    });
  }

  buildChartData(data: any[]): void {
    const ordreMois = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
  
    // Trier les données en fonction de l’ordre défini
    const dataTriee = data.sort((a, b) => {
      const [moisA, anneeA] = a.mois.split(' ');
      const [moisB, anneeB] = b.mois.split(' ');
      const indexMoisA = ordreMois.indexOf(moisA.toLowerCase());
      const indexMoisB = ordreMois.indexOf(moisB.toLowerCase());
    
      if (anneeA !== anneeB) {
        return parseInt(anneeA) - parseInt(anneeB);
      }
      return indexMoisA - indexMoisB;
    });
    
  
    const labels = dataTriee.map(stat => `${stat.mois} (${stat.totalMontant} DT)`);
    const avoirData: number[] = [];
    const carburantData: number[] = [];
    const lubrifiantData: number[] = [];
    const loyerData: number[] = [];
  
    dataTriee.forEach(stat => {
      avoirData.push(stat.details?.AVOIR?.montant || 0);
      carburantData.push(stat.details?.FACTURE_CARBURANT?.montant || 0);
      lubrifiantData.push(stat.details?.FACTURE_LUBRIFIANT?.montant || 0);
      loyerData.push(stat.details?.LOYER?.montant || 0);
    });
  
    this.barChartData = {
      labels,
      datasets: [
        {
          data: avoirData,
          label: 'AVOIR',
          backgroundColor: 'rgba(255,99,132,0.7)',
          count: dataTriee.map(stat => stat.details?.AVOIR?.count || 0) // ✅ ajouté
        } as any,
        {
          data: carburantData,
          label: 'Carburant',
          backgroundColor: 'rgba(54,162,235,0.7)',
          count: dataTriee.map(stat => stat.details?.FACTURE_CARBURANT?.count || 0)
        } as any,
        {
          data: lubrifiantData,
          label: 'Lubrifiant',
          backgroundColor: 'rgba(255,206,86,0.7)',
          count: dataTriee.map(stat => stat.details?.FACTURE_LUBRIFIANT?.count || 0)
        } as any,
        {
          data: loyerData,
          label: 'Loyer',
          backgroundColor: 'rgba(75,192,192,0.7)',
          count: dataTriee.map(stat => stat.details?.LOYER?.count || 0)
        } as any
      ]
    };
    
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ShellApiService } from 'src/app/shared/services/shell-api.service';

// ✅ Plugin pour afficher les pourcentages dans les parts
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { Chart } from 'chart.js';
Chart.register(DataLabelsPlugin); // Enregistrer le plugin

@Component({
  selector: 'app-analyse',
  templateUrl: './analyse.component.html',
  styleUrls: ['./analyse.component.scss']
})
export class AnalyseComponent implements OnInit {

  chartType: 'bar' | 'pie' = 'bar'; // 📊 par défaut on affiche le bar chart

  monthlyStats: any[] = [];
  availableMonths: string[] = []; // ✅ Liste des mois ayant des factures
  selectedMonth: string = '';     // ✅ Mois sélectionné dans le menu déroulant
  pieChartData: any;             // 📊 Données du pie chart
  pieChartOptions: any;          // ⚙️ Options du pie chart

  // Données du bar chart
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  // Options du bar chart
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
          title: function () {
            return ''; // ✅ Supprime la ligne du haut
          },
          label: function (context: any) {
            const label = context.dataset.label || '';
            const countArray = (context.dataset as any).count || [];
            const index = context.dataIndex;
            const count = countArray[index] ?? 0;
            return `${label}: ${count} facture${count > 1 ? 's' : ''}`;
          }
        }
      },
      datalabels: {
        color: 'black',        // ✅ Texte noir
        font: {
          weight: 'bold',      // ✅ En gras
          size: 13
        },
        formatter: function (value: number) {
          return value === 0 ? '' : `${value} DT`; // ✅ Pas de 0 affiché
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
        grid: {
          color: function (context: any) {
            return context.tick.value === 0 ? 'black' : 'rgba(0,0,0,0.1)';
          },
          lineWidth: function (context: any) {
            return context.tick.value === 0 ? 3 : 1;
          }
        },
        ticks: {
          color: 'black',
          font: {
            size: 14,
            weight: 'bold'
          },
          callback: function (value: any) {
            return `${value} DT`;
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

      // ✅ Liste des mois qui ont au moins une facture
      this.availableMonths = data
        .filter(stat => Object.values(stat.details || {}).some((detail: any) => detail.count > 0))
        .map(stat => stat.mois);

      // ✅ Trier la liste en ordre croissant (mai 2025 -> juin 2025 …)
      const ordreMois = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
      this.availableMonths.sort((a, b) => {
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const diffYear = parseInt(yearA) - parseInt(yearB);
        if (diffYear !== 0) return diffYear;
        return ordreMois.indexOf(monthA) - ordreMois.indexOf(monthB);
      });

      // ✅ Trouver le mois actuel (ex: "juillet 2025")
      const now = new Date();
      const moisActuel = ordreMois[now.getMonth()] + ' ' + now.getFullYear();

      // ✅ Si le mois actuel existe dans la liste => le sélectionner, sinon prendre le premier
      if (this.availableMonths.includes(moisActuel)) {
        this.selectedMonth = moisActuel;
      } else if (this.availableMonths.length > 0) {
        this.selectedMonth = this.availableMonths[0];
      }

      if (this.selectedMonth) {
        this.buildPieChartForMonth(this.selectedMonth);
      }

      this.buildChartData(data);
    });
  }

  buildChartData(data: any[]): void {
    const ordreMois = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];

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
      avoirData.push((stat.details?.AVOIR?.montant || 0) * -1);
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
          count: dataTriee.map(stat => stat.details?.AVOIR?.count || 0)
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

  buildPieChartForMonth(mois: string): void {
    const selectedStat = this.monthlyStats.find(stat => stat.mois === mois);

    if (!selectedStat) {
      this.pieChartData = null;
      return;
    }

    this.pieChartData = {
      labels: ['Avoir', 'Carburant', 'Lubrifiant', 'Loyer'],
      datasets: [{
        data: [
          selectedStat.details?.AVOIR?.montant || 0,
          selectedStat.details?.FACTURE_CARBURANT?.montant || 0,
          selectedStat.details?.FACTURE_LUBRIFIANT?.montant || 0,
          selectedStat.details?.LOYER?.montant || 0
        ],
        backgroundColor: [
          'rgba(255,99,132,0.7)',
          'rgba(54,162,235,0.7)',
          'rgba(255,206,86,0.7)',
          'rgba(75,192,192,0.7)'
        ]
      }]
    };

    this.pieChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: false, // ✅ Supprime la légende Chart.js
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} DT (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: '#000',
          font: {
            weight: 'bold',
            size: 12
          },
          formatter: (value: number, ctx: any) => {
            const total = ctx.chart.data.datasets[0].data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return parseFloat(percentage) < 1 ? '' : `${percentage}%`;
          }
        }
      }
    };
  }
}

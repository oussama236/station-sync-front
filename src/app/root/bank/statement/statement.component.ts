import { Component, OnInit } from '@angular/core';
import { BankApiService } from 'src/app/shared/services/bank-api.service';

type Row = { credit?: any; debit?: any };

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {

  credits: any[] = [];
  debits: any[] = [];
  rows: Row[] = [];
  loading = false;
  error: string | null = null;

  constructor(private bankApiService: BankApiService) {}

  ngOnInit(): void {
    this.loadStatement();
  }

  loadStatement(): void {
    this.loading = true;
    this.bankApiService.getBankStatement().subscribe({
      next: (res) => {
        this.credits = (res?.credits || []);
        this.debits  = (res?.debits  || []);
        this.normalizeSortAndBuildRows();
        this.loading = false;
      },
      error: () => { this.error = 'Erreur de chargement du relevé'; this.loading = false; }
    });
  }

  private normalizeSortAndBuildRows() {
    // Normalize to Date and keep original objects
    const toKey = (d: any) => {
      const t = new Date(d.dateOperation);
      // yyyy-MM-dd key
      const pad = (n: number) => n.toString().padStart(2,'0');
      return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`;
    };

    // Group by date key
    const cMap = new Map<string, any[]>();
    const dMap = new Map<string, any[]>();
    this.credits.forEach(c => {
      const k = toKey(c); if (!cMap.has(k)) cMap.set(k, []);
      cMap.get(k)!.push(c);
    });
    this.debits.forEach(d => {
      const k = toKey(d); if (!dMap.has(k)) dMap.set(k, []);
      dMap.get(k)!.push(d);
    });

    // Sort items inside each date (optional by montant or created order)
    for (const v of cMap.values()) v.sort((a,b)=>+new Date(a.dateOperation)-+new Date(b.dateOperation));
    for (const v of dMap.values()) v.sort((a,b)=>+new Date(a.dateOperation)-+new Date(b.dateOperation));

    // Sorted union of all dates
    const allKeys = Array.from(new Set([...cMap.keys(), ...dMap.keys()]))
      .sort();

    const out: Row[] = [];

    // For each date, pair 1–1; extras go to their own rows
    for (const k of allKeys) {
      const cs = cMap.get(k) ?? [];
      const ds = dMap.get(k) ?? [];
      const pairs = Math.min(cs.length, ds.length);

      // pair first
      for (let i = 0; i < pairs; i++) out.push({ credit: cs[i], debit: ds[i] });

      // remaining credits (no debit same day)
      for (let i = pairs; i < cs.length; i++) out.push({ credit: cs[i] });

      // remaining debits (no credit same day)
      for (let i = pairs; i < ds.length; i++) out.push({ debit: ds[i] });
    }

    this.rows = out;
  }

  totalCredits(): number {
    return this.credits.reduce((sum, c) => sum + (c.montant || 0), 0);
  }
  totalDebits(): number {
    return this.debits.reduce((sum, d) => sum + (d.montant || 0), 0);
  }
  getBalance(): number {
    return this.totalCredits() - this.totalDebits();
  }
}

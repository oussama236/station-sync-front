import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AiApiService } from 'src/app/shared/services/ai.service';
import { AiNlQueryRequest, AiNlQueryResponse, ContextTable } from 'src/app/shared/models/ai-nl.types';

// lightweight chart model (no libs)
type MiniChart = { title: string; labels: string[]; values: number[]; max: number };

@Component({
  selector: 'app-ai-analysis',
  templateUrl: './ai-analysis.component.html',
  styleUrls: ['./ai-analysis.component.scss']
})
export class AiAnalysisComponent {
  // chips
  contexts: { key: ContextTable; label: string }[] = [
    { key: 'shell',       label: 'Shell' },
    { key: 'banque',      label: 'Banque' },
    { key: 'prelevement', label: 'Prélèvements' }
  ];
  selected?: ContextTable;

  // ask bar
  question = '';
  loading = false;

  // result + history
  result?: AiNlQueryResponse;
  history: { ctx: ContextTable; question: string; response: AiNlQueryResponse; at: Date }[] = [];

  // auto-chart
  chart?: MiniChart;

 

  constructor(
    private ai: AiApiService,
    private msg: NzMessageService
  ) {}

  pick(ctx: ContextTable) {
    this.selected = ctx;
  }

  useSuggestion(s: string) {
    this.question = s;
  }

  disabledAsk(): boolean {
    return !this.selected || !this.question.trim() || this.loading;
  }

  // Always execute on backend; no demo mode & no SQL shown
  ask() {
    if (this.disabledAsk()) return;
    this.loading = true;

    const body: AiNlQueryRequest = {
      question: this.question.trim(),
      contextTable: this.selected,
      execute: true
    };

    this.ai.nlQuery(body).subscribe({
      next: (res: AiNlQueryResponse) => {
        this.result = res;
        this.history.unshift({
          ctx: this.selected!,
          question: body.question,
          response: res,
          at: new Date()
        });
        this.chart = this.buildChartFromResult(res);
        this.loading = false;
        this.msg.success(`Résultats: ${res.rowCount} ligne(s)`);
      },
      error: (error) => {
        this.result = undefined;
        this.chart = undefined;
        this.loading = false;
      
        if (error.status === 503) {
          this.msg.warning(error?.error?.message || 'Le service AI est temporairement indisponible. Veuillez réessayer plus tard.');
          return;
        }
      
        this.msg.error('Erreur lors de la requête IA');
      }
    });
  }

  hasRows(): boolean {
    return !!this.result && this.result.rowCount > 0 && this.result.rowsPreview?.length > 0;
  }

  colKeys(): string[] {
    if (!this.hasRows()) return [];
    return Object.keys(this.result!.rowsPreview[0]);
  }

  clear() {
    this.result = undefined;
    this.chart = undefined;
    this.question = '';
  }

  getKeysFromFirstRow(rows: Array<Record<string, any>>): string[] {
    if (!rows || rows.length === 0) return [];
    return Object.keys(rows[0]);
  }

  // Enter sends; Shift+Enter = newline
  onEnter(e: Event) {
    const ev = e as KeyboardEvent;
    if (!ev.shiftKey) {
      this.ask();
      ev.preventDefault();
    }
  }

  // ===== Auto-chart builder (pure heuristic, no lib) =====
  private buildChartFromResult(res: AiNlQueryResponse | undefined): MiniChart | undefined {
    if (!res || !res.rowsPreview || res.rowsPreview.length === 0) return undefined;

    // label & value preferences
    const labelCandidates = ['date_operation', 'dateOperation', 'station', 'nature_operation', 'natureOperation'];
    const valueCandidates = ['montant', 'total', 'sum', 'count', 'nb', 'value'];

    const sample = res.rowsPreview[0];
    const keys = Object.keys(sample);

    const labelKey = labelCandidates.find(k => keys.includes(k)) ?? this.findFirstStringKey(keys, sample);
    const valueKey = valueCandidates.find(k => keys.includes(k)) ?? this.findFirstNumericKey(keys, sample);
    if (!labelKey || !valueKey) return undefined;

    // aggregate by label
    const map = new Map<string, number>();
    for (const row of res.rowsPreview) {
      const rawLabel = row[labelKey];
      const label = this.prettyLabel(rawLabel);
      const v = Number(row[valueKey]);
      if (!isFinite(v)) continue;
      map.set(label, (map.get(label) ?? 0) + v);
    }
    if (map.size === 0) return undefined;

    // sort (date asc if all dates, else by value desc)
    const entries = Array.from(map.entries());
    const allDates = entries.every(([lbl]) => !Number.isNaN(Date.parse(lbl)));
    if (allDates) {
      entries.sort((a, b) => Date.parse(a[0]) - Date.parse(b[0]));
    } else {
      entries.sort((a, b) => b[1] - a[1]);
    }

    const labels = entries.map(e => e[0]);
    const values = entries.map(e => e[1]);
    const max = Math.max(...values);
    const title = this.makeChartTitle(labelKey, valueKey);
    return { title, labels, values, max };
  }

  private findFirstStringKey(keys: string[], row: Record<string, any>): string | undefined {
    return keys.find(k => typeof row[k] === 'string');
  }
  private findFirstNumericKey(keys: string[], row: Record<string, any>): string | undefined {
    return keys.find(k => typeof row[k] === 'number');
  }
  private prettyLabel(v: any): string {
    if (v == null) return '';
    const s = String(v);
    if (!Number.isNaN(Date.parse(s))) return s.slice(0, 10);
    return s;
  }
  private makeChartTitle(labelKey: string, valueKey: string): string {
    const label = this.friendlyName(labelKey);
    const val = this.friendlyName(valueKey);
    return `${val} par ${label}`;
    }
  private friendlyName(key: string): string {
    const map: Record<string, string> = {
      date_operation: 'date', dateOperation: 'date',
      station: 'station',
      nature_operation: 'nature', natureOperation: 'nature',
      montant: 'montant', total: 'total', sum: 'somme',
      count: 'compte', nb: 'nombre', value: 'valeur'
    };
    return map[key] ?? key;
  }

  cleanAnswer(raw: string): string {
    if (!raw) return '';
    return raw
      // Generic bracket patterns
      .replace(/<s>|<\/s>/g, '')
      .replace(/\[\/?(OUT|OST|THOUGHT|INTERNAL|SYS|RESULT|ANSWER)\]/g, '')
      .trim();
  }
  
  
}

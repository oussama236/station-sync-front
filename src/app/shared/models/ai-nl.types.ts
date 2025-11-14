export type ContextTable = 'shell' | 'banque' | 'prelevement';

export interface AiNlQueryRequest {
  question: string;
  contextTable?: ContextTable;
  execute?: boolean;
}

export interface AiNlQueryResponse {
  answerText: string;
  sql: string;
  executed: boolean;
  rowCount: number;
  rowsPreview: Array<Record<string, any>>;
}

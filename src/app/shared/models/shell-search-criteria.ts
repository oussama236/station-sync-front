export interface ShellSearchCriteria {
    exactDateOperation?: string;
    startDateOperation?: string;
    endDateOperation?: string;
    exactMontant?: number;
    minMontant?: number;
    maxMontant?: number;
    natures?: string[];
    statuts?: string[];
    stations?: string[];
    numeroFacture?: string;
    exactDatePrelevement?: string;
    startDatePrelevement?: string;
    endDatePrelevement?: string;
  }
  
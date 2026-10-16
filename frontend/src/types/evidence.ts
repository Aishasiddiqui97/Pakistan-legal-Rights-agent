export type LegalJurisdiction = 'sindh' | 'federal' | 'punjab' | 'kpk' | 'balochistan';

export type LegalTopic =
  | 'tenancy'
  | 'employment'
  | 'consumer'
  | 'family'
  | 'criminal_procedure'
  | 'constitutional'
  | 'general';

export type EvidenceConfidence =
  | 'verified-statute'
  | 'judicial-precedent'
  | 'general-guidance'
  | 'insufficient-evidence';

export interface LegalCitation {
  id: string;
  actTitle: string;
  shortTitle: string;
  section: string;
  enactmentYear: number;
  jurisdiction: LegalJurisdiction;
  verbatimExcerpt?: string;
  explanatoryNote: string;
  officialGazetteRef?: string;
}

export interface EvidenceSnippet {
  id: string;
  sourceDocument: string;
  sectionReference: string;
  snippetText: string;
  relevanceConfidence: number; // 0.0 to 1.0
  pageOrArticle?: string;
}

export interface LegalDisclaimer {
  title: string;
  notice: string;
  isLegalAdvice: false;
}

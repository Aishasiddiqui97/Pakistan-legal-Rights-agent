import { LegalCitation, EvidenceSnippet, LegalTopic } from '@/types/evidence';
import { ConversationSummary } from '@/types/chat';

export const SINDH_STATUTORY_CITATIONS: Record<string, LegalCitation> = {
  sindh_rented_premises_s15: {
    id: 'sindh-rent-s15',
    actTitle: 'The Sindh Rented Premises Ordinance, 1979',
    shortTitle: 'SRPO 1979',
    section: 'Section 15',
    enactmentYear: 1979,
    jurisdiction: 'sindh',
    officialGazetteRef: 'Sindh Govt. Gazette, Extr., Pt. I, p. 1150',
    verbatimExcerpt:
      'No landlord shall evict a tenant except under the provisions of this Ordinance. An application for eviction must be preferred before the Rent Controller having local jurisdiction on grounds of default, subletting, personal bona fide need, or impairment of property value.',
    explanatoryNote:
      'Under Pakistan law, a landlord cannot unilaterally force a tenant out, change door locks, or disconnect utility lines (water, gas, electricity). Eviction is strictly illegal without an eviction decree from the competent Rent Controller.',
  },
  sindh_rented_premises_s8: {
    id: 'sindh-rent-s8',
    actTitle: 'The Sindh Rented Premises Ordinance, 1979',
    shortTitle: 'SRPO 1979',
    section: 'Section 8',
    enactmentYear: 1979,
    jurisdiction: 'sindh',
    explanatoryNote:
      'Limits rent escalation. Landlord cannot arbitrarily increase rent during the tenancy term unless 3 years have elapsed or major improvements were made with written mutual consent.',
  },
  sindh_industrial_relations_s33: {
    id: 'sindh-ira-s33',
    actTitle: 'The Sindh Industrial Relations Act, 2013',
    shortTitle: 'SIRA 2013',
    section: 'Section 33',
    enactmentYear: 2013,
    jurisdiction: 'sindh',
    officialGazetteRef: 'Sindh Act No. XXIX of 2013',
    verbatimExcerpt:
      'A worker may bring his grievance in respect of any right guaranteed or secured to him by or under any law or any award or settlement for the time being in force to the notice of his employer in writing within ninety days of the day on which the cause of such grievance arises.',
    explanatoryNote:
      'Statutory redressal of worker grievances. Requires a formal Grievance Notice within 90 days. If the employer fails to redress within 15 days, the worker may petition the Labour Court within 30 days.',
  },
  sindh_consumer_protection_s11: {
    id: 'sindh-cpa-s11',
    actTitle: 'The Sindh Consumer Protection Act, 2014',
    shortTitle: 'SCPA 2014',
    section: 'Section 11 & Section 27',
    enactmentYear: 2014,
    jurisdiction: 'sindh',
    officialGazetteRef: 'Sindh Act No. IV of 2015',
    verbatimExcerpt:
      'Any consumer who has suffered damage, injury or financial loss arising from defective products or deficient services may file a claim before the Consumer Protection Court within thirty days of the cause of action.',
    explanatoryNote:
      'Consumer Protection Courts operate across Pakistan to adjudicate defective product claims, deceptive advertising, and lack of warranties.',
  },
  sindh_terms_employment_s12: {
    id: 'sindh-soe-s12',
    actTitle: 'The Sindh Terms of Employment (Standing Orders) Act, 2015',
    shortTitle: 'STEO 2015',
    section: 'Standing Order 12',
    enactmentYear: 2015,
    jurisdiction: 'sindh',
    explanatoryNote:
      'Mandates that services of a permanent workman shall not be terminated without one month’s notice in writing or one month’s pay in lieu of notice, accompanied by explicit written reasons.',
  },
  constitution_art4_10a: {
    id: 'const-art4-10a',
    actTitle: 'The Constitution of the Islamic Republic of Pakistan, 1973',
    shortTitle: 'Constitution 1973',
    section: 'Articles 4 & 10-A',
    enactmentYear: 1973,
    jurisdiction: 'federal',
    verbatimExcerpt:
      'Article 4 guarantees the right of individuals to be dealt with in accordance with law. Article 10-A guarantees that for the determination of his civil rights or in any criminal charge against him a person shall be entitled to a fair trial and due process.',
    explanatoryNote:
      'Fundamental constitutional protection preventing arbitrary state or executive action without legal authorization and fair hearing.',
  },
};

export interface LegalAnswerPreset {
  topic: LegalTopic;
  keywords: string[];
  summary: string;
  analysis: string;
  citations: LegalCitation[];
  evidenceSnippets: EvidenceSnippet[];
  nextSteps: string[];
  suggestedQuestions: string[];
}

export const SINDH_LEGAL_KNOWLEDGE_BASE: LegalAnswerPreset[] = [
  {
    topic: 'tenancy',
    keywords: ['evict', 'landlord', 'tenant', 'rent', 'agreement', 'karachi', 'hyderabad', 'flat', 'deposit'],
    summary:
      'Under statutory rent restriction laws, a landlord in Pakistan cannot arbitrarily evict a tenant or disconnect utility connections without an order from the Rent Controller.',
    analysis:
      'In Pakistan, residential and commercial tenancies are strictly regulated by statutory rent restriction laws. Key protections include:\n\n1. **No Forced Self-Help Eviction**: Section 15 mandates that an eviction can only be carried out through an application filed before the competent Rent Controller. Threatening physical eviction, changing locks, or withholding water/electricity is an offense under Section 11 punishable with fines or imprisonment.\n\n2. **Statutory Grounds for Eviction**: An application for ejectment succeeds only upon specific proven grounds: default in paying rent within 60 days of due date (or 15 days if a written agreement specifies), subletting without written consent, damage to property, or verified personal bona fide need of the landlord.\n\n3. **Deposit & Rent Increase**: Rent cannot be increased arbitrarily within three years of execution unless substantial renovations were carried out by agreement.',
    citations: [
      SINDH_STATUTORY_CITATIONS.sindh_rented_premises_s15,
      SINDH_STATUTORY_CITATIONS.sindh_rented_premises_s8,
    ],
    evidenceSnippets: [
      {
        id: 'snip-rent-1',
        sourceDocument: 'The Sindh Rented Premises Ordinance, 1979',
        sectionReference: 'Section 15(1) & 15(2)',
        snippetText:
          'A landlord may apply to the Controller for an order directing the tenant to put the landlord in possession if the tenant has failed to pay rent, sublet without permission, or used premises for purpose other than that for which let.',
        relevanceConfidence: 0.96,
        pageOrArticle: 'Section 15',
      },
    ],
    nextSteps: [
      'Demand all rent receipts or maintain bank transfer slips showing timely payment.',
      'If the landlord shuts off water or power, file an immediate miscellaneous application before the local Rent Controller under Section 11 of SRPO 1979 for immediate restoration.',
      'Never abandon premises upon oral threats; wait for formal legal summons served by court bailiff.',
      'Consult a practicing advocate of the High Court or Bar Association if a notice to quit is served.',
    ],
    suggestedQuestions: [
      'What if my landlord refused to accept rent directly to cause default?',
      'How does the Rent Controller determine personal bona fide need?',
      'Can a landlord increase rent by 25% every year in Pakistan?',
    ],
  },
  {
    topic: 'employment',
    keywords: ['job', 'employment', 'salary', 'termination', 'overtime', 'gratuity', 'worker', 'labour', 'notice'],
    summary:
      'Under the Sindh Terms of Employment Act 2015 and the Sindh Industrial Relations Act 2013, workers cannot be terminated verbally without written justification and statutory notice.',
    analysis:
      'Labour rights in Pakistan are governed by post-18th Amendment enactments:\n\n1. **Written Termination Order**: Standing Order 12 requires that every termination of employment (whether dismissal, retrenchment, or discharge) must be recorded in writing stating explicit, objective reasons. A verbal "you are fired" has zero legal validity.\n\n2. **Notice Period or Pay**: Permanent workmen must be granted 30 days’ notice in writing or 30 days’ wages in lieu thereof.\n\n3. **Grievance Redressal Procedure**: If your rights or statutory dues (gratuity, earned leave, provident fund) are withheld, Section 33 provides a strict timeline: send a written Grievance Notice to management within 90 days of the violation. If management does not respond or refuses within 15 days, you have 30 days to petition the Labour Court.',
    citations: [
      SINDH_STATUTORY_CITATIONS.sindh_terms_employment_s12,
      SINDH_STATUTORY_CITATIONS.sindh_industrial_relations_s33,
    ],
    evidenceSnippets: [
      {
        id: 'snip-labour-1',
        sourceDocument: 'Sindh Industrial Relations Act, 2013',
        sectionReference: 'Section 33(1)',
        snippetText:
          'A worker may bring his grievance in respect of any right guaranteed or secured to him by or under any law to the notice of his employer in writing within ninety days.',
        relevanceConfidence: 0.94,
        pageOrArticle: 'Sindh Act XXIX of 2013',
      },
    ],
    nextSteps: [
      'Preserve appointment letter, salary slips, bank statements, and attendance records.',
      'Draft and dispatch a formal Section 33 Grievance Notice via registered post with acknowledgment due (RPAD) within 90 days.',
      'File a grievance petition before the territorial Labour Court if redressal fails.',
    ],
    suggestedQuestions: [
      'What is the formula for gratuity calculation in Pakistan?',
      'Are contract and third-party agency workers covered under Pakistan Labour laws?',
      'How do I file a petition before the Labour Court?',
    ],
  },
  {
    topic: 'consumer',
    keywords: ['consumer', 'defective', 'warranty', 'refund', 'cheat', 'fraud', 'service', 'complaint'],
    summary:
      'Consumer Protection Acts grant consumers the statutory right to seek full refund, replacement, and compensation before dedicated Consumer Courts across Pakistan.',
    analysis:
      'Consumer rights are enforced through dedicated Consumer Protection Courts across Pakistan:\n\n1. **Statutory Warranty & Defect Liability**: Manufacturers and service providers are strictly liable for defective products, false product claims, and deficient services under statutory consumer protection laws.\n\n2. **Mandatory 15-Day Legal Notice**: Prior to filing a claim before the Consumer Court, the aggrieved consumer must issue a formal written notice to the vendor/manufacturer giving them 15 days to rectify the defect or reimburse the damages.\n\n3. **Consumer Court Adjudication**: If the seller fails to comply, a formal complaint can be filed before the Consumer Court within 30 days of the cause of action. Filing in Consumer Court does not require hefty court fees.',
    citations: [SINDH_STATUTORY_CITATIONS.sindh_consumer_protection_s11],
    evidenceSnippets: [
      {
        id: 'snip-cons-1',
        sourceDocument: 'Sindh Consumer Protection Act, 2014',
        sectionReference: 'Section 27 & 28',
        snippetText:
          'The Consumer Court may direct the defendant to remove defect, replace the goods with new goods of similar description, or return the price or charges paid.',
        relevanceConfidence: 0.95,
        pageOrArticle: 'Sindh Act IV of 2015',
      },
    ],
    nextSteps: [
      'Collect the retail invoice, warranty card, payment receipt, and photographs/videos of the defect.',
      'Issue a written legal notice to the vendor with postal proof.',
      'Lodge a petition before the District Consumer Protection Court.',
    ],
    suggestedQuestions: [
      'Can I sue an e-commerce platform for delivering damaged goods in Pakistan?',
      'What compensation can the Consumer Court award for faulty medical or airline services in Pakistan?',
    ],
  },
];

export const INITIAL_MOCK_CONVERSATIONS: ConversationSummary[] = [
  {
    id: 'conv-101',
    title: 'Tenant Eviction & Utility Disconnection in Clifton, Karachi',
    lastMessagePreview:
      'Under Section 15 & 11 of the Sindh Rented Premises Ordinance 1979, the landlord cannot disconnect water or electricity...',
    jurisdiction: 'sindh',
    topic: 'tenancy',
    messageCount: 4,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'conv-102',
    title: 'Unlawful Termination Without 30-Day Notice in Korangi Industrial Area',
    lastMessagePreview:
      'Standing Order 12 requires a written order stating explicit reasons. Send a Section 33 grievance notice within 90 days...',
    jurisdiction: 'sindh',
    topic: 'employment',
    messageCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
  },
];

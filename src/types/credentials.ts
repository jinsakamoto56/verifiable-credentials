export interface CredentialSubject {
  id: string;
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  dateOfBirth: string;
  nationality: string;
  languages: string[];
  netWorth?: number;
  agePredicate?: boolean;
  netWorthPredicate?: boolean;
}

export interface VerifiableCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: CredentialSubject | PartialCredentialSubject;
  proof?: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    proofValue: string;
  };
}

export interface SelectiveDisclosureOptions {
  showKycStatus?: boolean;
  showDateOfBirth?: boolean;
  showNationality?: boolean;
  showLanguages?: boolean;
  showNetWorth?: boolean;
  agePredicate?: number;
  netWorthPredicate?: number;
}

export interface PresentationRequest {
  type: 'FULL' | 'SELECTIVE' | 'PREDICATE';
  options: SelectiveDisclosureOptions;
}

export interface PartialCredentialSubject {
  id?: string;
  kycStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  dateOfBirth?: string;
  nationality?: string;
  languages?: string[];
  netWorth?: number;
  agePredicate?: boolean;
  netWorthPredicate?: boolean;
} 
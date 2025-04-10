import type { VerifiableCredential, CredentialSubject, SelectiveDisclosureOptions, PartialCredentialSubject } from '../types/credentials';

// For demo purposes, we'll simulate the VC operations without actual dependencies
export class CredentialService {
  private issuer: string;

  constructor() {
    this.issuer = 'did:example:123456789';
  }

  async issueCredential(subject: CredentialSubject): Promise<VerifiableCredential> {
    const credential: VerifiableCredential = {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/example/v1'
      ],
      type: ['VerifiableCredential', 'ExampleCredential'],
      issuer: this.issuer,
      issuanceDate: new Date().toISOString(),
      credentialSubject: subject
    };

    // In a real implementation, we would sign the credential here
    // For demo purposes, we'll simulate the proof
    credential.proof = {
      type: 'EcdsaSecp256k1Signature2019',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: `${this.issuer}#keys-1`,
      proofValue: 'simulated_proof_value'
    };

    return credential;
  }

  async createSelectivePresentation(
    credential: VerifiableCredential,
    options: SelectiveDisclosureOptions
  ): Promise<Partial<VerifiableCredential>> {
    const presentation: Partial<VerifiableCredential> = {
      '@context': credential['@context'],
      type: ['VerifiablePresentation', 'ExamplePresentation'],
      issuer: credential.issuer,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {} as PartialCredentialSubject
    };

    const subject = presentation.credentialSubject as PartialCredentialSubject;
    subject.id = credential.credentialSubject.id;

    if (options.showKycStatus) {
      subject.kycStatus = credential.credentialSubject.kycStatus;
    }

    if (options.showDateOfBirth) {
      subject.dateOfBirth = credential.credentialSubject.dateOfBirth;
    }

    if (options.showNationality) {
      subject.nationality = credential.credentialSubject.nationality;
    }

    if (options.showLanguages) {
      subject.languages = credential.credentialSubject.languages;
    }

    if (options.showNetWorth) {
      subject.netWorth = credential.credentialSubject.netWorth;
    }

    // Add predicate proofs if requested
    if (options.agePredicate && 'dateOfBirth' in credential.credentialSubject && credential.credentialSubject.dateOfBirth) {
      const dob = new Date(credential.credentialSubject.dateOfBirth);
      const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      subject.agePredicate = age >= options.agePredicate;
    }

    if (options.netWorthPredicate && 'netWorth' in credential.credentialSubject && credential.credentialSubject.netWorth !== undefined) {
      subject.netWorthPredicate = 
        credential.credentialSubject.netWorth >= options.netWorthPredicate;
    }

    return presentation;
  }

  async verifyCredential(credential: VerifiableCredential): Promise<{ verified: boolean; errors?: string[] }> {
    const errors: string[] = [];

    // 1. Verify the credential structure
    if (!credential['@context'] || !Array.isArray(credential['@context'])) {
      errors.push('Invalid @context');
    }

    if (!credential.type || !Array.isArray(credential.type)) {
      errors.push('Invalid type');
    }

    if (!credential.issuer) {
      errors.push('Missing issuer');
    }

    if (!credential.issuanceDate) {
      errors.push('Missing issuanceDate');
    }

    if (!credential.credentialSubject) {
      errors.push('Missing credentialSubject');
    }

    // 2. Verify the proof
    if (!credential.proof) {
      errors.push('Missing proof');
    } else {
      // In a real implementation, we would verify the cryptographic proof here
      // For demo purposes, we'll just check if it's our simulated proof
      if (credential.proof.proofValue !== 'simulated_proof_value') {
        errors.push('Invalid proof');
      }

      // Verify the proof was created by our issuer
      if (credential.proof.verificationMethod !== `${this.issuer}#keys-1`) {
        errors.push('Proof verification method mismatch');
      }
    }

    // 3. Verify the credential subject
    const subject = credential.credentialSubject;
    if ('id' in subject && !subject.id) {
      errors.push('Invalid subject ID');
    }

    if ('kycStatus' in subject && subject.kycStatus && !['VERIFIED', 'PENDING', 'REJECTED'].includes(subject.kycStatus)) {
      errors.push('Invalid KYC status');
    }

    if ('dateOfBirth' in subject && subject.dateOfBirth && !this.isValidDate(subject.dateOfBirth)) {
      errors.push('Invalid date of birth');
    }

    if ('nationality' in subject && typeof subject.nationality !== 'string') {
      errors.push('Invalid nationality');
    }

    if ('languages' in subject && (!Array.isArray(subject.languages) || !subject.languages.every(lang => typeof lang === 'string'))) {
      errors.push('Invalid languages');
    }

    if ('netWorth' in subject && subject.netWorth !== undefined && typeof subject.netWorth !== 'number') {
      errors.push('Invalid net worth');
    }

    return {
      verified: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}

module.exports = { CredentialService }; 
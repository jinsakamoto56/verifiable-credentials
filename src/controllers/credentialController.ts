import type { Request, Response } from 'express';
import type { CredentialSubject, SelectiveDisclosureOptions, VerifiableCredential } from '../types/credentials';
const { CredentialService } = require('../services/credentialService');

class CredentialController {
  private credentialService: any;

  constructor() {
    this.credentialService = new CredentialService();
  }

  async issueCredential(req: Request, res: Response) {
    try {
      const subject = req.body as CredentialSubject;
      const credential = await this.credentialService.issueCredential(subject);
      res.json(credential);
    } catch (error) {
      res.status(400).json({ error: 'Failed to issue credential' });
    }
  }

  async createPresentation(req: Request, res: Response) {
    try {
      const { credential, options } = req.body;
      const presentation = await this.credentialService.createSelectivePresentation(credential, options);
      res.json(presentation);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create presentation' });
    }
  }

  async verifyCredential(req: Request, res: Response) {
    try {
      const credential = req.body as VerifiableCredential;
      const result = await this.credentialService.verifyCredential(credential);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: 'Failed to verify credential' });
    }
  }
}

module.exports = { CredentialController }; 
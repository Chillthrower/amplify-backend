import {
  BackendSecret,
  UniqueBackendIdentifier,
} from '@aws-amplify/plugin-types';
import { Construct } from 'constructs';
import { SecretValue } from 'aws-cdk-lib';
import { BackendSecretFetcherFactory } from './backend_secret_fetcher_factory.js';

/**
 * Resolves a backend secret to a CFN token via a lambda-backed CFN custom resource.
 */
export class CfnTokenBackendSecret implements BackendSecret {
  /**
   * The name of the secret to fetch.
   */
  constructor(
    private readonly name: string,
    private readonly version: number,
    private readonly secretResourceFactory: BackendSecretFetcherFactory
  ) {}
  /**
   * Get a reference to the value within a CDK scope.
   */
  resolve = (
    scope: Construct,
    backendIdentifier: UniqueBackendIdentifier
  ): SecretValue => {
    const secretResource = this.secretResourceFactory.getOrCreate(
      scope,
      this.name,
      this.version,
      backendIdentifier
    );

    const val = secretResource.getAttString('secretValue');
    return SecretValue.unsafePlainText(val); // safe since 'val' is a cdk token.
  };
}
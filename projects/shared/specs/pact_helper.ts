import { InteractionObject, PactWeb } from '@pact-foundation/pact-web';
import { term } from '@pact-foundation/pact/dsl/matchers';
import { Observable } from 'rxjs';

declare const __karma__: any;

/**
 * Provides integration between Pact and Jasmine.
 */
export class PactTest {
  provider: PactWeb;

  constructor(providerName: string) {
    this.provider = new PactWeb({
      provider: '',
      consumer: '',
      port: __karma__.config.pactPorts[providerName]
    });
  }

  /**
   * Register an interaction with Pact and then call a test function which should test the registered interaction.  Upon completion of
   * the test function, the Pact provider is verified to ensure the HTTP request was made.  All errors are propagated to Jasmine as test
   * failures.
   *
   * @param {InteractionObject} interaction object describing the contract
   * @param testFn function called after the interaction is registered which should test the interaction
   *               returned Observable is checked for truthiness
   */
  verifyInteraction<T>(interaction: InteractionObject, testFn: () => Observable<T>): (DoneFn) => void {
    return (done: DoneFn) => {
      this.provider.addInteraction(interaction).then(() => {
        testFn().subscribe(ret => {
          expect(ret).toBeTruthy();
          this.verifyPact(done);
        }, this.failTestWithError('test function failed with', () => this.verifyPact(done)));
      }, this.failTestWithError('add interaction failed with', done));
    };
  }

  /**
   * Returns a callback function that is appropriate for usage in afterAll.  When called, it will finalize (i.e. write passing interactions
   * into a pact file).
   */
  finalize(): (DoneFn) => void {
    return done => this.provider.finalize().then(done, this.failTestWithError('failed to finalize', done));
  }

  /**
   * Returns a callback function that is appropriate for usage in beforeEach.  When called, it will remove any interactions added to pact
   * server in previous test.
   */
  clearInteractions(): (DoneFn) => void {
    return done => this.provider.removeInteractions().then(done);
  }

  /**
   * Return a callback function for use as an error handler.  The callback will fail the test and call the provided done callback.
   * @param {string} errorPrefix Prepended to failure message to provide context
   * @param {DoneFn} done Called to indicate that async test is complete
   */
  private failTestWithError(errorPrefix: string, done: () => any): (any) => void {
    return error => {
      fail(`${errorPrefix}: ${error}`);
      done();
    };
  }

  /**
   * Verifies that all interactions with Pact were successful, failing the test if they weren't
   */
  private verifyPact(done: DoneFn) {
    this.provider.verify().then(done, this.failTestWithError('provider verification failed with', done));
  }
}

/**
 * When like or eachLike is used, all matching values is done by type.  This forces the value to match exactly.
 */
export function exactly(val: any) {
  return term({ generate: val, matcher: `^${val}$` });
}

/**
 * Matcher for HTTP urls.
 */
export function url(generate: string) {
  return term({
    generate: generate,
    // This matcher kind of sucks but we can't use a wildcard because randexp in pact doesn't support them
    matcher: '^https?://[^\\s/$.?#].[^\\s]{0,1000}$'
  });
}

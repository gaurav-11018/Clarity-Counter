
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.6/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
    name: "counters are specific to the tx-sender",
    async fn(chain: Chain, accounts: Map<string, Account>) {
      // Get some accounts
      let deployer = accounts.get("deployer")!;
      let wallet1 = accounts.get("wallet_1")!;
      let wallet2 = accounts.get("wallet_2")!;
  
      // Mine a few contract calls to count-up
      let block = chain.mineBlock([
        // The deployer account calls count-up zero times.
  
        // Wallet 1 calls count-up one time.
        Tx.contractCall("counter", "count-up", [], wallet1.address),
  
        // Wallet 2 calls count-up two times.
        Tx.contractCall("counter", "count-up", [], wallet2.address),
        Tx.contractCall("counter", "count-up", [], wallet2.address),
      ]);
  
      // Get and assert the counter value for deployer.
      let deployerCount = chain.callReadOnlyFn("counter", "get-count", [
        types.principal(deployer.address),
      ], deployer.address);
      deployerCount.result.expectUint(0);
  
      // Get and assert the counter value for wallet 1.
      let wallet1Count = chain.callReadOnlyFn("counter", "get-count", [
        types.principal(wallet1.address),
      ], wallet1.address);
      wallet1Count.result.expectUint(1);
  
      // Get and assert the counter value for wallet 2.
      let wallet2Count = chain.callReadOnlyFn("counter", "get-count", [
        types.principal(wallet2.address),
      ], wallet2.address);
      wallet2Count.result.expectUint(2);
    },
  });
  
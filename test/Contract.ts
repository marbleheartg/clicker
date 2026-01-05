import { network } from "hardhat";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAddress } from "viem";
import ContractModule from "../ignition/modules/ProxyModule.js";
// import NewContractModule from "../ignition/modules/UpgradeModule.js";

describe("Contract", async function () {
  const { ignition, viem } = await network.connect();

  const [owner, account1, account2, account3] = await viem.getWalletClients();

  const { contract } = await ignition.deploy(ContractModule);

  describe("Proxy interaction", function () {
    it("Should be usable via proxy", async function () {
      assert.equal(
        getAddress(await contract.read.owner()),
        getAddress(owner.account.address),
      );
    });
  });

  describe("Clicker functionality", function () {
    it("Should allow users to click and track clicks", async function () {
      // Use account1 for this test
      const initialClicks = await contract.read.clicks([
        account1.account.address,
      ]);
      const initialTotal = await contract.read.totalClicks();

      // Click once
      await contract.write.click({ account: account1.account });
      assert.equal(
        await contract.read.clicks([account1.account.address]),
        initialClicks + 1n,
      );
      assert.equal(await contract.read.totalClicks(), initialTotal + 1n);

      // Click multiple times
      await contract.write.click({ account: account1.account });
      await contract.write.click({ account: account1.account });
      assert.equal(
        await contract.read.clicks([account1.account.address]),
        initialClicks + 3n,
      );
      assert.equal(await contract.read.totalClicks(), initialTotal + 3n);
    });

    it("Should track multiple players", async function () {
      // Use account2 and account3 for this test
      const account2Initial = await contract.read.clicks([
        account2.account.address,
      ]);
      const account3Initial = await contract.read.clicks([
        account3.account.address,
      ]);
      const initialTotal = await contract.read.totalClicks();

      // Account2 clicks
      await contract.write.click({ account: account2.account });
      await contract.write.click({ account: account2.account });

      // Account3 clicks
      await contract.write.click({ account: account3.account });
      await contract.write.click({ account: account3.account });
      await contract.write.click({ account: account3.account });

      assert.equal(
        await contract.read.clicks([account2.account.address]),
        account2Initial + 2n,
      );
      assert.equal(
        await contract.read.clicks([account3.account.address]),
        account3Initial + 3n,
      );
      assert.equal(await contract.read.totalClicks(), initialTotal + 5n);

      // Verify both are players
      assert.equal(
        await contract.read.isPlayer([account2.account.address]),
        true,
      );
      assert.equal(
        await contract.read.isPlayer([account3.account.address]),
        true,
      );
    });

    it("Should track players correctly", async function () {
      // Use owner account which hasn't clicked yet (owner is just the contract owner, not a player)
      assert.equal(
        await contract.read.isPlayer([owner.account.address]),
        false,
      );

      await contract.write.click({ account: owner.account });

      assert.equal(await contract.read.isPlayer([owner.account.address]), true);
      assert.equal(await contract.read.clicks([owner.account.address]), 1n);
    });
  });

  // describe("Upgrading", function () {
  //   it("Should have upgraded the proxy to DemoV2", async function () {
  //     const [, otherAccount] = await viem.getWalletClients();

  //     const { contract } = await ignition.deploy(NewContractModule);

  //     assert.equal(
  //       await contract.read.version({ account: otherAccount.account.address }),
  //       "2.0.0",
  //     );
  //   });

  //   it("Should have set the name during upgrade", async function () {
  //     const [, otherAccount] = await viem.getWalletClients();

  //     const { contract } = await ignition.deploy(NewContractModule);

  //     assert.equal(
  //       await contract.read.name({ account: otherAccount.account.address }),
  //       "Example Name",
  //     );
  //   });
  // });
});

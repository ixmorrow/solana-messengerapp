const assert = require('assert');
const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

describe('messengerapp', () => {
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  
  //const messenger_account = anchor.web3.Keypair.generate();
  const program = anchor.workspace.Messengerapp;
  const baseAccount  = anchor.web3.Keypair.generate();

  it("An account is initialized", async function() {
    await program.rpc.initialize("This message will live forever on the blockchain", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    //console.log('Data: ', account.data);
    assert.ok(account.data === "This message will live forever on the blockchain");

  });

  it("Updating initialized account", async function() {
    await program.rpc.update("My second message", {
      accounts: {
        baseAccount: baseAccount.publicKey,
      }
    });

    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.data === "My second message");
    assert.ok(account.dataList.length === 2);

  })

})
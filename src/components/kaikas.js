import Caver from "caver-js";

const KaikasBtn = () => {
  const connectKaikas = async () => {
    const { klaytn } = window;
    if (klaytn) {
      klaytn.enable();

      signMessage();
    } else {
      console.error("window.klaytn is undefined");
    }
  };

  // kaikas는 지원 안함. 궁금하면 써보셈.
  //   const signTypedDataV4 = async () => {
  //     const msgParams = JSON.stringify({
  //       domain: {
  //         // Defining the chain aka Rinkeby testnet or Ethereum Main Net
  //         chainId: 1,
  //         // Give a user friendly name to the specific contract you are signing for.
  //         name: "klaymint",
  //         // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
  //         verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
  //         // Just let's you know the latest version. Definitely make sure the field name is correct.
  //         version: "1",
  //       },

  //       // Defining the message signing data content.
  //       message: {
  //         /*
  //          - Anything you want. Just a JSON Blob that encodes the data you want to send
  //          - No required fields
  //          - This is DApp Specific
  //          - Be as explicit as possible when building out the message schema.
  //         */
  //         contents: "Hello, Bob!",
  //         attachedMoneyInEth: 4.2,
  //         from: {
  //           name: "Cow",
  //           wallets: [
  //             "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
  //             "0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF",
  //           ],
  //         },
  //         to: [
  //           {
  //             name: "Bob",
  //             wallets: [
  //               "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
  //               "0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57",
  //               "0xB0B0b0b0b0b0B000000000000000000000000000",
  //             ],
  //           },
  //         ],
  //       },
  //       // Refers to the keys of the *types* object below.
  //       primaryType: "Mail",
  //       types: {
  //         // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
  //         EIP712Domain: [
  //           { name: "name", type: "string" },
  //           { name: "version", type: "string" },
  //           { name: "chainId", type: "uint256" },
  //           { name: "verifyingContract", type: "address" },
  //         ],
  //         // Not an EIP712Domain definition
  //         Group: [
  //           { name: "name", type: "string" },
  //           { name: "members", type: "Person[]" },
  //         ],
  //         // Refer to PrimaryType
  //         Mail: [
  //           { name: "from", type: "Person" },
  //           { name: "to", type: "Person[]" },
  //           { name: "contents", type: "string" },
  //         ],
  //         // Not an EIP712Domain definition
  //         Person: [
  //           { name: "name", type: "string" },
  //           { name: "wallets", type: "address[]" },
  //         ],
  //       },
  //     });
  //     const params = [klaytn.selectedAddress, msgParams];
  //     const method = "eth_signTypedData_v4";

  //     const { klaytn } = window;
  //     klaytn.sendAsync(
  //       {
  //         method,
  //         params,
  //         from: klaytn.selectedAddress,
  //       },
  //       function (err, result) {
  //         if (err) return console.dir(err);
  //         if (result.error) {
  //           alert(result.error.message);
  //         }
  //         if (result.error) return console.error("ERROR", result);
  //         console.log("TYPED SIGNED:" + JSON.stringify(result.result));
  //       }
  //     );
  //   };

  const signMessage = async () => {
    // 웹팩5 개노무시끼...
    // window.global = window;
    // global.Buffer = global.Buffer || require("buffer").Buffer;

    const { klaytn } = window;
    const caver = new Caver(klaytn);

    // ===================유저가 싸인=========================
    const accountNonce = await caver.klay.getTransactionCount(
      klaytn.selectedAddress
    );
    const nonce = "klaymint register nonce: " + accountNonce;
    const sig = await caver.klay.sign(
      nonce,
      klaytn.selectedAddress.toLowerCase()
    );
    // ======================================================

    // ===========유저가 싸인한거 체크 return bool================
    const v = "0x" + sig.substring(2).substring(128, 130);
    const r = "0x" + sig.substring(2).substring(0, 64);
    const s = "0x" + sig.substring(2).substring(64, 128);

    // signature-to-vrs.js · GitHub 16
    const signature = [v, r, s];

    caver.validator
      .validateSignedMessage(nonce, signature, klaytn.selectedAddress)
      .then((res) => {
        alert(res);
      });
    // ======================================================
  };

  return (
    <div>
      <button onClick={connectKaikas}>Kaikas</button>
    </div>
  );
};

export default KaikasBtn;

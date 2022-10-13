const { ethers } = require("ethers");
// import ethUtil from "ethereumjs-util";
// window.global = window;
// global.Buffer = global.Buffer || require("buffer").Buffer;

const MetaMaskBtn = () => {
  const { ethereum } = window;
  const connectMetaMask = async () => {
    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const chainId = await ethereum.request({ method: "eth_chainId" });

      if (chainId !== "0x2019") {
        let answer = prompt("메인넷으로 change 하쉴? (y/n)");
        if (answer === "yes" || answer === "y") {
          await addNetwork();
        } else {
          console.error("그라믄 안돼");
        }
      }
    }
  };

  const addNetwork = async () => {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x2019",
          chainName: "Klaytn Mainnet Cypress",
          nativeCurrency: {
            name: "KLAY",
            symbol: "KLAY",
            decimals: 18,
          },
          rpcUrls: ["https://public-node-api.klaytnapi.com/v1/cypress"],
          blockExplorerUrls: ["https://scope.klaytn.com"],
        },
      ],
    });
    await signMessage();
    // await signTypedDataV4();
  };

  const signMessage = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const accountNonce = await provider.getTransactionCount(address);
    const nonce = "klaymint register nonce: " + accountNonce;
    const sig = await signer.signMessage(nonce);
    const decrypt = await ethers.utils.verifyMessage(nonce, sig);
    console.log(sig);
    console.log(decrypt);
    if (decrypt == address) {
      alert("싸인 맞음");
    } else {
      alert("싸인 틀림");
    }

    await signTypedDataV4();
  };

  const signTypedDataV4 = async () => {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = metamaskProvider.getSigner(accounts[0]);

    const domain = {
      name: "localhost",
      version: "1",
      chainId: 8217,
      verifyingContract: "0x1111111111111111111111111111111111111111",
    };

    const types = {
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "content", type: "string" },
      ],
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
    };

    const mail = {
      from: {
        name: "Alice",
        wallet: "0x2111111111111111111111111111111111111111",
      },
      to: {
        name: "Bob",
        wallet: "0x3111111111111111111111111111111111111111",
      },
      content: "Hello!",
    };

    const signature = await signer._signTypedData(domain, types, mail);

    const expectedSignerAddress = signer._address;
    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      mail,
      signature
    );
    console.log(recoveredAddress);
    console.log(recoveredAddress === expectedSignerAddress);
  };

  return (
    <div>
      <button onClick={connectMetaMask}>MetaMask</button>
    </div>
  );
};

export default MetaMaskBtn;

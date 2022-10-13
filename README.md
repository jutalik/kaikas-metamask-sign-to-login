# 브라우저 월렛(metamask, kaikas)


##./src/components/kaikas.js
* 기능은 연결, 싸인 후 사이너 주소가 맞는지 확인,
* accountNonce를 넣은 이유는 월렛의 고유의 넌스값을 넣고 돌려돌려 돌림판
(account의 nonce란 - EOA가 TX를 발생시킬때마다 1씩 증가하는 값.)
*signTypedDataV4는 현재 kaikas는 지원이 안되지만, 실행해보는 건 가능.


```js
const signMessage = async () => {
    
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

    
    const signature = [v, r, s];

    caver.validator
      .validateSignedMessage(nonce, signature, klaytn.selectedAddress)
      .then((res) => {
        alert(res);
      });
    // ======================================================
  };
```


##./src/components/metamask.js 
*못본 사이에 metamask 연결하는게 달라졌네요.
*이젠 window.ethereum.enable() 따윈 안 쓰는듯.
*window.ethereum.request(method:'method명') 으로 api 호출
*

```js
const MetaMaskBtn = () => {
  const { ethereum } = window;
  const connectMetaMask = async () => {
    if (ethereum) {
        // account연결
      await ethereum.request({ method: "eth_requestAccounts" });
        // 현재 연결된 chainId 갖고옴
      const chainId = await ethereum.request({ method: "eth_chainId" });


        // 클레이튼 메인넷의 hex값 8217 
      if (chainId !== "0x2019") {
        let answer = prompt("메인넷으로 change 하쉴? (y/n)");
        if (answer === "yes" || answer === "y") {
            // 클레이튼 메인넷으로 연결()
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

    // 연결하고 kaikas와 같이 signMessage() 호출
    // 그 아래 signTypedDataV4()가 있는데 이는 새로 나온 채신 기술입니다.
    // 아래에서 추가 설명 하겠습니다. 
    await signMessage();
    // await signTypedDataV4();
  };

```

signTypedDataV4()는 EIP-712
유저가 단순 klay,ether 트랜스퍼할때는 큰 상관 없겠으나
복잡한 contract function call 실행시
월렛에서 서명을 통해 
한번 더 확인하기 쉽도록 json 형태로 한번더 보여주고 확인 시켜줍니다.

간혹 네트워크가 다르거나, 잘못된 tx실행시 한번 더 확인이 가능하고
이러한 모든 내용들을 hashing하여 백단(혹은 checker contract)를 통하여
정상적인 호출인지 , 혹시 해킹에 의한 tx는 없는지 확인 가능 헙니다.




<img width="355" alt="스크린샷 2022-10-13 오전 9 49 03" src="https://user-images.githubusercontent.com/50254404/195474862-a1b6e4b7-0929-47ec-b60b-c008d2078faa.png">





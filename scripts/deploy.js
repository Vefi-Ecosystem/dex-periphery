const { ethers, network } = require("hardhat");
const path = require("path");
const fs = require("fs");

const factory_addresses = {
  1337: "0xB21887698d5c4D9E4e02c5f7EBDf2Cc1d81Adf5B",
  97: "0x583DD96cD23602979333B98bB81dFd22b55faa46",
  32520: "0x46e65AfC0BBF7cc037D82AC2eA9aaf560dD962Cc",
  56: "0x6A6CFF59de25175A5BC9e4796C88a73b2c581b49",
  86: "0xb562b09Bc2317D18a82FD415B7Fb33540Db7e723",
  311: "0x64FAF984Bf60dE19e24238521814cA98574E3b00",
  43114: "0xF1B1c2f4E8FcD4aFCA0E608B1c7dB8b4e700154F",
  888: "0x64FAF984Bf60dE19e24238521814cA98574E3b00",
  66: "0x64FAF984Bf60dE19e24238521814cA98574E3b00",
  1: '0x2CF6165c121EFadab70C42CEd85De8f742B29AA4'
};

const weths = {
  1337: {
    name: "Wrapped Local Ether",
    symbol: "WLETH",
  },
  97: {
    name: "Wrapped tBNB",
    symbol: "WtBNB",
  },
  32520: {
    name: "Wrapped Brise",
    symbol: "WBRISE",
  },
  56: {
    name: "Wrapped BNB",
    symbol: "WBNB",
  },
  86: {
    name: "Wrapped Gatecoin",
    symbol: "WGATE",
  },
  311: {
    name: "Wrapped OMAX",
    symbol: "WOMAX",
  },
  43114: {
    name: "Wrapped AVAX",
    symbol: "WAVAX",
  },
  888: {
    name: "Wrapped WAN",
    symbol: "WWAN",
  },
  66: {
    name: "Wrapped OKX",
    symbol: "WOKX",
  },
  1: {
    name: "Wrapped Ether",
    symbol: "WETH"
  }
};

(async () => {
  console.log("---------- Deploying to chain %d ----------", network.config.chainId);
  const RouterFactory = await ethers.getContractFactory("QuasarRouter");
  const WETHFactory = await ethers.getContractFactory("WETH");

  const wethDetails = weths[network.config.chainId];
  let weth = await WETHFactory.deploy(wethDetails.name, wethDetails.symbol);
  weth = await weth.deployed();

  const factory = factory_addresses[network.config.chainId];
  let router = await RouterFactory.deploy(factory, weth.address);
  router = await router.deployed();

  const location = path.join(__dirname, "../peripherals_addresses.json");
  const fileExists = fs.existsSync(location);

  if (fileExists) {
    const contentBuf = fs.readFileSync(location);
    let contentJSON = JSON.parse(contentBuf.toString());
    contentJSON = {
      ...contentJSON,
      [network.config.chainId]: {
        router: router.address,
        weth: weth.address,
      },
    };
    fs.writeFileSync(location, JSON.stringify(contentJSON, undefined, 2));
  } else {
    fs.writeFileSync(
      location,
      JSON.stringify(
        {
          [network.config.chainId]: {
            router: router.address,
            weth: weth.address,
          },
        },
        undefined,
        2
      )
    );
  }

  console.log("---- WETH: %s ----, ---- Router: %s ----", weth.address, router.address);
})();

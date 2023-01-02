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
  1: "0x2CF6165c121EFadab70C42CEd85De8f742B29AA4",
};

const weths = {
  32520: "0xD75411C6A3fEf2278E51EEaa73cdE8352c59eFEd",
  56: "0x2F856544d28c793F4461CE639709AA8C01D12745",
  86: "0x5CaD84E500d73A9bcCdeB21eDD9720FFb7531c56",
  311: "0x2e19F01B81628CCd8cFce9F7d9F2fACC77343b7c",
  888: "0x2e19F01B81628CCd8cFce9F7d9F2fACC77343b7c",
  66: "0xf886ABaCe837E5EC0CF7037B4d2198F7a1bf35B5",
  1: "0xfbAE861cbDFBB11AC0bC64c27AE7fEd3f99B8737",
};

(async () => {
  console.log("---------- Deploying to chain %d ----------", network.config.chainId);
  const RouterFactory = await ethers.getContractFactory("QuasarRouter02");

  const wethAddress = weths[network.config.chainId];

  const factory = factory_addresses[network.config.chainId];
  let router = await RouterFactory.deploy(factory, wethAddress);
  router = await router.deployed();

  const location = path.join(__dirname, "../router02_addresses.json");
  const fileExists = fs.existsSync(location);

  if (fileExists) {
    const contentBuf = fs.readFileSync(location);
    let contentJSON = JSON.parse(contentBuf.toString());
    contentJSON = {
      ...contentJSON,
      [network.config.chainId]: router.address,
    };
    fs.writeFileSync(location, JSON.stringify(contentJSON, undefined, 2));
  } else {
    fs.writeFileSync(
      location,
      JSON.stringify(
        {
          [network.config.chainId]: router.address,
        },
        undefined,
        2
      )
    );
  }

  console.log("---- Router: %s ----", router.address);
})();

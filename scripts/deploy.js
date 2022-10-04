const { ethers, network } = require("hardhat");
const path = require("path");
const fs = require("fs");

const factory_addresses = {
  1337: "0xB21887698d5c4D9E4e02c5f7EBDf2Cc1d81Adf5B",
};

const weths = {
  1337: {
    name: "Wrapped Local Ether",
    symbol: "WLETH",
  },
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

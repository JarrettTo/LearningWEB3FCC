const { network } = require("hardhat") 
const { networkConfig, developmentChains } = require("../helper-hardhat-config") 
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {     //basically means we are taking the getNamedAccounts and deployments from hre's module.exports, refer to notes.js
    const { deploy, log } = deployments         
    const { deployer } = await getNamedAccounts() //getting the deployer account
    const chainId = network.config.chainId  

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {         
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")  //gets the MockV3Aggregator contract
        ethUsdPriceFeedAddress = ethUsdAggregator.address   //if the chainid is of localhost or hardhat, then set the pricefeed address to contract address of mockv3agg
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"] //if the chainid is of an actual netowrk, then set the pricefeed address to the corresponding address in helper-hardhat-config's networkConfig
    }
    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress], // set the address as gthe argument for the constructor
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`FundMe deployed at ${fundMe.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
}

module.exports.tags = ["all", "fundme"]

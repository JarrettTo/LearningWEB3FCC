const { networkConfig }= require("../helper-hardhat-config");
module.exports= async(hre)=>{
    const { getNamedAccounts, deployments} = hre;
    //like doing hre.getNamedAccounts and hre.deployments
    const { deploy, log } = deployments;
    const { deployer }= await getNamedAccounts();
    const chainId= network.config.chainId;
    const address= networkConfig[chainId][ethUsdPriceFeed]; //this will choose the pricefeed address of the selected chain from helper-hardhat-config.js
    const fundMe = await deploy("FundMe",{
        from: deployer,
        args: [address],
        log: true,
    })
}
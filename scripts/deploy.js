const hre = require("hardhat"); 

async function main() {
  const [deployer] = await ethers.getSigners(); 

  console.log("Deploying contracts with the account:", deployer.address); 

  const Donation = await hre.ethers.getContractFactory("Donation"); 
  const donation = await Donation.deploy(); 

  await donation.deployed(); 

  console.log("Donation deployed to:", donation.address); 
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 
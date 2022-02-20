require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require('dotenv').config();

task("fund", "Внести пожертвование", async (args, hre) => {
  console.log("Адрес участника:", args.addr);
  const donation = await hre.ethers.getContractAt("Donation", process.env.CONTRACT);

  const res = await donation.fund({from: args.addr, value: web3.utils.toWei(args.amount, "ether")}); 
  if(res.type == 2) console.log("Транзакция выполнена успешно");

}).addParam("addr", "Адрес участника").addParam("amount", "Размер пожертвования, ether");

task("balanceOf", "Сумма пожертвований участника", async (args, hre) => {
  console.log("Адрес участника:", args.addr);
  const donation = await hre.ethers.getContractAt("Donation", process.env.CONTRACT);
  const balance = await donation.addrToAmount(args.addr);
  const eth = ethers.utils.formatEther(balance);
  console.log("Сумма пожертвований:", eth, "ether");
}).addParam("addr", "Адрес участника");

task("owner", "Создатель контракта", async (args, hre) => {
  const donation = await hre.ethers.getContractAt("Donation", process.env.CONTRACT);
  const ownerAddres = await donation.owner();
  console.log("Адрес создателя контракта:", ownerAddres);
});

task("balance", "Сумма пожертвований", async (args, hre) => {
  const donation = await hre.ethers.getContractAt("Donation", process.env.CONTRACT);
  const balance = await donation.balance();
  const eth = ethers.utils.formatEther(balance);
  console.log("Сумма всех пожертвований:", eth, "ether");
});

task("withdraw", "Вывести пожертвования", async (args, hre) => {
  console.log("Адрес получателя:", args.addr);
  const donation = await hre.ethers.getContractAt("Donation", process.env.CONTRACT);
  const res = await donation.withdraw(args.addr); //args.addr
  if(res.type == 2) console.log("Транзакция выполнена успешно");
}).addParam("addr", "Адрес получателя");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    rinkeby: {
      url: process.env.INFURA_URL,
      accounts: [process.env.ACCOUNT]
    }
  }
};

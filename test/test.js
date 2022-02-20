require("@nomiclabs/hardhat-web3");
const { ethers } = require("hardhat");
const assert = require('chai').assert;
const { expect } = require("chai");
const should = require('chai').should();
const hre = require("hardhat"); 

describe('Donation Deployed and Live', () => {
    let donation;
    let deployer;
    let other;

    before(async () => {
        const accounts = await ethers.getSigners(); 
        deployer = accounts[0].address;
        other = accounts[1];
        console.log("deployer:", deployer);
        console.log("other:", other.address);

        const Donation = await hre.ethers.getContractFactory("Donation"); 
        donation = await Donation.deploy(); 
        await donation.deployed();
    });

    it('contract deployed', async () => {
        console.log("Donation deployed to:", donation.address); 

        assert.ok(donation.address);
    });

    it('has owner as creator', async () => {
        expect(await donation.owner()).to.equal(deployer);
    });

    it('donation is empty', async () => {
        expect(await donation.count()).to.equal(0);
        expect(await donation.balance()).to.equal(0);
    });

    it('does not allow withdraw if donation is empty', async () => {
        await expect(donation.withdraw(deployer)).to.be.revertedWith("empty balance");
    });

    it('does not allow fund if amout is empty', async () => {
        await expect(donation.fund({from: deployer, value: 0})).to.be.revertedWith("empty amount");
    });
    
    it('allows to donate', async () => {
        await donation.fund({from: deployer, value: web3.utils.toWei("0.001", "ether")});

        const balance = await donation.addrToAmount(deployer);
        const eth = ethers.utils.formatEther(balance);

        assert.equal(eth, "0.001");
    });

    it('others can not withdraw the donation', async () => {
        await expect(donation.connect(other).withdraw(deployer)).to.be.revertedWith("only owner");
    });

    it('only owner can withdraw donation', async () => {
        await donation.withdraw(deployer);
        expect(await donation.balance()).to.equal(0);
    });

});
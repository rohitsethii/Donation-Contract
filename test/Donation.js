const Donation = artifacts.require('Donation.sol');

contract('Donation', async (accounts) => {

    let ether = 1000000000000000000;
    let val = 1 * ether;
    let amount = 11 * ether;
    let withdrawvalue = 500000000000;
    let zeroAddress = "0x0000000000000000000000000000000000000000";
    
    beforeEach(async function() {
        let instance = await Donation.new();
    })
     it("should let donar to donate", async () => {
        let instance = await Donation.deployed();
        let donate = await instance.donation(zeroAddress ,{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let referral = await instance.referred.call(accounts[1]);    
        assert.equal(referral,accounts[0]);            
     });

     it("should let donar to donate funds and check the reffered address", async () => {
        let instance = await Donation.new();
        const contractbalance1 = web3.eth.getBalance(instance.address).toNumber();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        let referral = await instance.referred.call(accounts[4]);
        assert.equal(referral,accounts[3]);
     });

     it("should let donar to donate funds and check the reffered address", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[4],value:val});
        let donate1 = await instance.donation(accounts[4],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        let referral = await instance.referred.call(accounts[4]);
        assert.equal(referral,accounts[3]);
     });

     it("should let donar to donate funds and check the reffered address", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[1],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[1],{from:accounts[4],value:val});
        let referral = await instance.referred.call(accounts[4]);
        assert.equal(referral,accounts[1]);
     });
     it("should let donar to donate funds and check all the participants", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        let referral = await instance.referred.call(accounts[4]);
        let participants = await instance.getParticipants.call();
        acc = [accounts[0],accounts[1],accounts[2],accounts[3],accounts[4]];
        assert.deepEqual(participants[0],acc);
     });
     it("should let owner withdraw ethers and check remaining balance", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        const contractbalance = web3.eth.getBalance(instance.address).toNumber();
        console.log("contract balance before withdrawl",contractbalance);
        let withdraw = await instance.withdraw(withdrawvalue);
        let remainingbalance = contractbalance - withdrawvalue;
        const balance = web3.eth.getBalance(instance.address).toNumber();
        console.log("contract balance after withdrawl",balance);
        assert.equal(balance,remainingbalance);
     });
     it("shows the total number ethers in contract", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        const contractbalance = web3.eth.getBalance(instance.address).toNumber();
        let total = await instance.getTotal.call();
        assert.equal(total[1],contractbalance);
     });
     it("should throw error when donar try to refer himself", async () => {
        try{
            let instance = await Donation.new();
            let donate = await instance.donation("zeroAddress",{from:accounts[0],value:amount});
            let donate1 = await instance.donation(accounts[0],{from:accounts[0],value:val});
            }
        catch(err){
            //console.log(err);
        }
    });

     it("should throw error when donar try to donate more than 10 ethers", async () => {
        try{
            let instance = await Donation.new();
            let donate = await instance.donation("zeroAddress",{from:accounts[0],value:amount});
            let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
            let referral = await instance.referred.call(accounts[1]);    
            }
        catch(err){
            //console.log(err);
        }
    });
    it("reverts when donar try to donate less than 1 ethers", async () => {
        try{
            let instance = await Donation.new();
            let donate = await instance.donation("zeroAddress",{from:accounts[0],value:99999999999999999});
            let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
            let referral = await instance.referred.call(accounts[1]);    
            }
        catch(err){
           // console.log(err);
        }
    });
    it("should throw error when withdrawl amount is greater than balance in contract", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        const contractbalance = web3.eth.getBalance(instance.address).toNumber();
        try{
        let withdraw = await instance.withdraw(amount);
        }
        catch(err){
        //console.log(err);    
        }
    });
    it("should throw error when others try to withdraw amount", async () => {
        let instance = await Donation.new();
        let donate = await instance.donation("zeroAddress",{from:accounts[0],value:val});
        let donate1 = await instance.donation(accounts[0],{from:accounts[1],value:val});
        let donate2 = await instance.donation(accounts[1],{from:accounts[2],value:val});
        let donate3 = await instance.donation(accounts[2],{from:accounts[3],value:val});
        let donate4 = await instance.donation(accounts[3],{from:accounts[4],value:val});
        const contractbalance = web3.eth.getBalance(instance.address).toNumber();
        try{
        let withdraw = await instance.withdraw(100000,{from:accounts[1]});
        }
        catch(err){
        //console.log(err);    
        }
    });
});   
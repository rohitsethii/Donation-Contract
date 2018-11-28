pragma solidity ^0.4.24;

contract Donation{
    
    address[] participants;
    mapping (address => address) public referred;
    bool zero;
    address[] a;
    uint total;
    address owner;
    
    constructor() 
    public {
    owner = msg.sender;    
    }
    
    function donation(address _referral) 
    public
    payable
    returns(bool) {
        require(msg.value >= 1 ether && msg.value <= 10 ether,"enter valid value");
        if(_referral == 0x0000000000000000000000000000000000000000){
            require(zero == false,"0x00 address is not allowed");
            participants.push(msg.sender);
            zero = true;
            total += msg.value;
            return true;
        }
        uint val = msg.value*5/100;
        if(_referral == participants[0]) {
            participants.push(msg.sender);
            referred[msg.sender] = _referral;
            participants[0].transfer(val);
            total += msg.value - val;
            return true;
        }
        if(_referral == participants[1]) {
            participants.push(msg.sender);
            referred[msg.sender] = _referral;
            participants[1].transfer(val);
            participants[0].transfer(val);
            total += msg.value - 2 * val;
            return true;
        }
        for(uint i = 0;i< participants.length ; i++) {
            if(_referral == participants[i]){
                participants.push(msg.sender);
                referred[msg.sender] = _referral;
                address add1 = find(_referral);
                address add2 = find(add1);
                _referral.transfer(val);
                total += msg.value -val;
                if(add1 != 0x0000000000000000000000000000000000000000){
                    add1.transfer(val);
                    total -= val;
                }
                if(add2 != 0x0000000000000000000000000000000000000000){
                    add2.transfer(val);
                    total -= val;
                }
                return true;
            }
        }
        
    }
    
    function find(address _referral)
    internal
    view
    returns (address){
        address addr = referred[_referral];
        return addr;
        
    }
    function getParticipants()
    public
    view
    returns(address[] all,address[] recent) {
        address[] memory ab = new address[](3);
        uint j=0;
        
        for(uint i=participants.length-1;i>participants.length-3;i--) {
            ab[j] = participants[i];
            j++;
        }
        
        return (participants,ab);
    }
    function getTotal()
    public
    view
    returns(uint totalDonation,uint contractbalance) {
        return (total,address(this).balance);
    }
    function withdraw(uint _amount)
    public
    returns (bool) {
        require(msg.sender == owner,"only owner can call");
        require(_amount > 0 wei && _amount <= address(this).balance,"enter valid amount");
        owner.transfer(_amount);
    }
    
}

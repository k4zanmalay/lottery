// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    address public manager;
    address[] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
   // receive() external payable{}
   // fallback() external payable {}

    modifier isManager(){
        require(msg.sender == manager, "Must be a manager");
        _;
    }
    
    function enterLottery() public payable {
        require(msg.value >= 1 ether, "Minimum amount to enter is 1 eth");
        if (!checkIfPlayerInList(msg.sender))
            players.push(msg.sender);
    }
    
    function checkIfPlayerInList(address player) private view returns (bool) {
        for (uint i=0; i<players.length; i++) {
            if (players[i]==player)
                return true;
        }
        return false;
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    function pickWinner() public isManager {
         uint index = random() % players.length;
         payable(players[index]).transfer(address(this).balance); 
         players = new address[](0); //reset lottery by emptying players list
    }
    
    function getPlayers() public view returns (address[] memory) {
        return players;   
    }
}

pragma solidity ^0.4.17;

contract Lottery{
    address public manager;
    address[] public players;

    function Lottery() public{
        // msg is a global variable
        //whenever we make an instance of lottery contract
        //Senders address is assigned to the manager
        manager = msg.sender; 
    }

    function enter() public payable{
        // require is the requirement after satisfying that condition
        //only then we can add person to the players
        require(msg.value > .01 ether);
            players.push(msg.sender);
    }

    function random() private view returns(uint){
        //now means current time
        //instead of sha3 we can also keecak256
        return uint(sha3(block.difficulty, now , players));
    }

    /* function pickwiner() public{
        //only the manager can call this function
        //if the person who invokes is manager then only the next lines will be executed
        require(msg.sender == manager);

       uint index = random()%players.length;
       
        // this is an instance to the current contract
        // balance is the value at the current contract
        players[index].transfer(this.balance);
       
        //clearing the players array after selecting a winner
        //creating a new players array again
        players = new address[](0);
    }  */

    //implementing the same pickWinners functions including modifiers

    function pickwinner() public restricted{
        uint index = random()%players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    //modifiers are used in solidity where repetative require functions are their
   
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }

    function getPlayers() public view returns(address[]){
        return players;
    } 
}
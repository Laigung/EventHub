// SPDX-License-Identifier: GPL-3.0
// Deployed contract address v0.1: 0xCaA9c00765ae51d05458ba356d2Ae19860946186
// Deployed contract address v0.2: 0x77884e97e58e0357b5e62CC7f403062bd78Bd1cB
// Deployed contract address v0.3: 0x5C038D1e2ad790bcf4F82a0D00c9260edA8c11B3


pragma solidity >=0.7.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract EventPlatform {

    uint256 currentEventID = 0;
    mapping(uint256 => Event) public currentEvent;
    mapping(address => User) private registeredUser;
    mapping(address => uint) pendingWithdrawals;

    struct Event {
        uint256 eventID;
        string eventName;
        string description;
        uint256 date; // unix timestamp
        string venue;
        uint maxParticipants;
        uint ageLimit;
        uint256 fee; // in wei
        User admin;
        address[] participants;
        bool isVisible;
    }

    struct User{
        address userAddress;
        string userName;
        uint age;
    }

    event EventCreated(uint256 eventId, address creator, Event detail);
    event EventJoined(uint256 eventId, address newParticipant);

    constructor(){
    }

    // User-related functions
    function registerUser(string memory name, uint age) public {
        require(registeredUser[msg.sender].userAddress == address(0), "User already exists");
        registeredUser[msg.sender] = User(msg.sender,name,age);
    }

    function getUserInfo() public view returns (User memory){
        require(registeredUser[msg.sender].userAddress != address(0), "Unregistered user");
        return registeredUser[msg.sender];
    }

    function getUserInfo(address userAddress) public view returns (User memory){
        require(registeredUser[userAddress].userAddress != address(0), "Unregistered user");
        return registeredUser[userAddress];
    }

    function isUserJoined(uint256 eventID) public view returns (bool) {
        for (uint i = 0; i < currentEvent[eventID].participants.length; i++){
            if (currentEvent[eventID].participants[i] == msg.sender) return true;
        }
        return false;
    } 

    function isUserJoined(address participant, uint256 eventID) public view returns (bool) {
        for (uint i = 0; i < currentEvent[eventID].participants.length; i++){
            if (currentEvent[eventID].participants[i] == participant) return true;
        }
        return false;
    }

    function getUserBalance() public view returns (uint256){
        return msg.sender.balance;
    }

    // Event-related functions
    function addEvent(string memory eventName, string memory description, uint256 date, string memory venue, uint maxParticipants, uint ageLimit, uint256 fee, bool isVisible) public {
        require(registeredUser[msg.sender].userAddress != address(0), "User is not yet registered");
        Event storage tmp = currentEvent[currentEventID];
        tmp.eventID = currentEventID;
        tmp.eventName = eventName;
        tmp.description = description;
        tmp.date = date;
        tmp.venue = venue;
        tmp.maxParticipants = maxParticipants;
        tmp.ageLimit = ageLimit;
        tmp.fee = fee;
        tmp.admin = registeredUser[msg.sender];
        tmp.isVisible = isVisible;
        
        emit EventCreated(currentEventID, msg.sender, tmp);

        currentEventID++;
    }

    function editEvent(uint256 eventID, string memory eventName, string memory description, uint256 date, string memory venue, uint maxParticipants, uint ageLimit, uint64 fee, bool isVisible) public {
        require(eventID >= 0 && eventID < currentEventID, "Event does not exist");
        require(currentEvent[eventID].admin.userAddress == msg.sender, "Only admin can edit the event");
        currentEvent[eventID].eventName = eventName;
        currentEvent[eventID].description = description;
        currentEvent[eventID].date = date;
        currentEvent[eventID].venue = venue;
        currentEvent[eventID].maxParticipants = maxParticipants;
        currentEvent[eventID].ageLimit = ageLimit;
        currentEvent[eventID].fee = fee;
        currentEvent[eventID].isVisible = isVisible;
    }

    function joinEvent(uint256 eventID) public payable {
        require(eventID >= 0 && eventID < currentEventID, "Event does not exist");
        Event storage eventToJoin = currentEvent[eventID];
        User memory participant = registeredUser[msg.sender];

        require(participant.userAddress != address(0), "User is not registered. Please register first.");
        require(!isUserJoined(msg.sender, eventID), "User has already joined");
        require(getRemainingSeats(eventID) > 0,"Event is full");
        require(participant.age >= eventToJoin.ageLimit, string.concat("This event is not available to anyone under ", Strings.toString(eventToJoin.ageLimit)));
        require(msg.sender.balance >= eventToJoin.fee, "Not enough money in your account.");
        require(msg.value >= eventToJoin.fee, "Not enough fee");

        // fee is paid to admin and the excess amount is returned to sender
        pendingWithdrawals[eventToJoin.admin.userAddress] += eventToJoin.fee;
        pendingWithdrawals[msg.sender] += (msg.value - eventToJoin.fee);
        currentEvent[eventID].participants.push(msg.sender);

        emit EventJoined(eventID, msg.sender);
    }

    function getNumberOfEvents() public view returns (uint256) {
        return currentEventID;
    }

    function getRemainingSeats(uint256 eventID) public view returns (uint) {
        return currentEvent[eventID].maxParticipants - currentEvent[eventID].participants.length;
    }

    // use the "Withdrawal from Contracts" pattern from https://docs.soliditylang.org/en/v0.8.28/common-patterns.html#withdrawal-from-contracts 
    function withdraw() public {
        uint amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
// SPDX-License-Identifier: GPL-3.0
// Deployed contract address v0.1: 0xCaA9c00765ae51d05458ba356d2Ae19860946186
// Deployed contract address v0.2: 0x77884e97e58e0357b5e62CC7f403062bd78Bd1cB
// Deployed contract address v0.3: 0x5C038D1e2ad790bcf4F82a0D00c9260edA8c11B3


pragma solidity >=0.7.0;

import "@openzeppelin/contracts/utils/Strings.sol";

contract EventPlatform {

    int currentEventID = 0;
    mapping(int => Event) public currentEvent;
    mapping(address => User) private registeredUser;

    struct Event {
        int eventID;
        string eventName;
        string description;
        string date;
        string venue;
        uint maxParticipants;
        uint ageLimit;
        uint64 fee;
        User admin;
        address[] participants;
        bool isVisible;
    }

    struct User{
        address userAddress;
        string userName;
        uint age;
    }

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

    function isUserJoined(int eventID) public view returns (bool) {
        for (uint i = 0; i < currentEvent[eventID].participants.length; i++){
            if (currentEvent[eventID].participants[i] == msg.sender) return true;
        }
        return false;
    } 

    function isUserJoined(address participant, int eventID) public view returns (bool) {
        for (uint i = 0; i < currentEvent[eventID].participants.length; i++){
            if (currentEvent[eventID].participants[i] == participant) return true;
        }
        return false;
    }

    function getUserBalance() public view returns (uint256){
        return msg.sender.balance;
    }

    // Event-related functions
    function addEvent(string memory eventName, string memory description, string memory date, string memory venue, uint maxParticipants, uint ageLimit, uint64 fee, bool isVisible) public {
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
        currentEventID++;
    }

    function editEvent(int eventID, string memory eventName, string memory description, string memory date, string memory venue, uint maxParticipants, uint ageLimit, uint64 fee, bool isVisible) public {
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

    // function joinEvent(int eventID) public payable {
    function joinEvent(int eventID) public {
        require(eventID >= 0 && eventID < currentEventID, "Event does not exist");
        Event storage eventToJoin = currentEvent[eventID];
        User memory participant = registeredUser[msg.sender];
        require(participant.userAddress != address(0), "User is not registered. Please register first.");
        require(!isUserJoined(msg.sender, eventID), "User has already joined");
        require(getRemainingSeats(eventID) > 0,"Event is full");
        require(participant.age >= eventToJoin.ageLimit, string.concat("This event is not available to anyone under ", Strings.toString(eventToJoin.ageLimit)));
        // require(msg.value >= eventToJoin.fee, "Not enough money in your account.");
        // payable(eventToJoin.admin.userAddress).transfer(eventToJoin.fee);
        currentEvent[eventID].participants.push(msg.sender);
    }

    function getNumberOfEvents() public view returns (int) {
        return currentEventID;
    }

    function getRemainingSeats(int eventID) public view returns (uint) {
        return currentEvent[eventID].maxParticipants - currentEvent[eventID].participants.length;
    }
}
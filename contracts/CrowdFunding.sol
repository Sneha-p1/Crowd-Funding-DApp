// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CrowdFunding {
    struct Project {
        string title;
        string description;
        uint256 goal;
        uint256 fundsRaised;
        address payable creator;
    }

    Project[] public projects;

    event ProjectCreated(uint256 projectId, string title, string description, uint256 goal, address creator);
    event DonationReceived(uint256 projectId, address donor, uint256 amount);

    // Create a new project
    function createProject(string memory _title, string memory _description, uint256 _goal) public {
        require(_goal > 0, "Goal must be greater than zero");

        projects.push(Project({
            title: _title,
            description: _description,
            goal: _goal,
            fundsRaised: 0,
            creator: payable(msg.sender)
        }));

        emit ProjectCreated(projects.length - 1, _title, _description, _goal, msg.sender);
    }

    // Donate to a project
    function donateToProject(uint256 _projectId) public payable {
        require(_projectId < projects.length, "Project does not exist");
        require(msg.value > 0, "Donation must be greater than zero");

        Project storage project = projects[_projectId];
        project.fundsRaised += msg.value;

        emit DonationReceived(_projectId, msg.sender, msg.value);
    }

    // Get project details
    function getProjects() public view returns (Project[] memory) {
        return projects;
    }
}

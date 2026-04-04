const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Voting", function () {
  async function deployVotingFixture() {
    const [admin, voter1, voter2, voter3] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    return { voting, admin, voter1, voter2, voter3 };
  }

  async function activeElectionFixture() {
    const [admin, voter1, voter2, voter3] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    await voting.addCandidate("Alice");
    await voting.addCandidate("Bob");
    await voting.registerVoter(voter1.address);
    await voting.registerVoter(voter2.address);
    await voting.startElection();
    return { voting, admin, voter1, voter2, voter3 };
  }

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      const { voting, admin } = await loadFixture(deployVotingFixture);
      expect(await voting.admin()).to.equal(admin.address);
    });

    it("Should start with election inactive", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.electionActive()).to.equal(false);
    });

    it("Should start with zero candidates", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.candidatesCount()).to.equal(0);
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add a candidate", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      expect(await voting.candidatesCount()).to.equal(1);
      const candidate = await voting.candidates(1);
      expect(candidate.name).to.equal("Alice");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should allow adding multiple candidates", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.addCandidate("Bob");
      expect(await voting.candidatesCount()).to.equal(2);
      expect((await voting.candidates(1)).name).to.equal("Alice");
      expect((await voting.candidates(2)).name).to.equal("Bob");
    });

    it("Should reject duplicate candidate names", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await expect(voting.addCandidate("Alice")).to.be.revertedWith(
        "Candidate already exists"
      );
    });

    it("Should reject non-admin adding a candidate", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await expect(
        voting.connect(voter1).addCandidate("Alice")
      ).to.be.revertedWith("Only admin allowed");
    });

    it("Should reject adding candidates after election starts", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.startElection();
      await expect(voting.addCandidate("Bob")).to.be.revertedWith(
        "Cannot add candidates after election starts"
      );
    });
  });

  describe("Election Lifecycle", function () {
    it("Should allow admin to start election with candidates", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.startElection();
      expect(await voting.electionActive()).to.equal(true);
    });

    it("Should reject starting election with no candidates", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await expect(voting.startElection()).to.be.revertedWith(
        "No candidates registered"
      );
    });

    it("Should allow admin to end an active election", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.startElection();
      await voting.endElection();
      expect(await voting.electionActive()).to.equal(false);
    });

    it("Should reject ending an inactive election", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await expect(voting.endElection()).to.be.revertedWith(
        "Election is not active"
      );
    });

    it("Should reject non-admin starting election", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await expect(
        voting.connect(voter1).startElection()
      ).to.be.revertedWith("Only admin allowed");
    });

    it("Should reject non-admin ending election", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.startElection();
      await expect(
        voting.connect(voter1).endElection()
      ).to.be.revertedWith("Only admin allowed");
    });
  });

  describe("Voter Registration", function () {
    it("Should allow admin to register a voter", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.registerVoter(voter1.address);
      expect(await voting.registeredVoters(voter1.address)).to.equal(true);
    });

    it("Should reject non-admin registering a voter", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);
      await expect(
        voting.connect(voter1).registerVoter(voter2.address)
      ).to.be.revertedWith("Only admin allowed");
    });
  });

  describe("Voting", function () {
    it("Should allow a registered voter to vote", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await voting.connect(voter1).vote(1);
      expect(await voting.voters(voter1.address)).to.equal(true);
      expect(await voting.hasVoted(voter1.address)).to.equal(true);
    });

    it("Should emit votedEvent on successful vote", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await expect(voting.connect(voter1).vote(1))
        .to.emit(voting, "votedEvent")
        .withArgs(1);
    });

    it("Should increment candidate vote count", async function () {
      const { voting, voter1, voter2 } = await loadFixture(activeElectionFixture);
      await voting.connect(voter1).vote(1);
      await voting.connect(voter2).vote(1);
      await voting.endElection();
      expect(await voting.getVotes(1)).to.equal(2);
    });

    it("Should reject double voting", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await voting.connect(voter1).vote(1);
      await expect(
        voting.connect(voter1).vote(2)
      ).to.be.revertedWith("You have already voted");
    });

    it("Should reject unregistered voter", async function () {
      const { voting, voter3 } = await loadFixture(activeElectionFixture);
      await expect(
        voting.connect(voter3).vote(1)
      ).to.be.revertedWith("You are not registered to vote");
    });

    it("Should reject admin voting", async function () {
      const { voting } = await loadFixture(activeElectionFixture);
      await expect(voting.vote(1)).to.be.revertedWith("Admin cannot vote");
    });

    it("Should reject voting when election is not active", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.addCandidate("Alice");
      await voting.registerVoter(voter1.address);
      await expect(
        voting.connect(voter1).vote(1)
      ).to.be.revertedWith("Election is not active");
    });

    it("Should reject vote for invalid candidate ID", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await expect(
        voting.connect(voter1).vote(99)
      ).to.be.revertedWith("Invalid candidate");
    });

    it("Should reject vote for candidate ID 0", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await expect(
        voting.connect(voter1).vote(0)
      ).to.be.revertedWith("Invalid candidate");
    });
  });

  describe("Results (getVotes)", function () {
    it("Should revert while election is active", async function () {
      const { voting } = await loadFixture(activeElectionFixture);
      await expect(voting.getVotes(1)).to.be.revertedWith(
        "Results available after election ends"
      );
    });

    it("Should return vote counts after election ends", async function () {
      const { voting, voter1, voter2 } = await loadFixture(activeElectionFixture);
      await voting.connect(voter1).vote(1);
      await voting.connect(voter2).vote(2);
      await voting.endElection();
      expect(await voting.getVotes(1)).to.equal(1);
      expect(await voting.getVotes(2)).to.equal(1);
    });

    it("Should return zero for candidates with no votes", async function () {
      const { voting, voter1 } = await loadFixture(activeElectionFixture);
      await voting.connect(voter1).vote(1);
      await voting.endElection();
      expect(await voting.getVotes(2)).to.equal(0);
    });
  });
});

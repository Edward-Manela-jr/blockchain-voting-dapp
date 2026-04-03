const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Voting", function () {
  async function deployVotingFixture() {
    const [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy();
    return { voting, owner, voter1, voter2 };
  }

  describe("Voting", function () {
    it("Should allow a user to vote for a candidate", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      expect(await voting.getVotes("Alice")).to.equal(1);
    });

    it("Should auto-register a new candidate on first vote", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      const candidates = await voting.getAllCandidates();
      expect(candidates).to.include("Alice");
    });

    it("Should reject double voting", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      await expect(
        voting.connect(voter1).vote("Bob")
      ).to.be.revertedWith("You have already voted!");
    });

    it("Should track multiple voters correctly", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      await voting.connect(voter2).vote("Alice");
      expect(await voting.getVotes("Alice")).to.equal(2);
    });

    it("Should return zero votes for unknown candidate", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.getVotes("Nobody")).to.equal(0);
    });
  });

  describe("Queries", function () {
    it("Should return all candidates", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      await voting.connect(voter2).vote("Bob");
      const candidates = await voting.getAllCandidates();
      expect(candidates).to.have.lengthOf(2);
      expect(candidates).to.include("Alice");
      expect(candidates).to.include("Bob");
    });

    it("Should return batch vote counts", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote("Alice");
      await voting.connect(voter2).vote("Bob");
      const votes = await voting.getCandidateVotes(["Alice", "Bob"]);
      expect(votes[0]).to.equal(1);
      expect(votes[1]).to.equal(1);
    });

    it("Should report hasVoted correctly", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);
      expect(await voting.hasVoted(voter1.address)).to.equal(false);
      await voting.connect(voter1).vote("Alice");
      expect(await voting.hasVoted(voter1.address)).to.equal(true);
      expect(await voting.hasVoted(voter2.address)).to.equal(false);
    });
  });
});

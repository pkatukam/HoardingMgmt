package com.allysuite.hoarding.mgmt.domain;

public class ProposalHistory {
	private int proposalHistoryId;
	private String proposalHistory;
	private int proposalId;
	public int getProposalHistoryId() {
		return proposalHistoryId;
	}
	public void setProposalHistoryId(int proposalHistoryId) {
		this.proposalHistoryId = proposalHistoryId;
	}
	public String getProposalHistory() {
		return proposalHistory;
	}
	public void setProposalHistory(String proposalHistory) {
		this.proposalHistory = proposalHistory;
	}
	public int getProposalId() {
		return proposalId;
	}

	public void setProposalId(int proposalId) {
		this.proposalId = proposalId;
	}
	@Override
	public String toString() {
		return "ProposalHistory [proposalHistoryId=" + proposalHistoryId
				+ ", proposalHistory=" + proposalHistory + ", proposalId="
				+ proposalId + "]";
	}
	

}

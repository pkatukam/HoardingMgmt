package com.allysuite.hoarding.mgmt.domain;

import java.util.Date;
import java.util.List;

public class ProposalFeed {

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	private int proposalCount;
	private int campaignId;
	private String campaignName;
	private byte campaignStatus;
	/**
	 * @return the campaignStatus
	 */
	public byte getCampaignStatus() {
		return campaignStatus;
	}

	/**
	 * @param campaignStatus the campaignStatus to set
	 */
	public void setCampaignStatus(byte campaignStatus) {
		this.campaignStatus = campaignStatus;
	}

	private Date fetchDateBuyer;
	List<Proposal> proposals;
	private int unreadProposalCount;

	/**
	 * @return the unreadProposal
	 */
	public int getUnreadProposalCount() {
		return unreadProposalCount;
	}

	/**
	 * @param unreadProposal
	 *            the unreadProposal to set
	 */
	public void setUnreadProposalCount(int unreadProposalCount) {
		this.unreadProposalCount = unreadProposalCount;
	}

	/**
	 * @return the fetchDateBuyer
	 */
	public Date getFetchDateBuyer() {
		return fetchDateBuyer;
	}

	/**
	 * @param fetchDateBuyer
	 *            the fetchDateBuyer to set
	 */
	public void setFetchDateBuyer(Date fetchDateBuyer) {
		this.fetchDateBuyer = fetchDateBuyer;
	}

	public int getProposalCount() {
		return proposalCount;
	}

	public void setProposalCount(int proposalCount) {
		this.proposalCount = proposalCount;
	}

	public int getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(int campaignId) {
		this.campaignId = campaignId;
	}

	public String getCampaignName() {
		return campaignName;
	}

	public void setCampaignName(String campaignName) {
		this.campaignName = campaignName;
	}

	public List<Proposal> getProposals() {
		return proposals;
	}

	public void setProposals(List<Proposal> proposals) {
		this.proposals = proposals;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProposalFeed [proposalCount=" + proposalCount + ", campaignId="
				+ campaignId + ", campaignName=" + campaignName
				+ ", fetchDateBuyer=" + fetchDateBuyer + ", proposals="
				+ proposals + ", unreadProposalCount=" + unreadProposalCount + "]";
	}

}

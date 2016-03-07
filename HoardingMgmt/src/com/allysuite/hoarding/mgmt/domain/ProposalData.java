package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class ProposalData {
	private int sellerId;
	private int cityId;
	private int campaignId;
	private List<Proposal> proposals;

	public int getSellerId() {
		return sellerId;
	}

	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}

	public int getCityId() {
		return cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public int getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(int campaignId) {
		this.campaignId = campaignId;
	}

	public List<Proposal> getProposals() {
		return proposals;
	}

	public void setProposals(List<Proposal> proposals) {
		this.proposals = proposals;
	}

	@Override
	public String toString() {
		return "ProposalEntry [sellerId=" + sellerId + ", cityId=" + cityId
				+ ", campaignId=" + campaignId + ", proposals=" + proposals
				+ "]";
	}

}

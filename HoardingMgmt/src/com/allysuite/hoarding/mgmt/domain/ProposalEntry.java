package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class ProposalEntry {
	private List<Proposal> proposals;
	private Campaign campaign;
	private List<Marker> markers;
	private List<Seller> sellers;
	private List<City> cities;
	private List<Category> categories;
	private List<ProposalNegotiation> negotiationHistory;
	
	/**
	 * @return the negotiationHistory
	 */
	public List<ProposalNegotiation> getNegotiationHistory() {
		return negotiationHistory;
	}

	/**
	 * @param negotiationHistory the negotiationHistory to set
	 */
	public void setNegotiationHistory(List<ProposalNegotiation> negotiationHistory) {
		this.negotiationHistory = negotiationHistory;
	}

	//Required to open the proposal window after click on a message in the Message Notification.
	private int openProposalId;
	private byte openProposalAction;


	/**
	 * @return the openProposalAction
	 */
	public byte getOpenProposalAction() {
		return openProposalAction;
	}

	/**
	 * @param openProposalAction the openProposalAction to set
	 */
	public void setOpenProposalAction(byte openProposalAction) {
		this.openProposalAction = openProposalAction;
	}

	/**
	 * @return the openProposalId
	 */
	public int getOpenProposalId() {
		return openProposalId;
	}

	/**
	 * @param openProposalId the openProposalId to set
	 */
	public void setOpenProposalId(int openProposalId) {
		this.openProposalId = openProposalId;
	}

	// Will be set only if the buyer clicks the proposals in the ProposalFeed on
	// the dashboard page.
	private ProposalFeed proposalFeed;

	/**
	 * @return the proposalFeed
	 */
	public ProposalFeed getProposalFeed() {
		return proposalFeed;
	}

	/**
	 * @param proposalFeed
	 *            the proposalFeed to set
	 */
	public void setProposalFeed(ProposalFeed proposalFeed) {
		this.proposalFeed = proposalFeed;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProposalEntry [proposals=" + proposals + ", campaign="
				+ campaign + ", markers=" + markers + ", sellers=" + sellers
				+ ", cities=" + cities + ", categories=" + categories
				+ ", negotiationHistory=" + negotiationHistory
				+ ", openProposalId=" + openProposalId
				+ ", openProposalAction=" + openProposalAction
				+ ", proposalFeed=" + proposalFeed + "]";
	}

	public List<Proposal> getProposals() {
		return proposals;
	}

	public void setProposals(List<Proposal> proposals) {
		this.proposals = proposals;
	}



	/**
	 * @return the campaign
	 */
	public Campaign getCampaign() {
		return campaign;
	}

	/**
	 * @param campaign the campaign to set
	 */
	public void setCampaign(Campaign campaign) {
		this.campaign = campaign;
	}

	public List<Marker> getMarkers() {
		return markers;
	}

	public void setMarkers(List<Marker> markers) {
		this.markers = markers;
	}

	public List<Seller> getSellers() {
		return sellers;
	}

	public void setSellers(List<Seller> sellers) {
		this.sellers = sellers;
	}

	public List<City> getCities() {
		return cities;
	}

	public void setCities(List<City> cities) {
		this.cities = cities;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

}

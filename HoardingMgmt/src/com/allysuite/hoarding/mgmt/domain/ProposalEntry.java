package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class ProposalEntry {
	private List<Proposal> proposals;
	private List<Campaign> campaigns;
	private List<Marker> markers;
	private List<Seller> sellers;
	private List<City> cities;
	private List<Category> categories;

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

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProposalEntry [proposals=" + proposals + ", campaigns="
				+ campaigns + ", markers=" + markers + ", sellers=" + sellers
				+ ", cities=" + cities + ", categories=" + categories
				+ ", proposalFeed=" + proposalFeed + "]";
	}

	public List<Proposal> getProposals() {
		return proposals;
	}

	public void setProposals(List<Proposal> proposals) {
		this.proposals = proposals;
	}

	public List<Campaign> getCampaigns() {
		return campaigns;
	}

	public void setCampaigns(List<Campaign> campaigns) {
		this.campaigns = campaigns;
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

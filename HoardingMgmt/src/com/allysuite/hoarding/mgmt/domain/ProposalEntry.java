package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class ProposalEntry {
	private List<Proposal> proposals;
	private List<Campaign> campaigns;
	private List<Marker> markers;
	private List<Seller> sellers;
	private List<City> cities;
	private List<Category> categories;
	
	@Override
	public String toString() {
		return "ProposalEntry [proposals=" + proposals + ", campaigns="
				+ campaigns + ", markers=" + markers + ", sellers=" + sellers
				+ ", cities=" + cities + "]";
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

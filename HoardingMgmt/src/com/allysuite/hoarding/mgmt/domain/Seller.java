package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class Seller extends User {
	private int sellerId;
	private List<City> cities;
	private List<Marker> markers;
	private String contactNumber;
	private String mailId;

	public String getMailId() {
		return mailId;
	}

	public void setMailId(String mailId) {
		this.mailId = mailId;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public List<Marker> getMarkers() {
		return markers;
	}

	public void setMarkers(List<Marker> markers) {
		this.markers = markers;
	}

	public Seller() {
		super();
	}

	public int getSellerId() {
		return sellerId;
	}

	public List<City> getCities() {
		return cities;
	}

	public void setCities(List<City> cities) {
		this.cities = cities;
	}

	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}

	@Override
	public String toString() {
		return "Seller [sellerId=" + sellerId + ", cities=" + cities
				+ ", markers=" + markers + ", contactNumber=" + contactNumber
				+ ", mailId=" + mailId + "]";
	}

	@Override
	public String getUser() {
		// TODO Auto-generated method stub
		return "seller";
	}

}

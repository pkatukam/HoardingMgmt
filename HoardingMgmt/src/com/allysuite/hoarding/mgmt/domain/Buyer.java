package com.allysuite.hoarding.mgmt.domain;

public class Buyer extends User {

	// buyerId, buyerFirstName, buyerLastName, buyerEmailId,
	// buyerContactNumber

	private int buyerId;
	private String buyerContactNumber;

	public Buyer() {
		super();
	}

	public int getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(int buyerId) {
		this.buyerId = buyerId;
	}

	public String getBuyerContactNumber() {
		return buyerContactNumber;
	}

	public void setBuyerContactNumber(String buyerContactNumber) {
		this.buyerContactNumber = buyerContactNumber;
	}

	public Buyer(int buyerId, String buyerFirstName, String buyerLastName,
			String buyerEmailId, String buyerContactNumber) {
		super();
		this.buyerId = buyerId;
		this.buyerContactNumber = buyerContactNumber;
	}

	public Buyer(String buyerFirstName, String buyerLastName,
			String buyerEmailId, String buyerContactNumber) {
		super();
		this.buyerContactNumber = buyerContactNumber;
	}

	@Override
	public String toString() {
		return "Buyers [buyerId=" + buyerId + ", buyerContactNumber="
				+ buyerContactNumber + "]";
	}

	public String getUser() {
		// TODO Auto-generated method stub
		return "buyer";
	}

}

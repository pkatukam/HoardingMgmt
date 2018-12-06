package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonDeserialize;

import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;

public class ProposalNegotiation {

	
	public ProposalNegotiation() {
		super();
		// TODO Auto-generated constructor stub
	}

	public ProposalNegotiation(int proposalId, BigDecimal negotiatedPrice, String initiatedBy,
			Date negotiationDate, String negotionStatus) {
		super();
		this.negotiatedPrice = negotiatedPrice;
		this.initiatedBy = initiatedBy;
		this.negotiationDate = negotiationDate;
		this.proposalId = proposalId;
		this.negotiationStatus = negotionStatus;
	}

	private int negotiationId;
	private BigDecimal negotiatedPrice;
	private String initiatedBy;
	private String negotiationStatus;
	private Date negotiationDate;
	private int proposalId;
	private String firstName;
	private String lastName;
	
	

	/**
	 * @return the proposalId
	 */
	public int getProposalId() {
		return proposalId;
	}

	/**
	 * @param proposalId the proposalId to set
	 */
	public void setProposalId(int proposalId) {
		this.proposalId = proposalId;
	}

	/**
	 * @return the negotiationId
	 */
	public int getNegotiationId() {
		return negotiationId;
	}

	/**
	 * @param negotiationId
	 *            the negotiationId to set
	 */
	public void setNegotiationId(int negotiationId) {
		this.negotiationId = negotiationId;
	}

	/**
	 * @return the negotiatedPrice
	 */
	public BigDecimal getNegotiatedPrice() {
		return negotiatedPrice;
	}

	/**
	 * @param negotiatedPrice
	 *            the negotiatedPrice to set
	 */
	public void setNegotiatedPrice(BigDecimal negotiatedPrice) {
		this.negotiatedPrice = negotiatedPrice;
	}

	/**
	 * @return the initiatedBy
	 */
	public String getInitiatedBy() {
		return initiatedBy;
	}

	/**
	 * @param initiatedBy
	 *            the initiatedBy to set
	 */
	public void setInitiatedBy(String initiatedBy) {
		this.initiatedBy = initiatedBy;
	}

	/**
	 * @return the negotiationStatus
	 */
	public String getNegotiationStatus() {
		return negotiationStatus;
	}

	/**
	 * @param negotiationStatus
	 *            the negotiationStatus to set
	 */
	public void setNegotiationStatus(String negotiationStatus) {
		this.negotiationStatus = negotiationStatus;
	}

	/**
	 * @return the negotiationDate
	 */
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public Date getNegotiationDate() {
		return negotiationDate;
	}

	/**
	 * @param negotiationDate
	 *            the negotiationDate to set
	 */
	public void setNegotiationDate(Date negotiationDate) {
		this.negotiationDate = negotiationDate;
	}
	
	

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName the firstName to set
	 */
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	/**
	 * @return the lastName
	 */
	public String getLastName() {
		return lastName;
	}

	/**
	 * @param lastName the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ProposalNegotiation [negotiationId=" + negotiationId
				+ ", negotiatedPrice=" + negotiatedPrice + ", initiatedBy="
				+ initiatedBy + ", negotiationStatus=" + negotiationStatus
				+ ", negotiationDate=" + negotiationDate + ", proposalId="
				+ proposalId + ", firstName=" + firstName + ", lastName="
				+ lastName + "]";
	}

}

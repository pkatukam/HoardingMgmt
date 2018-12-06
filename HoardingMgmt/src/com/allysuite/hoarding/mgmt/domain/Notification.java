package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;

import org.codehaus.jackson.map.annotate.JsonDeserialize;

import com.allysuite.hoarding.mgmt.commons.CommonUtil;
import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;

public class Notification {
	private String firstName;
	private String lastName;
	private BigDecimal price;
	private String initiatedBy;
	private Date date;
	private int proposalId;
	private int negotiationId;
	
	/**
	 * @return the negotiationId
	 */
	public int getNegotiationId() {
		return negotiationId;
	}

	/**
	 * @param negotiationId the negotiationId to set
	 */
	public void setNegotiationId(int negotiationId) {
		this.negotiationId = negotiationId;
	}

	private byte entity;
	private byte enityAction;
	private int entityId;
	private String enityName;

	public Notification(String firstName, String lastName, BigDecimal price,
			String initiatedBy, Date date, int proposalId, byte entity,
			byte enityAction, int entityId, String enityName) {
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.price = price;
		this.initiatedBy = initiatedBy;
		this.date = date;
		this.proposalId = proposalId;
		this.entity = entity;
		this.enityAction = enityAction;
		this.entityId = entityId;
		this.enityName = enityName;
	}

	public Notification(ProposalNegotiation negotiation) {
		this.price = negotiation.getNegotiatedPrice();
		this.initiatedBy = negotiation.getInitiatedBy();
		this.date = negotiation.getNegotiationDate();
		this.entity = CommonUtil.ENTITY_PROPOSAL_NEGOTIATION;
		this.enityAction = CommonUtil.ENTITY_ACTION_CREATE;
		this.entityId = negotiation.getNegotiationId();
		this.proposalId = negotiation.getProposalId();
	}

	public Notification(Proposal proposal, byte action) {
		this.price = proposal.getPrice();
		this.entity = CommonUtil.ENTITY_PROPOSAL;
		this.enityAction = action;
		this.entityId = proposal.getProposalId();
		this.proposalId = proposal.getProposalId();
		if (action == CommonUtil.ENTITY_ACTION_ACCEPT)
			this.date = proposal.getAcceptedDate();
		else {
			this.date = proposal.getCreatedDateTimeStamp();
			this.initiatedBy = "s";
		}
	}

	/**
	 * @return the proposalId
	 */
	public int getProposalId() {
		return proposalId;
	}

	/**
	 * @param proposalId
	 *            the proposalId to set
	 */
	public void setProposalId(int proposalId) {
		this.proposalId = proposalId;
	}

	/**
	 * @return the firstName
	 */
	public String getFirstName() {
		return firstName;
	}

	/**
	 * @param firstName
	 *            the firstName to set
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
	 * @param lastName
	 *            the lastName to set
	 */
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	/**
	 * @return the price
	 */
	public BigDecimal getPrice() {
		return price;
	}

	/**
	 * @param price
	 *            the price to set
	 */
	public void setPrice(BigDecimal price) {
		this.price = price;
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
	 * @return the date
	 */
	public Date getDate() {
		return date;
	}

	/**
	 * @param date
	 *            the date to set
	 */
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * @return the entity
	 */
	public byte getEntity() {
		return entity;
	}

	/**
	 * @param entity
	 *            the entity to set
	 */
	public void setEntity(byte entity) {
		this.entity = entity;
	}

	/**
	 * @return the enityAction
	 */
	public byte getEnityAction() {
		return enityAction;
	}

	/**
	 * @param enityAction
	 *            the enityAction to set
	 */
	public void setEnityAction(byte enityAction) {
		this.enityAction = enityAction;
	}

	/**
	 * @return the entityId
	 */
	public int getEntityId() {
		return entityId;
	}

	/**
	 * @param entityId
	 *            the entityId to set
	 */
	public void setEntityId(int entityId) {
		this.entityId = entityId;
	}

	/**
	 * @return the enityName
	 */
	public String getEnityName() {
		return enityName;
	}

	/**
	 * @param enityName
	 *            the enityName to set
	 */
	public void setEnityName(String enityName) {
		this.enityName = enityName;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Notification [firstName=" + firstName + ", lastName="
				+ lastName + ", price=" + price + ", initiatedBy="
				+ initiatedBy + ", date=" + date + ", proposalId=" + proposalId
				+ ", negotiationId=" + negotiationId + ", entity=" + entity
				+ ", enityAction=" + enityAction + ", entityId=" + entityId
				+ ", enityName=" + enityName + "]";
	}

}

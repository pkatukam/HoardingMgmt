package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonDeserialize;

import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;

public class Proposal {
	private int buyerId;
	private int sellerId;
	private int cityId;
	private Date createdDate;
	private int proposalId;
	private int markerId;
	private int campaignId;
	private BigDecimal price;
	private String note;
	// New Read Resend Accept Decline
	private String status;
	private Date availableStartDate;
	private Date availableEndDate;
	private boolean isBuyerAccepeted;
	private boolean isSellerAccepted;
	private List<Message> messages;
	
	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

	public int getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(int buyerId) {
		this.buyerId = buyerId;
	}

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

	public Date getCreatedDate() {
		return createdDate;
	}
	
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public int getProposalId() {
		return proposalId;
	}

	public void setProposalId(int proposalId) {
		this.proposalId = proposalId;
	}

	public int getMarkerId() {
		return markerId;
	}

	public void setMarkerId(int markerId) {
		this.markerId = markerId;
	}

	public int getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(int campaignId) {
		this.campaignId = campaignId;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getAvailableStartDate() {
		return availableStartDate;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setAvailableStartDate(Date availableStartDate) {
		this.availableStartDate = availableStartDate;
	}

	public Date getAvailableEndDate() {
		return availableEndDate;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setAvailableEndDate(Date availableEndDate) {
		this.availableEndDate = availableEndDate;
	}

	public boolean isBuyerAccepeted() {
		return isBuyerAccepeted;
	}

	public void setBuyerAccepeted(boolean isBuyerAccepeted) {
		this.isBuyerAccepeted = isBuyerAccepeted;
	}

	public boolean isSellerAccepted() {
		return isSellerAccepted;
	}

	public void setSellerAccepted(boolean isSellerAccepted) {
		this.isSellerAccepted = isSellerAccepted;
	}

	@Override
	public String toString() {
		return "Proposal [buyerId=" + buyerId + ", sellerId=" + sellerId
				+ ", cityId=" + cityId + ", createdDate=" + createdDate
				+ ", proposalId=" + proposalId + ", markerId=" + markerId
				+ ", campaignId=" + campaignId + ", price=" + price + ", note="
				+ note + ", status=" + status + ", availableStartDate="
				+ availableStartDate + ", availableEndDate=" + availableEndDate
				+ ", isBuyerAccepeted=" + isBuyerAccepeted
				+ ", isSellerAccepted=" + isSellerAccepted + ", messages="
				+ messages + "]";
	}

}

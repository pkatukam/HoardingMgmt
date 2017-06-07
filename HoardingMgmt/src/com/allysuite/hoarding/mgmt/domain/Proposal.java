package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;
import com.allysuite.hoarding.mgmt.commons.CustomJsonDateSerializer;

public class Proposal {
	private int buyerId;
	private int sellerId;
	private int cityId;
	private City city;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date createdDate;
	private int proposalId;
	private int markerId;
	private Marker marker;
	
	private int campaignId;
	private BigDecimal price;
	private String note;
	// New Read Resend Accept Decline
	private String status;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date availableStartDate;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date availableEndDate;
	private boolean isBuyerAccepeted;
	private boolean isSellerAccepted;
	private List<Message> messages;
	private int negotiationId;
	private Date createdDateTimeStamp;
	private Date acceptedDate;
	
	/**
	 * @return the acceptedDate
	 */
	public Date getAcceptedDate() {
		return acceptedDate;
	}

	/**
	 * @param acceptedDate the acceptedDate to set
	 */
	public void setAcceptedDate(Date acceptedDate) {
		this.acceptedDate = acceptedDate;
	}

	/**
	 * @return the createdDateTimeStamp
	 */
	public Date getCreatedDateTimeStamp() {
		return createdDateTimeStamp;
	}

	/**
	 * @param createdDateTimeStamp the createdDateTimeStamp to set
	 */
	public void setCreatedDateTimeStamp(Date createdDateTimeStamp) {
		this.createdDateTimeStamp = createdDateTimeStamp;
	}

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
	
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	public Date getAvailableStartDate() {
		return availableStartDate;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setAvailableStartDate(Date availableStartDate) {
		this.availableStartDate = availableStartDate;
	}

	@JsonSerialize(using =  CustomJsonDateSerializer.class)
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

	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

	public Marker getMarker() {
		return marker;
	}

	public void setMarker(Marker marker) {
		this.marker = marker;
	}

	
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

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Proposal [buyerId=" + buyerId + ", sellerId=" + sellerId
				+ ", cityId=" + cityId + ", city=" + city + ", createdDate="
				+ createdDate + ", proposalId=" + proposalId + ", markerId="
				+ markerId + ", marker=" + marker + ", campaignId="
				+ campaignId + ", price=" + price + ", note=" + note
				+ ", status=" + status + ", availableStartDate="
				+ availableStartDate + ", availableEndDate=" + availableEndDate
				+ ", isBuyerAccepeted=" + isBuyerAccepeted
				+ ", isSellerAccepted=" + isSellerAccepted + ", messages="
				+ messages + ", negotiationId=" + negotiationId
				+ ", createdDateTimeStamp=" + createdDateTimeStamp
				+ ", acceptedDate=" + acceptedDate + "]";
	}

}

package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonDeserialize;

import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;

public class Campaign {
	private int campaignId;
	private String jsonString;
	private String campaignTitle;
	private String campaignDescription;
	private Date campaignFrom;
	private Date campaignTo;
	private Date campaignRespondBy;
	private int buyerId;
	private String buyerName;
	private Date campaignCreatedDate;

	public String getBuyerName() {
		return buyerName;
	}

	public void setBuyerName(String buyerName) {
		this.buyerName = buyerName;
	}

	private BigDecimal campaignBudget;
	private int mediaType;
	private String mediaString;
	private List<Category> categories;
	private List<City> campaignCities;
	private List<Map> maps;

	public String getJsonString() {
		return jsonString;
	}

	public void setJsonString(String jsonString) {
		this.jsonString = jsonString;
	}

	public List<Map> getMaps() {
		return maps;
	}

	public void setMaps(List<Map> maps) {
		this.maps = maps;
	}

	public String getMediaString() {
		return mediaString;
	}

	public void setMediaString(String mediaString) {
		this.mediaString = mediaString;
	}

	public List<Category> getCategories() {
		return categories;
	}

	public void setCategories(List<Category> categories) {
		this.categories = categories;
	}

	public BigDecimal getCampaignBudget() {
		return campaignBudget;
	}

	public void setCampaignBudget(BigDecimal campaignBudget) {
		this.campaignBudget = campaignBudget;
	}

	public Campaign() {
		super();
	}

	public int getMediaType() {
		return mediaType;
	}

	public void setMediaType(int mediaType) {
		this.mediaType = mediaType;
	}

	public int getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(int campaignId) {
		this.campaignId = campaignId;
	}

	public String getCampaignTitle() {
		return campaignTitle;
	}

	public void setCampaignTitle(String campaignTitle) {
		this.campaignTitle = campaignTitle;
	}

	public String getCampaignDescription() {
		return campaignDescription;
	}

	public void setCampaignDescription(String campaignDescription) {
		this.campaignDescription = campaignDescription;
	}

	public Date getCampaignFrom() {
		return campaignFrom;
	}

	@Override
	public String toString() {
		return "Campaign [campaignId=" + campaignId + ", jsonString="
				+ jsonString + ", campaignTitle=" + campaignTitle
				+ ", campaignDescription=" + campaignDescription
				+ ", campaignFrom=" + campaignFrom + ", campaignTo="
				+ campaignTo + ", campaignRespondBy=" + campaignRespondBy
				+ ", buyerId=" + buyerId + ", buyerName=" + buyerName
				+ ", campaignBudget=" + campaignBudget + ", mediaType="
				+ mediaType + ", mediaString=" + mediaString + ", categories="
				+ categories + ", campaignCities=" + campaignCities + ", maps="
				+ maps + "]";
	}

	public List<City> getCampaignCities() {
		return campaignCities;
	}

	public void setCampaignCities(List<City> campaignCities) {
		this.campaignCities = campaignCities;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCampaignFrom(Date campaignFrom) {
		this.campaignFrom = campaignFrom;
	}

	public Date getCampaignTo() {
		return campaignTo;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCampaignTo(Date campaignTo) {
		this.campaignTo = campaignTo;
	}

	public Date getCampaignRespondBy() {
		return campaignRespondBy;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCampaignRespondBy(Date campaignRespondBy) {
		this.campaignRespondBy = campaignRespondBy;
	}

	public int getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(int buyerId) {
		this.buyerId = buyerId;
	}

	public Date getCampaignCreatedDate() {
		return campaignCreatedDate;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCampaignCreatedDate(Date campaignCreatedDate) {
		this.campaignCreatedDate = campaignCreatedDate;
	}

}
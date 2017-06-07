package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.allysuite.hoarding.mgmt.commons.CustomJsonDateDeserializer;
import com.allysuite.hoarding.mgmt.commons.CustomJsonDateSerializer;

public class Campaign {
	private int campaignId;
	private String jsonString;
	private String campaignTitle;
	private String campaignDescription;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date campaignFrom;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date campaignTo;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	private Date campaignRespondBy;
	private int buyerId;
	private String buyerName;
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
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
	
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
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
	
	@JsonSerialize(using =  CustomJsonDateSerializer.class)
	public Date getCampaignTo() {
		return campaignTo;
	}

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	public void setCampaignTo(Date campaignTo) {
		this.campaignTo = campaignTo;
	}

	@JsonSerialize(using =  CustomJsonDateSerializer.class)
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
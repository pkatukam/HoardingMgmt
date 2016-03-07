package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class Map {

	private int mapId;
	private List<Shapes> shapes;
	private int cityId;
	private int campaignId;

	public int getCampaignId() {
		return campaignId;
	}

	public void setCampaignId(int campaignId) {
		this.campaignId = campaignId;
	}

	public int getMapId() {
		return mapId;
	}

	public void setMapId(int mapId) {
		this.mapId = mapId;
	}

	public List<Shapes> getShapes() {
		return shapes;
	}

	public void setShapes(List<Shapes> shapes) {
		this.shapes = shapes;
	}

	@Override
	public String toString() {
		return "Map [mapId=" + mapId + ", shapes=" + shapes + ", cityId="
				+ cityId + ", campaignId=" + campaignId + "]";
	}

	public int getCityId() {
		return cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

}

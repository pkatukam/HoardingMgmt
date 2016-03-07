package com.allysuite.hoarding.mgmt.domain;

public class City {

	public City() {
		super();
		// TODO Auto-generated constructor stub
	}

	public City(int cityId, String cityName) {
		super();
		this.cityId = cityId;
		this.cityName = cityName;
	}

	public City(int cityId) {
		super();
		this.cityId = cityId;
	}

	private int cityId;
	private String cityName;
	private Coardinate coardinate;

	public int getCityId() {
		return cityId;
	}

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public Coardinate getCoardinate() {
		return coardinate;
	}

	public void setCoardinate(Coardinate coardinate) {
		this.coardinate = coardinate;
	}

	@Override
	public String toString() {
		return "City [cityId=" + cityId + ", cityName=" + cityName
				+ ", coardinate=" + coardinate + "]";
	}

}

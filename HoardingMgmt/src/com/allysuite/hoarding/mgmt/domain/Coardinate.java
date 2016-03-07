package com.allysuite.hoarding.mgmt.domain;

public class Coardinate {
	
	@Override
	public String toString() {
		return "Coardinate [latitude=" + latitude + ", longitude=" + longitude
				+ ", circleId=" + circleId + ", polygonId=" + polygonId + "]";
	}

	private double latitude;
	private double longitude;
	private int circleId;
	private int polygonId;
	private int coordinateId;
	private String polygonStr;
	

	public String getPolygonStr() {
		return polygonStr;
	}

	public void setPolygonStr(String polygonStr) {
		this.polygonStr = polygonStr;
	}

	public int getCoordinateId() {
		return coordinateId;
	}

	public void setCoordinateId(int coordinateId) {
		this.coordinateId = coordinateId;
	}

	public Coardinate(double latitude, double longitude) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
	}
	
	
	public Coardinate(double latitude, double longitude , int polygonId, int coordinateId) {
		super();
		this.latitude = latitude;
		this.longitude = longitude;
		this.polygonId = polygonId;
		this.coordinateId = coordinateId;
	}

	public Coardinate() {
		super();
		// TODO Auto-generated constructor stub
	}

	public int getCircleId() {
		return circleId;
	}

	public void setCircleId(int circleId) {
		this.circleId = circleId;
	}

	public int getPolygonId() {
		return polygonId;
	}

	public void setPolygonId(int polygonId) {
		this.polygonId = polygonId;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

}

package com.allysuite.hoarding.mgmt.domain;

public class Circle implements Shapes {
	
	private int circleId;
	private int mapId;

	public int getMapId() {
		return mapId;
	}

	public void setMapId(int mapId) {
		this.mapId = mapId;
	}

	public int getCircleId() {
		return circleId;
	}

	public void setCircleId(int circleId) {
		this.circleId = circleId;
	}

	private double radius;
	private Coardinate coardinate;

	public double getRadius() {
		return radius;
	}

	public void setRadius(double radius) {
		this.radius = radius;
	}

	public Coardinate getCoardinate() {
		return coardinate;
	}

	public void setCoardinate(Coardinate coardinate) {
		this.coardinate = coardinate;
	}

	

	@Override
	public String toString() {
		return "Circle [circleId=" + circleId + ", mapId=" + mapId
				+ ", radius=" + radius + ", coardinate=" + coardinate + "]";
	}

	@Override
	public int getShape() {
		return CIRCLE;
	}

}

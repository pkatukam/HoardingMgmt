package com.allysuite.hoarding.mgmt.domain;

public class Rectangle implements Shapes {

	public Rectangle(int rectangleId, int mapId, double bound1, double bound2,
			double bound3, double bound4) {
		super();
		this.rectangleId = rectangleId;
		this.mapId = mapId;
		this.bound1 = bound1;
		this.bound2 = bound2;
		this.bound3 = bound3;
		this.bound4 = bound4;
	}

	public Rectangle() {
		super();
		// TODO Auto-generated constructor stub
	}

	private int rectangleId;

	private int mapId;

	public int getMapId() {
		return mapId;
	}

	public void setMapId(int mapId) {
		this.mapId = mapId;
	}

	public int getRectangleId() {
		return rectangleId;
	}

	public void setRectangleId(int rectangleId) {
		this.rectangleId = rectangleId;
	}

	private double bound1;
	private double bound2;
	private double bound3;
	private double bound4;

	public double getBound1() {
		return bound1;
	}

	public void setBound1(double bound1) {
		this.bound1 = bound1;
	}

	public double getBound2() {
		return bound2;
	}

	public void setBound2(double bound2) {
		this.bound2 = bound2;
	}

	public double getBound3() {
		return bound3;
	}

	public void setBound3(double bound3) {
		this.bound3 = bound3;
	}

	public double getBound4() {
		return bound4;
	}

	public void setBound4(double bound4) {
		this.bound4 = bound4;
	}

	@Override
	public String toString() {
		return "Rectangle [rectangleId=" + rectangleId + ", mapId=" + mapId
				+ ", bound1=" + bound1 + ", bound2=" + bound2 + ", bound3="
				+ bound3 + ", bound4=" + bound4 + "]";
	}

	@Override
	public int getShape() {
		return RECTANGLE;
	}

}

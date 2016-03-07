package com.allysuite.hoarding.mgmt.domain;

import java.util.List;

public class Polygon implements Shapes {

	private int polygonId;
	private int mapId;
	private List<Coardinate> path;


	public int getMapId() {
		return mapId;
	}

	public void setMapId(int mapId) {
		this.mapId = mapId;
	}

	public int getPolygonId() {
		return polygonId;
	}

	public void setPolygonId(int polygonId) {
		this.polygonId = polygonId;
	}

	
	public List<Coardinate> getPath() {
		return path;
	}

	public void setPath(List<Coardinate> path) {
		this.path = path;
	}

	@Override
	public int getShape() {
		return POLYGON;
	}

	@Override
	public String toString() {
		return "Polygon [polygonId=" + polygonId + ", mapId=" + mapId
				+ ", path=" + path + "]";
	}

}

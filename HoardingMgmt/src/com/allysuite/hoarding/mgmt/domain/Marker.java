package com.allysuite.hoarding.mgmt.domain;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import javax.xml.bind.annotation.XmlTransient;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.springframework.web.multipart.MultipartFile;

public class Marker {

	private int markerId;
	private String markerName;
	private double latitude;
	private double longitude;
	private int sellerId;
	private String address;
	private BigDecimal rate;
	private String availability;
	private int categoryId;
	private String categoryName;
	private String lighting;
	private int height;
	private int width;
	@JsonIgnore
	private MultipartFile[] imageFiles;
	private int[] markerDatabaseIds;

	public int[] getMarkerDatabaseIds() {
		return markerDatabaseIds;
	}

	public void setMarkerDatabaseIds(int[] markerDatabaseIds) {
		this.markerDatabaseIds = markerDatabaseIds;
	}

	private int cityId;
	private String cityName;
	private List<MarkerGallery> markerGallery;

	public int getSellerId() {
		return sellerId;
	}

	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}

	public int getCityId() {
		return cityId;
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

	public void setCityId(int cityId) {
		this.cityId = cityId;
	}

	public String getCityName() {
		return cityName;
	}

	public void setCityName(String cityName) {
		this.cityName = cityName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public BigDecimal getRate() {
		return rate;
	}

	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}

	public String getAvailability() {
		return availability;
	}

	public void setAvailability(String availability) {
		this.availability = availability;
	}

	public int getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(int categoryId) {
		this.categoryId = categoryId;
	}

	public String getLighting() {
		return lighting;
	}

	public void setLighting(String lighting) {
		this.lighting = lighting;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	@XmlTransient
	public MultipartFile[] getImageFiles() {
		return imageFiles;
	}

	@Override
	public String toString() {
		return "Marker [ markerId=" + markerId + ", markerName=" + markerName
				+ ", latitude=" + latitude + ", longitude=" + longitude
				+ ", sellerId=" + sellerId + ", address=" + address + ", rate="
				+ rate + ", availability=" + availability + ", categoryId="
				+ categoryId + ", categoryName=" + categoryName + ", lighting="
				+ lighting + ", height=" + height + ", width=" + width
				+ ", imageFiles=" + Arrays.toString(imageFiles)
				+ ", markerDatabaseIds=" + Arrays.toString(markerDatabaseIds)
				+ ", cityId=" + cityId + ", cityName=" + cityName
				+ ", markerGallery=" + markerGallery + "]";
	}

	public void setImageFiles(MultipartFile[] imageFiles) {
		this.imageFiles = imageFiles;
	}

	public Marker() {
		super();
	}

	public int getMarkerId() {
		return markerId;
	}

	public void setMarkerId(int markerId) {
		this.markerId = markerId;
	}

	public String getMarkerName() {
		return markerName;
	}

	public void setMarkerName(String markerName) {
		this.markerName = markerName;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public List<MarkerGallery> getMarkerGallery() {
		return markerGallery;
	}

	public void setMarkerGallery(List<MarkerGallery> markerGallery) {
		this.markerGallery = markerGallery;
	}

}

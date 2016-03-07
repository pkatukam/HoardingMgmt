package com.allysuite.hoarding.mgmt.domain;


public class MarkerGallery {

	public MarkerGallery() {
		super();
		// TODO Auto-generated constructor stub
	}

	private int markerGalleryId;
	private int markerId;
	private byte[] imageFile;

	public int getMarkerGalleryId() {
		return markerGalleryId;
	}

	public void setMarkerGalleryId(int markerGalleryId) {
		this.markerGalleryId = markerGalleryId;
	}

	public int getMarkerId() {
		return markerId;
	}

	public void setMarkerId(int markerId) {
		this.markerId = markerId;
	}
	
	public byte[] getImageFile() {
		return imageFile;
	}

	public void setImageFile(byte[] imageFile) {
		this.imageFile = imageFile;
	}

	@Override
	public String toString() {
		return "MarkerGallery [markerGalleryId=" + markerGalleryId
				+ ", markerId=" + markerId + "]";
	}

}
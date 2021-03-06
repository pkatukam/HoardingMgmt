package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.dao.MarkerDAO;
import com.allysuite.hoarding.mgmt.dao.MarkerGalleryDAO;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.MarkerGallery;

@Transactional
@Service("markerService")
public class MarkerService {

	@Autowired
	private MarkerDAO markerDao;
	
	@Autowired
	private MarkerGalleryDAO markerGalleryDao;

	public Marker createMarker(Marker marker) {
		try {
			return markerDao.create(marker);
		} catch (Exception ex) {
			ex.printStackTrace();
			return new Marker();
		}
	}



	
	public List<Marker> getAllMarkersOfSellerByCityID(int sellerId, int cityId) {
		return markerDao.getMarkerBySellerIDAndCityID(sellerId, cityId);
	}

	public List<Marker> getMarkerBySellerIDAndCityIDWithImage(int sellerId, int cityId) {
		return markerDao.getMarkerBySellerIDAndCityIDWithImage(sellerId, cityId);
	}
	
	public Marker updateMarker(Marker marker) {
		try {
			return markerDao.update(marker);
		} catch (Exception ex) {
			ex.printStackTrace();
			return marker;
		}
	}
	
	public boolean deleteMarker(int markerId) {
		try {
			return markerDao.delete(markerId);
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	public List<Marker> getAllMarkersForBuyerWithProposals(int buyerId) {
		return markerDao.getMarkersByBuyerIDAndProposalExist(buyerId);
	}
	
	public List<Marker> getAllMarkersForBuyerWithProposals(int buyerId, int campaignId) {
		return markerDao.getMarkersByBuyerIDAndProposalExist(buyerId, campaignId);
	}




	public List<MarkerGallery> getImageGallery(int markerId) {
		return markerGalleryDao.getImagesForMarker(markerId);
	}




}

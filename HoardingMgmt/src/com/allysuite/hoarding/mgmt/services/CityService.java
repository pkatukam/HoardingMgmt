package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.CityDAO;
import com.allysuite.hoarding.mgmt.domain.City;

@Service("cityService")
public class CityService {

	@Autowired
	private CityDAO cityDAO;

	public List<City> getAllCitieWithProposalsForBuyerId(int buyerId) {
		return cityDAO.getAllCitieForProposalExistByBuyerId(buyerId);
	}


}

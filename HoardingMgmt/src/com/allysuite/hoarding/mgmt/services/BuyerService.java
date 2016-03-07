package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.BuyerDAO;
import com.allysuite.hoarding.mgmt.domain.Buyer;

@Service("buyerService")
public class BuyerService {
	
	@Autowired
	private BuyerDAO buyerDao;

	public BuyerDAO getBuyerDao() {
		return buyerDao;
	}

	public void setBuyerDao(BuyerDAO buyerDao) {
		this.buyerDao = buyerDao;
	}
	
	public List<Buyer> getCurrent() {
		return buyerDao.getBuyers();
	}

	public List<Buyer> getSentProposalBuyers(int sellerId) {
		return buyerDao.getBuyersBySellerIDWithProposals(sellerId);
	}
}

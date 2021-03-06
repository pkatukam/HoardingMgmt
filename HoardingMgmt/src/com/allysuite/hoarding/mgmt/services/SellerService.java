package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.SellerDAO;
import com.allysuite.hoarding.mgmt.domain.Seller;

@Service("sellerService")
public class SellerService {

	@Autowired
	private SellerDAO sellerDao;

	public List<Seller> getCurrent() {
		return sellerDao.getSellers();
	}

	public List<Seller> getSentProposalVendors(int buyerId) {
		return sellerDao.getSellersByBuyerIDWithProposals(buyerId);
	}

	public List<Seller> getSentProposalVendors(int buyerId, int campaignId) {
		return sellerDao.getSellersByBuyerIDWithProposals(buyerId, campaignId);
	}

	public Seller getSellerByProposalId(int proposalId) {
		return sellerDao.getSellerByProposalId(proposalId);
	}

	public Seller getSellerBySellerId(int sellerId) {
		return sellerDao.getSellerBySellerId(sellerId);
	}

}

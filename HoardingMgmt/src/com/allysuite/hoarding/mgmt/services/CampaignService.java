package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.dao.CampaignDAO;
import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.Seller;

@Transactional
@Service("campaignService")
public class CampaignService {

	@Autowired
	private CampaignDAO campaignDao;

	public boolean createCampaign(Campaign campaign) {
		try {
			return campaignDao.create(campaign);
		} catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
	}

	public List<Campaign> getAllCampaignsForBuyer(int buyerId) {
		return campaignDao.getCampaignByBuyerId(buyerId);
	}

	public Campaign getCampaignByID(int campaignid) {
		return campaignDao.getCampaignById(campaignid);
	}

	public List<Campaign> getCampaignFeed(int sellerId) {
		return campaignDao.getCampaignBySellerId(sellerId);
	}

	public List<Campaign> getSellerCampaignList(Seller seller) {
		// TODO Auto-generated method stub
		return campaignDao.getCampaignsForSeller(seller);
	}

	public Campaign getCampaignByID(int campaignid, Seller seller) {
		return campaignDao.getCampaignById(campaignid, seller);
	}

	public List<Campaign> getAllCampaignsHavingProposals(int buyerId) {
		// TODO Auto-generated method stub
		return campaignDao.getCampaignsByBuyerIdWithProposals(buyerId);
	}

}

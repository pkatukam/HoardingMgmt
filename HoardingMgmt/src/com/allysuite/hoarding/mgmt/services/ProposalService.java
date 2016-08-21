package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.ProposalDAO;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;

@Service("proposalService")
public class ProposalService {

	@Autowired
	private ProposalDAO proposalDao;

	public Proposal sendProposal(Proposal proposal) {
		return proposalDao.create(proposal);
	}

	public List<Proposal> getProposalsForCampaign(int campaignId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByCampaignID(campaignId);
	}

	public List<Proposal> getAllProposalsForBuyer(int buyerId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByBuyerID(buyerId);
	}

	public void updateStatusAsRead(String[] proposals) {
		proposalDao.updateProposalStatusToRead(proposals);
	}

	public List<ProposalFeed> getProposalFeedsForSeller(int sellerId) {
		return proposalDao.getProposalFeedsForSeller(sellerId);
	}
	
	public List<ProposalFeed> getProposalFeedsForBuyer(int buyerId) {
		return proposalDao.getProposalFeedsForBuyer(buyerId);
	}
	
	public boolean updateProposalFetchDate(ProposalFeed proposalFeed) {
		return proposalDao.updateProposalFetchDate(proposalFeed);
	}

}

package com.allysuite.hoarding.mgmt.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.ProposalDAO;
import com.allysuite.hoarding.mgmt.dao.ProposalNegotiationDAO;
import com.allysuite.hoarding.mgmt.domain.Notification;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
import com.allysuite.hoarding.mgmt.domain.ProposalNegotiation;

@Service("proposalService")
public class ProposalService {

	@Autowired
	private ProposalDAO proposalDao;

	@Autowired
	private ProposalNegotiationDAO proposalNegotiationDao;

	public Proposal sendProposal(Proposal proposal) {
		return proposalDao.create(proposal);
	}

	public Proposal getProposalsByProposalId(int proposalId) {
		return proposalDao.getProposalsByID(proposalId);
	}

	public List<Proposal> getProposalsForCampaign(int campaignId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByCampaignID(campaignId);
	}

	public List<Proposal> getProposalsByCampaignIDAndSellerID(int campaignId,
			int sellerId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByCampaignIDAndSellerID(campaignId,
				sellerId);
	}

	public List<Proposal> getAllProposalsForBuyer(int buyerId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByBuyerID(buyerId);
	}

	public List<Proposal> getAllProposalsForBuyer(int buyerId, int campaignId) {
		// TODO Auto-generated method stub
		return proposalDao.getProposalsByBuyerID(buyerId, campaignId);
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

	public boolean acceptProposal(int proposalId, Date acceptedDate) {
		return proposalDao.updateProposalStatusToAccept(proposalId,
				acceptedDate);
	}

	public ProposalNegotiation negotiatePrice(
			ProposalNegotiation proposalNegotiation) {
		return proposalNegotiationDao.create(proposalNegotiation);

	}

	public boolean acceptProposal(int proposalId, int negotiationId,
			Date acceptedDate, String initiatedBy) {
		return proposalDao.updateProposalStatusToAccept(proposalId,
				negotiationId, acceptedDate, initiatedBy);
	}

	public List<ProposalNegotiation> getAllNegotiationHistory(int buyerId,
			int campaignId) {
		// TODO Auto-generated method stub
		return proposalNegotiationDao.getAllNegotiationByBuyerIdAndCampaignId(
				buyerId, campaignId);
	}

	public List<ProposalNegotiation> getAllNegotiationHistoryForSeller(
			int sellerId, int campaignId) {
		// TODO Auto-generated method stub
		return proposalNegotiationDao.getAllNegotiationBySellerIdAndCampaignId(
				sellerId, campaignId);
	}

	public Object markAllProposalNegotiationsViewedForUserProposal(
			int proposalId, String initatedBy) {
		// TODO Auto-generated method stub
		return proposalNegotiationDao.updateAllProposalNegotiationAsViewedForUserByProposalId(
				proposalId, initatedBy);
	}

	public List<Notification> pullUnViewedNegotiations(int userId, String user, List<Notification> list) {
		// TODO Auto-generated method stub
		return proposalNegotiationDao.getUnViewedNegotiationsForUser(userId, user, list);
	}

	public Object markProposalAcceptedView(int entityId, String initiatedBy) {
		// TODO Auto-generated method stub
		return proposalDao.updateProposalAcceptedViewedForUserByProposalId(
				entityId, initiatedBy);
	}

	public List<Notification> pullAcceptedProposals(int userId, String user,
			List<Notification> sortedList) {
		return proposalDao.getAcceptedProposalsForUser(userId, user, sortedList);
	}

	public void updateStatusAsInNegotiation(int proposalId) {
		proposalDao.updateProposalStatusToInNegotiation(proposalId);
		
	}

}

package com.allysuite.hoarding.mgmt.controllers;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.allysuite.hoarding.mgmt.commons.CommonUtil;
import com.allysuite.hoarding.mgmt.commons.NotificationDateComparator;
import com.allysuite.hoarding.mgmt.commons.SortedList;
import com.allysuite.hoarding.mgmt.domain.Notification;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
import com.allysuite.hoarding.mgmt.exceptions.InvalidUserTypeException;
import com.allysuite.hoarding.mgmt.services.ProposalService;

@Controller
public class NotificationController {

	private Logger logger = Logger.getLogger(NotificationController.class);

	@Autowired
	private ProposalService proposalService;

	@RequestMapping(value = "/pullUnViewedNotifications", method = RequestMethod.POST)
	public @ResponseBody String pullUnViewedNotifications(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String user = request.getParameter("user");
		int userId = Integer.parseInt(request.getParameter("userId"));
		logger.info("User Id - " + userId + " User Type - " + user);

		if (!(user.equals(CommonUtil.BUYER) || user.equals(CommonUtil.SELLER))) {
			throw new InvalidUserTypeException(user);
		}

		List<Notification> sortedList = new SortedList<Notification>(
				new NotificationDateComparator());
		proposalService.pullUnViewedNegotiations(userId, user, sortedList);
		proposalService.pullAcceptedProposals(userId, user, sortedList);

		logger.info("Sorted List" + sortedList);
		String notificationListJson = new ObjectMapper()
				.writeValueAsString(sortedList);
		logger.info(notificationListJson);

		return notificationListJson;
	}

	@RequestMapping(value = "/makeNotificationViewed", method = RequestMethod.POST)
	public @ResponseBody String makeNotificationViewed(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		byte entity = Byte.parseByte(request.getParameter("entity"));
		byte entityAction = Byte.parseByte(request.getParameter("enityAction"));
		int entityId = Integer.parseInt(request.getParameter("entityId"));

		String initatedBy = request.getParameter("initiatedBy");

		if (entity == CommonUtil.ENTITY_PROPOSAL_NEGOTIATION
				&& entityAction == CommonUtil.ENTITY_ACTION_CREATE) {
			return makeNegotiationViewed(request, initatedBy);
		} else if (entity == CommonUtil.ENTITY_PROPOSAL
				&& entityAction == CommonUtil.ENTITY_ACTION_ACCEPT) {
			return makeProposalAcceptedViewed(request, initatedBy, entityId);
		} else {
			return "Failure";
		}
	}

	private String makeProposalAcceptedViewed(HttpServletRequest request,
			String initatedBy, int entityId) {
		logger.info("Proposal Id - " + entityId);
		logger.info("Initiated By - " + initatedBy);
		if (proposalService.markProposalAcceptedView(entityId, initatedBy)
				.equals("Success")) {
			Proposal proposal = proposalService
					.getProposalsByProposalId(entityId);
			HttpSession session = request.getSession(false);
			if (session != null) {
				if (initatedBy.equals("s")) {
					ProposalFeed proposalFeed = new ProposalFeed();
					proposalFeed.setCampaignId(proposal.getCampaignId());
					proposalFeed.setProposalId(entityId);
					session.setAttribute("openProposalFeed", proposalFeed);
					session.setAttribute("openProposalDetails",
							proposal.getProposalId());
					session.setAttribute("openProposalAction",
							CommonUtil.OPEN_PROPOSAL_ACTION_NEGOTIATION);
					return "/viewProposalList";
				} else {
					session.setAttribute("openCampaignDetails",
							String.valueOf(proposal.getCampaignId()));
					session.setAttribute("openProposalDetails",
							proposal.getProposalId());
					session.setAttribute("openProposalAction",
							CommonUtil.OPEN_PROPOSAL_ACTION_NEGOTIATION);
					return "/viewSellerCampaignDetails";
				}
			}
		} else {
			return "Failure";
		}
		return "/login";

	}

	private String makeNegotiationViewed(HttpServletRequest request,
			String initatedBy) {
		int proposalId = Integer.parseInt(request.getParameter("proposalId"));
		logger.info("Proposal Id - " + proposalId);
		logger.info("Initiated By - " + initatedBy);
		if (proposalService.markAllProposalNegotiationsViewedForUserProposal(
				proposalId, initatedBy).equals("Success")) {
			Proposal proposal = proposalService
					.getProposalsByProposalId(proposalId);
			HttpSession session = request.getSession(false);
			if (session != null) {
				if (initatedBy.equals("s")) {
					ProposalFeed proposalFeed = new ProposalFeed();
					proposalFeed.setCampaignId(proposal.getCampaignId());
					proposalFeed.setProposalId(proposalId);
					session.setAttribute("openProposalFeed", proposalFeed);
					session.setAttribute("openProposalDetails",
							proposal.getProposalId());
					session.setAttribute("openProposalAction",
							CommonUtil.OPEN_PROPOSAL_ACTION_NEGOTIATION);
					return "/viewProposalList";
				} else {
					session.setAttribute("openCampaignDetails",
							String.valueOf(proposal.getCampaignId()));
					session.setAttribute("openProposalDetails",
							proposal.getProposalId());
					session.setAttribute("openProposalAction",
							CommonUtil.OPEN_PROPOSAL_ACTION_NEGOTIATION);
					return "/viewSellerCampaignDetails";
				}
			}
		} else {
			return "Failure";
		}
		return "/login";
	}

}

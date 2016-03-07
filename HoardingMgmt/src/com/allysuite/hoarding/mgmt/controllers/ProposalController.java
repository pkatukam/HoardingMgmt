package com.allysuite.hoarding.mgmt.controllers;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalEntry;
import com.allysuite.hoarding.mgmt.domain.Seller;
import com.allysuite.hoarding.mgmt.domain.User;
import com.allysuite.hoarding.mgmt.services.BuyerService;
import com.allysuite.hoarding.mgmt.services.CampaignService;
import com.allysuite.hoarding.mgmt.services.CityService;
import com.allysuite.hoarding.mgmt.services.MarkerService;
import com.allysuite.hoarding.mgmt.services.ProposalService;
import com.allysuite.hoarding.mgmt.services.SellerService;

@Controller
public class ProposalController {

	private Logger logger = Logger.getLogger(ProposalController.class);

	@Autowired
	private CampaignService campaignService;

	@Autowired
	private ProposalService proposalService;

	@Autowired
	private MarkerService markerService;

	@Autowired
	private SellerService sellerService;

	@Autowired
	private BuyerService buyerService;

	@Autowired
	private CityService cityService;

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getMarkersAndProposals", method = RequestMethod.POST)
	public @ResponseBody String getMarkersAndProposals(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----getMarkersAndProposals---");
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			if (user != null) {
				int cityId = Integer.valueOf(request.getParameter("cityId"));
				int campaignId = Integer.valueOf(request
						.getParameter("campaignId"));
				logger.info(cityId + "************ " + campaignId);
				List<Marker> markerList = markerService
						.getAllMarkersOfSellerByCityID(
								((Seller) user).getSellerId(), cityId);
				((Seller) user).setMarkers(markerList);
				List<Proposal> proposals = proposalService
						.getProposalsForCampaign(campaignId);
				int sellerId = ((Seller) user).getSellerId();
				logger.info("SellerId --> " + sellerId);
				List<Buyer> buyers = buyerService
						.getSentProposalBuyers(sellerId);
				String buyersJson = new ObjectMapper()
						.writeValueAsString(buyers);
				List<Category> categories = (List<Category>) session
						.getAttribute("Categories");
				String json = new ObjectMapper().writeValueAsString(markerList);
				String category_json = new ObjectMapper()
						.writeValueAsString(categories);
				String proposalsJson = new ObjectMapper()
						.writeValueAsString(proposals);
				String proposalsList = "proposals";
				String categoryList = "categoryList";
				String markerData = "markerData";
				String buyersList = "buyersList";
				String jason = "{ \"" + categoryList + "\" : " + category_json
						+ ", \"" + markerData + "\" :  " + json + ", \""
						+ proposalsList + "\" :  " + proposalsJson + ", \""
						+ buyersList + "\" :  " + buyersJson + "}";
				logger.info(jason);
				return jason;
			}
		}
		return "{}";
	}

	@RequestMapping(value = "/sendProposal", method = RequestMethod.POST)
	public @ResponseBody String sendProposal(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("Send Proposal");
		String proposalJsonString = request.getParameter("proposalJsonString");
		String markerJsonString = request.getParameter("markerJsonString");
		logger.info(proposalJsonString + " " + markerJsonString);
		boolean markerUpdate = true;
		if (markerJsonString != null && !markerJsonString.equals("null")) {
			markerUpdate = false;
			Marker marker = new ObjectMapper().readValue(markerJsonString,
					Marker.class);
			logger.info(marker);
			if (marker != null) {
				markerService.updateMarker(marker);
				markerUpdate = true;
			}
		}
		if (markerUpdate) {
			Proposal proposal = new ObjectMapper().readValue(
					proposalJsonString, Proposal.class);
			logger.info(proposal);
			proposal.setCreatedDate(new Date());
			proposal = proposalService.sendProposal(proposal);
			String proposalJSON = new ObjectMapper()
					.writeValueAsString(proposal);
			return proposalJSON;
		}
		return "failure";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getProposals", method = RequestMethod.POST)
	public @ResponseBody String getProposals(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----getProposalEntries---");
		HttpSession session = request.getSession(false);
		try {
			if (session != null) {
				User user = (User) session.getAttribute("user");
				if (user != null) {
					int buyerId = ((Buyer) user).getBuyerId();
					logger.info("Get Proposals - BuyerId --> " + buyerId);
					logger.info("Get Proposals - Proposal Read --> "
							+ request.getParameterValues("proposalsRead"));
					String[] proposals = request
							.getParameterValues("proposalsRead");
					if (proposals != null) {
						for (int i = 0; i < proposals.length; i++) {
							logger.info("Get Proposals - Parameter Values --> "
									+ proposals[i]);
						}
						proposalService.updateStatusAsRead(proposals);
					}
					ProposalEntry proposalEntry = new ProposalEntry();
					proposalEntry.setCampaigns(campaignService
							.getAllCampaignsHavingProposals(buyerId));
					proposalEntry.setMarkers(markerService
							.getAllMarkersForBuyerWithProposals(buyerId));
					proposalEntry.setProposals(proposalService
							.getAllProposalsForBuyer(buyerId));
					proposalEntry.setSellers(sellerService
							.getSentProposalVendors(buyerId));
					proposalEntry.setCities(cityService
							.getAllCitieWithProposalsForBuyerId(buyerId));
					List<Category> categories = (List<Category>) session
							.getAttribute("Categories");
					proposalEntry.setCategories(categories);

					String proposalsEntryJson = new ObjectMapper()
							.writeValueAsString(proposalEntry);

					// logger.info("JSON String generated --> "
					// + proposalsEntryJson);
					return proposalsEntryJson;
				}
			}
		} catch (ClassCastException e) {
			session.invalidate();
		}
		return "";
	}
}

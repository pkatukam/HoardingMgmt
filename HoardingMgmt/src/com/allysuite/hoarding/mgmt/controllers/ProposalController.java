package com.allysuite.hoarding.mgmt.controllers;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalEntry;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
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
				// ((Seller) user).setMarkers(markerList);
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
					proposalEntry.setProposalFeed(null);

					ProposalFeed proposalFeed = (ProposalFeed) session
							.getAttribute("openProposalFeed");
					if (proposalFeed != null) {
						proposalEntry.setProposalFeed(proposalFeed);
						if (proposalFeed.getFetchDateBuyer() == null
								&& proposalFeed.getProposals() != null)
							proposalService
									.updateProposalFetchDate(proposalFeed);
						//session.removeAttribute("openProposalFeed");
					}

					String proposalsEntryJson = new ObjectMapper()
							.writeValueAsString(proposalEntry);

					logger.info("JSON String generated --> "
							+ proposalsEntryJson);
					return proposalsEntryJson;
				}
			}
		} catch (ClassCastException e) {
			session.invalidate();
		}
		return "";
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/fetchProposalFeed", method = RequestMethod.POST)
	public @ResponseBody String fetchProposalFeed(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----fetchProposalFeed---");
		HttpSession session = request.getSession(false);
		logger.info("-----fetchProposalFeed---" + session);
		try {
			if (session != null) {
				User user = (User) session.getAttribute("user");
				logger.info("-----fetchProposalFeed---" + user);
				if (user != null) {
					List<ProposalFeed> proposals = null;
					if (user.getUser().equalsIgnoreCase("buyer")) {
						int buyerId = ((Buyer) user).getBuyerId();
						logger.info("Get proposal feed for buyerId --> "
								+ buyerId);
						proposals = proposalService
								.getProposalFeedsForBuyer(buyerId);
						String proposalFeedJson = new ObjectMapper()
								.writeValueAsString(proposals);
						String proposalFeed = "proposalFeedList";
						String feedJson = "{ \"" + proposalFeed + "\" : "
								+ proposalFeedJson + "}";
						logger.info("Controller For Buyer  --- > " + feedJson);
						return feedJson;
					} else {
						int sellerId = ((Seller) user).getSellerId();
						logger.info("Get Campaign Feed for SellerId --> "
								+ sellerId);
						proposals = proposalService
								.getProposalFeedsForSeller(sellerId);
						List<Buyer> buyers = buyerService
								.getSentProposalBuyers(sellerId);
						String buyersJson = new ObjectMapper()
								.writeValueAsString(buyers);
						String proposalFeedJson = new ObjectMapper()
								.writeValueAsString(proposals);
						String userJson = new ObjectMapper()
								.writeValueAsString(user);
						List<Category> categories = (List<Category>) session
								.getAttribute("Categories");
						String category_json = new ObjectMapper()
								.writeValueAsString(categories);
						String proposalFeed = "proposalFeedList";
						String userJsonStr = "user";
						String buyersList = "buyersList";
						String categoryList = "categoryList";
						String feedJson = "{ \"" + proposalFeed + "\" : "
								+ proposalFeedJson + ",\"" + userJsonStr
								+ "\" : " + userJson + ",\"" + buyersList
								+ "\" :  " + buyersJson + ",\"" + categoryList
								+ "\" : " + category_json + "}";
						logger.info("Controller  --- > " + feedJson);
						return feedJson;
					}

				}
			}
		} catch (ClassCastException e) {
			e.printStackTrace();
			session.invalidate();
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return "";
	}

	@RequestMapping(value = "/openProposalFeed", method = RequestMethod.POST)
	public @ResponseBody String openProposalFeed(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("openProposalFeed");
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info("-----openProposalFeed---" + session);
			String proposalJsonString = request.getParameter("proposalFeed");
			logger.info(proposalJsonString);
			ProposalFeed proposalFeed = new ObjectMapper().readValue(
					proposalJsonString, ProposalFeed.class);
			logger.info(proposalFeed);
			session.setAttribute("openProposalFeed", proposalFeed);
		} else {
			return "/login";
		}
		return "/viewProposalList";
	}

	@RequestMapping(value = "/viewCampaignProposals", method = RequestMethod.POST)
	public @ResponseBody String viewCampaignProposals(HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		int campaignId = Integer.valueOf(request.getParameter("campaignId"));
		logger.info("View Campaign Proposals" + campaignId);
		HttpSession session = request.getSession(false);
		if (session != null) {
			ProposalFeed proposalFeed = new ProposalFeed();
			proposalFeed.setCampaignId(campaignId);
			session.setAttribute("openProposalFeed", proposalFeed);
		} else {
			return "/login";
		}
		return "/viewProposalList";
	}

	@RequestMapping("/viewCampaignProposalDetails")
	public ModelAndView viewCampaignProposalDetails(HttpServletRequest request,
			Model model) {
		HttpSession session = request.getSession(false);
		try {
			if (session != null) {
				logger.info("ProposalController Campaign Proposal Details List");
				User user = (User) session.getAttribute("user");
				if (user != null) {
					ModelAndView mv = new ModelAndView(
							"campaignProposalDetails");
					List<ProposalFeed> list = campaignService
							.getAllCampaignProposalDetailsListForBuyer(((Buyer) user)
									.getBuyerId());
					mv.addObject("campaignProposalDetailsList", list);
					return mv;
				}
			}
		} catch (ClassCastException e) {
			e.printStackTrace();
			session.invalidate();
		}
		model.addAttribute("login", new Login());
		model.addAttribute("sessionError");
		return new ModelAndView("login/login");
	}

}

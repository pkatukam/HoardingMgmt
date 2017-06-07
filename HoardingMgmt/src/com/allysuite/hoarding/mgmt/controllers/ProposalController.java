package com.allysuite.hoarding.mgmt.controllers;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.commons.CommonUtil;
import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.MarkerGallery;
import com.allysuite.hoarding.mgmt.domain.Notification;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalEntry;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
import com.allysuite.hoarding.mgmt.domain.ProposalNegotiation;
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

	private SimpMessagingTemplate template;

	@Autowired
	public ProposalController(SimpMessagingTemplate template) {
		this.template = template;
	}

	/** Seller Side - Fetch Proposal Details **/
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getMarkersAndProposals", method = RequestMethod.POST)
	public @ResponseBody String getMarkersAndProposals(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----getMarkersAndProposals For Sellers---");
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
				String json = new ObjectMapper().writeValueAsString(markerList);

				int sellerId = ((Seller) user).getSellerId();
				logger.info("SellerId --> " + sellerId);
				List<Proposal> proposals = proposalService
						.getProposalsByCampaignIDAndSellerID(campaignId,
								sellerId);
				String proposalsJson = new ObjectMapper()
						.writeValueAsString(proposals);

				List<Buyer> buyers = buyerService
						.getSentProposalBuyers(sellerId);
				String buyersJson = new ObjectMapper()
						.writeValueAsString(buyers);

				List<ProposalNegotiation> negotiations = proposalService
						.getAllNegotiationHistoryForSeller(sellerId, campaignId);
				String negotiationsJson = new ObjectMapper()
						.writeValueAsString(negotiations);

				List<Category> categories = (List<Category>) session
						.getAttribute("Categories");
				String category_json = new ObjectMapper()
						.writeValueAsString(categories);

				int openProposalId = 0;
				byte action = 0;
				if (session.getAttribute("openProposalDetails") != null) {
					openProposalId = (Integer) session
							.getAttribute("openProposalDetails");
					session.removeAttribute("openProposalDetails");
					if (session.getAttribute("openProposalAction") != null) {
						action = (Byte) session
								.getAttribute("openProposalAction");
						session.removeAttribute("openProposalAction");
					}

				}
				String proposalsList = "proposals";
				String categoryList = "categoryList";
				String markerData = "markerData";
				String buyersList = "buyersList";
				String openProposal = "openProposal";
				String openProposalAction = "openProposalAction";
				String negotiationHistory = "negotiationHistory";
				String jason = "{ \"" + categoryList + "\" : " + category_json
						+ ", \"" + markerData + "\" :  " + json + ", \""
						+ proposalsList + "\" :  " + proposalsJson + ", \""
						+ buyersList + "\" :  " + buyersJson + ", \""
						+ openProposal + "\" :  " + openProposalId + ", \""
						+ openProposalAction + "\" :  " + action + ", \""
						+ negotiationHistory + "\" :  " + negotiationsJson
						+ "}";
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
			Date createdDate = new Date();
			proposal.setCreatedDate(createdDate);
			Timestamp timestamp = new Timestamp(createdDate.getTime());
			proposal.setCreatedDateTimeStamp(timestamp);
			proposal = proposalService.sendProposal(proposal);
			String proposalJSON = new ObjectMapper()
					.writeValueAsString(proposal);
			logger.info(proposal);
			return proposalJSON;
		}
		return "failure";
	}

	@RequestMapping(value = "/getMarkerImages", method = RequestMethod.POST)
	public @ResponseBody String getMarkerImages(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("----- Get Proposal Images Method - Start ---");
		HttpSession session = request.getSession(false);
		if (session != null) {
			if (request.getParameter("markerId") != null) {
				int markerId = Integer
						.valueOf(request.getParameter("markerId"));
				List<MarkerGallery> gallery = markerService
						.getImageGallery(markerId);
				String galleryJson = new ObjectMapper()
						.writeValueAsString(gallery);

				logger.info("JSON String --> " + galleryJson);
				logger.info("----- Get Proposal Images Method - END ---");
				return galleryJson;

			}
			return CommonUtil.ERR_REQUEST_NULL;
		}
		return CommonUtil.ERR_SESSION_EXPIRED;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getProposals", method = RequestMethod.POST)
	public @ResponseBody String getProposals(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----Inside getProposals method START ---");
		HttpSession session = request.getSession(false);
		try {
			if (session != null) {
				User user = (User) session.getAttribute("user");
				if (user != null) {
					int buyerId = ((Buyer) user).getBuyerId();
					logger.info("Get Proposals - BuyerId --> " + buyerId);

					ProposalEntry proposalEntry = new ProposalEntry();
					// Get the (active)campaignId to be opened.
					if (session.getAttribute("openProposalFeed") != null) {
						ProposalFeed proposalFeed = (ProposalFeed) session
								.getAttribute("openProposalFeed");
						logger.info("Proposal Feed - " + proposalFeed);
						int campaignId = proposalFeed.getCampaignId();
						proposalEntry.setCampaign(campaignService
								.getCampaignByID(campaignId));
						proposalEntry.setMarkers(markerService
								.getAllMarkersForBuyerWithProposals(buyerId,
										campaignId));
						proposalEntry.setProposals(proposalService
								.getAllProposalsForBuyer(buyerId, campaignId));
						proposalEntry.setSellers(sellerService
								.getSentProposalVendors(buyerId, campaignId));
						proposalEntry.setCities(cityService
								.getAllCitieWithProposalsForBuyerId(buyerId,
										campaignId));
						proposalEntry.setNegotiationHistory(proposalService
								.getAllNegotiationHistory(buyerId, campaignId));
						List<Category> categories = (List<Category>) session
								.getAttribute("Categories");
						proposalEntry.setCategories(categories);
						proposalEntry.setProposalFeed(proposalFeed);
						if (proposalFeed.getFetchDateBuyer() == null
								&& proposalFeed.getProposals() != null)
							proposalService
									.updateProposalFetchDate(proposalFeed);
					}

					/*
					 * logger.info("Get Proposals - Proposal Read --> " +
					 * request.getParameterValues("proposalsRead")); String[]
					 * proposals = request .getParameterValues("proposalsRead");
					 * if (proposals != null) { for (int i = 0; i <
					 * proposals.length; i++) {
					 * logger.info("Get Proposals - Parameter Values --> " +
					 * proposals[i]); }
					 * proposalService.updateStatusAsRead(proposals); }
					 */
					if (session.getAttribute("openProposalDetails") != null) {
						int proposalId = (Integer) session
								.getAttribute("openProposalDetails");
						proposalEntry.setOpenProposalId(proposalId);
						session.removeAttribute("openProposalDetails");
						if (session.getAttribute("openProposalAction") != null) {
							byte action = (Byte) session
									.getAttribute("openProposalAction");
							proposalEntry.setOpenProposalAction(action);
							session.removeAttribute("openProposalAction");
						}
					}

					String proposalsEntryJson = new ObjectMapper()
							.writeValueAsString(proposalEntry);

					logger.info("JSON String generated --> "
							+ proposalsEntryJson);
					logger.info("-----Inside getProposals method END ---");
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
				session.removeAttribute("openProposalDetails");
				session.removeAttribute("openProposalAction");
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
			session.removeAttribute("openProposalDetails");
			session.removeAttribute("openProposalAction");

		} else {
			return "/login";
		}
		return "/viewProposalList";
	}

	@RequestMapping(value = "/viewCampaignProposals", method = RequestMethod.POST)
	public @ResponseBody String viewCampaignProposals(HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		int campaignId = Integer.valueOf(request.getParameter("campaignId"));
		String status = request.getParameter("status");
		logger.info("View Campaign Proposals" + campaignId);
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.removeAttribute("openProposalDetails");
			session.removeAttribute("openProposalAction");
			ProposalFeed proposalFeed = new ProposalFeed();
			proposalFeed.setCampaignId(campaignId);
			/*
			 * If View All pressed on vendor proposal page all proposals should
			 * be viewed, if accepted only accepted and if in negotiation only
			 * In negotiation proposals should be viewed. status = "A" / status
			 * = "IN" / status = "" for accepted.
			 */
			proposalFeed.setProposalStatus(status);
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
					session.removeAttribute("openProposalDetails");
					session.removeAttribute("openProposalAction");
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

	@RequestMapping(value = "/negotiatePrice", method = RequestMethod.POST)
	public @ResponseBody String negotiatePrice(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("----Inside NegotiatePrice Method ----");
		HttpSession session = request.getSession(false);
		if (session != null
				&& (request.getParameter("proposalId") != null || request
						.getParameter("negotiationPrice") != null)) {
			// Require proposalId, price, initiatedBy.
			int proposalId = Integer.parseInt(request
					.getParameter("proposalId"));
			BigDecimal negotiatedPrice = new BigDecimal(
					request.getParameter("negotiationPrice"));
			String initiatedBy = request.getParameter("initiatedBy");
			logger.info("Proposal Negotiation for proposalId - " + proposalId
					+ " price - " + negotiatedPrice + " initiatedBy - "
					+ initiatedBy);
			ProposalNegotiation proposalNegotiation = new ProposalNegotiation(
					proposalId, negotiatedPrice, initiatedBy, new Date(), "p");
			logger.info("Proposal Negotiation Object - " + proposalNegotiation);
			// Update In Database.
			proposalNegotiation = proposalService
					.negotiatePrice(proposalNegotiation);
			proposalService.updateStatusAsInNegotiation(proposalNegotiation
					.getProposalId());

			String proposalNegotiationJSONStr = new ObjectMapper()
					.writeValueAsString(proposalNegotiation);

			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");

			String user = request.getParameter("user");
			int userId = Integer.parseInt(request.getParameter("userId"));
			logger.info("Proposal Negotiation Details User - " + user
					+ " userId " + userId);

			Notification notification = new Notification(proposalNegotiation);
			notification.setFirstName(firstName);
			notification.setLastName(lastName);
			logger.info(notification);
			// Send notification
			this.template.convertAndSend("/topic/notification/" + user + "/"
					+ userId, notification);
			return proposalNegotiationJSONStr;
		}
		return "failure";
	}

	@RequestMapping(value = "/acceptProposal", method = RequestMethod.POST)
	public @ResponseBody String acceptProposal(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("----Inside acceptProposal Method ----");
		HttpSession session = request.getSession(false);
		if (session != null && request.getParameter("proposalId") != null) {
			int proposalId = Integer.parseInt(request
					.getParameter("proposalId"));
			String user = request.getParameter("user");
			int userId = Integer.parseInt(request.getParameter("userId"));
			logger.info("User Id - " + userId + " User Type - " + user);

			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");
			logger.info("firstName - " + firstName + " lastName - " + lastName);

			BigDecimal price = new BigDecimal(request.getParameter("price"));
			String initiatedBy = request.getParameter("initiatedBy");

			Date acceptedDate = new Date();
			Proposal proposal = new Proposal();
			proposal.setAcceptedDate(acceptedDate);
			proposal.setProposalId(proposalId);
			proposal.setPrice(price);

			Notification notification = new Notification(proposal,
					CommonUtil.ENTITY_ACTION_ACCEPT);
			notification.setFirstName(firstName);
			notification.setLastName(lastName);
			notification.setInitiatedBy(initiatedBy);

			logger.info(notification);

			if (request.getParameter("negotiationId") != null) {
				int negotiationId = Integer.parseInt(request
						.getParameter("negotiationId"));
				notification.setNegotiationId(negotiationId);
				proposal.setNegotiationId(negotiationId);
				logger.info("Accept Proposal proposalId - " + proposalId
						+ " negotiationId - " + negotiationId);
				if (proposalService.acceptProposal(proposalId, negotiationId,
						acceptedDate, initiatedBy)) {
					logger.info("Proposal Object - " + proposal);
					String proposalJSONStr = new ObjectMapper()
							.writeValueAsString(proposal);
					logger.info("Proposal JSON Object - " + proposalJSONStr);

					this.template.convertAndSend("/topic/notification/" + user
							+ "/" + userId, notification);
					return proposalJSONStr;
				}
			} else {
				logger.info("Accept Proposal proposalId - " + proposalId
						+ " negotiationId - null");
				if (proposalService.acceptProposal(proposalId, acceptedDate)) {
					logger.info("Proposal Object - " + proposal);
					String proposalJSONStr = new ObjectMapper()
							.writeValueAsString(proposal);
					logger.info("Proposal JSON Object - " + proposalJSONStr);
					this.template.convertAndSend("/topic/notification/" + user
							+ "/" + userId, notification);

					return proposalJSONStr;
				}
			}

		}
		return "failure";
	}

}

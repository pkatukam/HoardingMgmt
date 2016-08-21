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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.Seller;
import com.allysuite.hoarding.mgmt.domain.User;
import com.allysuite.hoarding.mgmt.services.CampaignService;

@Controller
public class CampaignController {

	private Logger logger = Logger.getLogger(CampaignController.class);

	private CampaignService campaignService;

	@Autowired
	private LoginController loginController;

	@Autowired
	public void setCampaignService(CampaignService campaignService) {
		this.campaignService = campaignService;
	}

	@RequestMapping(value = "/createCampaign", method = RequestMethod.POST)
	public @ResponseBody String createCampaign(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			String jsonbody = request.getParameter("jsonString");
			logger.info("jsonString --- > " + jsonbody);
			Campaign campaign_json = fromJson(jsonbody);
			campaign_json.setBuyerId(((Buyer) user).getBuyerId());
			campaign_json.setCampaignCreatedDate(new Date());
			if (campaignService.createCampaign(campaign_json))
				return "/viewCampaignList";
		}
		return "/campaignError";
	}

	@RequestMapping(value = "/viewCampaignDetail/campaignId/{campaignId}")
	public ModelAndView viewCampainDetail(
			@PathVariable("campaignId") int campaignId, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		logger.info("Campaign Details" + campaignId);
		Campaign campaign = campaignService.getCampaignByID(campaignId);
		ModelAndView mv = new ModelAndView("viewCampaignDetails");
		logger.info(campaign);
		// Object to JSON in String
		String jsonString = fromObjToJson(campaign);
		campaign.setJsonString(jsonString);
		logger.info("jsonString --> " + jsonString);
		mv.addObject("campaign", campaign);
		return mv;
	}

	@RequestMapping(value = "/getMapDetails")
	public @ResponseBody String getMapDetails(HttpServletRequest request)
			throws JsonParseException, JsonMappingException, IOException {
		logger.info("Campaign Controller -- getMapDetails");
		HttpSession session = request.getSession(false);
		if (session != null) {
			Campaign campaign = (Campaign) session.getAttribute("campaign");
			String json = fromObjToJson(campaign);
			logger.info("json --> " + json);
			return json;
		}
		return "";
	}

	@RequestMapping(value = "/campaignCreateError")
	public ModelAndView viewCampainErrorPage() throws JsonParseException,
			JsonMappingException, IOException {
		logger.info("Create Campaign Error Page");
		return new ModelAndView("errorPage");
	}

	@RequestMapping(value = "/viewCampaignList")
	public ModelAndView viewCampainList(HttpServletRequest request, Model model)
			throws JsonParseException, JsonMappingException, IOException {
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info("Campaign List");
			User user = (User) session.getAttribute("user");
			if (user != null) {
				ModelAndView mv = new ModelAndView("campaignList");
				List<Campaign> list = campaignService
						.getAllCampaignsForBuyer(((Buyer) user).getBuyerId());
				mv.addObject("campaignList", list);
				return mv;
			}
		}
		model.addAttribute("login", new Login());
		model.addAttribute("sessionError");
		return new ModelAndView("login/login");
	}

	@RequestMapping(value = "/viewSellerCampaignList")
	public ModelAndView viewSellerCampaignList(HttpServletRequest request,
			Model model) throws JsonParseException, JsonMappingException,
			IOException {
		logger.info("Seller Campaign List");
		ModelAndView mv = new ModelAndView("sellerCampaignList");
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			if (user != null) {
				List<Campaign> list = campaignService
						.getSellerCampaignList((Seller) user);
				mv.addObject("campaignList", list);
				return mv;
			}
		}
		mv = new ModelAndView("login/login");
		model.addAttribute("login", new Login());
		mv.addObject("sessionError", "sessionError");
		return mv;

	}

	@RequestMapping(value = "/openCampaignDetails", method = RequestMethod.POST)
	public @ResponseBody String openProposalFeed(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("openCampaignDetails");
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info("-----openCampaignDetails---" + session);
			String campaignId = request.getParameter("campaignId");
			session.setAttribute("openCampaignDetails", campaignId);
		} else {
			return "/login";
		}
		return "/viewSellerCampaignDetails";
	}

	@RequestMapping(value = "/viewSellerCampaignDetails")
	public ModelAndView viewSellerCampaignDetails(HttpServletRequest request,
			Model model) throws JsonParseException, JsonMappingException,
			IOException {
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			if (user != null) {
				int campaignId = Integer.parseInt((String) session
						.getAttribute("openCampaignDetails"));
				logger.info("Seller Campaign Details " + campaignId);
				Campaign campaign = campaignService.getCampaignByID(campaignId,
						(Seller) user);
				ModelAndView mv = new ModelAndView("viewSellerCampaignDetails");
				logger.info(campaign);
				// Object to JSON in String
				String jsonString = fromObjToJson(campaign);
				campaign.setJsonString(jsonString);
				logger.info("jsonString --> " + jsonString);
				mv.addObject("campaign", campaign);
				return mv;
			}
		}
		model.addAttribute("login", new Login());
		model.addAttribute("sessionError");
		return new ModelAndView("login/login");
	}

	@RequestMapping(value = "/fetchCampaignFeed", method = RequestMethod.POST)
	public @ResponseBody String fetchCampaignFeed(ModelMap model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("-----fetchCampaignFeed---");
		HttpSession session = request.getSession(false);
		logger.info("-----fetchCampaignFeed---" + session);
		try {
			if (session != null) {
				User user = (User) session.getAttribute("user");
				logger.info("-----fetchCampaignFeed---" + user);
				if (user != null) {
					List<Campaign> campaignFeedList;
					if (user.getUser().equalsIgnoreCase("buyer")) {
						int buyerId = ((Buyer) user).getBuyerId();
						logger.info("Get Campaign Feed for BuyerId --> "
								+ buyerId);
						campaignFeedList = campaignService
								.getAllCampaignsForBuyer(((Buyer) user)
										.getBuyerId());
					} else {
						int sellerId = ((Seller) user).getSellerId();
						logger.info("Get Campaign Feed for SellerId --> "
								+ sellerId);
						campaignFeedList = campaignService
								.getSellerCampaignFeed((Seller) user);
					}
					String campaignFeedJson = new ObjectMapper()
							.writeValueAsString(campaignFeedList);
					String campaignFeed = "campaignFeedList";
					String feedJson = "{ \"" + campaignFeed + "\" : "
							+ campaignFeedJson + "}";
					logger.info(feedJson);
					return feedJson;
				}
			}
		} catch (ClassCastException e) {
			session.invalidate();
		}
		return "";
	}

	public Campaign fromJson(String json) throws JsonParseException,
			JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		Campaign campaign = mapper.readValue(json, Campaign.class);
		return campaign;
	}

	public String fromObjToJson(Campaign campaign) throws JsonParseException,
			JsonMappingException, IOException {
		return new ObjectMapper().writeValueAsString(campaign);
	}

}

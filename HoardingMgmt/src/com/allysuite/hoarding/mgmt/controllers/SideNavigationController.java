package com.allysuite.hoarding.mgmt.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Campaign;

@Controller
public class SideNavigationController {

	@RequestMapping("/viewDashboard")
	public ModelAndView viewDashboard() {
		return new ModelAndView("dashboard");
	}

	@RequestMapping("/viewCreatCampaign")
	public ModelAndView viewCreatCampaign(Model model) {
		model.addAttribute("campaign", new Campaign());
		return new ModelAndView("createCampaign");
	}


	@RequestMapping("/viewProposalList")
	public ModelAndView viewProposalList(Model model) {
		return new ModelAndView("proposalList");
	}
	
	@RequestMapping("/geolocation")
	public ModelAndView viewGeoLocation(Model model) {
		return new ModelAndView("geolocation");
	}

}

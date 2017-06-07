package com.allysuite.hoarding.mgmt.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.User;

@Controller
public class SideNavigationController {

	@RequestMapping("/viewDashboard")
	public ModelAndView viewDashboard(HttpServletRequest request, Model model) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			if (user.getUser().equalsIgnoreCase("seller")) {
				return new ModelAndView("dashboardForSeller");
			} else {
				return new ModelAndView("dashboardForBuyer");
			}
		}
		model.addAttribute("login", new Login());
		model.addAttribute("sessionError");
		return new ModelAndView("login/login");
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

	@RequestMapping("/viewMessages")
	public ModelAndView viewMessages(Model model) {
		return new ModelAndView("messagesList");
	}

}

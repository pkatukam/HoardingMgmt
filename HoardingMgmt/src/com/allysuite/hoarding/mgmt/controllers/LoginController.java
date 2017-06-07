package com.allysuite.hoarding.mgmt.controllers;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.User;
import com.allysuite.hoarding.mgmt.services.CategoryService;
import com.allysuite.hoarding.mgmt.services.LoginService;

@SessionAttributes
@Controller
public class LoginController {

	private Logger logger = Logger.getLogger(LoginController.class);

	private LoginService loginService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	public void setLoginService(LoginService loginService) {
		this.loginService = loginService;
	}

	@RequestMapping("/")
	public String showLogin(Model model) {
		logger.info("In the Login Method");
		model.addAttribute("login", new Login());
		return "login/login";
	}

	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ModelAndView login(HttpServletRequest request, Model model,
			@Valid Login login) {
		logger.info("Login Controller" + login);
		HttpSession sessions = request.getSession(false);
		if (sessions != null)
			sessions.invalidate();
		HttpSession session = request.getSession(true);
		User user = loginService.login(login);
		if (user == null) {
			model.addAttribute("test", "error");
			logger.error("Login Controller - Login Failure!!!" + login);
			return new ModelAndView("login/login");
		} else {
			List<Category> categories;
			// if (user.getUser().equalsIgnoreCase("seller")) {
			// categories = categoryService
			// .getAllCategoriesForSeller((Seller) user);
			// } else {
			categories = categoryService.getAllCategories();
			// }
			Map<String, Integer> categoryMap = new HashMap<String, Integer>();
			for (Iterator<Category> iterator = categories.iterator(); iterator
					.hasNext();) {
				Category category = iterator.next();
				categoryMap.put(category.getCategoryName(),
						category.getCategoryId());
			}

			Map<Integer, String> mediaType = new HashMap<Integer, String>();
			mediaType.put(1, "Traditional Only");
			mediaType.put(2, "Digital Only");
			mediaType.put(3, "Traditional & Digital");

			session.setAttribute("user", user);
			session.setAttribute("Categories", categories);
			session.setAttribute("CategoryMap", categoryMap);
			session.setAttribute("MediaMap", mediaType);
			if (user.getUser().equalsIgnoreCase("seller")) {
				return new ModelAndView("dashboardForSeller");
			} else {
				return new ModelAndView("dashboardForBuyer");
			}
		}
	}

	@RequestMapping(value = "/logout")
	public ModelAndView logout(HttpServletRequest request, Model model,
			@Valid Login login) {
		HttpSession session = request.getSession(false);
		if (session != null)
			session.invalidate();
		return new ModelAndView("login/login");
	}
}

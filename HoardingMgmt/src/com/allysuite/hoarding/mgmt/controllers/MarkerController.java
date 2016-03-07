package com.allysuite.hoarding.mgmt.controllers;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.City;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.Seller;
import com.allysuite.hoarding.mgmt.domain.User;
import com.allysuite.hoarding.mgmt.services.CategoryService;
import com.allysuite.hoarding.mgmt.services.MarkerService;

@Controller
public class MarkerController {

	private Logger logger = Logger.getLogger(MarkerController.class);

	private MarkerService markerService;

	@Autowired
	private CategoryService categoryService;

	@Autowired
	public void setMarkerService(MarkerService markerService) {
		this.markerService = markerService;
	}

	@RequestMapping(value = "/createMarker", method = RequestMethod.POST)
	public @ResponseBody String createMarker(@Valid Marker marker,
			BindingResult result, HttpServletRequest request, ModelMap model,
			HttpServletResponse response) throws Exception {
		logger.info("===========Create Marker ====================");
		logger.info(marker);
		if (marker.getMarkerId() == 0) {
			marker = markerService.createMarker(marker);
		} else {
			marker = markerService.updateMarker(marker);
		}
		String json = fromObjToJson(marker);
		return json;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/updateMarker", method = RequestMethod.POST)
	public @ResponseBody String updateMarker(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========Update Marker ====================");
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info("Update Marker");
			String jsonbody = request.getParameter("jsonString");
			logger.info("jsonString --- > " + jsonbody);
			Marker marker = new ObjectMapper()
					.readValue(jsonbody, Marker.class);
			logger.info(marker);
			Map<String, Integer> categoryMap = (Map<String, Integer>) session
					.getAttribute("CategoryMap");
			logger.info(categoryMap);
			marker.setCategoryId(categoryMap.get(marker.getCategoryName()));
			if (marker.getMarkerId() == 0) {
				marker = markerService.createMarker(marker);
				if (marker != null) {
					String markerData = new ObjectMapper()
							.writeValueAsString(marker);
					return markerData;
				} else
					return "create_failure";
			} else {
				marker = markerService.updateMarker(marker);
				String markerData = new ObjectMapper()
						.writeValueAsString(marker);
				return markerData;

			}
		}
		return "update_failure";
	}

	@RequestMapping(value = "/deleteMarker", method = RequestMethod.POST)
	public @ResponseBody String deleteMarker(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========Delete Marker ====================");
		int markerId = Integer.valueOf(request.getParameter("markerId"));
		logger.info(markerId);
		if (markerService.deleteMarker(markerId)) {
			return "deleted";
		} else {
			return "failure";
		}
	}

	@RequestMapping(value = "/viewCreateMarker/cityId/{cityId}/cityName/{cityName}")
	public ModelAndView viewCreateMarker(@PathVariable("cityId") int cityId,
			@PathVariable("cityName") String cityName, Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		HttpSession session = request.getSession(false);
		logger.info("===========View Create Marker Start====================");
		logger.info("viewCreateMarker -- >" + session);
		if (session == null) {
			logger.info("viewCreateMarker -- > Session Null");
			model.addAttribute("login", new Login());
			model.addAttribute("sessionError");
			return new ModelAndView("login/login");
		} else {
			logger.info("viewCreateMarker -- > Session Not Null");
			ModelAndView mv = new ModelAndView("viewCreateMarker");
			model.addAttribute("marker", new Marker());
			mv.addObject("MarkerCity", new City(cityId, cityName));
			return mv;
		}
	}

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/getMarkers", method = RequestMethod.POST)
	public @ResponseBody String getMarkers(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========Get Markers Start====================");
		HttpSession session = request.getSession(false);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			logger.info(request.getParameter("cityId"));
			int cityId = Integer.valueOf(request.getParameter("cityId"));
			logger.info(cityId);
			if (user != null) {
				List<Marker> markerList = markerService
						.getAllMarkersOfSellerByCityID(
								((Seller) user).getSellerId(), cityId);
				logger.info("====================================================");
				logger.info(markerList);
				logger.info("====================================================");
				((Seller) user).setMarkers(markerList);
				List<Category> categories = (List<Category>) session
						.getAttribute("Categories");
				String json = new ObjectMapper().writeValueAsString(markerList);
				String category_json = new ObjectMapper()
						.writeValueAsString(categories);
				String categoryList = "categoryList";
				String markerData = "markerData";
				String jason = "{ \"" + categoryList + "\" : " + category_json
						+ ", \"" + markerData + "\" :  " + json + "}";
				logger.info(jason);
				return jason;
			}
		}
		return "{}";
	}

	@RequestMapping(value = "/viewMarkerList/cityId/{cityId}/cityName/{cityName}")
	public ModelAndView viewMarkerList(@PathVariable("cityId") int cityId,
			@PathVariable("cityName") String cityName, Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========View Marker List====================");
		ModelAndView mv = new ModelAndView("markerList");
		HttpSession session = request.getSession(false);
		logger.info("ViewMarkerList -- >" + session);
		if (session != null) {
			User user = (User) session.getAttribute("user");
			if (user != null) {
				logger.info("Marker List");
				logger.info(cityId);
				List<Marker> markerList = markerService
						.getAllMarkersOfSellerByCityID(
								((Seller) user).getSellerId(), cityId);
				mv.addObject("markerList", markerList);
				model.addAttribute("marker", new Marker());
				mv.addObject("MarkerCity", new City(cityId, cityName));
				return mv;
			}
		}
		model.addAttribute("login", new Login());
		model.addAttribute("sessionError");
		return new ModelAndView("login/login");
	}

	public Seller fromJson(String json) throws JsonParseException,
			JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		Seller seller = mapper.readValue(json, Seller.class);
		return seller;
	}

	public String fromObjToJson(Marker marker) throws JsonParseException,
			JsonMappingException, IOException {
		return new ObjectMapper().writeValueAsString(marker);
	}

}

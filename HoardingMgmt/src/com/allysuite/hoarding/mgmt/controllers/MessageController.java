package com.allysuite.hoarding.mgmt.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.allysuite.hoarding.mgmt.domain.Message;
import com.allysuite.hoarding.mgmt.services.MessageService;

@Controller
public class MessageController {

	private Logger logger = Logger.getLogger(MessageController.class);

	@Autowired
	private MessageService messageService;

	@RequestMapping(value = "/sendMessage", method = RequestMethod.POST)
	public @ResponseBody String getMarkers(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========Send Message Start t====================");
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info(request.getParameter("message"));
			logger.info(request.getParameter("sentDate"));
			logger.info(request.getParameter("proposalId"));
			logger.info(request.getParameter("initiatedBy"));

			String messageStr = request.getParameter("message");
			Date sentDate = (new SimpleDateFormat("MM/dd/yyyy HH:mm:ss"))
					.parse(request.getParameter("sentDate"));

			logger.info("**************Date*********" + sentDate);
			int proposalId = Integer.parseInt(request
					.getParameter("proposalId"));
			String initiatedBy = request.getParameter("initiatedBy");
			Message message = new Message(proposalId, initiatedBy, messageStr,
					sentDate);
			if (messageService.sendMessage(message)) {
				logger.info("Message sent successfully!!!");
				return "success";
			}
		}
		logger.info("Message sent Failure!!!");
		return "failure";
	}

}

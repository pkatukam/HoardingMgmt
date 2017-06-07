package com.allysuite.hoarding.mgmt.controllers;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.allysuite.hoarding.mgmt.commons.CommonUtil;
import com.allysuite.hoarding.mgmt.domain.Message;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
import com.allysuite.hoarding.mgmt.exceptions.InvalidUserTypeException;
import com.allysuite.hoarding.mgmt.services.MessageService;
import com.allysuite.hoarding.mgmt.services.ProposalService;

@Controller
public class MessageController {

	private Logger logger = Logger.getLogger(MessageController.class);

	private SimpMessagingTemplate template;

	@Autowired
	public MessageController(SimpMessagingTemplate template) {
		this.template = template;
	}

	@Autowired
	private MessageService messageService;

	@Autowired
	private ProposalService proposalService;

	@RequestMapping(value = "/sendMessage", method = RequestMethod.POST)
	public @ResponseBody String getMarkers(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		logger.info("===========Send Message Start t====================");
		HttpSession session = request.getSession(false);
		if (session != null) {
			logger.info(request.getParameter("userId"));
			logger.info(request.getParameter("firstName"));
			logger.info(request.getParameter("lastName"));
			logger.info(request.getParameter("user"));
			String messageStr = request.getParameter("message");
			String sendDate = request.getParameter("sentDate");
			String firstName = request.getParameter("firstName");
			String lastName = request.getParameter("lastName");
			String user = request.getParameter("user");
			int userId = Integer.parseInt(request.getParameter("userId"));
			int proposalId = Integer.parseInt(request
					.getParameter("proposalId"));
			String initiatedBy = request.getParameter("initiatedBy");

			logger.info(firstName);
			logger.info(lastName);
			logger.info(userId);
			logger.info(user);
			logger.info(messageStr);
			logger.info(sendDate);
			logger.info(proposalId);
			logger.info(initiatedBy);

			Date sentDate = (new SimpleDateFormat("MM/dd/yyyy HH:mm:ss"))
					.parse(sendDate);

			logger.info("**************Date*********" + sentDate);
			Message message = new Message(proposalId, initiatedBy, messageStr,
					sentDate);
			message.setFirstName(firstName);
			message.setLastName(lastName);

			if (messageService.sendMessage(message)) {
				logger.info("Message sent successfully --> " + message + " !!!");
				String messageJson = new ObjectMapper()
						.writeValueAsString(message);
				this.template.convertAndSend("/topic/messageNotify/" + user
						+ "/" + userId, message);
				logger.info("ADDITION : Message Sent - " + messageStr + "!");
				return messageJson;
			}
		}
		logger.info("Message sent Failure!!!");
		return "failure";
	}

	@RequestMapping(value = "/pullUnReadMessages", method = RequestMethod.POST)
	public @ResponseBody String pullUnReadMessages(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		String user = request.getParameter("user");
		int userId = Integer.parseInt(request.getParameter("userId"));
		logger.info("User Id - " + userId);
		logger.info("User Type - " + user);

		if (!(user.equals(CommonUtil.BUYER) || user.equals(CommonUtil.SELLER))) {
			throw new InvalidUserTypeException(user);
		}

		List<Message> messageList = messageService.getUnreadMessage(userId,
				user);

		String messageListJson = new ObjectMapper()
				.writeValueAsString(messageList);
		return messageListJson;
	}

	@RequestMapping(value = "/makeMessageRead", method = RequestMethod.POST)
	public @ResponseBody String makeMessageRead(Model model,
			HttpServletRequest request, HttpServletResponse response)
			throws Exception {
		Enumeration<String> names = request.getParameterNames();
		while (names.hasMoreElements()) {
			String param = (String) names.nextElement();
			System.out.println("Pram name - " + param);
		}
		int proposalId = Integer.parseInt(request.getParameter("proposalId"));
		String initatedBy = request.getParameter("initiatedBy");
		logger.info("Proposal Id - " + proposalId);
		logger.info("Initiated By - " + initatedBy);
		if (messageService.markAllMessagesReadForUserProposal(proposalId,
				initatedBy).equals("Success")) {
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
							CommonUtil.OPEN_PROPOSAL_ACTION_MESSAGE);
					return "/viewProposalList";
				} else {
					session.setAttribute("openCampaignDetails",
							String.valueOf(proposal.getCampaignId()));
					session.setAttribute("openProposalDetails",
							proposal.getProposalId());
					session.setAttribute("openProposalAction",
							CommonUtil.OPEN_PROPOSAL_ACTION_MESSAGE);
					return "/viewSellerCampaignDetails";
				}
			}
		} else {
			return "Failure";
		}
		return "/login";
	}
}

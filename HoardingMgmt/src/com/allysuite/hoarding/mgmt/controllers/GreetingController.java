package com.allysuite.hoarding.mgmt.controllers;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.allysuite.hoarding.mgmt.domain.Greeting;
import com.allysuite.hoarding.mgmt.domain.HelloMessage;

@Controller
public class GreetingController {

	private Logger logger = Logger.getLogger(GreetingController.class);

	private SimpMessagingTemplate template;

	@Autowired
	public GreetingController(SimpMessagingTemplate template) {
		this.template = template;
	}

	/*
	 * @MessageMapping("/hello") - Ensures that if the message is sent to
	 * destination "/hello" then the Greeting Method will be executed.
	 * 
	 * @SendTo("/topic/greetings") - The return value is broadcast to all
	 * subscribers to "/topic/greetings" as specified in the @SendTo annotation.
	 */

	@RequestMapping(value = "/greet", method = RequestMethod.POST)
	public void greet(Model model, HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		logger.info("Greet" + this.template);
		String name = request.getParameter("name");
		logger.info("jsonString --- > " + name);
		HelloMessage message = new HelloMessage();
		message.setName(name);
		logger.info("Greetinggggggggssssss - " + message.getName() + "!");
		String text = "Hello " + message.getName() + "!";
		this.template.convertAndSend("/topic/greetings", new Greeting("Hello " + message.getName() + "!"));
	}

	@MessageMapping("/hello")
	@SendTo("/topic/greetings")
	public Greeting greeting(HelloMessage message) throws InterruptedException {
		logger.info("Greetinggggggggssssss - " + message.getName() + "!");
		Thread.sleep(3000); // Simulated Delay.
		return new Greeting("Hello " + message.getName() + "!");
	}

	public HelloMessage fromJson(String json) throws JsonParseException,
			JsonMappingException, IOException {
		ObjectMapper mapper = new ObjectMapper();
		HelloMessage campaign = mapper.readValue(json, HelloMessage.class);
		return campaign;
	}
}

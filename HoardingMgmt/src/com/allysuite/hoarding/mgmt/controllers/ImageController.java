package com.allysuite.hoarding.mgmt.controllers;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.allysuite.hoarding.mgmt.domain.UploadedFile;

@Controller
public class ImageController {

	private Logger logger = Logger.getLogger(ImageController.class);
	
	UploadedFile ufile;
	

	public ImageController() {
		logger.info("init RestController");
		ufile = new UploadedFile();
	}

	@RequestMapping(value = "/get/{value}", method = RequestMethod.GET)
	public void get(HttpServletResponse response, @PathVariable String value) {
		try {

			response.setContentType(ufile.type);
			response.setContentLength(ufile.length);
			FileCopyUtils.copy(ufile.bytes, response.getOutputStream());

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@RequestMapping(value = "/UploadImage", method = RequestMethod.POST)
	public @ResponseBody String upload(@RequestParam MultipartFile[] files,
			MultipartHttpServletRequest request, HttpServletResponse response) {
		logger.info("Inside");
		for (MultipartFile f : files) {
			logger.info("File " + f.getOriginalFilename()
					+ " uploaded successfully");
			try {
				// just temporary save file info into ufile
				ufile.length = f.getBytes().length;
				ufile.bytes = f.getBytes();
				ufile.type = f.getContentType();
				ufile.name = f.getOriginalFilename();

			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			// 2. send it back to the client as <img> that calls get method
			// we are using getTimeInMillis to avoid server cached image

		//	return "<img src='http://localhost:8080/HoardingMgmt/get/"
			//		+ Calendar.getInstance().getTimeInMillis() + "' />";

		}

		return "";

	}
}
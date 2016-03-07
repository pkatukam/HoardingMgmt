package com.allysuite.hoarding.mgmt.commons;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.DeserializationContext;
import org.codehaus.jackson.map.JsonDeserializer;

public class CustomJsonDateFormatDeserializer extends JsonDeserializer<Date> {
	

	private Logger logger = Logger.getLogger(CustomJsonDateFormatDeserializer.class);

	@Override
	public Date deserialize(JsonParser jsonparser,
			DeserializationContext deserializationcontext) throws IOException,
			JsonProcessingException {

		SimpleDateFormat format = new SimpleDateFormat("MM/DD/YYYY HH:mm:ss");
		String date = jsonparser.getText();
		try {
			Date dateTest = format.parse(date);
			logger.info(dateTest);
			return dateTest;
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}

	}

}
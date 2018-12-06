package com.allysuite.hoarding.mgmt.commons;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.ser.std.SerializerBase;

public class CustomJsonDateSerializer extends SerializerBase<Date> {

//	private Logger logger = Logger.getLogger(CustomJsonDateSerializer.class);

	public CustomJsonDateSerializer() {
		super(Date.class, true);
	}

	@Override
	public void serialize(Date value, org.codehaus.jackson.JsonGenerator jgen,
			org.codehaus.jackson.map.SerializerProvider provider)
			throws IOException, JsonGenerationException  {
		//logger.info(value);
		SimpleDateFormat formatter = new SimpleDateFormat("MM-dd-yyyy");
		String format = formatter.format(value);
		//logger.info(" value - " + format);
		jgen.writeString(format);

	}

}

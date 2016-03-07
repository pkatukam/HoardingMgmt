package com.allysuite.hoarding.mgmt.domain;

import org.codehaus.jackson.annotate.JsonSubTypes;
import org.codehaus.jackson.annotate.JsonTypeInfo;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes({ @JsonSubTypes.Type(value = Circle.class, name = "circle"),
		@JsonSubTypes.Type(value = Rectangle.class, name = "rectangle"),
		@JsonSubTypes.Type(value = Polygon.class, name = "polygon"), })
public interface Shapes {

	public static int CIRCLE = 0;
	public static int RECTANGLE = 1;
	public static int POLYGON = 2;
	
	public int getShape();

}

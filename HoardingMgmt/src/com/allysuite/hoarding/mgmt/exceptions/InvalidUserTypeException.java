package com.allysuite.hoarding.mgmt.exceptions;

public class InvalidUserTypeException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String userType;

	public InvalidUserTypeException(String userType) {
		this.userType = userType;
	}

	public String toString() {
		return "The User Type cannot be [" + userType
				+ "]. It should be either 'seller' or 'buyer'.";
	}

}

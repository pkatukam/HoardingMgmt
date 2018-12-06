package com.allysuite.hoarding.mgmt.exceptions;

public class InvalidUserID extends Exception {

	int userId;
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public InvalidUserID(int userId) {
		this.userId = userId;
	}

	public String toString() {
		return "Invalid User ID [" + userId + "].";
	}
}

package com.allysuite.hoarding.mgmt.domain;

public abstract class User {
	public abstract String getUser();

	private String loginId;
	private String firstName;

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	private String lastName;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	@Override
	public String toString() {
		return "User [loginId=" + loginId + ", firstName=" + firstName
				+ ", lastName=" + lastName + "]";
	}

}

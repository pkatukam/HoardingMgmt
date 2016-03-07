package com.allysuite.hoarding.mgmt.domain;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.allysuite.hoarding.mgmt.validation.ValidEmail;

public class Login {

	@NotNull
	@ValidEmail(min=6, message="This email address is not valid.")
	private String loginId;
	
	@Size(min=5, max=100, message="Name must be between 5 and 100 characters.")
	private String password;
	
	private int sellerId;
	private int buyerId;

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getSellerId() {
		return sellerId;
	}

	public void setSellerId(int sellerId) {
		this.sellerId = sellerId;
	}

	public int getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(int buyerId) {
		this.buyerId = buyerId;
	}

	public Login(String loginId, String password, int sellerId, int buyerId) {
		super();
		this.loginId = loginId;
		this.password = password;
		this.sellerId = sellerId;
		this.buyerId = buyerId;
	}

	public Login() {
		super();
	}

	public Login(String password, int sellerId, int buyerId) {
		super();
		this.password = password;
		this.sellerId = sellerId;
		this.buyerId = buyerId;
	}

	@Override
	public String toString() {
		return "Login [loginId=" + loginId + ", password=" + password
				+ ", sellerId=" + sellerId + ", buyerId=" + buyerId + "]";
	}

}

package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.LoginDAO;
import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.User;

@Service("loginService")
public class LoginService {

	private LoginDAO loginDao;

	public LoginDAO getLoginDAO() {
		return loginDao;
	}

	@Autowired
	public void setLoginDAO(LoginDAO loginDao) {
		this.loginDao = loginDao;
	}

	public List<Login> getCurrent() {
		return loginDao.getLogins();
	}

	public User login(Login login) {
		return loginDao.getLoginById(login);
	}
}

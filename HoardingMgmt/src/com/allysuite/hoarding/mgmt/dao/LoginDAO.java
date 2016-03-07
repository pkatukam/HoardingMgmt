package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.allysuite.hoarding.mgmt.domain.Login;
import com.allysuite.hoarding.mgmt.domain.User;

@Component("loginDAO")
public class LoginDAO {

	@Autowired
	private BuyerDAO buyerDAO;

	@Autowired
	private SellerDAO sellerDAO;

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Login> getLogins() {

		return jdbc.query("Select * from login", new RowMapper<Login>() {

			public Login mapRow(ResultSet rs, int arg1) throws SQLException {
				Login login = getLoginDetails(rs);
				return login;
			}

		});
	}

	public User getLoginById(Login login) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("loginId", login.getLoginId());
		try {
			return namedJdbc.queryForObject(
					"Select * from login where loginId = :loginId", params,
					new RowMapper<User>() {
						public User mapRow(ResultSet rs, int arg1)
								throws SQLException {
							Login login_db = getLoginDetails(rs);
							if (login_db.getPassword().equals(
									login.getPassword())) {
								User user;
								if (login_db.getBuyerId() > 0) {
									user = buyerDAO.getBuyerById(login_db
											.getBuyerId());
									user.setLoginId(login_db.getLoginId());
								} else if (login_db.getSellerId() > 0) {
									user = sellerDAO.getSellerById(login_db
											.getSellerId());
									user.setLoginId(login_db.getLoginId());
								} else {
									return null;
								}
								return user;
							} else
								return null;
						}
					});
		} catch (Exception e) {
			return null;
		}
	}

	public boolean create(Login login) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				login);
		return namedJdbc
				.update("Insert into login ( loginId, password, buyerId, sellerId) values (:loginId, :password, :buyerId, :sellerId)",
						params) == 1;

	}

	public boolean update(Login login) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				login);
		return namedJdbc
				.update("Update login set password=:password, buyerId=:buyerId, sellerId=:sellerId where loginId=:loginId",
						params) == 1;

	}

	public boolean delete(int loginId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("loginId", loginId);
		return namedJdbc.update("delete from login where loginId = :loginId",
				params) == 1;

	}

	private Login getLoginDetails(ResultSet rs) throws SQLException {
		Login login = new Login();
		login.setLoginId(rs.getString("loginId"));
		login.setPassword(rs.getString("password"));
		login.setSellerId(rs.getInt("sellerId"));
		login.setBuyerId(rs.getInt("buyerId"));
		return login;
	}

}

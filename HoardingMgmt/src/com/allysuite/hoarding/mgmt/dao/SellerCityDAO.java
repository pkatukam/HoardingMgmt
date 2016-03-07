package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.allysuite.hoarding.mgmt.domain.City;

@Component("sellerCityDAO")
public class SellerCityDAO {

//	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;
	
	@Autowired
	private CityDAO cityDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
	//	this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<City> getAllCitiesForSellerId(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc.query(
				"Select * from seller_cities where sellerId = :sellerId",
				params, new RowMapper<City>() {
					public City mapRow(ResultSet rs, int arg1)
							throws SQLException {
						City city = new City();
						city.setCityId(rs.getInt("cityId"));
						city.setCityName(cityDAO.getCityById(city).getCityName());
						return city;
					}
				});
	}

}

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

@Component("cityDAO")
public class CityDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public City getCityById(City city) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("cityId", city.getCityId());
		return namedJdbc.queryForObject(
				"Select * from city where cityId = :cityId", params,
				new RowMapper<City>() {
					public City mapRow(ResultSet rs, int arg1)
							throws SQLException {
						City city = new City();
						city.setCityId(rs.getInt("cityId"));
						city.setCityName(rs.getString("cityName"));
						return city;
					}
				});
	}
	
	public List<City> getAllCitieForProposalExistByBuyerId(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("Select * from city where cityId in (select cityId from Proposal where buyerId = :buyerId group by cityId)",
						params, new RowMapper<City>() {
							public City mapRow(ResultSet rs, int arg1)
									throws SQLException {
								City city = new City();
								city.setCityId(rs.getInt("cityId"));
								city.setCityName(rs.getString("cityName"));
								return city;
							}
						});
	}

	public List<City> getAllCitieForProposalExistByBuyerId(int buyerId, int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		params.addValue("campaignId", campaignId);
		return namedJdbc
				.query("Select * from city where cityId in (select cityId from Proposal where buyerId = :buyerId and campaignId = :campaignId group by cityId)",
						params, new RowMapper<City>() {
							public City mapRow(ResultSet rs, int arg1)
									throws SQLException {
								City city = new City();
								city.setCityId(rs.getInt("cityId"));
								city.setCityName(rs.getString("cityName"));
								return city;
							}
						});
	}

}

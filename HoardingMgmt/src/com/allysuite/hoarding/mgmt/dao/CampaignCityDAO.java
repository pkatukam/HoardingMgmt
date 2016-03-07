package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.City;

@Component("campaignCityDAO")
public class CampaignCityDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CityDAO cityDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public boolean create(Campaign campaign) {
		String createString;
		List<City> cities = campaign.getCampaignCities();
		for (Iterator<City> iterator = cities.iterator(); iterator.hasNext();) {
			City city = iterator.next();
			MapSqlParameterSource cityparams = new MapSqlParameterSource();
			cityparams.addValue("campaignId", campaign.getCampaignId());
			cityparams.addValue("cityId", city.getCityId());
			createString = "Insert into Campaign_Cities(campaignId, cityId) values (:campaignId , :cityId)";
			if (namedJdbc.update(createString, cityparams) != 1) {
				return false;
			}
		}
		return true;
	}

	public List<City> getCitiesForCampaignID(int campaignId,
			List<City> sellerCities) {
		String selectQuery = "Select * from Campaign_Cities where campaignId = :campaignId and cityId IN (";
		for (Iterator<City> iterator = sellerCities.iterator(); iterator
				.hasNext();) {
			City city = iterator.next();
			if (iterator.hasNext())
				selectQuery = selectQuery + city.getCityId() + ",";
			else
				selectQuery = selectQuery + city.getCityId() + ")";
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(selectQuery, params, new RowMapper<City>() {
			public City mapRow(ResultSet rs, int arg1) throws SQLException {
				City city = new City();
				city.setCityId(rs.getInt("cityId"));
				city = cityDAO.getCityById(city);
				return city;
			}
		});
	}

	public List<City> getCitiesForCampaignID(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(
				"Select * from Campaign_Cities where campaignId = :campaignId",
				params, new RowMapper<City>() {
					public City mapRow(ResultSet rs, int arg1)
							throws SQLException {
						City city = new City();
						city.setCityId(rs.getInt("cityId"));
						city = cityDAO.getCityById(city);
						return city;
					}
				});
	}

	public List<Campaign> getAllCampaignsForCityId(int cityId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("cityId", cityId);
		return namedJdbc.query(
				"Select * from Campaign_Cities where cityId = :cityId", params,
				new RowMapper<Campaign>() {
					public Campaign mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Campaign campaign = new Campaign();
						campaign.setCampaignId(rs.getInt("campaignId"));
						return campaign;
					}
				});
	}

	public List<Campaign> getAllCampaignsForCities(List<City> cities) {
		String selectQuery = "Select * from Campaign_Cities where cityId IN (";
		for (Iterator<City> iterator = cities.iterator(); iterator.hasNext();) {
			City city = iterator.next();
			if (iterator.hasNext())
				selectQuery = selectQuery + city.getCityId() + ",";
			else
				selectQuery = selectQuery + city.getCityId() + ") group by campaignId";
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("cities", cities);
		return namedJdbc.query(selectQuery, params, new RowMapper<Campaign>() {
			public Campaign mapRow(ResultSet rs, int arg1) throws SQLException {
				Campaign campaign = new Campaign();
				campaign.setCampaignId(rs.getInt("campaignId"));
				return campaign;
			}
		});
	}

}

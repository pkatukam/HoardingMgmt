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
import com.allysuite.hoarding.mgmt.domain.Category;

@Component("campaignCategoryDAO")
public class CampaignCategoryDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public boolean create(Campaign campaign) {
		String createString;
		List<Category> categories = campaign.getCategories();
		for (Iterator<Category> iterator = categories.iterator(); iterator
				.hasNext();) {
			Category category = iterator.next();
			MapSqlParameterSource categoryparams = new MapSqlParameterSource();
			categoryparams.addValue("campaignId", campaign.getCampaignId());
			categoryparams.addValue("categoryId", category.getCategoryId());
			createString = "Insert into Campaign_Categories(campaignId, categoryId) values (:campaignId , :categoryId)";
			if (namedJdbc.update(createString, categoryparams) != 1) {
				return false;
			}
		}
		return true;
	}

	public List<Category> getCategoriesForCampaignID(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(
				"Select * from Campaign_Categories where campaignId = :campaignId",
				params, new RowMapper<Category>() {
					public Category mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Category category = new Category();
						category.setCategoryId(rs.getInt("categoryId"));
						category = categoryDAO.getCategoryById(category);
						return category;
					}
				});
	}

}

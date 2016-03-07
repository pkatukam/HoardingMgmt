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

import com.allysuite.hoarding.mgmt.domain.Category;

@Component("categoryDAO")
public class CategoryDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public Category getCategoryById(Category category) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("categoryId", category.getCategoryId());
		return namedJdbc.queryForObject(
				"Select * from category where categoryId = :categoryId",
				params, new RowMapper<Category>() {
					public Category mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Category category = new Category();
						category.setCategoryId(rs.getInt("categoryId"));
						category.setCategoryName(rs.getString("categoryName"));
						return category;
					}
				});
	}

	public List<Category> getAllCategories() {
		return namedJdbc.query("Select * from category",
				new RowMapper<Category>() {
					public Category mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Category category = new Category();
						category.setCategoryId(rs.getInt("categoryId"));
						category.setCategoryName(rs.getString("categoryName"));
						return category;
					}
				});

	}

	public List<Category> getAllCategoriesBySellerId(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc.query(
				"Select * from Category where sellerId = :sellerId", params,
				new RowMapper<Category>() {
					public Category mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Category category = new Category();
						category.setCategoryId(rs.getInt("categoryId"));
						category.setCategoryName(rs.getString("categoryName"));
						return category;
					}
				});
	}

}

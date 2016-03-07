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

@Component("sellerCategoryDAO")
public class SellerCategoryDAO {

	// private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		// this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Category> getAllCategoriesForSellerId(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc.query(
				"Select * from seller_category where sellerId = :sellerId",
				params, new RowMapper<Category>() {
					public Category mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Category category = new Category();
						category.setCategoryId(rs.getInt("categoryId"));
						category.setCategoryName(categoryDAO.getCategoryById(
								category).getCategoryName());
						return category;
					}
				});
	}

}

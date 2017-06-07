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
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Seller;

@Component("sellerDAO")
public class SellerDAO {

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private SellerCityDAO sellerCityDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Seller> getSellers() {

		return jdbc.query("Select * from seller", new RowMapper<Seller>() {

			public Seller mapRow(ResultSet rs, int arg1) throws SQLException {
				Seller seller = new Seller();

				getSellerDetails(rs, seller);
				return seller;
			}

		});
	}

	public Seller getSellerById(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);

		return namedJdbc.queryForObject(
				"Select * from seller where sellerId = :sellerId", params,
				new RowMapper<Seller>() {

					public Seller mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Seller seller = new Seller();
						getSellerDetails(rs, seller);
						seller.setCities(sellerCityDAO
								.getAllCitiesForSellerId(sellerId));
						return seller;
					}
				});
	}

	public Seller getSellerBySellerId(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);

		return namedJdbc.queryForObject(
				"Select * from seller where sellerId = :sellerId", params,
				new RowMapper<Seller>() {

					public Seller mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Seller seller = new Seller();

						getSellerDetails(rs, seller);

						return seller;
					}
				});
	}

	
	public Seller getSellerByProposalId(int proposalId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("proposalId", proposalId);

		return namedJdbc.queryForObject(
				"Select * from seller where sellerId =( select sellerId from Proposal where proposalId = :proposalId)", params,
				new RowMapper<Seller>() {

					public Seller mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Seller seller = new Seller();

						getSellerDetails(rs, seller);

						return seller;
					}
				});
	}
	
	public boolean delete(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc.update(
				"delete from seller where sellerId = :sellerId", params) == 1;

	}

	public boolean create(Seller seller) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				seller);
		return namedJdbc
				.update("Insert into seller ( sellerFirstName, sellerLastName, sellerEmailId) values (:sellerId, :firstName, :lastName, :sellerEmailId)",
						params) == 1;

	}

	public boolean update(Seller seller) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				seller);
		return namedJdbc
				.update("Update seller set sellerFirstName=:firstName, sellerLastName=:lastName, sellerEmailId=:sellerEmailId where sellerId=:sellerId",
						params) == 1;

	}

	@Transactional
	public int[] create(List<Seller> sellers) {
		SqlParameterSource[] params = SqlParameterSourceUtils
				.createBatch(sellers.toArray());
		return namedJdbc
				.batchUpdate(
						"Insert into seller (sellerId, sellerFirstName, sellerLastName, sellerContactNumber, sellerEmailId) values (:sellerId, :firstName, :lastName, :contactNumber, :mailId)",
						params);

	}

	private void getSellerDetails(ResultSet rs, Seller seller)
			throws SQLException {
		seller.setSellerId(rs.getInt("sellerId"));
		seller.setFirstName(rs.getString("sellerFirstName"));
		seller.setLastName(rs.getString("sellerLastName"));
		seller.setContactNumber(rs.getString("sellerContactNumber"));
		seller.setMailId(rs.getString("sellerEmailId"));
	}

	public List<Seller> getSellersByBuyerIDWithProposals(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("Select * from seller where sellerId in (select sellerId from Proposal where buyerId = :buyerId group by sellerId)",
						params, new RowMapper<Seller>() {
							public Seller mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Seller seller = new Seller();
								getSellerDetails(rs, seller);
								return seller;
							}
						});
	}
	
	
	public List<Seller> getSellersByBuyerIDWithProposals(int buyerId, int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		params.addValue("campaignId", campaignId);
		return namedJdbc
				.query("Select * from seller where sellerId in (select sellerId from Proposal where buyerId = :buyerId and campaignId = :campaignId group by sellerId)",
						params, new RowMapper<Seller>() {
							public Seller mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Seller seller = new Seller();
								getSellerDetails(rs, seller);
								return seller;
							}
						});
	}

}

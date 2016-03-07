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

import com.allysuite.hoarding.mgmt.domain.Buyer;

@Component("buyerDAO")
public class BuyerDAO {

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Buyer> getBuyers() {

		return jdbc.query("Select * from buyer", new RowMapper<Buyer>() {

			public Buyer mapRow(ResultSet rs, int arg1) throws SQLException {
				Buyer buyer = new Buyer();

				getBuyerDetails(rs, buyer);
				return buyer;
			}

		});
	}

	public Buyer getBuyerById(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);

		return namedJdbc.queryForObject(
				"Select * from buyer where buyerId = :buyerId", params,
				new RowMapper<Buyer>() {

					public Buyer mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Buyer buyer = new Buyer();

						getBuyerDetails(rs, buyer);

						return buyer;
					}
				});
	}

	public Buyer getBuyerByBuyerId(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);

		return namedJdbc.queryForObject(
				"Select * from buyer where buyerId = :buyerId", params,
				new RowMapper<Buyer>() {

					public Buyer mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Buyer buyer = new Buyer();

						getBuyerDetails(rs, buyer);

						return buyer;
					}
				});
	}

	public boolean delete(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc.update("delete from buyer where buyerId = :buyerId",
				params) == 1;

	}

	public boolean create(Buyer buyer) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				buyer);
		return namedJdbc
				.update("Insert into buyer ( buyerFirstName, buyerLastName, buyerEmailId, buyerContactNumber) values (:buyerId, :firstName, :lastName, :buyerEmailId, :buyerContactNumber)",
						params) == 1;

	}

	public boolean update(Buyer buyer) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				buyer);
		return namedJdbc
				.update("Update buyer set buyerFirstName=:firstName, buyerLastName=:lastName, buyerEmailId=:buyerEmailId, buyerContactNumber=:buyerContactNumber where buyerId=:buyerId",
						params) == 1;

	}

	@Transactional
	public int[] create(List<Buyer> buyers) {

		SqlParameterSource[] params = SqlParameterSourceUtils
				.createBatch(buyers.toArray());
		return namedJdbc
				.batchUpdate(
						"Insert into buyer (buyerId, buyerFirstName, buyerLastName, buyerEmailId, buyerContactNumber) values (:buyerId, :firstName, :lastName, :buyerEmailId, buyerContactNumber)",
						params);

	}

	public List<Buyer> getBuyersBySellerIDWithProposals(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc
				.query("Select * from buyer where buyerId in (select buyerId from Proposal where sellerId = :sellerId group by buyerId)",
						params, new RowMapper<Buyer>() {
							public Buyer mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Buyer buyer = new Buyer();
								getBuyerDetails(rs, buyer);
								return buyer;
							}
						});
	}

	private void getBuyerDetails(ResultSet rs, Buyer buyer) throws SQLException {
		buyer.setBuyerId(rs.getInt("buyerId"));
		buyer.setFirstName(rs.getString("buyerFirstName"));
		buyer.setLastName(rs.getString("buyerLastName"));
		buyer.setBuyerContactNumber(rs.getString("buyerContactNumber"));
	}

}

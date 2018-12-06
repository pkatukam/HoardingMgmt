package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Notification;
import com.allysuite.hoarding.mgmt.domain.ProposalNegotiation;
import com.allysuite.hoarding.mgmt.domain.Seller;
import com.allysuite.hoarding.mgmt.services.BuyerService;
import com.allysuite.hoarding.mgmt.services.SellerService;

@Component("ProposalNegotiationDAO")
public class ProposalNegotiationDAO {

	private Logger logger = Logger.getLogger(ProposalNegotiationDAO.class);

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private SellerService sellerService;

	@Autowired
	private BuyerService buyerService;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public boolean delete(int proposalNegotiationId) {
		logger.info("Delete negotiation record - " + proposalNegotiationId);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("proposalNegotiationId", proposalNegotiationId);
		return namedJdbc
				.update("delete from proposal_negotiation where proposalNegotiationId = :proposalNegotiationId",
						params) == 1;

	}

	public ProposalNegotiation create(ProposalNegotiation proposalNegotiation) {
		logger.info("Create negotiation record - " + proposalNegotiation);
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				proposalNegotiation);
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		String createString = "Insert into proposal_negotiation ( negotiationId, proposalId, negotiatedPrice, initiatedBy, negotiationStatus, negotiationDate) values (:negotiationId, :proposalId, :negotiatedPrice, :initiatedBy, :negotiationStatus, :negotiationDate)";
		if (namedJdbc.update(createString, params, generatedKeyHolder) == 1) {
			proposalNegotiation.setNegotiationId(generatedKeyHolder.getKey()
					.intValue());
			return proposalNegotiation;
		}
		return null;
	}

	public boolean update(ProposalNegotiation proposalNegotiation) {
		logger.info("Update negotiation record - " + proposalNegotiation);
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				proposalNegotiation);
		return namedJdbc
				.update("Update proposal_negotiation set negotiatedPrice=:negotiatedPrice, proposalId=:proposalId, initiatedBy=:initiatedBy, negotiationStatus=:negotiationStatus, negotiationDate=:negotiationDate where negotiationId=:negotiationId",
						params) == 1;

	}

	public ProposalNegotiation getProposalsNegotiationByID(int negotiationId) {
		logger.info("Get negotiation record for negotionId - " + negotiationId);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("negotiationId", negotiationId);
		return namedJdbc
				.queryForObject(
						"Select * from Proposal_negotiation where negotiationId = :negotiationId order by negotiationDate asc",
						params, new RowMapper<ProposalNegotiation>() {
							public ProposalNegotiation mapRow(ResultSet rs,
									int arg1) throws SQLException {
								ProposalNegotiation proposalNegotiation = new ProposalNegotiation();
								getProposalNegotiationDetails(rs,
										proposalNegotiation);
								return proposalNegotiation;
							}
						});
	}

	protected void getProposalNegotiationDetails(ResultSet rs,
			ProposalNegotiation proposalNegotiation) throws SQLException {
		proposalNegotiation.setNegotiationId(rs.getInt("negotiationId"));
		proposalNegotiation.setInitiatedBy(rs.getString("initiatedBy"));
		proposalNegotiation.setProposalId(rs.getInt("proposalId"));
		proposalNegotiation.setNegotiatedPrice(rs
				.getBigDecimal("negotiatedPrice"));
		Timestamp timestamp = rs.getTimestamp("negotiationDate");
		java.util.Date date = null;
		if (timestamp != null) {
			date = new java.util.Date(timestamp.getTime());
			proposalNegotiation.setNegotiationDate(date);
		}
		proposalNegotiation.setNegotiationStatus(rs
				.getString("negotiationStatus"));
	}

	@Transactional
	public boolean updateProposalNegotiationStatusToAccept(int negotiationId) {
		logger.info("Update negotiation record to accepted for negotionId - "
				+ negotiationId);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("negotiationId", negotiationId);
		String updateQuery = "Update proposal_negotiation set negotiationStatus='A' where negotiationId = :negotiationId";
		return namedJdbc.update(updateQuery, params) > 0;
	}

	public List<ProposalNegotiation> getNegotiationListByProposalId(
			int proposalId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("proposalId", proposalId);
		return namedJdbc
				.query("Select * from proposal_negotiation where proposalId = :proposalId",
						params, new RowMapper<ProposalNegotiation>() {
							public ProposalNegotiation mapRow(ResultSet rs,
									int arg1) throws SQLException {
								ProposalNegotiation proposalNegotiation = new ProposalNegotiation();
								getProposalNegotiationDetails(rs,
										proposalNegotiation);
								return proposalNegotiation;
							}
						});
	}

	public List<ProposalNegotiation> getAllNegotiationByBuyerIdAndCampaignId(
			int buyerId, int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		params.addValue("campaignId", campaignId);
		return namedJdbc
				.query("Select * from proposal_negotiation where proposalId in (select proposalId from Proposal where buyerId = :buyerId and campaignId = :campaignId group by proposalId) order by negotiationDate desc",
						params, new RowMapper<ProposalNegotiation>() {
							public ProposalNegotiation mapRow(ResultSet rs,
									int arg1) throws SQLException {
								ProposalNegotiation proposalNegotiation = new ProposalNegotiation();
								getProposalNegotiationDetails(rs,
										proposalNegotiation);
								return proposalNegotiation;
							}
						});
	}

	public List<ProposalNegotiation> getAllNegotiationBySellerIdAndCampaignId(
			int sellerId, int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		params.addValue("campaignId", campaignId);
		return namedJdbc
				.query("Select * from proposal_negotiation where proposalId in (select proposalId from Proposal where sellerId = :sellerId and campaignId = :campaignId group by proposalId) order by negotiationDate desc",
						params, new RowMapper<ProposalNegotiation>() {
							public ProposalNegotiation mapRow(ResultSet rs,
									int arg1) throws SQLException {
								ProposalNegotiation proposalNegotiation = new ProposalNegotiation();
								getProposalNegotiationDetails(rs,
										proposalNegotiation);
								return proposalNegotiation;
							}
						});
	}

	public Object updateAllProposalNegotiationAsViewedForUserByProposalId(
			int proposalId, String initatedBy) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		String updateStr = "Update proposal_negotiation set negotiationStatus='V' where negotiationStatus = 'p' and proposalId = "
				+ proposalId + " and initiatedBy = '" + initatedBy + "'";
		logger.info(updateStr);
		if (namedJdbc.update(updateStr, params) >= 1)
			return "Success";
		else
			return "Failure";
	}

	public List<Notification> getUnViewedNegotiationsForUser(int userId,
			String user, List<Notification> list) {
		// TODO Auto-generated method stub
		MapSqlParameterSource params = new MapSqlParameterSource();
		String queryStr;
		if (user.equals("seller")) {
			params.addValue("sellerId", userId);
			queryStr = "Select * from proposal_negotiation where proposalId in (select proposalId from proposal where sellerId = :sellerId) and negotiationStatus = 'p' and initiatedBy = 'b' order by negotiationDate desc";
		} else {
			params.addValue("buyerId", userId);
			queryStr = "Select * from proposal_negotiation where proposalId in (select proposalId from proposal where buyerId = :buyerId) and negotiationStatus = 'p' and initiatedBy = 's' order by negotiationDate desc";
		}
		return namedJdbc.query(queryStr, params, new RowMapper<Notification>() {
			public Notification mapRow(ResultSet rs, int arg1)
					throws SQLException {
				ProposalNegotiation negotiate = new ProposalNegotiation();
				HashMap<Integer, Notification> userMap = new HashMap<>();
				getProposalNegotiationDetails(rs, negotiate);
				Notification notification = new Notification(negotiate);
				Notification neg = userMap.get(notification.getProposalId());
				if (neg == null) {
					if (user.equals("seller")) {
						Buyer buyer = buyerService
								.getBuyerByProposalId(negotiate.getProposalId());
						notification.setFirstName(buyer.getFirstName());
						notification.setLastName(buyer.getLastName());
					} else {
						Seller seller = sellerService
								.getSellerByProposalId(negotiate
										.getProposalId());
						notification.setFirstName(seller.getFirstName());
						notification.setLastName(seller.getLastName());
					}
					userMap.put(notification.getProposalId(), notification);
				} else {
					notification.setFirstName(neg.getFirstName());
					notification.setLastName(neg.getLastName());
				}
				list.add(notification);
				return notification;
			}
		});

	}

}

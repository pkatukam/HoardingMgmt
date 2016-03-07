package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;

import com.allysuite.hoarding.mgmt.domain.Message;
import com.allysuite.hoarding.mgmt.domain.Proposal;

@Component("proposalDAO")
public class ProposalDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private MessageDAO messageDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public boolean delete(int proposalId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("proposalId", proposalId);
		return namedJdbc.update(
				"delete from proposal where proposalId = :proposalId", params) == 1;

	}

	public Proposal create(Proposal proposal) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				proposal);
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		String createString = "Insert into proposal ( proposalId, markerId, campaignId, sellerId, buyerId, cityId, price, note, status, startDate, endDate, createdDate) values (:proposalId, :markerId, :campaignId, :sellerId, :buyerId, :cityId, :price, :note, :status, :availableStartDate, :availableEndDate, :createdDate)";
		if (namedJdbc.update(createString, params, generatedKeyHolder) == 1) {
			proposal.setProposalId(generatedKeyHolder.getKey().intValue());
			proposal.setMessages(new ArrayList<Message>());
			return proposal;
		}
		return null;
	}

	public boolean update(Proposal proposal) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				proposal);
		return namedJdbc
				.update("Update proposal set price=:price, note=:note, status=:status, startDate=:startDate, endDate=:endDate where proposalId=:proposalId",
						params) == 1;

	}

	public List<Proposal> getProposalsByCampaignID(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(
				"Select * from Proposal where campaignId = :campaignId",
				params, new RowMapper<Proposal>() {
					public Proposal mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Proposal proposal = new Proposal();
						getProposalDetails(rs, proposal);
						proposal.setMessages(messageDAO
								.getMessagesByProposalID(proposal
										.getProposalId()));
						return proposal;
					}
				});

	}

	public List<Proposal> getProposalsByBuyerID(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc.query(
				"Select * from Proposal where buyerId = :buyerId", params,
				new RowMapper<Proposal>() {
					public Proposal mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Proposal proposal = new Proposal();
						getProposalDetails(rs, proposal);
						proposal.setMessages(messageDAO
								.getMessagesByProposalID(proposal
										.getProposalId()));
						return proposal;
					}
				});

	}

	protected void getProposalDetails(ResultSet rs, Proposal proposal)
			throws SQLException {
		proposal.setProposalId(rs.getInt("proposalId"));
		proposal.setMarkerId(rs.getInt("markerId"));
		proposal.setCampaignId(rs.getInt("campaignId"));
		proposal.setCityId(rs.getInt("cityId"));
		proposal.setBuyerId(rs.getInt("buyerId"));
		proposal.setSellerId(rs.getInt("sellerId"));
		proposal.setCreatedDate(rs.getDate("createdDate"));
		proposal.setPrice(rs.getBigDecimal("price"));
		proposal.setNote(rs.getString("note"));
		proposal.setStatus(rs.getString("status"));
		proposal.setAvailableStartDate(rs.getDate("startDate"));
		proposal.setAvailableEndDate(rs.getDate("endDate"));
	}

	public void updateProposalStatusToRead(String[] proposals) {
		String updateQuery = "Update proposal set status='R' where proposalId IN (";
		for (int i = 0; i < proposals.length; i++) {
			if (i == proposals.length - 1) {
				updateQuery = updateQuery + Integer.parseInt(proposals[i])
						+ ")";
			} else {
				updateQuery = updateQuery + Integer.parseInt(proposals[i])
						+ ",";
			}
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		namedJdbc.update(updateQuery, params);
	}

}

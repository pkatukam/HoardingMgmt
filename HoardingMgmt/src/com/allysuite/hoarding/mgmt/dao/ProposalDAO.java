package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
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

import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.Message;
import com.allysuite.hoarding.mgmt.domain.Proposal;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;

@Component("proposalDAO")
public class ProposalDAO {

	private Logger logger = Logger.getLogger(ProposalDAO.class);

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private MessageDAO messageDAO;

	@Autowired
	private SellerCityDAO sellerCityDAO;

	@Autowired
	private CampaignDAO campaignDAO;

	@Autowired
	private MarkerDAO markerDAO;

	@Autowired
	private CityDAO cityDAO;

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

	public boolean deleteByMarkerId(int markerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", markerId);
		return namedJdbc.update(
				"delete from proposal where markerId = :markerId", params) >= 1;

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

	public List<Proposal> getProposalsByCampaignID(int campaignId, int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		params.addValue("sellerId", sellerId);
		return namedJdbc
				.query("Select * from Proposal where campaignId = :campaignId and sellerId = :sellerId order by createdDate desc",
						params, new RowMapper<Proposal>() {
							public Proposal mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Proposal proposal = new Proposal();
								getProposalDetails(rs, proposal);
								proposal.setMessages(messageDAO
										.getMessagesByProposalID(proposal
												.getProposalId()));
								Marker marker = markerDAO
										.getBasicMarkerById(proposal
												.getMarkerId());
								proposal.setMarker(marker);
								return proposal;
							}
						});
	}

	public List<Proposal> getProposalsByCampaignIDFetchDateForBuyer(
			int campaignId, int buyerId, Date fetchDateBuyer,
			Timestamp timestamp) {
		logger.info("getProposalsByCampaignIDFetchDateForBuyer --- > Campaign Id : "
				+ campaignId
				+ " buyerId : "
				+ buyerId
				+ " fetchDateBuyer : "
				+ fetchDateBuyer);

		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		params.addValue("buyerId", buyerId);
		if (timestamp != null) {
			SimpleDateFormat noMilliSecondsFormatter = new SimpleDateFormat(
					"yyyy-MM-dd HH:mm:ss");
			logger.info(noMilliSecondsFormatter.format(timestamp));
			params.addValue("fetchDateBuyer",
					noMilliSecondsFormatter.format(timestamp));
		}
		String query;
		if (fetchDateBuyer == null)
			query = "Select * from Proposal where campaignId = :campaignId and buyerId = :buyerId and fetchDateBuyer is null order by createdDate desc";
		else
			query = "Select * from Proposal where campaignId = :campaignId and buyerId = :buyerId and fetchDateBuyer = :fetchDateBuyer order by createdDate desc";
		return namedJdbc.query(query, params, new RowMapper<Proposal>() {
			public Proposal mapRow(ResultSet rs, int arg1) throws SQLException {
				Proposal proposal = new Proposal();
				getProposalDetails(rs, proposal);
				logger.info("Proposal Loop --> " + rs.getInt("campaignId")
						+ " " + rs.getInt("buyerId") + " fetchDateBuyer - "
						+ rs.getDate("fetchDateBuyer"));
				proposal.setMessages(messageDAO
						.getMessagesByProposalID(proposal.getProposalId()));
				Marker marker = markerDAO.getBasicMarkerById(proposal
						.getMarkerId());
				proposal.setMarker(marker);
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

	public List<ProposalFeed> getProposalFeedsForSeller(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc
				.query("Select count(*) as count,campaignId, max(createdDate) as max from Proposal where sellerId = :sellerId group by campaignId order by max(createdDate) desc",
						params, new RowMapper<ProposalFeed>() {
							public ProposalFeed mapRow(ResultSet rs, int arg1)
									throws SQLException {
								ProposalFeed proposalFeed = new ProposalFeed();
								proposalFeed.setCampaignId(rs
										.getInt("campaignId"));
								logger.info("Proposal Feed Loop --> "
										+ rs.getInt("campaignId") + " "
										+ rs.getInt("count") + " max - "
										+ rs.getDate("max"));
								Campaign campaign = campaignDAO
										.getCampaignTitleById(proposalFeed
												.getCampaignId());
								proposalFeed.setCampaignName(campaign
										.getCampaignTitle());
								proposalFeed.setProposalCount(rs
										.getInt("count"));
								List<Proposal> proposals = getProposalsByCampaignID(
										proposalFeed.getCampaignId(), sellerId);
								proposalFeed.setProposals(proposals);
								logger.info("getProposalFeedsForSeller --- > "
										+ proposalFeed);
								return proposalFeed;
							}
						});

	}

	public List<ProposalFeed> getProposalFeedsForBuyer(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		List<ProposalFeed> proposalFeeds = namedJdbc
				.query("Select count(*) as count, campaignId, fetchDateBuyer, proposalId from proposal where buyerId = :buyerId and fetchDateBuyer is null group by campaignId",
						params, new RowMapper<ProposalFeed>() {
							public ProposalFeed mapRow(ResultSet rs, int arg1)
									throws SQLException {
								ProposalFeed proposalFeed = new ProposalFeed();
								proposalFeed.setCampaignId(rs
										.getInt("campaignId"));
								Timestamp timestamp = rs
										.getTimestamp("fetchDateBuyer");
								Campaign campaign = campaignDAO
										.getCampaignTitleById(proposalFeed
												.getCampaignId());
								proposalFeed.setCampaignName(campaign
										.getCampaignTitle());
								proposalFeed.setProposalCount(rs
										.getInt("count"));
								List<Proposal> proposals = getProposalsByCampaignIDFetchDateForBuyer(
										proposalFeed.getCampaignId(), buyerId,
										proposalFeed.getFetchDateBuyer(),
										timestamp);
								proposalFeed.setProposals(proposals);
								logger.info("getProposalFeedsForBuyer --- > "
										+ proposalFeed);
								return proposalFeed;
							}
						});
		List<ProposalFeed> proposalFeedWithNoNullFetchDate = namedJdbc
				.query("Select count(*) as count, campaignId, fetchDateBuyer from proposal where buyerId = :buyerId and fetchDateBuyer is not null group by fetchDateBuyer,campaignId order by fetchDateBuyer desc",
						params, new RowMapper<ProposalFeed>() {
							public ProposalFeed mapRow(ResultSet rs, int arg1)
									throws SQLException {
								ProposalFeed proposalFeed = new ProposalFeed();
								proposalFeed.setCampaignId(rs
										.getInt("campaignId"));
								Timestamp timestamp = rs
										.getTimestamp("fetchDateBuyer");
								Date testDate = timestamp;
								logger.info("TimeStamp Date - " + testDate);
								java.util.Date date = null;
								if (timestamp != null) {
									date = timestamp;
									SimpleDateFormat noMilliSecondsFormatter = new SimpleDateFormat(
											"yyyy-MM-dd HH:mm:ss");
									logger.info(noMilliSecondsFormatter
											.format(timestamp));
									proposalFeed.setFetchDateBuyer(date);
								}
								logger.info("Proposal Feed Loop --> Campaign Id : "
										+ rs.getInt("campaignId")
										+ " Count : "
										+ rs.getInt("count")
										+ " fetchDateBuyer - "
										+ proposalFeed.getFetchDateBuyer());
								Campaign campaign = campaignDAO
										.getCampaignTitleById(proposalFeed
												.getCampaignId());
								proposalFeed.setCampaignName(campaign
										.getCampaignTitle());
								proposalFeed.setProposalCount(rs
										.getInt("count"));
								List<Proposal> proposals = getProposalsByCampaignIDFetchDateForBuyer(
										proposalFeed.getCampaignId(), buyerId,
										proposalFeed.getFetchDateBuyer(),
										timestamp);
								proposalFeed.setProposals(proposals);
								logger.info("getProposalFeedsForBuyer --- > "
										+ proposalFeed);
								return proposalFeed;
							}
						});
		// updateProposalFetchDate(proposalFeeds);
		proposalFeeds.addAll(proposalFeedWithNoNullFetchDate);
		return proposalFeeds;
	}

	public boolean updateProposalFetchDate(ProposalFeed proposalFeed) {
		String proposalsStr = "";
		List<Proposal> proposals = proposalFeed.getProposals();
		for (Iterator<Proposal> iterator2 = proposals.iterator(); iterator2
				.hasNext();) {
			Proposal proposal = iterator2.next();
			if (iterator2.hasNext())
				proposalsStr = proposalsStr + proposal.getProposalId() + ",";
			else
				proposalsStr = proposalsStr + proposal.getProposalId();
		}

		if (proposalsStr != "") {
			ProposalFeed tempProp = new ProposalFeed();
			tempProp.setFetchDateBuyer(new Date());
			BeanPropertySqlParameterSource params2 = new BeanPropertySqlParameterSource(
					tempProp);
			if (namedJdbc.update(
					"Update proposal set fetchDateBuyer=:fetchDateBuyer where proposalId in ("
							+ proposalsStr + ")", params2) > 0)
				return true;
			else
				return false;
		}
		return false;
	}
}

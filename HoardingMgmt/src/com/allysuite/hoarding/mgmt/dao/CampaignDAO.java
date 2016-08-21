package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.commons.CommonUtil;
import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Campaign;
import com.allysuite.hoarding.mgmt.domain.City;
import com.allysuite.hoarding.mgmt.domain.Map;
import com.allysuite.hoarding.mgmt.domain.ProposalFeed;
import com.allysuite.hoarding.mgmt.domain.Seller;

@Transactional
@Component("campaignDAO")
public class CampaignDAO {

	private Logger logger = Logger.getLogger(CampaignDAO.class);

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private MapDAO mapDAO;

	@Autowired
	private CampaignCityDAO campaignCityDAO;

	@Autowired
	private CampaignCategoryDAO campaignCategoryDAO;

	@Autowired
	private CityDAO cityDAO;

	@Autowired
	private SellerCityDAO sellerCityDAO;

	@Autowired
	private BuyerDAO buyerDAO;

	@Autowired
	private ProposalDAO proposalDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Campaign> getAllCampaigns() {

		return jdbc.query("Select * from campaign", new RowMapper<Campaign>() {

			public Campaign mapRow(ResultSet rs, int arg1) throws SQLException {
				Campaign campaign = new Campaign();

				getCampaignDetails(rs, campaign);
				return campaign;
			}

		});
	}

	public Campaign getCampaignTitleById(int campaignid) {
		Campaign campaign = new Campaign();
		campaign.setCampaignId(campaignid);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaign.getCampaignId());
		campaign = namedJdbc
				.queryForObject(
						"Select campaignTitle from campaign where campaignId = :campaignId",
						params, new RowMapper<Campaign>() {
							public Campaign mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Campaign campaign = new Campaign();
								campaign.setCampaignTitle(rs
										.getString("campaignTitle"));
								return campaign;
							}
						});
		return campaign;
	}

	public Campaign getCampaignById(int campaignid) {
		Campaign campaign = new Campaign();
		campaign.setCampaignId(campaignid);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaign.getCampaignId());
		campaign = namedJdbc.queryForObject(
				"Select * from campaign where campaignId = :campaignId",
				params, new RowMapper<Campaign>() {
					public Campaign mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Campaign campaign = new Campaign();
						getCampaignDetails(rs, campaign);
						return campaign;
					}
				});
		campaign.setBuyerName(((Buyer) buyerDAO.getBuyerByBuyerId(campaign
				.getBuyerId())).getFirstName()
				+ " "
				+ ((Buyer) buyerDAO.getBuyerByBuyerId(campaign.getBuyerId()))
						.getLastName());
		campaign.setCategories(campaignCategoryDAO
				.getCategoriesForCampaignID(campaign.getCampaignId()));
		campaign.setCampaignCities(campaignCityDAO
				.getCitiesForCampaignID(campaign.getCampaignId()));
		campaign.setMaps(mapDAO.getMaps(campaign.getCampaignId()));
		return campaign;
	}

	public Campaign getCampaignById(int campaignid, Seller seller) {
		if (seller != null) {
			List<City> sellerCities = seller.getCities();
			if (sellerCities == null || sellerCities.size() == 0) {
				sellerCities = sellerCityDAO.getAllCitiesForSellerId(seller
						.getSellerId());
				seller.setCities(sellerCities);
			}
			Campaign campaign = new Campaign();
			campaign.setCampaignId(campaignid);
			MapSqlParameterSource params = new MapSqlParameterSource();
			params.addValue("campaignId", campaign.getCampaignId());
			campaign = namedJdbc.queryForObject(
					"Select * from campaign where campaignId = :campaignId",
					params, new RowMapper<Campaign>() {
						public Campaign mapRow(ResultSet rs, int arg1)
								throws SQLException {
							Campaign campaign = new Campaign();
							getCampaignDetails(rs, campaign);
							return campaign;
						}
					});
			campaign.setBuyerName(((Buyer) buyerDAO.getBuyerByBuyerId(campaign
					.getBuyerId())).getFirstName()
					+ " "
					+ ((Buyer) buyerDAO.getBuyerByBuyerId(campaign.getBuyerId()))
							.getLastName());
			campaign.setCategories(campaignCategoryDAO
					.getCategoriesForCampaignID(campaign.getCampaignId()));
			campaign.setCampaignCities(campaignCityDAO.getCitiesForCampaignID(
					campaign.getCampaignId(), sellerCities));
			campaign.setMaps(mapDAO.getMaps(campaign.getCampaignId(),
					sellerCities));
			return campaign;
		}
		return new Campaign();
	}

	public List<Campaign> getCampaignByBuyerId(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc.query(
				"Select * from campaign where buyerId = :buyerId", params,
				new RowMapper<Campaign>() {
					public Campaign mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Campaign campaign = new Campaign();
						getCampaignDetails(rs, campaign);
						return campaign;
					}
				});
	}

	public boolean delete(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.update(
				"delete from campaign where campaignId = :campaignId", params) == 1;

	}

	@Transactional
	public boolean create(Campaign campaign) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				campaign);
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		String createString = "Insert into campaign (  campaignTitle, campaignDescription, campaignStartDate, campaignEndDate, campaignRespondBy, buyerId, mediaType, campaignBudget, campaignCreatedDate) values ( :campaignTitle, :campaignDescription, :campaignFrom, :campaignTo, :campaignRespondBy, :buyerId, :mediaType, :campaignBudget, :campaignCreatedDate)";
		if (namedJdbc.update(createString, params, generatedKeyHolder) == 1) {
			campaign.setCampaignId(generatedKeyHolder.getKey().intValue());
			/*** Insert into Campaign Cities ****/
			campaignCityDAO.create(campaign);
			/**** Insert into Campaign Categories ***/
			campaignCategoryDAO.create(campaign);
			/**** Insert into Map Tables ****/
			List<Map> maps = campaign.getMaps();
			for (Iterator<Map> iterator = maps.iterator(); iterator.hasNext();) {
				Map map = iterator.next();
				map.setCampaignId(campaign.getCampaignId());
				mapDAO.create(map);
			}
		}
		return true;
	}

	public boolean update(Campaign campaign) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				campaign);
		return namedJdbc
				.update("Update campaign set campaignTitle=:campaignTitle, campaignDescription=:campaignDescription, campaignStartDate=:campaignStartDate, campaignEndDate=:campaignEndDate, campaignRespondBy=:campaignRespondBy, buyerId=:buyerId  where campaignId=:campaignId",
						params) == 1;

	}

	@Transactional
	public int[] create(List<Campaign> campaigns) {

		SqlParameterSource[] params = SqlParameterSourceUtils
				.createBatch(campaigns.toArray());
		return namedJdbc
				.batchUpdate(
						"Insert into campaign (campaignId, campaignTitle, campaignDescription, campaignStartDate, campaignEndDate, campaignRespondBy, buyerId) values (:campaignId, :campaignTitle, :campaignDescription, :campaignStartDate, :campaignEndDate, :campaignRespondBy, :buyerId)",
						params);

	}

	private void getCampaignDetails(ResultSet rs, Campaign campaign)
			throws SQLException {
		campaign.setCampaignId(rs.getInt("campaignId"));
		campaign.setCampaignTitle(rs.getString("campaignTitle"));
		campaign.setCampaignDescription(rs.getString("campaignDescription"));
		campaign.setCampaignFrom(rs.getDate("campaignStartDate"));
		campaign.setCampaignTo(rs.getDate("campaignEndDate"));
		campaign.setCampaignBudget(rs.getBigDecimal("campaignBudget"));
		campaign.setCampaignRespondBy(rs.getDate("campaignRespondBy"));
		campaign.setBuyerId(rs.getInt("buyerId"));
		campaign.setMediaType(rs.getInt("mediaType"));
		campaign.setCampaignCreatedDate(rs.getDate("campaignCreatedDate"));
	}

	public List<Campaign> getCampaignBySellerId(int sellerId) {
		List<City> cities = sellerCityDAO.getAllCitiesForSellerId(sellerId);
		List<Campaign> campaignList = new ArrayList<Campaign>();
		for (Iterator<City> iterator = cities.iterator(); iterator.hasNext();) {
			City city = iterator.next();
			List<Campaign> campaign_list = campaignCityDAO
					.getAllCampaignsForCityId(city.getCityId());
			campaignList.addAll(campaign_list);
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		// params.addValue("buyerId", buyerId);
		return namedJdbc.query(
				"Select * from campaign where buyerId = :buyerId", params,
				new RowMapper<Campaign>() {
					public Campaign mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Campaign campaign = new Campaign();
						getCampaignDetails(rs, campaign);
						return campaign;
					}
				});
	}

	public List<Campaign> getCampaignsForSeller(Seller seller) {
		if (seller != null) {
			List<City> sellerCities = seller.getCities();
			if (sellerCities == null || sellerCities.size() == 0) {
				sellerCities = sellerCityDAO.getAllCitiesForSellerId(seller
						.getSellerId());
				seller.setCities(sellerCities);
			}
			List<Campaign> campaigns = campaignCityDAO
					.getAllCampaignsForCities(sellerCities);
			List<Campaign> campaignList = new ArrayList<Campaign>();
			for (Iterator<Campaign> iterator = campaigns.iterator(); iterator
					.hasNext();) {
				Campaign campaign = iterator.next();
				campaignList.add(getCampaignById(campaign.getCampaignId()));
			}
			return campaignList;
		}
		return new ArrayList<Campaign>();
	}

	public List<Campaign> getCampaignsByBuyerIdWithProposals(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("Select * from campaign where campaignId in (select campaignId from Proposal where buyerId = :buyerId group by campaignId) order by campaignId desc",
						params, new RowMapper<Campaign>() {
							public Campaign mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Campaign campaign = new Campaign();
								getCampaignDetails(rs, campaign);
								campaign.setBuyerName(((Buyer) buyerDAO
										.getBuyerByBuyerId(campaign
												.getBuyerId())).getFirstName()
										+ " "
										+ ((Buyer) buyerDAO
												.getBuyerByBuyerId(campaign
														.getBuyerId()))
												.getLastName());
								campaign.setCategories(campaignCategoryDAO
										.getCategoriesForCampaignID(campaign
												.getCampaignId()));
								campaign.setCampaignCities(campaignCityDAO
										.getCitiesForCampaignID(campaign
												.getCampaignId()));
								campaign.setMaps(mapDAO
										.getMapsForProposalCities(campaign
												.getCampaignId()));
								return campaign;
							}
						});
	}

	public List<Campaign> getCampaignFeedsForSeller(Seller seller) {
		if (seller != null) {
			List<City> sellerCities = seller.getCities();
			if (sellerCities == null || sellerCities.size() == 0) {
				sellerCities = sellerCityDAO.getAllCitiesForSellerId(seller
						.getSellerId());
				seller.setCities(sellerCities);
			}
			List<Campaign> campaigns = campaignCityDAO
					.getAllCampaignsForCities(sellerCities);
			List<Campaign> campaignList = new ArrayList<Campaign>();
			for (Iterator<Campaign> iterator = campaigns.iterator(); iterator
					.hasNext();) {
				Campaign campaign = iterator.next();
				campaignList.add(getCampaignFeedDataById(
						campaign.getCampaignId(), sellerCities));
			}
			return campaignList;
		}
		return new ArrayList<Campaign>();
	}

	private Campaign getCampaignFeedDataById(int campaignId,
			List<City> sellerCities) {
		Campaign campaign = new Campaign();
		campaign.setCampaignId(campaignId);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaign.getCampaignId());
		campaign = namedJdbc.queryForObject(
				"Select * from campaign where campaignId = :campaignId",
				params, new RowMapper<Campaign>() {
					public Campaign mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Campaign campaign = new Campaign();
						campaign.setCampaignId(rs.getInt("campaignId"));
						campaign.setCampaignTitle(rs.getString("campaignTitle"));
						campaign.setCampaignCreatedDate(rs
								.getDate("campaignCreatedDate"));
						return campaign;
					}
				});
		List<City> campaignCities = campaignCityDAO.getCitiesForCampaignID(
				campaign.getCampaignId(), sellerCities);
		campaign.setCampaignCities(campaignCities);
		return campaign;
	}

	public List<ProposalFeed> getAllCampaignProposalDetailsList(int buyerId) {
		logger.info("CampaignDAO - getAllCampaignProposalDetailsList "
				+ buyerId);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("select proposal.campaignId, campaign.campaignTitle, campaign.campaignStartDate, campaign.campaignEndDate,"
						+ "campaign.campaignRespondBy,count(proposal.proposalId) as totalProposals, count(prop.proposalId) as totalUnViewedProposals "
						+ "from hoarding_management.campaign campaign, hoarding_management.proposal proposal left join "
						+ "hoarding_management.proposal prop ON proposal.proposalId = prop.proposalId AND prop.status = 'N' "
						+ "where campaign.campaignId = proposal.campaignId and campaign.buyerId = :buyerId group by campaign.campaignId "
						+ "order by campaign.campaignStartDate desc", params,
						new RowMapper<ProposalFeed>() {
							public ProposalFeed mapRow(ResultSet rs, int arg1)
									throws SQLException {
								ProposalFeed proposalFeed = new ProposalFeed();
								proposalFeed.setCampaignId(rs
										.getInt("campaignId"));
								proposalFeed.setCampaignName(rs
										.getString("campaignTitle"));
								proposalFeed.setProposalCount(rs
										.getInt("totalProposals"));
								proposalFeed.setUnreadProposalCount(rs
										.getInt("totalUnViewedProposals"));
								proposalFeed.setCampaignStatus(CommonUtil.evaluateCampaignStatus(
										rs.getTimestamp("campaignStartDate"),
										rs.getTimestamp("campaignEndDate"),
										rs.getTimestamp("campaignRespondBy")));
								return proposalFeed;
							}
						});

	}

}

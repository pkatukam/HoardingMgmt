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

import com.allysuite.hoarding.mgmt.domain.Buyer;
import com.allysuite.hoarding.mgmt.domain.Message;
import com.allysuite.hoarding.mgmt.domain.Seller;
import com.allysuite.hoarding.mgmt.services.BuyerService;
import com.allysuite.hoarding.mgmt.services.SellerService;

@Component("messageDAO")
public class MessageDAO {

	private Logger logger = Logger.getLogger(MessageDAO.class);

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private SellerService sellerService;

	@Autowired
	private BuyerService buyerService;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public boolean create(Message message) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				message);
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		if (namedJdbc
				.update("Insert into messages ( messageId, proposalId, initiatedBy, message, sentDate) values (:messageId, :proposalId, :initiatedBy, :message, :sentDate)",
						params, generatedKeyHolder) == 1) {
			message.setMessageId(generatedKeyHolder.getKey().intValue());
			return true;
		}
		return false;
	}

	protected void getMessageDetails(ResultSet rs, Message message)
			throws SQLException {
		message.setMessageId(rs.getInt("messageId"));
		message.setMessage(rs.getString("message"));
		message.setProposalId(rs.getInt("proposalId"));
		message.setInitiatedBy(rs.getString("initiatedBy"));
		Timestamp timestamp = rs.getTimestamp("sentDate");
		java.util.Date date = null;
		if (timestamp != null) {
			date = new java.util.Date(timestamp.getTime());
			message.setSentDate(date);
		//	logger.info("*******************Test *********** " + date);
		}
	}

	public List<Message> getMessagesByProposalID(int proposalId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("proposalId", proposalId);
		return namedJdbc
				.query("Select * from messages where proposalId = :proposalId order by sentDate asc",
						params, new RowMapper<Message>() {
							public Message mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Message message = new Message();
								getMessageDetails(rs, message);
								return message;
							}
						});
	}

	public List<Message> getUnreadMessagesForUser(int userId, String user) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		String queryStr;
		if (user.equals("seller")) {
			params.addValue("sellerId", userId);
			queryStr = "Select * from messages where proposalId in (select proposalId from proposal where sellerId = :sellerId) and status = 'U' and initiatedBy = 'b' order by sentDate desc";
		} else {
			params.addValue("buyerId", userId);
			queryStr = "Select * from messages where proposalId in (select proposalId from proposal where buyerId = :buyerId) and status = 'U' and initiatedBy = 's' order by sentDate desc";
		}
		return namedJdbc.query(queryStr, params, new RowMapper<Message>() {
			public Message mapRow(ResultSet rs, int arg1) throws SQLException {
				Message message = new Message();
				HashMap<Integer, Message> userMap = new HashMap<>();
				getMessageDetails(rs, message);
				Message msg = userMap.get(message.getProposalId());
				if (msg == null) {
					if (user.equals("seller")) {
						Buyer buyer = buyerService.getBuyerByProposalId(message
								.getProposalId());
						message.setFirstName(buyer.getFirstName());
						message.setLastName(buyer.getLastName());
					} else {
						Seller seller = sellerService
								.getSellerByProposalId(message.getProposalId());
						message.setFirstName(seller.getFirstName());
						message.setLastName(seller.getLastName());
					}
					userMap.put(message.getProposalId(), message);
				} else {
					message.setFirstName(msg.getFirstName());
					message.setLastName(msg.getLastName());
				}
				return message;
			}
		});
	}

	public String updateAllMessageStatusAsReadForUserByProposalId(
			int proposalId, String initatedBy) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		String updateStr = "Update messages set status='R' where proposalId = " + proposalId + " and initiatedBy = '" + initatedBy + "'";
		logger.info(updateStr);
		if(namedJdbc.update( updateStr , params) >= 1)
			return "Success";
		else
			return "Failure";
		}

}

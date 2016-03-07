package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;

import com.allysuite.hoarding.mgmt.domain.Message;

@Component("messageDAO")
public class MessageDAO {
	private Logger logger = Logger.getLogger(MessageDAO.class);

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public boolean create(Message message) {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				message);
		return namedJdbc
				.update("Insert into messages ( messageId, proposalId, initiatedBy, message, sentDate) values (:messageId, :proposalId, :initiatedBy, :message, :sentDate)",
						params) == 1;

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
			logger.info("*******************Test *********** " + date);
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

}

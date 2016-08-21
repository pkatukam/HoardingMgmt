package com.allysuite.hoarding.mgmt.domain;

import java.util.Date;

public class Message {

	public Message(int proposalId, String initiatedBy, String message,
			Date sentDate) {
		super();
		this.proposalId = proposalId;
		this.initiatedBy = initiatedBy;
		this.message = message;
		this.sentDate = sentDate;
	}

	public Message() {
		super();
		// TODO Auto-generated constructor stub
	}

	private int messageId;
	private int proposalId;
	private String initiatedBy;
	private String message;
	private Date sentDate;

	public int getMessageId() {
		return messageId;
	}

	public void setMessageId(int messageId) {
		this.messageId = messageId;
	}

	public int getProposalId() {
		return proposalId;
	}

	public void setProposalId(int proposalId) {
		this.proposalId = proposalId;
	}

	public String getInitiatedBy() {
		return initiatedBy;
	}

	public void setInitiatedBy(String initiatedBy) {
		this.initiatedBy = initiatedBy;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Date getSentDate() {
		return sentDate;
	}

	public void setSentDate(Date sentDate) {
		this.sentDate = sentDate;
	}

	@Override
	public String toString() {
		return "Message [messageId=" + messageId + ", proposalId=" + proposalId
				+ ", initiatedBy=" + initiatedBy + ", message=" + message
				+ ", sentDate=" + sentDate + "]";
	}

}

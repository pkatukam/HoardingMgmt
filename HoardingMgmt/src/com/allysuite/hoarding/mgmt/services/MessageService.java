package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.MessageDAO;
import com.allysuite.hoarding.mgmt.domain.Message;

@Service("messageService")
public class MessageService {
	
	@Autowired
	private MessageDAO messageDao;

	public boolean sendMessage(Message message) {
		return messageDao.create(message);
	}

	public List<Message> getMessagesForProposal(int proposalId) {
		// TODO Auto-generated method stub
		return messageDao.getMessagesByProposalID(proposalId);
	}
	
}

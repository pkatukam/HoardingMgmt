package com.allysuite.hoarding.mgmt.commons;

import java.util.Date;

public class CommonUtil {

	public static final byte CAMPAIGN_LIVE = 0;
	public static final byte CAMPAIGN_ACTIVE = 1;
	public static final byte CAMPAIGN_DUE = 2;
	public static final byte CAMPAIGN_EXPIRED = 3;

	public static final String PROPOSAL_ACCEPTED = "A";
	public static final String PROPOSAL_NEW = "N";
	public static final String PROPOSAL_READ = "R";

	public static final byte OPEN_PROPOSAL_ACTION_MESSAGE = 0;
	public static final byte OPEN_PROPOSAL_ACTION_NEGOTIATION = 1;
	public static final byte OPEN_PROPOSAL_ACTION_DETAIL = 2;

	public static final String SELLER = "seller";
	public static final String BUYER = "buyer";

	public static final byte ENTITY_PROPOSAL = 0;
	public static final byte ENTITY_PROPOSAL_NEGOTIATION = 1;
	public static final byte ENTITY_CAMPAIGN = 2;

	public static final byte ENTITY_ACTION_CREATE = 0;
	public static final byte ENTITY_ACTION_ACCEPT = 1;
	
	public static final String ERR_SESSION_EXPIRED = "0";
	public static final String ERR_REQUEST_NULL = "1";

	public static byte evaluateCampaignStatus(Date startDate, Date endDate,
			Date respondBy) {
		Date now = new Date();
		if (startDate.after(now)
				&& (respondBy.after(now) || respondBy.equals(now))) {
			return CommonUtil.CAMPAIGN_ACTIVE;
		}
		if (startDate.after(now) && respondBy.before(now)) {
			return CommonUtil.CAMPAIGN_DUE;
		}
		if (startDate.before(now) && endDate.before(now)) {
			return CommonUtil.CAMPAIGN_EXPIRED;
		}
		return CommonUtil.CAMPAIGN_LIVE;
	}

}

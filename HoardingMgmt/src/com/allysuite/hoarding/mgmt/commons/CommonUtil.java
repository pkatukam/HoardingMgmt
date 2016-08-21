package com.allysuite.hoarding.mgmt.commons;

import java.util.Date;

public class CommonUtil {

	public static final byte CAMPAIGN_LIVE = 0;
	public static final byte CAMPAIGN_ACTIVE = 1;
	public static final byte CAMPAIGN_DUE = 2;
	public static final byte CAMPAIGN_EXPIRED = 3;

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

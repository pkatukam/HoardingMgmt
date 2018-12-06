package com.allysuite.hoarding.mgmt.commons;

import java.util.Comparator;

import com.allysuite.hoarding.mgmt.domain.Notification;

public class NotificationDateComparator implements Comparator<Notification> {

	@Override
	public int compare(Notification o1, Notification o2) {
		// TODO Auto-generated method stub
		return o2.getDate().compareTo(o1.getDate());
	}


}
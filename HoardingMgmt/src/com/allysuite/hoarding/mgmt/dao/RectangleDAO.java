package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Rectangle;

@Component("rectangleDAO")
public class RectangleDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public void create(Rectangle reactangle) {
		String createShapeString;
		MapSqlParameterSource rectangleparams = new MapSqlParameterSource();
		rectangleparams.addValue("mapId", reactangle.getMapId());
		rectangleparams.addValue("bound1", reactangle.getBound1());
		rectangleparams.addValue("bound2", reactangle.getBound2());
		rectangleparams.addValue("bound3", reactangle.getBound3());
		rectangleparams.addValue("bound4", reactangle.getBound4());
		createShapeString = "Insert into rectangle(mapId, bound1, bound2, bound3, bound4) values (:mapId, :bound1, :bound2, :bound3, :bound4)";
		namedJdbc.update(createShapeString, rectangleparams);
	}

	public List<Rectangle> getRectanglesByMapID(int mapId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("mapId", mapId);
		return namedJdbc.query("Select * from rectangle where mapId = :mapId",
				params, new RowMapper<Rectangle>() {
					public Rectangle mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Rectangle rectangle = new Rectangle();
						rectangle.setRectangleId(rs.getInt("rectangleId"));
						rectangle.setMapId(rs.getInt("mapId"));
						rectangle.setBound1(rs.getDouble("bound1"));
						rectangle.setBound2(rs.getDouble("bound2"));
						rectangle.setBound3(rs.getDouble("bound3"));
						rectangle.setBound4(rs.getDouble("bound4"));
						return rectangle;
					}
				});
	}
}

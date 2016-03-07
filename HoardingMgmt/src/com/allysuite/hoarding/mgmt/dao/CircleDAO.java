package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Circle;

@Component("circleDAO")
public class CircleDAO {

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CoardinateDAO coardinateDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Circle> getCircles() {

		return jdbc.query("Select * from circle", new RowMapper<Circle>() {

			public Circle mapRow(ResultSet rs, int arg1) throws SQLException {
				Circle circle = new Circle();

				getCircle(rs, circle);
				return circle;
			}

		});
	}

	public Circle getCircleById(int circleId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("circleId", circleId);

		return namedJdbc.queryForObject(
				"Select * from circle where circleId = :circleId", params,
				new RowMapper<Circle>() {

					public Circle mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Circle circle = new Circle();

						getCircle(rs, circle);

						return circle;
					}
				});
	}

	public boolean delete(int circleId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("circleId", circleId);
		return namedJdbc.update(
				"delete from circle where circleId = :circleId", params) == 1;

	}

	@Transactional
	public boolean create(Circle circle) {
		String createShapeString;
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		MapSqlParameterSource circleparams = new MapSqlParameterSource();
		circleparams.addValue("radius", circle.getRadius());
		circleparams.addValue("mapId", circle.getMapId());
		createShapeString = "Insert into Circle(radius, mapId) values (:radius , :mapId)";
		if (namedJdbc.update(createShapeString, circleparams,
				generatedKeyHolder) == 1) {
			circle.setCircleId(generatedKeyHolder.getKey().intValue());
			coardinateDAO.create(circle);
		}
		return true;
	}

	@Transactional
	public int[] create(List<Circle> circles) {

		SqlParameterSource[] params = SqlParameterSourceUtils
				.createBatch(circles.toArray());
		return namedJdbc
				.batchUpdate(
						"Insert into Circle (circleId, radius, mapId) values (:circleId, :radius, :mapId)",
						params);

	}

	private void getCircle(ResultSet rs, Circle circle) throws SQLException {
		circle.setCircleId(rs.getInt("circleId"));
		circle.setMapId(rs.getInt("mapId"));
		circle.setRadius(rs.getInt("radius"));
	}

	public List<Circle> getCirclesByMapID(int mapId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("mapId", mapId);
		return namedJdbc.query("Select * from circle where mapId = :mapId",
				params, new RowMapper<Circle>() {
					public Circle mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Circle circle = new Circle();
						circle.setCircleId(rs.getInt("circleId"));
						circle.setMapId(rs.getInt("mapId"));
						circle.setRadius(rs.getDouble("radius"));
						circle.setCoardinate(coardinateDAO
								.getCoordinateByCircleID(circle.getCircleId()));
						return circle;
					}
				});
	}
}

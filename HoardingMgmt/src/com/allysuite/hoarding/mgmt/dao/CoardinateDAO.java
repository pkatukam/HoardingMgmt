package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Circle;
import com.allysuite.hoarding.mgmt.domain.Coardinate;
import com.allysuite.hoarding.mgmt.domain.Polygon;

@Component("coardinateDAO")
public class CoardinateDAO {

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Coardinate> getCoardinates() {

		return jdbc.query("Select * from coardinate",
				new RowMapper<Coardinate>() {

					public Coardinate mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Coardinate coardinate = new Coardinate();

						getCoardinate(rs, coardinate);
						return coardinate;
					}

				});
	}

	@Transactional
	public boolean create(Circle circle) {
		String createShapeString;
		MapSqlParameterSource coardinatesParam = new MapSqlParameterSource();
		coardinatesParam.addValue("circleId", circle.getCircleId());
		coardinatesParam.addValue("point1", circle.getCoardinate()
				.getLatitude());
		coardinatesParam.addValue("point2", circle.getCoardinate()
				.getLongitude());
		createShapeString = "Insert into coordinates(circleId, center) values (:circleId , POINT(:point1, :point2))";
		namedJdbc.update(createShapeString, coardinatesParam);
		return true;
	}

	@Transactional
	public boolean create(Polygon polygon) {
		String createShapeString;
		MapSqlParameterSource coardinatesParam = new MapSqlParameterSource();
		coardinatesParam.addValue("polygonId", polygon.getPolygonId());
		List<Coardinate> path = polygon.getPath();
		String geomString = "POLYGON((";
		Coardinate first_coardinate = new Coardinate();
		int first = 0;
		for (Iterator<Coardinate> iterator3 = path.iterator(); iterator3
				.hasNext();) {
			Coardinate coardinate = iterator3.next();
			if (first == 0) {
				first_coardinate = coardinate;
				first = 1;
			}
			geomString = geomString + coardinate.getLatitude() + " "
					+ coardinate.getLongitude() + ", ";

		}
		geomString = geomString + first_coardinate.getLatitude() + " "
				+ first_coardinate.getLongitude() + " ))";
		coardinatesParam.addValue("geomString", geomString);
		createShapeString = "Insert into coordinates(polygonId, polygon) values (:polygonId , PolygonFromText(:geomString))";
		namedJdbc.update(createShapeString, coardinatesParam);
		return true;
	}

	private void getCoardinate(ResultSet rs, Coardinate coardinate)
			throws SQLException {
		coardinate.setCircleId(rs.getInt("circleId"));
		coardinate.setPolygonId(rs.getInt("polygonId"));

	}

	public Coardinate getCoordinateByCircleID(int circleId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("circleId", circleId);
		List<Coardinate> coardinate_list = namedJdbc
				.query("Select  circleId, X(center) AS latitude, Y(center) AS longitude from Coordinates where circleId = :circleId",
						params, new RowMapper<Coardinate>() {
							public Coardinate mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Coardinate coordinate = new Coardinate();
								coordinate.setCircleId(rs.getInt("circleId"));
								coordinate
										.setLatitude(rs.getDouble("latitude"));
								coordinate.setLongitude(rs
										.getDouble("longitude"));
								return coordinate;
							}
						});
		return coardinate_list.get(0);

	}

	public List<Coardinate> getCoordinateByPolygonID(int polygonId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("polygonId", polygonId);
		List<Coardinate> coardinate_list = namedJdbc
				.query("Select  polygonId, coardinatesId, AsText(polygon) AS polygonStr from Coordinates where polygonId = :polygonId",
						params, new RowMapper<Coardinate>() {
							public Coardinate mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Coardinate coordinate = new Coardinate();
								coordinate.setPolygonId(polygonId);
								coordinate.setCoordinateId(rs
										.getInt("coardinatesId"));
								coordinate.setPolygonStr(rs
										.getString("polygonStr"));
								return coordinate;
							}
						});
		List<Coardinate> cordinates = new ArrayList<Coardinate>();
		for (Iterator<Coardinate> iterator = coardinate_list.iterator(); iterator
				.hasNext();) {
			Coardinate coardinate = iterator.next();
			cordinates.addAll(convertPolygonIntoCoordinates(coardinate));

		}
		return cordinates;
	}

	private List<Coardinate> convertPolygonIntoCoordinates(Coardinate coardinate) {
		ArrayList<Coardinate> polylist = new ArrayList<Coardinate>();

		String[] parts = coardinate.getPolygonStr().replace("POLYGON((", "")
				.replace("))", "").split("(?<!\\\\),");

		for (String part : parts) {
			String[] subpart = part.split(" ");
			polylist.add(new Coardinate(Double.parseDouble(subpart[0]), Double
					.parseDouble(subpart[1]), coardinate.getPolygonId(),
					coardinate.getCoordinateId()));
		}
		return polylist;
	}

}

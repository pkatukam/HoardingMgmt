package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Circle;
import com.allysuite.hoarding.mgmt.domain.City;
import com.allysuite.hoarding.mgmt.domain.Map;
import com.allysuite.hoarding.mgmt.domain.Polygon;
import com.allysuite.hoarding.mgmt.domain.Rectangle;
import com.allysuite.hoarding.mgmt.domain.Shapes;

@Component("mapDAO")
public class MapDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CircleDAO circleDAO;
	@Autowired
	private PolygonDAO polygonDAO;
	@Autowired
	private RectangleDAO rectangleDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public boolean create(Map map) {
		GeneratedKeyHolder generatedKeyHolder;
		String createString;
		generatedKeyHolder = new GeneratedKeyHolder();
		MapSqlParameterSource mapparams = new MapSqlParameterSource();
		mapparams.addValue("campaignId", map.getCampaignId());
		mapparams.addValue("cityId", map.getCityId());
		createString = "Insert into Map(campaignId, cityId) values (:campaignId , :cityId)";
		if (namedJdbc.update(createString, mapparams, generatedKeyHolder) == 1) {
			map.setMapId(generatedKeyHolder.getKey().intValue());
			List<Shapes> shapes = map.getShapes();
			for (Iterator<Shapes> iterator2 = shapes.iterator(); iterator2
					.hasNext();) {
				Shapes shape = iterator2.next();
				switch (shape.getShape()) {
				case Shapes.CIRCLE:
					Circle circle = (Circle) shape;
					circle.setMapId(map.getMapId());
					circleDAO.create(circle);
					break;
				case Shapes.RECTANGLE:
					Rectangle reactangle = (Rectangle) shape;
					reactangle.setMapId(map.getMapId());
					rectangleDAO.create(reactangle);
					break;
				case Shapes.POLYGON:
					Polygon polygon = (Polygon) shape;
					polygon.setMapId(map.getMapId());
					polygonDAO.create(polygon);
					break;
				}

			}

		}
		return true;
	}

	public List<Map> getMaps(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(
				"Select * from map where campaignId = :campaignId", params,
				new RowMapper<Map>() {
					public Map mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Map map = new Map();
						map.setMapId(rs.getInt("mapId"));
						map.setCampaignId(rs.getInt("campaignId"));
						map.setCityId(rs.getInt("cityId"));
						List<Shapes> shapes = new ArrayList<Shapes>();
						List<Rectangle> rectangle = rectangleDAO
								.getRectanglesByMapID(map.getMapId());
						shapes.addAll(rectangle);
						List<Circle> circle = circleDAO.getCirclesByMapID(map
								.getMapId());
						shapes.addAll(circle);
						List<Polygon> polygon = polygonDAO
								.getPolygonsByMapID(map.getMapId());
						shapes.addAll(polygon);
						map.setShapes(shapes);
						return map;
					}
				});
	}

	public List<Map> getMapsForProposalCities(int campaignId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc
				.query("Select * from map where campaignId = :campaignId and cityId in (select cityId from Proposal where campaignId = :campaignId group by cityId)",
						params, new RowMapper<Map>() {
							public Map mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Map map = new Map();
								map.setMapId(rs.getInt("mapId"));
								map.setCampaignId(rs.getInt("campaignId"));
								map.setCityId(rs.getInt("cityId"));
								List<Shapes> shapes = new ArrayList<Shapes>();
								List<Rectangle> rectangle = rectangleDAO
										.getRectanglesByMapID(map.getMapId());
								shapes.addAll(rectangle);
								List<Circle> circle = circleDAO
										.getCirclesByMapID(map.getMapId());
								shapes.addAll(circle);
								List<Polygon> polygon = polygonDAO
										.getPolygonsByMapID(map.getMapId());
								shapes.addAll(polygon);
								map.setShapes(shapes);
								return map;
							}
						});
	}

	public List<Map> getMaps(int campaignId, List<City> sellerCities) {
		String selectQuery = "Select * from map where campaignId = :campaignId and cityId IN (";
		for (Iterator<City> iterator = sellerCities.iterator(); iterator
				.hasNext();) {
			City city = iterator.next();
			if (iterator.hasNext())
				selectQuery = selectQuery + city.getCityId() + ",";
			else
				selectQuery = selectQuery + city.getCityId() + ")";
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("campaignId", campaignId);
		return namedJdbc.query(selectQuery, params, new RowMapper<Map>() {
			public Map mapRow(ResultSet rs, int arg1) throws SQLException {
				Map map = new Map();
				map.setMapId(rs.getInt("mapId"));
				map.setCampaignId(rs.getInt("campaignId"));
				map.setCityId(rs.getInt("cityId"));
				List<Shapes> shapes = new ArrayList<Shapes>();
				List<Rectangle> rectangle = rectangleDAO
						.getRectanglesByMapID(map.getMapId());
				shapes.addAll(rectangle);
				List<Circle> circle = circleDAO.getCirclesByMapID(map
						.getMapId());
				shapes.addAll(circle);
				List<Polygon> polygon = polygonDAO.getPolygonsByMapID(map
						.getMapId());
				shapes.addAll(polygon);
				map.setShapes(shapes);
				System.out.print(false);
				return map;
			}
		});
	}

}

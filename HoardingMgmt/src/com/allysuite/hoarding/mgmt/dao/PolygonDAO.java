package com.allysuite.hoarding.mgmt.dao;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Polygon;

@Component("polygonDAO")
public class PolygonDAO {

	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private CoardinateDAO coardinateDAO;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public boolean create(Polygon polygon) {
		GeneratedKeyHolder generatedKeyHolder;
		String createShapeString;
		generatedKeyHolder = new GeneratedKeyHolder();
		MapSqlParameterSource polygonparams = new MapSqlParameterSource();
		polygonparams.addValue("mapId", polygon.getMapId());
		createShapeString = "Insert into Polygon(mapId) values (:mapId)";
		if (namedJdbc.update(createShapeString, polygonparams,
				generatedKeyHolder) == 1) {
			polygon.setPolygonId(generatedKeyHolder.getKey().intValue());
			coardinateDAO.create(polygon);
		}
		return true;
	}

	public List<Polygon> getPolygonsByMapID(int mapId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("mapId", mapId);
		return namedJdbc
				.query("Select polygonId from Polygon where mapId = :mapId",
						params, new RowMapper<Polygon>() {
							public Polygon mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Polygon polygon = new Polygon();
								polygon.setMapId(mapId);
								polygon.setPolygonId(rs.getInt("polygonId"));
								polygon.setPath(coardinateDAO
										.getCoordinateByPolygonID(polygon.getPolygonId()));
								return polygon;
							}
						});
	}
	
}

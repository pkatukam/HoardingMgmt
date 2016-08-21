package com.allysuite.hoarding.mgmt.dao;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.BeanPropertySqlParameterSource;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.MarkerGallery;

@Transactional
@Component("markerDAO")
public class MarkerDAO {

	private Logger logger = Logger.getLogger(MarkerDAO.class);

	private JdbcTemplate jdbc;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	private MarkerGalleryDAO markerGalleryDAO;

	@Autowired
	private ProposalDAO proposalDAO;
	
	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbc = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	public List<Marker> getAllMarkers() {

		return jdbc
				.query("Select markerId, markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker",
						new RowMapper<Marker>() {

							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);
								return marker;
							}

						});
	}

	public Marker getMarkerById(int markerid) {
		Marker marker = new Marker();
		marker.setMarkerId(markerid);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", marker.getMarkerId());
		marker = namedJdbc
				.queryForObject(
						"Select markerId, markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where markerId = :markerId",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);
								return marker;
							}
						});
		return marker;
	}

	public Marker getBasicMarkerById(int markerid) {
		System.out.println("Basic Marker Retrieval" + markerid);
		Marker marker = new Marker();
		marker.setMarkerId(markerid);
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", marker.getMarkerId());
		marker = namedJdbc
				.queryForObject(
						"Select markerId, markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where markerId = :markerId",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								return marker;
							}
						});
		return marker;
	}

	public List<Marker> getMarkersBySellerId(int sellerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		return namedJdbc.query(
				"Select * from marker where sellerId = :sellerId", params,
				new RowMapper<Marker>() {
					public Marker mapRow(ResultSet rs, int arg1)
							throws SQLException {
						Marker marker = new Marker();
						getMarkerDetails(rs, marker);
						List<MarkerGallery> markerGallery = markerGalleryDAO
								.getImagesForMarker(marker.getMarkerId());
						marker.setMarkerGallery(markerGallery);
						return marker;
					}
				});
	}

	@Transactional
	public boolean delete(int markerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", markerId);
		markerGalleryDAO.delete(markerId);
		proposalDAO.deleteByMarkerId(markerId);
		namedJdbc.update("delete from marker where markerId = :markerId",
				params);
		return true;
	}

	@Transactional
	public Marker create(Marker marker) throws IOException {
		logger.info(marker.getAvailability());
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				marker);
		GeneratedKeyHolder generatedKeyHolder = new GeneratedKeyHolder();
		String createString = "Insert into marker (  markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, point, cityId) values ( :markerName, :sellerId, :address, :rate, :availability, :categoryId, :lighting, :height, :width, POINT(:latitude, :longitude), :cityId)";
		if (namedJdbc.update(createString, params, generatedKeyHolder) == 1) {
			marker.setMarkerId(generatedKeyHolder.getKey().intValue());
			markerGalleryDAO.create(marker);
			return getMarkerById(marker.getMarkerId());
		}
		return new Marker();
	}

	@Transactional
	public Marker update(Marker marker) throws IOException {
		BeanPropertySqlParameterSource params = new BeanPropertySqlParameterSource(
				marker);
		if (namedJdbc
				.update("Update marker set markerName=:markerName, address=:address, rate=:rate, availability=:availability, categoryId=:categoryId, lighting=:lighting, height=:height, width=:width, point=POINT(:latitude, :longitude)  where markerId=:markerId",
						params) == 1) {
			markerGalleryDAO.update(marker);
			return getMarkerById(marker.getMarkerId());
		}
		return marker;
	}

	@Transactional
	public int[] create(List<Marker> markers) {
		SqlParameterSource[] params = SqlParameterSourceUtils
				.createBatch(markers.toArray());
		return namedJdbc
				.batchUpdate(
						"Insert into marker (markerId, markerTitle, markerDescription, markerStartDate, markerEndDate, markerRespondBy, buyerId) values (:markerId, :markerTitle, :markerDescription, :markerStartDate, :markerEndDate, :markerRespondBy, :buyerId)",
						params);

	}

	private void getMarkerDetails(ResultSet rs, Marker marker)
			throws SQLException {
		marker.setMarkerId(rs.getInt("markerId"));
		marker.setAddress(rs.getString("address"));
		marker.setAvailability(rs.getString("availability"));
		marker.setLatitude(rs.getDouble("latitude"));
		marker.setLongitude(rs.getDouble("longitude"));
		marker.setCityId(rs.getInt("cityId"));
		marker.setCategoryId(rs.getInt("categoryId"));
		marker.setHeight(rs.getInt("height"));
		marker.setWidth(rs.getInt("width"));
		marker.setLighting(rs.getString("lighting"));
		marker.setMarkerName(rs.getString("markerName"));
		marker.setRate(rs.getBigDecimal("rate"));
		marker.setSellerId(rs.getInt("sellerId"));
	}

	public List<Marker> getMarkerBySellerIDAndCityID(int sellerId, int cityId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		params.addValue("cityId", cityId);
		return namedJdbc
				.query("Select markerId, markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where sellerId = :sellerId and cityId = :cityId",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								/*List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);*/
								return marker;
							}
						});
	}
	
	public List<Marker> getMarkerBySellerIDAndCityIDWithImage(int sellerId, int cityId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("sellerId", sellerId);
		params.addValue("cityId", cityId);
		return namedJdbc
				.query("Select markerId, markerName, sellerId, address, rate, availability, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where sellerId = :sellerId and cityId = :cityId",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);
								return marker;
							}
						});
	}

	public List<Marker> getMarkersBySellerIDAndProposalExist(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("Select markerId, markerName, sellerId, address, availability, rate, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where markerId in (select markerId from Proposal where buyerId = :buyerId group by markerId)",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);
								return marker;
							}
						});
	}

	public List<Marker> getMarkersByBuyerIDAndProposalExist(int buyerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("buyerId", buyerId);
		return namedJdbc
				.query("Select markerId, markerName, sellerId, address, availability, rate, categoryId, lighting, height, width, cityId, X(point) AS latitude, Y(point) AS longitude from marker where markerId in (select markerId from Proposal where buyerId = :buyerId group by markerId)",
						params, new RowMapper<Marker>() {
							public Marker mapRow(ResultSet rs, int arg1)
									throws SQLException {
								Marker marker = new Marker();
								getMarkerDetails(rs, marker);
								List<MarkerGallery> markerGallery = markerGalleryDAO
										.getImagesForMarker(marker
												.getMarkerId());
								marker.setMarkerGallery(markerGallery);
								return marker;
							}
						});
	}

}

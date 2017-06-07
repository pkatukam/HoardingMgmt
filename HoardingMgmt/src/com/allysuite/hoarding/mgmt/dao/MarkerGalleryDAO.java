package com.allysuite.hoarding.mgmt.dao;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import javax.sql.DataSource;

import org.apache.commons.io.IOUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.support.AbstractLobCreatingPreparedStatementCallback;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.jdbc.support.lob.LobCreator;
import org.springframework.jdbc.support.lob.LobHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.allysuite.hoarding.mgmt.domain.Marker;
import com.allysuite.hoarding.mgmt.domain.MarkerGallery;

@Transactional
@Component("markerGalleryDAO")
public class MarkerGalleryDAO {

	private Logger logger = Logger.getLogger(MarkerGalleryDAO.class);

	private JdbcTemplate jdbcTemplate;
	private NamedParameterJdbcTemplate namedJdbc;

	@Autowired
	public void setDataSource(DataSource datasource) {
		this.jdbcTemplate = new JdbcTemplate(datasource);
		this.namedJdbc = new NamedParameterJdbcTemplate(datasource);
	}

	@Transactional
	public void create(Marker marker) throws IOException {
		MultipartFile[] imageFiles = marker.getImageFiles();
		if (imageFiles != null) {
			for (int i = 0; i < imageFiles.length; i++) {
				byte[] byteArr = imageFiles[i].getBytes();
				LobHandler lobhandler = new DefaultLobHandler();
				InputStream inputStream = new ByteArrayInputStream(byteArr);
				// FileInputStream fis = new FileInputStream (imageFiles[i]);
				logger.info(imageFiles[i].getOriginalFilename());
				logger.info(imageFiles[i].getSize());
				final MultipartFile file = imageFiles[i];
				//final float markerId =  marker.getMarkerId();
				jdbcTemplate
						.execute(
								"Insert into marker_gallery (markerId, imageFile) values (?, ?)",
								new AbstractLobCreatingPreparedStatementCallback(
										lobhandler) {
									@Override
									protected void setValues(
											java.sql.PreparedStatement ps,
											LobCreator lobCreator)
											throws SQLException,
											DataAccessException {
										ps.setLong(1, marker.getMarkerId());
										lobCreator.setBlobAsBinaryStream(ps, 2,
												inputStream,
												(int) file.getSize());
									}
								});
				inputStream.close();
			}
		}
	}

	@Transactional
	public boolean delete(int markerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", markerId);
		namedJdbc
				.update("delete from marker_gallery where markerId = :markerId",
						params);
		return true;
	}

	@Transactional
	public boolean update(Marker marker) throws IOException {
		MapSqlParameterSource params = new MapSqlParameterSource();
		List<MarkerGallery> markerGalList = getNeedToBeDeletedMarkers(marker);
		if (markerGalList.size() > 0) {
			String deleteQuery = "delete from marker_gallery where markerGalleryId in (";
			for (Iterator<MarkerGallery> iterator = markerGalList.iterator(); iterator
					.hasNext();) {
				MarkerGallery markerGallery = iterator.next();
				if (iterator.hasNext()) {
					deleteQuery = deleteQuery
							+ markerGallery.getMarkerGalleryId() + ",";
				} else {
					deleteQuery = deleteQuery
							+ markerGallery.getMarkerGalleryId() + ")";
				}
			}
			namedJdbc.update(deleteQuery, params);
		}
		create(marker);
		return true;
	}

	@Transactional
	public List<MarkerGallery> getNeedToBeDeletedMarkers(Marker marker) {
		String selectQuery = "Select * from marker_gallery where markerId = :markerId ";
		int[] markerDeleteIds = marker.getMarkerDatabaseIds();
		if (markerDeleteIds != null && markerDeleteIds.length > 0) {
			selectQuery = selectQuery + " and markerGalleryId not in (";
			for (int i = 0; i < markerDeleteIds.length; i++) {
				if (i == markerDeleteIds.length - 1)
					selectQuery = selectQuery + markerDeleteIds[i] + ")";
				else
					selectQuery = selectQuery + markerDeleteIds[i] + ",";
			}
		}
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", marker.getMarkerId());
		return namedJdbc.query(selectQuery, params,
				new RowMapper<MarkerGallery>() {
					public MarkerGallery mapRow(ResultSet rs, int arg1)
							throws SQLException {
						MarkerGallery markerGallery = new MarkerGallery();
						markerGallery.setMarkerId(rs.getInt("markerId"));
						markerGallery.setMarkerGalleryId(rs
								.getInt("markerGalleryId"));
						return markerGallery;
					}
				});
	}

	public List<MarkerGallery> getImagesForMarker(int markerId) {
		MapSqlParameterSource params = new MapSqlParameterSource();
		params.addValue("markerId", markerId);
		return namedJdbc.query(
				"Select * from marker_gallery where markerId = :markerId",
				params, new RowMapper<MarkerGallery>() {
					public MarkerGallery mapRow(ResultSet rs, int arg1)
							throws SQLException {
						MarkerGallery markerGallery = new MarkerGallery();
						markerGallery.setMarkerId(rs.getInt("markerId"));
						markerGallery.setMarkerGalleryId(rs
								.getInt("markerGalleryId"));
						try {
							markerGallery.setImageFile(rs
									.getBinaryStream("imageFile") != null ? IOUtils
									.toByteArray(rs
											.getBinaryStream("imageFile"))
									: null);
						} catch (IOException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						return markerGallery;
					}
				});
	}
}

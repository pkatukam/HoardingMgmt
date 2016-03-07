package com.allysuite.hoarding.mgmt.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.allysuite.hoarding.mgmt.dao.CategoryDAO;
import com.allysuite.hoarding.mgmt.dao.SellerCategoryDAO;
import com.allysuite.hoarding.mgmt.domain.Category;
import com.allysuite.hoarding.mgmt.domain.Seller;

@Service("categoryService")
public class CategoryService {

	@Autowired
	private CategoryDAO categoryDAO;

	@Autowired
	private SellerCategoryDAO sellerCategoryDAO;

	public List<Category> getAllCategories() {
		return categoryDAO.getAllCategories();
	}

	public List<Category> getAllCategoriesForSeller(Seller seller) {
		return sellerCategoryDAO.getAllCategoriesForSellerId(seller
				.getSellerId());
	}

}

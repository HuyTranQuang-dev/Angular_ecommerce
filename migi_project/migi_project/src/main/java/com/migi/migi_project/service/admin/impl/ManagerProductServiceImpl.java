package com.migi.migi_project.service.admin.impl;

import com.migi.migi_project.entity.Category;
import com.migi.migi_project.entity.Product;
import com.migi.migi_project.model.dto.CategoryDTO;
import com.migi.migi_project.model.dto.ProductDTO;
import com.migi.migi_project.model.mapper.CategoryMapper;
import com.migi.migi_project.model.mapper.ProductMapper;
import com.migi.migi_project.model.response.PageableModel;
import com.migi.migi_project.model.response.ResponseNormal;
import com.migi.migi_project.model.response.ResponseUploadFile;
import com.migi.migi_project.repository.user.CategoryRepository;
import com.migi.migi_project.repository.user.ProductRepository;
import com.migi.migi_project.service.admin.ManagerProductService;
import com.migi.migi_project.utils.FileUtils;
import org.dom4j.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ManagerProductServiceImpl implements ManagerProductService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<ProductDTO> findAll(Pageable pageable) {
        List<Product> productList = productRepository.findAll(pageable).getContent();
        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : productList) {
            productDTOList.add(ProductMapper.toProductDTO(p));
        }
        return productDTOList;
    }

    @Override
    public PageableModel<ProductDTO> findByCategory(Integer id, Pageable pageable) {
        List<Product> productList = productRepository.findByCategory(id, pageable);
        List<ProductDTO> productDTOList = new ArrayList<>();
        for (Product p : productList) {
            productDTOList.add(ProductMapper.toProductDTO(p));
        }
        PageableModel<ProductDTO> response = new PageableModel<>();
        response.setList(productDTOList);
        response.setTotal(productRepository.countProductByCategory(id));
        return response;
    }

    @Override
    public List<CategoryDTO> findAllCategory(Pageable pageable) {
        List<Category> categories = categoryRepository.findAll(pageable).getContent();
        List<CategoryDTO> categoryDTOList = new ArrayList<>();
        for (Category category : categories) {
            categoryDTOList.add(CategoryMapper.toCategoryDTO(category));
        }
        return categoryDTOList;
    }

    @Override
    public Long countProducts() {
        return productRepository.count();
    }

    @Override
    public Long countCategories() {
        return categoryRepository.count();
    }

    @Override
    public ResponseNormal addProduct(ProductDTO productDTO, MultipartFile file) {
        // upload image
        ResponseUploadFile<String> responseUploaded = FileUtils.uploadFile(file);
        if (!HttpStatus.OK.equals(responseUploaded.getHttpStatus())) {
            return new ResponseNormal("Lỗi upload file. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST);
        }

        Optional<Category> category = categoryRepository.findById(productDTO.getCategoryId());
        if (!category.isPresent()) {
            return new ResponseNormal("Danh mục sản phẩm không còn tồn tại. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST);
        }

        Product product = ProductMapper.toProduct(productDTO);
        product.setCategoryByIdCategory(category.get());
        product.setImage(responseUploaded.getData());

        productRepository.save(product);
        return new ResponseNormal("Thêm mới thành công", HttpStatus.OK);
    }

    @Override
    public ResponseNormal updateProduct(ProductDTO productDTO, MultipartFile file) {
        Optional<Category> category = categoryRepository.findById(productDTO.getCategoryId());
        if (!category.isPresent()) {
            return new ResponseNormal("Danh mục sản phẩm không còn tồn tại. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST);
        }

        String image = "";

        if (file != null) {
            // upload image
            ResponseUploadFile<String> responseUploaded = FileUtils.uploadFile(file);
            if (!HttpStatus.OK.equals(responseUploaded.getHttpStatus())) {
                return new ResponseNormal("Lỗi upload file. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST);
            }

            image = responseUploaded.getData();
        }

        Optional<Product> productOpt = productRepository.findById(productDTO.getId());
        if (!productOpt.isPresent()) {
            return new ResponseNormal("Sản phẩm không còn tồn tái. Vui lòng thử lại sau", HttpStatus.BAD_REQUEST);
        }

        Product product = ProductMapper.toProduct(productDTO);
        product.setCategoryByIdCategory(category.get());

        if (!image.isEmpty()) {
            FileUtils.deleteFile(productOpt.get().getImage());
            product.setImage(image);
        }

        productRepository.save(product);
        return new ResponseNormal("Sửa thành công", HttpStatus.OK);
    }

    @Override
    public ResponseNormal deleteProduct(Integer id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return new ResponseNormal("Sản phẩm không còn tồn tại", HttpStatus.BAD_REQUEST);
        }

        FileUtils.deleteFile(product.getImage());

        productRepository.deleteById(id);
        return new ResponseNormal("Xóa thành công", HttpStatus.OK);
    }

    @Override
    public ResponseNormal addCategory(CategoryDTO categoryDTO) {
        //Check trùng tên
        List<Category> categoryList = categoryRepository.findAll();
        long result = categoryList.stream()
                .filter(c -> categoryDTO.getName().trim().equalsIgnoreCase(c.getName()))
                .count();
        if (result > 0) {
            return new ResponseNormal("Tên danh mục đã tồn tại, không được thêm!", HttpStatus.BAD_REQUEST);
        }
        categoryRepository.save(CategoryMapper.toCategory(categoryDTO));
        return new ResponseNormal("Thêm mới thành công", HttpStatus.OK);
    }

    @Override
    public ResponseNormal updateCategory(CategoryDTO categoryDTO) {
        //Check trùng tên
        List<Category> categoryList = categoryRepository.findAll();
        long result = categoryList.stream()
                .filter(c -> categoryDTO.getName().trim().equalsIgnoreCase(c.getName()))
                .count();
        if (result > 0) {
            return new ResponseNormal("Tên danh mục đã tồn tại, không được sửa!", HttpStatus.BAD_REQUEST);
        }
        categoryRepository.save(CategoryMapper.toCategory(categoryDTO));
        return new ResponseNormal("Sửa thành công", HttpStatus.OK);
    }

    @Override
    public ResponseNormal deleteCategory(Integer id) {
        List<Product> productList = productRepository.findProductByCategory(id);
        if (productList.size() > 0) {
            return new ResponseNormal("Còn sản phẩm thuộc danh mục này, không thể xóa!", HttpStatus.BAD_REQUEST);
        }
        categoryRepository.deleteById(id);
        return new ResponseNormal("Xóa thành công!", HttpStatus.OK);
    }
}

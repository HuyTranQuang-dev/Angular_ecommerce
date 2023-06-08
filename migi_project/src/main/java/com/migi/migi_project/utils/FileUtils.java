package com.migi.migi_project.utils;

import com.migi.migi_project.model.response.ResponseUploadFile;
import org.springframework.http.HttpStatus;
import org.springframework.util.ResourceUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.UUID;

public class FileUtils {
    private FileUtils() { }

    private static final String UPLOAD_DIR = FileUtils.getResourceBasePath() + "\\src\\main\\resources\\images\\";


    public static String getResourceBasePath() {
        // Get the directory
        File path = null;
        try {
            path = new File(ResourceUtils.getURL("classpath:").getPath());
        } catch (FileNotFoundException e) {
            // nothing to do
        }
        if (path == null || !path.exists()) {
            path = new File("");
        }

        String pathStr = path.getAbsolutePath();
        // If it is running in eclipse, it will be in the same level as the target. If the jar is deployed to the server, the default is the same as the jar package.
        pathStr = pathStr.replace("\\target\\classes", "");

        return pathStr;
    }


    public static boolean deleteFile(String fileName) {
        File file = new File(UPLOAD_DIR + fileName);
        if (file.exists()) {
            if (file.delete()) {
                System.out.println("Xóa tệp tin thành công: " + fileName);
                return true;
            } else {
                System.out.println("Không thể xóa tệp tin: " + fileName);
                return false;
            }
        } else {
            System.out.println("Tệp tin không tồn tại: " + fileName);
            return false;
        }
    }

    public static ResponseUploadFile<String> uploadFile(MultipartFile multipartFile) {
        //Tạo thư mục chứa ảnh nếu không tồn tại
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
        //Lấy tên file và đuôi mở rộng của file
        String originalFilename = multipartFile.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        if (originalFilename.length() > 0) {

            //Kiểm tra xem file có đúng định dạng không
            if (!extension.equals("png") && !extension.equals("jpg") && !extension.equals("gif") && !extension.equals("svg") && !extension.equals("jpeg")) {
                return new ResponseUploadFile<>("Không hỗ trợ định dạng file này!", HttpStatus.BAD_REQUEST, "");
            }
            try {
                String nameFile = UUID.randomUUID() + "." + extension;
                String linkFile = UPLOAD_DIR + nameFile;
                //Tạo file
                File file = new File(linkFile);
                BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream(file));
                bos.write(multipartFile.getBytes());
                bos.close();

                return new ResponseUploadFile<>("Upload ảnh thành công!", HttpStatus.OK, nameFile);

            } catch (Exception e) {
                System.out.println("Có lỗi trong quá trình upload file!");
            }
        }
        return new ResponseUploadFile<>("File không hợp lệ!", HttpStatus.BAD_REQUEST, "");
    }
}

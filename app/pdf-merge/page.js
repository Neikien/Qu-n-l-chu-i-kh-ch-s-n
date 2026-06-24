'use client'; // Bắt buộc vì có sử dụng hooks và sự kiện trình duyệt

import { useRef, useState } from 'react';
import jsPDF from 'jspdf';

export default function PdfMergerPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Hàm xử lý khi chọn file
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            src: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });
  };

  // Hàm ghép ảnh thành PDF
  const mergeToPDF = () => {
    if (images.length === 0) {
      alert('Vui lòng chọn ít nhất một ảnh!');
      return;
    }

    setIsLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      images.forEach((image, index) => {
        if (index > 0) {
          pdf.addPage();
        }

        // Tính toán tỷ lệ để ảnh vừa với trang
        const imgProps = pdf.getImageProperties(image.src);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;
        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;

        pdf.addImage(image.src, 'JPEG', x, y, width, height);
      });

      pdf.save('merged-images.pdf');
    } catch (error) {
      console.error('Lỗi tạo PDF:', error);
      alert('Có lỗi xảy ra khi tạo PDF!');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xóa ảnh
  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Kéo thả file
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileChange(event);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>📄 Ghép ảnh thành PDF</h1>
      <p>Tải lên các ảnh và sắp xếp thứ tự trước khi xuất PDF.</p>

      {/* Khu vực tải lên */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          margin: '20px 0',
          backgroundColor: '#f9f9f9'
        }}
      >
        <p>📁 Kéo thả ảnh vào đây hoặc</p>
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Chọn ảnh từ máy tính
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      {/* Danh sách ảnh đã tải lên */}
      {images.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Đã tải lên: {images.length} ảnh</h3>
            <div>
              <button
                onClick={mergeToPDF}
                disabled={isLoading}
                style={{
                  padding: '10px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  marginRight: '10px'
                }}
              >
                {isLoading ? 'Đang xử lý...' : '⬇️ Tạo PDF'}
              </button>
              <button
                onClick={() => setImages([])}
                style={{
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Xóa tất cả
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
            {images.map((image) => (
              <div
                key={image.id}
                style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={image.src}
                  alt="Uploaded"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => removeImage(image.id)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

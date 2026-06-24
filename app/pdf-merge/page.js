'use client';

import { useState } from 'react';

export default function HelloPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý khi chọn file bằng click
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log('Đã chọn file:', files);
    
    const imageUrls = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...imageUrls]);
  };

  // Xử lý kéo thả
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    console.log('Đã thả file:', files);
    
    const imageUrls = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setImages(prev => [...prev, ...imageUrls]);
  };

  // Xóa ảnh
  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // HÀM TẠO PDF
  const createPDF = async () => {
    if (images.length === 0) {
      alert('Chưa có ảnh nào để tạo PDF!');
      return;
    }

    setIsLoading(true);
    
    try {
      // Import jspdf - dynamic import để tránh lỗi SSR
      const { default: jsPDF } = await import('jspdf');
      
      // Tạo PDF với khổ A4
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();  // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      console.log('Kích thước trang A4:', pageWidth, 'x', pageHeight);

      // Duyệt qua từng ảnh
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        // Tạo đối tượng Image để lấy kích thước thật
        const img = new Image();
        img.src = image.url;
        
        // Chờ ảnh load xong
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          // Nếu ảnh đã load rồi thì vẫn resolve
          if (img.complete) resolve();
        });

        const imgWidth = img.width;
        const imgHeight = img.height;
        
        console.log(`Ảnh ${i+1}: ${imgWidth}x${imgHeight}`);

        // TÍNH TOÁN KÍCH THƯỚC HIỂN THỊ
        // Chiều rộng luôn bằng chiều rộng trang A4
        const displayWidth = pageWidth;
        // Chiều cao tính theo tỉ lệ của ảnh
        const displayHeight = (imgHeight / imgWidth) * displayWidth;
        
        console.log(`Hiển thị: ${displayWidth.toFixed(2)}x${displayHeight.toFixed(2)}mm`);

        // Thêm trang mới (trừ trang đầu tiên)
        if (i > 0) {
          pdf.addPage();
        }

        // Thêm ảnh vào PDF
        // Căn giữa theo chiều ngang, nếu ảnh ngắn hơn trang thì căn giữa theo chiều dọc
        const x = 0; // Căn lề trái
        const y = (pageHeight - displayHeight) / 2; // Căn giữa theo chiều dọc
        
        pdf.addImage(
          image.url,
          'JPEG',
          x,
          y,
          displayWidth,
          displayHeight
        );
      }

      // Lưu file PDF
      pdf.save('merged-images.pdf');
      console.log('✅ Tạo PDF thành công!');
      
    } catch (error) {
      console.error('Lỗi tạo PDF:', error);
      alert(`Có lỗi xảy ra: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      <h1 style={{ fontSize: '36px', color: '#0070f3', textAlign: 'center' }}>
        📄 Ghép ảnh thành PDF
      </h1>
      <p style={{ fontSize: '18px', color: '#666', textAlign: 'center', marginBottom: '30px' }}>
        Kéo thả ảnh vào để tạo file PDF
      </p>

      {/* Layout 2 cột */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Cột trái: Khung kéo thả */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              border: '3px dashed #ccc',
              borderRadius: '12px',
              padding: '60px 20px',
              backgroundColor: '#f9f9f9',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onDragEnter={(e) => {
              e.currentTarget.style.borderColor = '#0070f3';
              e.currentTarget.style.backgroundColor = '#f0f7ff';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
          >
            <p style={{ fontSize: '48px', margin: '10px 0' }}>📁</p>
            <p style={{ fontSize: '20px', color: '#333', fontWeight: 'bold' }}>
              Kéo thả ảnh vào đây
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>hoặc</p>
            
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            
            <button
              onClick={() => document.getElementById('fileInput').click()}
              style={{
                padding: '12px 28px',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              Chọn ảnh từ máy tính
            </button>

            {images.length > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#e8f5e9',
                borderRadius: '20px',
                color: '#2e7d32'
              }}>
                ✅ Đã chọn {images.length} ảnh
              </div>
            )}
          </div>

          {/* Nút Tạo PDF */}
          {images.length > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                onClick={createPDF}
                disabled={isLoading}
                style={{
                  padding: '14px 40px',
                  backgroundColor: isLoading ? '#94a3b8' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '20px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  boxShadow: isLoading ? 'none' : '0 4px 6px rgba(34, 197, 94, 0.3)',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isLoading ? '⏳ Đang xử lý...' : '⬇️ Tạo PDF'}
              </button>
              {isLoading && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Đang xử lý {images.length} ảnh...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Cột phải: Danh sách ảnh */}
        <div>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#333',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            📸 Danh sách ảnh ({images.length})
          </h3>
          
          {images.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              color: '#999'
            }}>
              <p style={{ fontSize: '16px' }}>Chưa có ảnh nào được chọn</p>
              <p style={{ fontSize: '14px' }}>Hãy kéo thả ảnh vào khung bên trái</p>
            </div>
          ) : (
            <div style={{
              maxHeight: '600px',
              overflowY: 'auto',
              paddingRight: '10px'
            }}>
              {images.map((img, index) => (
                <div
                  key={img.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    minWidth: '30px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#999'
                  }}>
                    #{index + 1}
                  </div>

                  <img
                    src={img.url}
                    alt={img.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb'
                    }}
                  />

                  <div style={{
                    flex: 1,
                    textAlign: 'left',
                    overflow: 'hidden'
                  }}>
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {img.name}
                    </p>
                  </div>

                  <button
                    onClick={() => removeImage(img.id)}
                    disabled={isLoading}
                    style={{
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '4px',
                      width: '30px',
                      height: '30px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      opacity: isLoading ? 0.5 : 1
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length > 1 && (
                <button
                  onClick={() => setImages([])}
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    marginTop: '10px',
                    width: '100%',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  🗑️ Xóa tất cả ({images.length} ảnh)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

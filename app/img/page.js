'use client';

import { useState } from 'react';

export default function HelloPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageUrls = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...imageUrls]);
  };

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // Ham 1: Chuyen sang JPEG
  // Ham 2: Resize voi chieu rong = 210mm (A4)
  const convertAndResize = (img) => {
    const FIXED_WIDTH = 210; // mm
    
    // Tinh chieu cao theo ti le
    const displayHeight = (img.height / img.width) * FIXED_WIDTH;
    
    // Tao canvas voi kich thuoc moi
    const canvas = document.createElement('canvas');
    canvas.width = FIXED_WIDTH;
    canvas.height = displayHeight;
    
    const ctx = canvas.getContext('2d');
    // Ve anh len canvas voi kich thuoc moi (resize)
    ctx.drawImage(img, 0, 0, FIXED_WIDTH, displayHeight);
    
    // Xuat ra JPEG
    return canvas.toDataURL('image/jpeg', 0.95);
  };

  const createPDF = async () => {
    if (images.length === 0) {
      alert('Chua co anh nao de tao PDF!');
      return;
    }

    setIsLoading(true);
    
    try {
      const { default: jsPDF } = await import('jspdf');
      
      const FIXED_WIDTH = 210; // mm
      
      let pdf = null;

      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        
        const img = new Image();
        img.src = image.url;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          if (img.complete) resolve();
        });

        // CHI LAM 2 VIEC:
        // 1. Chuyen sang JPEG
        // 2. Resize voi chieu rong = 210mm, chieu cao tu dong theo ti le
        const imageData = convertAndResize(img);
        
        // Lay chieu cao sau khi resize
        const displayHeight = (img.height / img.width) * FIXED_WIDTH;
        
        // Tao trang moi voi kich thuoc da resize
        if (i === 0) {
          pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: [FIXED_WIDTH, displayHeight]
          });
        } else {
          pdf.addPage([FIXED_WIDTH, displayHeight]);
        }

        // Them anh da duoc chuyen sang JPEG va resize
        pdf.addImage(
          imageData,
          'JPEG',
          0,
          0,
          FIXED_WIDTH,
          displayHeight
        );
      }

      pdf.save('merged-images.pdf');
    } catch (error) {
      console.error('Loi tao PDF:', error);
      alert('Co loi xay ra khi tao PDF: ' + error.message);
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
        Ghep anh thanh PDF
      </h1>
      <p style={{ fontSize: '18px', color: '#666', textAlign: 'center', marginBottom: '30px' }}>
        Keo tha anh vao de tao file PDF
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
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
            <p style={{ fontSize: '48px', margin: '10px 0' }}>+</p>
            <p style={{ fontSize: '20px', color: '#333', fontWeight: 'bold' }}>
              Keo tha anh vao day
            </p>
            <p style={{ fontSize: '14px', color: '#999' }}>hoac</p>
            
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
              Chon anh tu may tinh
            </button>

            {images.length > 0 && (
              <div style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#e8f5e9',
                borderRadius: '20px',
                color: '#2e7d32'
              }}>
                Da chon {images.length} anh
              </div>
            )}
          </div>

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
                {isLoading ? 'Dang xu ly...' : 'Tao PDF'}
              </button>
              {isLoading && (
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                  Dang xu ly {images.length} anh...
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 style={{
            margin: '0 0 15px 0',
            color: '#333',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            Danh sach anh ({images.length})
          </h3>
          
          {images.length === 0 ? (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              color: '#999'
            }}>
              <p style={{ fontSize: '16px' }}>Chua co anh nao duoc chon</p>
              <p style={{ fontSize: '14px' }}>Hay keo tha anh vao khung ben trai</p>
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
                    X
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
                  Xoa tat ca ({images.length} anh)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

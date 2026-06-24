'use client';

export default function HelloPage() {
  // Hàm xử lý kéo thả - chỉ log để kiểm tra
  const handleDragOver = (e) => {
    e.preventDefault();
    console.log('Đang kéo qua');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    console.log('Đã thả file:', e.dataTransfer.files);
  };

  const handleClick = () => {
    console.log('Click vào khung');
  };

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', color: '#0070f3' }}>
        👋 Hello World!
      </h1>
      <p style={{ fontSize: '20px', color: '#666', marginBottom: '30px' }}>
        Trang này đang hoạt động bình thường!
      </p>

      {/* Khung kéo thả ảnh */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: '3px dashed #ccc',
          borderRadius: '12px',
          padding: '60px 20px',
          margin: '20px auto',
          maxWidth: '500px',
          backgroundColor: '#f9f9f9',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
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
        <p style={{ fontSize: '24px', margin: '10px 0' }}>📁</p>
        <p style={{ fontSize: '18px', color: '#333' }}>
          Kéo thả ảnh vào đây
        </p>
        <p style={{ fontSize: '14px', color: '#999' }}>
          (Chưa xử lý, chỉ test UI)
        </p>
      </div>
    </div>
  );
}

// Thay thế cho toàn bộ phần <header> của bạn

const Header = () => {
  return (
    <header className="uhf_headerFooter">
      {/* 1. Thanh Tiện ích Chính (Desktop View) */}
      <div className="utilityNavWrapper visible-sm visible-md visible-lg">
        <div className="utilityNavContainer container">
          <div className="row">
            <div className="col-md-12 clearfix">
              {/* Phần liên hệ và hỗ trợ */}
              <nav className="utilityNav">
                <ul className="utilityNav-list u-list clearfix">
                  <li className="utilityNav-list-item u-list-item">
                    {/* Số điện thoại, lấy từ mã nguồn của bạn: "tel:18778343613" và text "Quý vị cần giúp đỡ?" */}
                    <a className="utilityNav-link u-link nav-middle resDirectIcon-link" href="tel:18778343613" aria-label="Call intercontinental">
                      <i className="fa fa-phone" style={{ fontSize: '1.3em', verticalAlign: 'middle', paddingRight: '.3em' }}></i>
                    </a>
                    <span className="utilityNav-link u-link nav-middle resDirectNum-link">18778343613</span>
                  </li>
                  <li className="utilityNav-list-item u-list-item">
                    <a className="utilityNav-link u-link nav-middle" href="#" title="Quý vị cần giúp đỡ?">Quý vị cần giúp đỡ?</a>
                  </li>
                </ul>
              </nav>

              {/* Phần Đăng nhập/Tham gia và Ngôn ngữ */}
              <div className="logIn">
                {/* Chọn Ngôn ngữ */}
                <div className="utilityNav-list-item u-list-item">
                  <a className="utilityNav-link language u-link nav-middle" href="javascript:void(0);" aria-label="Select country and language">
                    <span className="language-text nav-middle">Tiếng Việt ▾</span>
                    {/* Giả định icon mũi tên xuống (fa fa-angle-down) */}
                    <i className="fa fa-angle-down nav-middle"></i>
                  </a>
                </div>
                
                {/* Đăng nhập/Tham gia */}
                <div className="logIn-anonymous logIn-State">
                  <a className="logIn-link login-join" href="#" title="Tham gia miễn phí">
                    <span>Tham gia miễn phí</span>
                  </a>
                  <a className="logIn-link login-signin" href="javascript:void(0);" title="Đăng nhập">
                    <div className="login-signin-icon"></div>
                    <span>Đăng nhập</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 2. Menu Di động (Dạng Hamburger) */}
      <div className="mobileNavManuWrapper hidden-sm hidden-md hidden-lg wrapper-UBE bn-intercontinental">
          <div className="brandLogo">
              {/* Logo (Bạn cần chèn ảnh logo ở đây) */}
              <a className="brandLogo-link" href="#" title="InterContinental Hotels & Resorts">
                  <img className="brandLogo-image" alt="InterContinental Hotels & Resorts" src="//digital.ihg.com/is/content/ihg/ic-logo-updated?fmt=png-alpha" />
              </a>
          </div>
          <div className="mobileNav">
              <a className="mobileNav-link menuCTA" href="javascript:void(0);">
                   {/* Icon Hamburger */}
                  <img src="//digital.ihg.com//is/image/ihg/xsvp-hamburger-nav-white?fmt=png-alpha" alt="Menu" style={{ width: '20px' }} />
              </a>
          </div>
          {/* ... Phần đăng nhập/tham gia di động ... */}
      </div>

    </header>
  );
};

export default Header;
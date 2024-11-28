function Footer () {

    return (
        // <!-- Footer -->
        <footer class="footer">
          <div class="footer-content">
            {/* <!-- About Section --> */}
            <div class="footer-section">
              <h3>About Us</h3>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias
                laudantium commodi, nostrum, qui officiis consequuntur dignissimos
                corporis delectus ullam ad dolorum id quam fuga porro et! Error
                consequatur soluta reiciendis.
              </p>
            </div>
    
            {/* <!-- Quick Links Section --> */}
            <div class="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="{{ url_for('home') }}">Home</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">FAQs</a></li>
              </ul>
            </div>
    
            {/* <!-- Social Media Section --> */}
            <div class="footer-section">
              <h3>Follow Us</h3>
              <div class="social-icons">
                <a href="#" aria-label="Facebook">F</a>
                <a href="#" aria-label="Twitter">T</a>
                <a href="#" aria-label="Instagram">I</a>
                <a href="#" aria-label="LinkedIn">L</a>
              </div>
            </div>
          </div>
    
          {/* <!-- Footer Bottom --> */}
          <div class="footer-bottom">© {new Date().getFullYear()} Dwell-o. All rights reserved.</div>
        </footer>
    );
}
export default Footer
class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = /* html */`
    <section class="app-footer">
      <footer class="footer-28 py-5">
        <div class="footer-bg-layer">
          <div class="container py-lg-3">
            <div class="row footer-top-28">
              <div class="col-lg-4 footer-list-28 copy-right mb-lg-0 mb-sm-5 mt-sm-0 mt-4">
                <a class="navbar-brand mb-3" href="index.html">
                  <span class="fa fa-newspaper-o"></span> NewsBlog</a>
                <p class="copy-footer-28"> © 2020. All Rights Reserved. </p>
                <h5 class="mt-2">Design by <a href="#companyurl">Company</a></h5>
              </div>
              <div class="col-lg-8 row">
                <div class="col-sm-4 col-6 footer-list-28">
                  <h6 class="footer-title-28">Useful links</h6>
                  <ul>
                    <li><a href="#categories">food blogs</a></li>
                    <li><a href="#advertise">Advertise with us</a></li>
                    <li><a href="#authors">Our Authors</a></li>
                    <li><a href="contact.html">Get in touch</a></li>
                  </ul>
                </div>
                <div class="col-sm-4 col-6 footer-list-28">
                  <h6 class="footer-title-28">Categories</h6>
                  <ul>
                    <li><a href="detail.html?id=2976">Beauty</a></li>
                    <li><a href="detail.html?id=2995">Fashion and Style</a></li>
                    <li><a href="detail.html?id=3298"> Food and Wellness</a></li>
                    <li><a href="detail.html?id=1143">Lifestyle</a></li>
                  </ul>
                </div>
                <div class="col-sm-4 col-6 footer-list-28 mt-sm-0 mt-4">
                  <h6 class="footer-title-28">Social Media</h6>
                  <ul class="social-icons">
                    <li class="facebook">
                      <a href="#facebook"><span class="fa fa-facebook"></span> Facebook</a>
                    </li>
                    <li class="twitter"> <a href="#twitter"><span class="fa fa-twitter"></span>
                        Twitter</a></li>
                    <li class="linkedin"> <a href="#linkedin"><span class="fa fa-linkedin"></span>
                        Linkedin</a></li>
                    <li class="dribbble"><a href="#dribbble"><span class="fa fa-dribbble"></span>
                        Dribbble</a></li>
                  </ul>

                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </footer>

      <!-- move top -->
      <button onclick="topFunction()" id="movetop" title="Go to top">
        <span class="fa fa-angle-up"></span>
      </button>
      <script>
        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function () {
          scrollFunction()
        };

        function scrollFunction() {
          if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            document.getElementById("movetop").style.display = "block";
          } else {
            document.getElementById("movetop").style.display = "none";
          }
        }

        // When the user clicks on the button, scroll to the top of the document
        function topFunction() {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        }
      </script>
      <!-- /move top -->
    </section>`;
  }
}

customElements.define('footer-component', Footer);
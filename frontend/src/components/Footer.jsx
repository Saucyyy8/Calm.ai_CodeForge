import React from 'react';
import '../pages/DashboardPage.css';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>Calm.ai</h4>
                    <a href="#">About Us</a>
                    <a href="#">Blog</a>
                    <a href="#">Careers</a>
                </div>
                <div className="footer-column">
                    <h4>Contact</h4>
                    <a href="mailto:mailsuhas.madhu@gmail.com">Write to us</a>
                    <a href="https://www.linkedin.com/in/suhas-madhu-37393528b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div className="footer-column">
                    <h4>Legal</h4>
                    <a href="#">Terms of Service</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Policy</a>
                </div>
                <div className="footer-social">
                    <div className="social-icons">
                        <a href="https://www.linkedin.com/in/suhas-madhu-37393528b/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                        <a href="mailto:mailsuhas.madhu@gmail.com" aria-label="Email">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" /></svg>
                        </a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Calm.ai. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

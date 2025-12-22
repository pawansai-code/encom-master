import { useState } from "react";
import {
    FaAddressCard,
    FaBell,
    FaBook,
    FaBriefcase,
    FaCalendarAlt,
    FaChartLine,
    FaFire,
    FaGamepad,
    FaHistory,
    FaHome,
    FaInfoCircle,
    FaList,
    FaMapMarkerAlt,
    FaNewspaper,
    FaPhone,
    FaTools,
    FaTrophy,
    FaUtensils
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import useTranslation from "../../hooks/useTranslation";
import "./Navigation.css";

const Navigation = ({ includeSearch = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { icon: FaHome, label: t("Home"), path: "/" },
    { icon: FaRobot, label: "Chatbot", path: "/chatbot" },
    { icon: FaTools, label: t("Tools"), path: "/tools" },
    { icon: FaGamepad, label: t("Funzone"), path: "/funzone" },
    { icon: FaBook, label: t("Journal"), path: "/journal" },
    { icon: FaFire, label: t("Streaks"), path: "/streaks" },
    { icon: FaBriefcase, label: t("Jobs"), path: "/jobs" },
    { icon: FaNewspaper, label: t("News"), path: "/news" },
    { icon: FaInfoCircle, label: t("UpdatesInfo"), path: "/updates" },
    { icon: FaTrophy, label: t("Results"), path: "/results" },
    { icon: FaBell, label: t("Notifications"), path: "/notifications" },
    { icon: FaChartLine, label: t("Sports"), path: "/sports" },
    { icon: FaUtensils, label: t("FamousFood"), path: "/famousfood" },
    { icon: FaHistory, label: t("NelloreHistory"), path: "/history" },
    { icon: FaMapMarkerAlt, label: t("FamousStay"), path: "/famousstay" },
    { icon: FaCalendarAlt, label: t("Events"), path: "/events" },
    { icon: FaBook, label: t("Articles"), path: "/articles" },
    { icon: FaAddressCard, label: t("ContactUs"), path: "/contact" },
  ];

  const hubNavItems = [
    { icon: FaHome, label: t("Home"), path: "/HomePage" },
    { icon: FaTools, label: t("Tools"), path: "/tools" },
    { icon: FaGamepad, label: t("Funzone"), path: "/funzone" },
    { icon: FaBook, label: t("Journal"), path: "/journal" },
    { icon: FaFire, label: t("Streaks"), path: "/streaks" },
    { icon: FaBriefcase, label: t("Jobs"), path: "/hub/jobs" },
    { icon: FaNewspaper, label: t("News"), path: "/hub/news" },
    { icon: FaInfoCircle, label: t("UpdatesInfo"), path: "/hub/updates" },
    { icon: FaTrophy, label: t("Events"), path: "/hub/events" },
    { icon: FaChartLine, label: t("Sports"), path: "/hub/sports" },
    { icon: FaPhone, label: t("ContactUs"), path: "/hub/contact" },
  ];

  const isHubPage = location.pathname.startsWith("/hub");
  let items = isHubPage ? hubNavItems : navItems;

  // if (location.pathname === '/history') {
  //   items = [...items, { icon: FaHistory, label: 'Nellore History', path: '/history' }];
  // }

  return (
    <nav className="main-navigation">
        <div className="d-flex justify-content-center align-items-center navigation-wrapper">
          <div className="mobile-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaList />
          </div>
          <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {includeSearch && (
            <div className="nav-search">
              <input
                type="text"
                placeholder={t("SearchPlaceholder")}
                className="search-input"
              />
            </div>
          )}
        </div>
    </nav>
  );
};

export default Navigation;

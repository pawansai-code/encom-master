import { FaChevronDown, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../State/slices/appSlice";
import "./Mainheader.css";

const MainHeader = ({
  siteName = "NELLORIENS",
  tagline = "Explore, Discover, Connect",
}) => {
  const language = useSelector((state) => state.app.language);
  const dispatch = useDispatch();

  const handleLanguageChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <div className="main-header">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center py-3 main-header-content">
          <div className="d-flex align-items-center logo-site-container">
            <div className="logo-circle">
              <FaGlobe className="logo-icon" />
            </div>
            <div>
              <h1 className="site-title">{siteName}</h1>
              <div className="d-flex align-items-center gap-2 tagline">
                <FaMapMarkerAlt />
                <span>{tagline}</span>
              </div>
            </div>
          </div>
          <div className="language-selector">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="language-dropdown"
            >
              <option value="en">English</option>
              <option value="te">Telugu</option>
              <option value="hi">Hindi</option>
            </select>
            <FaChevronDown className="dropdown-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;

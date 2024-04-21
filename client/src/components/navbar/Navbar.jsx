import { Link, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import useMakeRequest from "../../hook/useFetch";
import profilePic from "../../assets/profilePic.png";
import Img from "../../components/Img";

const Navbar = () => {
  const { setCurrentUser, currentUser } = useContext(AuthContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const makeRequest = useMakeRequest();

  const handleSearch = async (value) => {
    try {
      setSearchValue(value);
      if (value.length > 0) {
        const { data } = await makeRequest.get(`users/find?username=${value}`);
        setSearchResults(data);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResultClick = (username) => {
    navigate(`/profile/${username}`);
    setSearchValue("");
    setSearchResults([]);
    setShowResults(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        event.target.closest(".nav__search") === null &&
        event.target.closest(".search-results") === null
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="nav">
      <div className="nav__content">
        <Link className="logo" to={"/"}>
          <img src="/logo.svg" alt="Socialfleet" />
        </Link>
        <div className="nav__search">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Enter username"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="nav__search--input"
          />
          <SearchIcon className="search-icon" /> {/* Added search icon here */}
          {showResults && (
            <ul className="search-results">
              {searchResults.map((user) => (
                <li
                  key={user.username}
                  className="search-result"
                  onClick={() => handleResultClick(user.username)}
                >
                  <div className="user">
                    <div className="userInfo">
                      <Img
                        isDefault={user.profilePic ? false : true}
                        src={user.profilePic ? user.profilePic : profilePic}
                        alt="Image"
                      />
                      <span className="name">{user.name}</span>
                      <span className="username"> ({user.username})</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <ul className="nav__items">
          <li className="nav__item">
            <Link to={"/"}>
              <HomeOutlinedIcon />
            </Link>
          </li>
          <li className="nav__item">
            <Link
              onClick={() => {
                localStorage.setItem("user", null);
                setCurrentUser(null);
              }}
              to={"/login"}
            >
              <ExitToAppRoundedIcon />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import "./style.scss";
import { authActions } from "../../store/auth/authSlice";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/logo.jpeg";



const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };
    const dispatch = useDispatch();
    const onLogout = () => {
        dispatch(authActions.logout());
        localStorage.removeItem("user");
        navigate("/");
      };

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else if(type === "tv") {
            navigate("/explore/tv");
        }
        else if(type === "register"){
            navigate("/register")
        }
        else if(type === "login")
            {
                navigate("/login")
            }
            else if("favourites")
                {
                    navigate("/favourites")
                }
        setMobileMenu(false);
    };

    var [useremail,setuseremail]=useState('123456789');
  var [username,setusername]=useState('123456789');
useEffect(()=>{
  changeNavbar();
  setInterval(() => {
    changeNavbar();
  }, 2000);
  
});

function changeNavbar(){
    // console.log('show',show);
    var c=localStorage.getItem('ashokcookie');
     //console.log("=>",c);
     if(c==null||c.length<5){
     // console.log("h");
     console.log("nav");
      //if(useremail!=='123456789'){setuseremail('123456789');console.log('bar');}
      localStorage.setItem('ashokcookie','random');
      setuseremail('123456789');
     }
     else if(c=='random'){

     }
     else{
       c=JSON.parse(c);
       //console.log("->",c);
      setuseremail(c.e);
      setusername(c.e.substr(0,c.e.length - 10));
   
     }
   
    }
    console.log(user)
    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="" /><span style={{color:"white",fontSize:"4rem"}}>Movies</span>
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("movie")}
                    >
                        Movies
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("tv")}
                    >
                        TV Shows
                    </li>
                    
                    {
user !== null?
<>

<li className="menuItem" onClick={() => navigationHandler("favourites")}>
 Favourites
</li> 
<li className="menuItem" style={{fontWeight:"bolder"}}>
 {user?.name}
</li> 

<li className="menuItem" onClick={onLogout}>
 logout
</li> 

</>  :
<>
<li className="menuItem" onClick={() => navigationHandler("register")}>
 Register
</li> 
<li className="menuItem" onClick={() => navigationHandler("login")}>
 Login
</li> 

</>


      }
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Search for a movie or tv show...."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <VscChromeClose
                                onClick={() => setShowSearch(false)}
                            />
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;

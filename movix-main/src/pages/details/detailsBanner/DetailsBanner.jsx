import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import axios from 'axios';
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailsBanner = ({ video, crew }) => {
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const {user}=useSelector((state)=>state.auth)
    const { mediaType, id } = useParams();
    const { data, loading } = useFetch(`/${mediaType}/${id}`);
    
    const { url } = useSelector((state) => state.home);

    const _genres = data?.genres?.map((g) => g.id);

    const director = crew?.filter((f) => f.job === "Director");
    const writer = crew?.filter(
        (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
    );

    const toHoursAndMinutes = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    };
    const [added, setAdd]=useState("false")
    const [toggle,setToggle]=useState(false)
    const [load,setLoad] = useState(false);

    useEffect(()=>{
        const t= async()=>{
            try {
                const response = await axios.get('http://localhost:5000/api/users/check', {
                    params: {
                        userId: user._id,
                        data: data
                    },
                    body: { data: data.id }
                });
                setAdd(response.data);
            } catch (error) {
                console.error("There was an error fetching the favorite movies!", error);
            }
        }
        t();
        
    })

    useEffect(() => {
        const t = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/check', {
                    params: {
                        userId: user._id,
                        data: data
                    },
                    body: { data: data.id }
                });
                setAdd(response.data);
            } catch (error) {
                console.error("There was an error fetching the favorite movies!", error);
            } finally {
                setLoad(false);
            }
        };
    
       setLoad(true)
        setTimeout(()=>t(),2000)
      }, [added,toggle]);

    const handleClick = async()=>{
        if(toggle)
            {
                setToggle(false)
            }else setToggle(true)
            
      if (user === null) {
            toast.error("Please log in first to add items to your favourites.");
          } else {
            if(added === 'true')
                {
                    await axios.post('http://localhost:5000/api/users/removeFavourites' , {
                        params: {
                          userId: user?._id
                        },
                        body:{data:data}
                      })
                }else
       { await axios.post('http://localhost:5000/api/users/addFavourites' , {
        params: {
          userId: user?._id
        },
        body:{data:data}
      })} }
    }

    return (
        <div className="detailsBanner">
            {!loading ? (
                <>
                    {!!data && (
                        <React.Fragment>
                            
                            <div className="opacity-layer"></div>
                            <ContentWrapper>
                                <div className="content">
                                    <div className="left">
                                        {data.poster_path ? (
                                            <Img
                                                className="posterImg"
                                                src={
                                                    url.backdrop +
                                                    data.poster_path
                                                }
                                            />
                                        ) : (
                                            <Img
                                                className="posterImg"
                                                src={PosterFallback}
                                            />
                                        )}
                                    </div>
                                    <div className="right">
                                        <div className="title">
                                            {`${
                                                data.name || data.title
                                            } (${dayjs(
                                                data?.release_date
                                            ).format("YYYY")})`}
                                        </div>
                                        <div className="subtitle">
                                            {data.tagline}
                                        </div>

                                        <Genres data={_genres} />

                                        <div className="row">
                                            <CircleRating
                                                rating={data.vote_average.toFixed(
                                                    1
                                                )}
                                            />
                                            <div
                                                className="playbtn"
                                                onClick={() => {
                                                    setShow(true);
                                                    setVideoId(video.key);
                                                }}
                                            >
                                                <PlayIcon />
                                                <span className="text">
                                                    Watch Trailer
                                                </span>
                                            </div>
                                        </div>

                                        <button style={buttonStyle} onClick={handleClick}>{load?`Loading...`:(added === 'false' || user==null) ?`Add to Favourite`:`Remove From Favourite`}</button>
                                        <ToastContainer />
                                        <div className="overview">
                                            <div className="heading">
                                                Overview
                                            </div>
                                            <div className="description">
                                                {data.overview}
                                            </div>
                                        </div>

                                        <div className="info">
                                            {data.status && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Status:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {data.status}
                                                    </span>
                                                </div>
                                            )}
                                            {data.release_date && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Release Date:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {dayjs(
                                                            data.release_date
                                                        ).format("MMM D, YYYY")}
                                                    </span>
                                                </div>
                                            )}
                                            {data.runtime && (
                                                <div className="infoItem">
                                                    <span className="text bold">
                                                        Runtime:{" "}
                                                    </span>
                                                    <span className="text">
                                                        {toHoursAndMinutes(
                                                            data.runtime
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {director?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Director:{" "}
                                                </span>
                                                <span className="text">
                                                    {director?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {director.length -
                                                                1 !==
                                                                i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {writer?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Writer:{" "}
                                                </span>
                                                <span className="text">
                                                    {writer?.map((d, i) => (
                                                        <span key={i}>
                                                            {d.name}
                                                            {writer.length -
                                                                1 !==
                                                                i && ", "}
                                                        </span>
                                                    ))}
                                                </span>
                                            </div>
                                        )}

                                        {data?.created_by?.length > 0 && (
                                            <div className="info">
                                                <span className="text bold">
                                                    Creator:{" "}
                                                </span>
                                                <span className="text">
                                                    {data?.created_by?.map(
                                                        (d, i) => (
                                                            <span key={i}>
                                                                {d.name}
                                                                {data
                                                                    ?.created_by
                                                                    .length -
                                                                    1 !==
                                                                    i && ", "}
                                                            </span>
                                                        )
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <VideoPopup
                                    show={show}
                                    setShow={setShow}
                                    videoId={videoId}
                                    setVideoId={setVideoId}
                                />
                            </ContentWrapper>
                        </React.Fragment>
                    )}
                </>
            ) : (
                <div className="detailsBannerSkeleton">
                    <ContentWrapper>
                        <div className="left skeleton"></div>
                        <div className="right">
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                            <div className="row skeleton"></div>
                        </div>
                    </ContentWrapper>
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    marginTop: '10px',
    marginBottom:'10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(45deg, #ff0000, #ff69b4)',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.3s ease',
  };
  
  buttonStyle[':hover'] = {
    background: 'linear-gradient(45deg, #ff69b4, #ff0000)',
    transform: 'scale(1.05)',
  };
  
  buttonStyle[':active'] = {
    background: 'linear-gradient(45deg, #ff0000, #ff69b4)',
    transform: 'scale(0.95)',
  };

export default DetailsBanner;

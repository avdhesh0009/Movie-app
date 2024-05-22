import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.scss';
import { useSelector } from 'react-redux';
import MovieCard from '../../components/movieCard/MovieCard';

const FavoriteMovies = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users/getFavourites', {
      params: {
        userId: user._id
      }
    })
    .then(response => {
      setMovies(response.data);
    })
    .catch(error => {
      console.error("There was an error fetching the favorite movies!", error);
    });
  }, []);

  const response = movies.filter((movie) => movie.userId === user._id);
  
  return (
    <div className="favorite-movies">
      <h1>Favorite Movies</h1>
      <div className="movies-list">
        {response.length > 0 ? (
          response.map(movie => (
            <MovieCard 
              key={movie._id}
              data={movie.data}
              mediaType="movie"
            />
          ))
        ) : (
          <p style={{color:"white", fontSize:"4rem", fontWeight:"bold", textAlign:"center", marginLeft:"3rem"}}>No favorite movie found. 😑</p>
        )}
      </div>
    </div>
  );
};

export default FavoriteMovies;

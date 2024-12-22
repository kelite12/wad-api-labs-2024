import React from 'react';
import { useQuery } from 'react-query';
import { getMovies } from "./api/movies-api";

export const PublicPage = () => {
    return <h2>Public page</h2>
 }
 export const Movies = () => {
    const {  data, error, isLoading, isError }  = useQuery('discover', getMovies)
    if (isLoading) {
        return <h1>Loading...</h1>
      }
    
      if (isError) {
        return <h1>{error.message}</h1>
      }  
      const movies = data.results;
      const moviesDisplay = (
        <div>
            {movies.map(movie => { return <>{movie.id},{movie.title}<br /></> })}
        </div>
    )
       return <div><h2>Movies</h2>{moviesDisplay}</div>
              
 }
 export const Profile = () => {
    return <h2>My Profile </h2>

}
 export const HomePage = () => {
     return  <h2>Home page</h2>
 }
 
export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=46d560215dbb52e08b814e10cccebcd4&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };
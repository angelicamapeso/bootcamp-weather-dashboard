//Search button event listener
document.getElementById('search-city').addEventListener('submit', submitSearch);

function submitSearch(event) {
  event.preventDefault();
  resetErrors();
  
  let userInput = document.getElementById('city-name').value;
  userInput = userInput.replace(/\s/g,'');

  if (userInput) {
    console.log('You wrote something!')
  } else {
    console.log('Did not write anything');
  }
}

function resetErrors() {
  document.getElementById('city-name').classList.remove('border-danger');
  document.getElementById('error').textContent = '';
}

function showSearchError(message) {
  document.getElementById('city-name').classList.add('border-danger');
  document.getElementById('error').textContent = message;
}
//fetch the data
  //error if city could not be found
  
  //if city can be found and data retrieved
  //display city in search history 
    //Ensure that first letter is capitalized
  //display data in overview card
  //display data in 5 day forecast
  

  //save search term in object (only if success!)
    //properties:
      //current
      //search history[]

//fetch data
  //fetch current data
  //fetch 5 day
  //fetch uv index

//on page load
  //grab the search object from local storage
  //display the overview info from current (make another fetch)
  //display search history
  //display 5 day forecast

  //if none
    //center text- enter city to see weather

//when city clicked in search history
  //if selection isn't current
    //make another fetch
    //display search history
    //display overview card
    //display 5 day forecast




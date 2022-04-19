import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios, { Requests } from 'axios';
import Select from "react-select"
import './Searchbar.css';



// TODO: figure out what's going on with .env files 
// TODO: figure out what's going on with api key

const SearchBar = () => {

   const location = useLocation();
   const user = location.state

   const [searchInput, setSearchInput] = useState("");
   const [multiSearchInput, setMultiSearchInput] = useState("");
   const [selectedOption, setSelectedOption] = useState(null);
   const [mealDBList, setMealDbList] = useState([])
   const [customMealList, setCustomMealList] = useState([])
   const [favorite, setFavorite] = useState(false);

   const mealSugg = [
      { value: "chicken", label: "Chicken" },
      { value: "chicken_breast", label: "Chicken Breast" },
      { value: "beef", label: "Beef" },
      { value: "steak", label: "Steak" },
      { value: "pork", label: "Pork" },
      { value: "pork_chops", label: "Pork Chops" },


      { value: "broccoli", label: "broccoli" },
      { value: "squash", label: "squash" },
      { value: "rice", label: "rice" },
      { value: "seaweed", label: "seaweed" },
   ]

   const tableItems = []
   const customTableItems = []






   // function to send
   async function handleSubmit(e) {
      e.preventDefault();
      //console.log(selectedOption)
      let searchString = ""
      if (selectedOption.length !== 0) {
         for (let i = 0; i < selectedOption.length; i++) {
            if (i === selectedOption.length - 1) {
               searchString += selectedOption[i].value
            } else {
               searchString += selectedOption[i].value + ","
            }
         }
      } else {
         searchString = searchInput
      }

      console.log("Form has been submitted, it's recipe time!!😋" + searchString)
      // imported function to make diff calls for different searches
      // add search to local storage just in case
      const mealDbUrl = "https://www.themealdb.com/api/json/v2/9973533/filter.php?i="
      const localApiUrl = "http://localhost:8080/recipe"
      console.log(mealDbUrl + searchString)

      await fetch(mealDbUrl + searchString).then(resp => resp.json()).then(data => setMealDbList(data.meals)).then(console.log(mealDBList))

      await fetch(localApiUrl).then(resp => resp.json()).then(data => setCustomMealList(data)).then(console.log(customMealList))

      setSearchInput("");
   }

   const handleInput = (e) => {
      setSearchInput(e.target.value);

   }

   async function handleFavorite(e)
   {
      if (user !== null) {
         if (e.target.className === "on") {
            e.target.className = "off"
         }
         else {
            e.target.className = "on"
            await fetch("http://localhost:8080/Favorites/", {method: "post", headers: {"Content-Type": "text/plain"}} + user.id).then(resp => resp.json()).then(data => console.log(data))
         }
      }
   }


   try {
      for (let i = 0; i < mealDBList.length; i++) {
         tableItems.push(
            <tr>
               <td>{mealDBList[i].idMeal}</td>
               <td>{mealDBList[i].strMeal}</td>
               <td><img src={mealDBList[i].strMealThumb} width="50px"></img></td>
               <td><button
                  type="button"
                  class="button"
                  key={i}
                  onClick={(e) => handleFavorite(e)}
               >
                  <span className="star">&#9733;</span>
               </button></td>
            </tr>
         )
      }
   } catch (e) {
      console.log(e)
      tableItems.push(
         <tr>
            <td>0</td>
            <td>no meals to display</td>
            <td><img src="https://via.placeholder.com/50" width="50px"></img></td>
         </tr>
      )
   }

   try {
      for (let i = 0; i < customMealList.length; i++) {
         customTableItems.push(
            <tr>
               <td>{customMealList[i].recipeId}</td>
               <td>{customMealList[i].recipeName}</td>
               <td><img src="https://via.placeholder.com/50" width="50px"></img></td>
            </tr>
         )
      }
   } catch (e) {
      console.log(e)
      tableItems.push(
         <tr>
            <td>0</td>
            <td>no meals to display</td>
            <td><img src="https://via.placeholder.com/50" width="50px"></img></td>
         </tr>
      )
   }



   return (

      <>
         <article className="searchBody">
            <div className="main">

               <form onSubmit={handleSubmit}>
                  <label htmlFor="search input">What's for eating 😋</label>
                  <input type="text" placeholder="Enter a food item" name={searchInput} value={searchInput} onChange={handleInput} autoFocus />
                  <Select value={selectedOption} onChange={setSelectedOption} options={mealSugg} isMulti></Select>
                  <input type="submit" value="Submit" />
               </form>

               <div id="mealDbTableContainer" className='tableContainer'>
                  <table>
                     <thead>
                        <tr>
                           <th>meal Id</th>
                           <th>meal Title</th>
                           <th>image of meal</th>
                        </tr>
                     </thead>
                     <tbody>
                        {tableItems}
                     </tbody>
                  </table>
               </div>

               <div id="customMealTableContainer" className='tableContainer'>
                  <table>
                     <thead>
                        <tr>
                           <th>meal Id</th>
                           <th>meal Title</th>
                           <th>meal Origin</th>
                        </tr>
                     </thead>
                     <tbody>
                        {customTableItems}
                     </tbody>
                  </table>
               </div>
            </div>

         </article>
      </>
   )
}





export default SearchBar;
<template>
   <div
      id="app"
      :class="
         typeof weather.main != 'undefined' &&
         kelvinToCelsius(weather.main.temp) > 16
            ? 'warm'
            : 'cold'
      "
   >
      <main>
         <!--h3 class="mobile-hint">On mobile: Press Enter TWO Times</h3-->
         <div class="search-box">
            <input
               type="text"
               class="search-bar"
               placeholder="City..."
               v-model="query"
               @keypress.enter="fetchWeather"
            />
            <button class="search-button" @click="fetchWeather">Search</button>
         </div>

         <div class="weather-wrap" v-if="typeof weather.main != 'undefined'">
            <div class="location-box">
               <div class="location">
                  {{ weather.name }}, {{ weather.sys.country }}
               </div>
               <div class="date">{{ dateBuilder() }}</div>
            </div>

            <div class="weather-box">
               <div class="temp">
                  {{ Math.round(kelvinToCelsius(weather.main.temp)) }}°c
               </div>
               <div class="weather">Weather: {{ weather.weather[0].main }}</div>
            </div>
         </div>
      </main>
   </div>
</template>

<script>
export default {
   name: "app",
   data() {
      return {
         api_key: "77f423df329515b94c176383b1543438",
         url_base: "https://api.openweathermap.org/data/2.5/",
         query: "",
         weather: {},
      };
   },
   methods: {
      fetchWeather(e) {
            fetch(
               `${this.url_base}weather?q=${this.query}&appid=${this.api_key}`
            )
               .then(res => {
                  return res.json();
               })
               .then(this.setResults);
      },
      setResults(results) {
         this.weather = results;
      },
      dateBuilder() {
         let d = new Date();
         let months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
         ];
         let days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
         ];
         let day = days[d.getDay()];
         let date = d.getDate();
         let month = months[d.getMonth()];
         let year = d.getFullYear();
         return `${day} ${date} ${month} ${year}`;
      },
      kelvinToCelsius(kelvin) {
         return kelvin - 273.15;
      },
   },
};
</script>

<style>
* {
   margin: 0;
   padding: 0;
   box-sizing: border-box;
   user-select: none;
}

body {
   font-family: "montserrat", sans-serif;
   background-color: rgb(15, 15, 15);
}

#app {
   max-width: 61.8vh;
   margin: auto;
   background-size: cover;
   background-position: bottom;
   transition: 0.4s;
}

main {
   min-height: 100vh;
   padding: 25px;

   background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.75)
   );
}

.cold {
   background-image: url("./assets/cold-bg.jpg");
}

.warm {
   background-image: url("./assets/warm-bg.jpg");
}

.search-box {
   width: 100%;
   margin-bottom: 30px;
}

.search-box .search-bar {
   display: block;
   width: 100%;
   padding: 15px;
   margin-top: 12px;
   color: #313131;
   font-size: 20px;
   appearance: none;
   border: none;
   outline: none;
   background: none;
   background-color: rgba(255, 255, 255, 0.5);
   box-shadow: 6px 4px 16px rgba(0, 0, 0);
   border-radius: 0px 16px 0px 16px;
   transition: 0.4s;
}
.search-box .search-bar:focus {
   background-color: rgba(255, 255, 255, 0.75);
   box-shadow: 0px 0px 16px rgba(0, 0, 0);
   border-radius: 16px 0px 16px 0px;
}

.search-box .search-button {
   display: block;
   width: 140px;
   height: 50px;
   margin: 24px auto;
   border-width: 0px;
   border-radius: 12px 2px 12px 2px;
   font-size: 18pt;
   color: rgba(30, 30, 30, 0.7);
   background-color: rgba(255, 255, 255, 0.5);
   box-shadow: 3px 2px 10px rgb(0, 0, 0);
   transition: 0.2s;
}
.search-box .search-button:hover {
   transform: scale(1.1);
   border-radius: 2px 12px 2px 12px;
   color: rgba(30, 30, 30, 0.8);
   background-color: rgba(255, 255, 255, 0.75);
   box-shadow: 4px 3px 16px rgb(0, 0, 0);
}
.search-box .search-button:active {
   transform: scale(0.95);
   border-radius: 12px 2px 12px 2px;
}

.location-box .location {
   color: #fff;
   font-size: min(8vw, 32px);
   font-weight: 500;
   text-align: center;
   text-shadow: 1px 3px rgba(0, 0, 0, 0.25);
}
.location-box .date {
   color: #fff;
   font-size: min(6vw, 20px);
   font-weight: 300;
   font-style: italic;
   text-align: center;
}
.weather-box {
   text-align: center;
}
.weather-box .temp {
   display: inline-block;
   width: 100%;
   padding: 10px 25px;
   color: #fff;
   font-size: min(20vw, 80px);
   font-weight: 900;
   text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
   text-align: center;
   background-color: rgba(255, 255, 255, 0.25);
   border-radius: 16px;
   margin: 30px 0px;
   box-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}
.weather-box .weather {
   color: #fff;
   font-size: 48px;
   font-weight: 700;
   font-style: italic;
   text-shadow: 3px 6px rgba(0, 0, 0, 0.25);
}

.mobile-hint {
   color: aliceblue;
   text-align: center;
   text-shadow: 2px 2px 2px #252525;
}
</style>

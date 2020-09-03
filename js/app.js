
let allTeamsFantasy = []
let allPlayersFantasy = []
let allEplMatches = []
let arsenalFantasy = []
let villaFantasy = []
let brightonFantasy = []
let burnelyFantasy = []
let chelseaFantasy = []
let palaceFantasy = []
let evertonFantasy = []
let fulhamFantasy = []
let leicesterFantasy = []
let leedsFantasy = []
let liverpoolFantasy = []
let cityFantasy = []
let unitedFantasy = []
let newcastleFantasy = []
let sheffieldFantasy = []
let southamptonFantasy = []
let spursFantasy = []
let westBromFantasy = []
let westHamFantasy = []
let wolvesFantasy = []
let homeTeamId = 0
let awayTeamId = 0
let tempArsenalCreateArray = []
let arsenalCreateRating = 0

// var settings = {
//     "url": "https://api.football-data.org/v2/competitions/PL/teams",
//     "method": "GET",
//     "timeout": 0,
//     "headers": {
//       "X-Auth-Token": "fdf2e3c8a1194516969b6654051e23e2"
//     },
//   };
  
//   $.ajax(settings).done(function (response) {
//     console.log(response)
//     for (let i = 0; i < response.teams.length; i++) {
//         const $newA = $(`<a class="dropdown-item" href="#">${response.teams[i].shortName}</a>`)
//         $('#team-dropdown').append($newA)
        
//     }
//   });

var settings = {
    "url": "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "X-Auth-Token": "fdf2e3c8a1194516969b6654051e23e2"
    },
  };
  
    $.ajax(settings).done(function (response) {


        homeTeamId = response.matches[0].homeTeam.id
        awayTeamId = response.matches[0].awayTeam.id

       

        $('#next-game-home-name-div').html(`<p>${response.matches[0].homeTeam.name}</p>`)
        $('#next-game-away-name-div').html(`<p>${response.matches[0].awayTeam.name}</p>`)
        $('#next-game-match-info-div').html(`<p>${response.matches[0].season.startDate}</p>`)



        for (let i = 0; i < response.matches.length; i++) {
            allEplMatches.push(response.matches[i])
            
        }




        // console.log(allEplMatches)

    });
    










var settings = {
    "url": "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/",
    "method": "GET",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (data) {
      for (let i = 0; i < data.teams.length; i++) {
          allTeamsFantasy.push(data.teams[i])
          
      }

      for (let i = 0; i < data.elements.length; i++) {
          allPlayersFantasy.push(data.elements[i])
          
      }
    for (let i = 0; i < data.elements.length; i++) {
        

       if (data.elements[i].team == 1) {
           arsenalFantasy.push(data.elements[i])
       } else if (data.elements[i].team == 2) {
        villaFantasy.push(data.elements[i])
       }
       else if (data.elements[i].team == 3) {
           brightonFantasy.push(data.elements[i])
    }
        else if (data.elements[i].team == 4) {
            burnelyFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 5) {
            chelseaFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 6) {
            palaceFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 7) {
            evertonFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 8) {
            fulhamFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 9) {
            leicesterFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 10) {
            leedsFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 11) {
            liverpoolFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 12) {
            cityFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 13) {
            unitedFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 14) {
            newcastleFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 15) {
            sheffieldFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 16) {
            southamptonFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 17) {
            spursFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 18) {
            westBromFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 19) {
            westHamFantasy.push(data.elements[i])
        }
        else if (data.elements[i].team == 20) {
            wolvesFantasy.push(data.elements[i])
        }
            
        }

        console.log(arsenalFantasy)
        // console.log(villaFantasy)
        // console.log(brightonFantasy)
        // console.log(burnelyFantasy)
        // console.log(chelseaFantasy)
        // console.log(palaceFantasy)
        // console.log(evertonFantasy)
        // console.log(fulhamFantasy)
        // console.log(leicesterFantasy)
        // console.log(leedsFantasy)
        // console.log(liverpoolFantasy)
        // console.log(cityFantasy)
        // console.log(unitedFantasy)
        // console.log(newcastleFantasy)
        // console.log(sheffieldFantasy)
        // console.log(southamptonFantasy)
        // console.log(spursFantasy)
        // console.log(westBromFantasy)
        // console.log(westHamFantasy)
        // console.log(wolvesFantasy)

       
        // console.log(allTeamsFantasy)
        // console.log(allPlayersFantasy)
        
        // for (let i = 0; i < arsenalFantasy.length; i++) {
            
        //     tempArsenalCreateArray.push(arsenalFantasy[i].creativity)

            
        // }
        // let arsenalCreateArray = tempArsenalCreateArray.map(val => parseInt(val, 10))
        // console.log(arsenalCreateArray)
        // let arsenalReducer = (accumulator, currentValue) => accumulator + currentValue
        // arsenalAllCreateRating = arsenalCreateArray.reduce(arsenalReducer)
        // arsenalCreateRating = (arsenalAllCreateRating / arsenalCreateArray.length)
        // console.log(arsenalCreateRating)

    });



      









$(()=>{
    


      


  })
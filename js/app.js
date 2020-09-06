
// =======================================
//              VARIABLES
// =======================================
let allPlayersFantasy = []
let allEplMatches = []
let teamPlayers = []
let matchIdArray = [57, 58, 397, 328, 61, 354, 62, 63, 338, 341, 64, 65, 66, 67, 356, 340, 73, 74, 563, 76]


class Team {
    constructor(fantasyId, name, short_name, strength, played, position, win, loss, draw, form, strength_overall_home, strength_overall_away, strength_attack_home, strength_attack_away, strength_defence_home, strength_defence_away) {
      this.fantasyId = fantasyId
      this.name = name
      this.short_name = short_name
      this.strength = strength
      this.played = played
      this.position = position
      this.win = win
      this.loss = loss
      this.draw = draw
      this.form = form
      this.strength_overall_home = strength_overall_home
      this.strength_overall_away = strength_overall_away
      this.strength_attack_home = strength_attack_home
      this.strength_attack_away = strength_attack_away
      this.strength_defence_home = strength_defence_home
      this.strength_defence_away = strength_defence_away
      this.matches = []
      this.players = []
      this.matchId = null
    }
  
  }
 

        /* =================================================
        
                        FANTASY AJAX CALL
                        ALL PLAYER STATS 

        ===================================================*/
        var settings = {
            "url": "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/",
            "method": "GET",
            "timeout": 0,
        };

            $.ajax(settings).done(function (data) {
            /* =================================================
            PUTTING ALL TEAM OBJECTS IN ONE ARRAY
            ===================================================*/
            for (let i = 0; i < data.teams.length; i++) {
                const teamObject = new Team(data.teams[i].id, data.teams[i].name, data.teams[i].short_name, data.teams[i].strength, data.teams[i].played, data.teams[i].position, data.teams[i].win, data.teams[i].loss, data.teams[i].draw, data.teams[i].form, data.teams[i].strength_overall_home, data.teams[i].strength_overall_away, data.teams[i].strength_attack_home, data.teams[i].strength_attack_away, data.teams[i].strength_defence_home, data.teams[i].strength_defence_away)
                teamPlayers.push(teamObject)
            }
            
                // console.log(teamPlayers)
            /* =================================================
            GIVING EACH TEAM ITS MATCH ID FOR NEXT AJAX CALL
            ===================================================*/
            for (let i = 0; i < teamPlayers.length; i++) {
                teamPlayers[i].matchId = matchIdArray[i]
                
            }


            //   console.log(teamPlayers)
            /* =================================================
            APPENDING TOP 5 HOME TEAMS TO DOM
            ===================================================*/
            // let $firstHomeTeam = $(`<h4>${teamsByDefHomeIndex[19].name}</h4>`)
            // let $secondHomeTeam = $(`<h4>${teamsByDefHomeIndex[18].name}</h4>`)
            // let $thridHomeTeam = $(`<h4>${teamsByDefHomeIndex[17].name}</h4>`)
            // let $fourthHomeTeam = $(`<h4>${teamsByDefHomeIndex[16].name}</h4>`)
            // let $fiveHomeTeam = $(`<h4>${teamsByDefHomeIndex[15].name}</h4>`)
            // $('#strong-home-teams').append($firstHomeTeam, $secondHomeTeam, $thridHomeTeam, $fourthHomeTeam, $fiveHomeTeam)
            /* =================================================
            PUTTING ALL PLAYER OBJECTS IN ONE ARRAY
            ===================================================*/
            for (let i = 0; i < data.elements.length; i++) {
                allPlayersFantasy.push(data.elements[i])
               let playerTeamId = data.elements[i].team
               let hisTeam = teamPlayers.findIndex(team => team.fantasyId === playerTeamId)
                teamPlayers[hisTeam].players.push(data.elements[i])
                
                
            }
     
         })




/* =================================================
        
                       MATCHES AJAX CALL

        ===================================================*/

        var settings = {
            "url": "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED",
            "method": "GET",
            "timeout": 0,
            "headers": {
            "X-Auth-Token": "fdf2e3c8a1194516969b6654051e23e2"
            },
        };

        $.ajax(settings).done(function (response) {
            // console.log(response)
            /* =======================================
                PUTTING ALL LEAGUE MATCHES IN ARRAY
            ========================================= */

            for (let i = 0; i < response.matches.length; i++) {
                allEplMatches.push(response.matches[i])
                
            }
            /* =============================================
                PUTTING EACH TEAM MATCHES IN SEPERATE ARRAY
            ================================================*/
            for (let i = 0; i < response.matches.length; i++) {
                let homeTeamId = response.matches[i].homeTeam.id
                let awayTeamId = response.matches[i].awayTeam.id
                    
                for (let j = 0; j < teamPlayers.length; j++) {
                        if (homeTeamId == teamPlayers[j].matchId || awayTeamId == teamPlayers[j].matchId) {
                            teamPlayers[j].matches.push(response.matches[i])
                        }
                        
                    }

            }


        })
/* =================================================
        
                       FUNCTIONS

        ===================================================*/

         /* ===============================================
        GRAB TOP 3 FANTASY STATS FOR PLAYER FOR GRAPH DATA
     ===================================================*/
        const grabPlayerStatArray = (param) => {
            let currentStat = []
            // event.preventDefault()
            // event.stopPropagation()
            // console.log($(event.currentTarget))
            // console.log($(event.target))
            // currentPlayerID = $(event.currentTarget).attr("id")
            selectedPlayer = allPlayersFantasy.find(player => player.id == param)
            console.log(selectedPlayer)
            currentStat.push(Math.floor(selectedPlayer.creativity / 10))
            currentStat.push(Math.floor(selectedPlayer.influence / 10))
            currentStat.push(Math.floor(selectedPlayer.threat / 10))
            // currentStat.push(selectedPlayer.ict_index_rank)
            // currentStat.push(selected_by_percent)
            return currentStat

        }

             /* ===============================================
                        RENDER CHART
     ===================================================*/
        const makeChart = (player) => {
            let ctx = document.getElementById('myChart').getContext('2d');
            let myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Creativity', 'Influence', 'Threat'],
                    datasets: [{
                        label: 'Index',
                        data: grabPlayerStatArray(player),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false,
                                
                            }
                        }]
                    }
                }
            });

            
        }
         /* ===============================================
        RENDER TEAM ON LOGO DIV/DROPDOWN LINK CLICK
     ===================================================*/
        const renderTeam = (teamId) => {
            console.log(teamId)
            let selectedTeamIndex = teamPlayers.findIndex(team => team.fantasyId === teamId)
            let selectedTeam = teamPlayers[selectedTeamIndex]
            


              
              console.log(selectedTeam)
              
              let selectedTeamCreateArray = selectedTeam.players.sort((a, b) => a.creativity - b.creativity)
              let selectedTeamInfluArray = selectedTeam.players.sort((a, b) => a.influence - b.influence)

              let selectedTeamGoalsArray = selectedTeam.players.sort((a, b) => a.goals_scored - b.goals_scored)

              const $hotTeamGoalList = $('<ul>').addClass('no-bullets')
              const $hotTeamListGoalItemsOne = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 1].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -1].second_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 1].goals_scored + ' GOALS')
      
              const $hotTeamListGoalItemsTwo = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 2].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -2].second_name  + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 2].goals_scored + ' GOALS')
      
              const $hotTeamListGoalItemsThree = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 3].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -3].second_name  + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 3].goals_scored + ' GOALS')
      



              const $hotTeamName = $(`<h2>${selectedTeam.name}</h2>`)
              const $hotTeamList = $('<ul>').addClass('no-bullets')
              const $hotTeamListItemsOne = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 1].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -1].second_name)
      
              const $hotTeamListItemsTwo = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 2].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -2].second_name)
      
              const $hotTeamListItemsThree = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 3].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -3].second_name)
      
              const $hotTeamListItemsFour = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 4].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -4].second_name)
      
              const $hotTeamListItemsFive = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 5].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -5].second_name)
      
              const $hotTeamListItemsSix = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 6].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -6].second_name)


              $('#goals').append($hotTeamGoalList)
              $hotTeamGoalList.append($hotTeamListGoalItemsOne, $hotTeamListGoalItemsTwo, $hotTeamListGoalItemsThree)
              $('#hot-team-select-team-img').attr('class', selectedTeam.short_name + '-img')
              $('#hot-team-select-team-name').append($hotTeamName)
              $('#creative-players-list').append($hotTeamList)
              $hotTeamList.append($hotTeamListItemsOne, $hotTeamListItemsTwo, $hotTeamListItemsThree, $hotTeamListItemsFour, $hotTeamListItemsFive, $hotTeamListItemsSix)

              for (let i = selectedTeamInfluArray.length - 1; i >= 0; i--) {
                  const $player = $(`<button type="button" class="list-group-item list-group-item-action active player-list-item" id='${selectedTeamInfluArray[i].id}' role="tab">${selectedTeamInfluArray[i].first_name} ${selectedTeamInfluArray[i].second_name}</button>`)
                  $('#players-list').append($player)
            
                   }

                   console.log(selectedTeamInfluArray[0])
                   makeChart(selectedTeamInfluArray[0].id)























// =======================================
//              CODE SCARPS
// =======================================

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

// var settings = {
//     "url": "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED",
//     "method": "GET",
//     "timeout": 0,
//     "headers": {
//       "X-Auth-Token": "fdf2e3c8a1194516969b6654051e23e2"
//     },
//   };
  
//     $.ajax(settings).done(function (response) {


//         homeTeamId = response.matches[0].homeTeam.id
//         awayTeamId = response.matches[0].awayTeam.id

       

//         $('#next-game-home-name-div').html(`<p>${response.matches[0].homeTeam.name}</p>`)
//         $('#next-game-away-name-div').html(`<p>${response.matches[0].awayTeam.name}</p>`)
//         $('#next-game-match-info-div').html(`<p>${response.matches[0].season.startDate}</p>`)



//         for (let i = 0; i < response.matches.length; i++) {
//             allEplMatches.push(response.matches[i])
            
//         }




//         // console.log(allEplMatches)

//     });
    










// var settings = {
//     "url": "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/",
//     "method": "GET",
//     "timeout": 0,
//   };
  
//   $.ajax(settings).done(function (data) {
//       for (let i = 0; i < data.teams.length; i++) {
//           allTeamsFantasy.push(data.teams[i])
          
//       }

//       for (let i = 0; i < data.elements.length; i++) {
//           allPlayersFantasy.push(data.elements[i])
          
//       }
//     for (let i = 0; i < data.elements.length; i++) {
        

//        if (data.elements[i].team == 1) {
//            arsenalFantasy.push(data.elements[i])
//        } else if (data.elements[i].team == 2) {
//         villaFantasy.push(data.elements[i])
//        }
//        else if (data.elements[i].team == 3) {
//            brightonFantasy.push(data.elements[i])
//     }
//         else if (data.elements[i].team == 4) {
//             burnelyFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 5) {
//             chelseaFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 6) {
//             palaceFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 7) {
//             evertonFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 8) {
//             fulhamFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 9) {
//             leicesterFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 10) {
//             leedsFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 11) {
//             liverpoolFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 12) {
//             cityFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 13) {
//             unitedFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 14) {
//             newcastleFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 15) {
//             sheffieldFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 16) {
//             southamptonFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 17) {
//             spursFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 18) {
//             westBromFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 19) {
//             westHamFantasy.push(data.elements[i])
//         }
//         else if (data.elements[i].team == 20) {
//             wolvesFantasy.push(data.elements[i])
//         }
            
//         }

//         console.log(arsenalFantasy)
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

    // });



      









            /* ===============================================================
            FILTER ALL PLAYER OBJECTS BY TEAM PUT IN SEPERATE TEAM ARRAYS
            ==============================================================*/
            // for (let i = 0; i < data.elements.length; i++) {
                
            //     if (data.elements[i].team == 1) {
            //         arsenalFantasy.push(data.elements[i])
            //     } else if (data.elements[i].team == 2) {
            //         villaFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 3) {
            //     brightonFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 4) {
            //         burnelyFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 5) {
            //         chelseaFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 6) {
            //         palaceFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 7) {
            //         evertonFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 8) {
            //         fulhamFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 9) {
            //         leicesterFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 10) {
            //         leedsFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 11) {
            //         liverpoolFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 12) {
            //         cityFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 13) {
            //         unitedFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 14) {
            //         newcastleFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 15) {
            //         sheffieldFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 16) {
            //         southamptonFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 17) {
            //         spursFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 18) {
            //         westBromFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 19) {
            //         westHamFantasy.push(data.elements[i])
            //     }
            //     else if (data.elements[i].team == 20) {
            //         wolvesFantasy.push(data.elements[i])
            //     }
                    
            //     }


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
        const renderPlayer = (params) => {

            selectedPlayerObject = allPlayersFantasy.find(player => player.id == params)
            makeChart(params)
            $('#player-headline').text(selectedPlayerObject.first_name + ' ' + selectedPlayerObject.second_name)
            $('#season-total-body').html(`<h4>Goals: ${selectedPlayerObject.goals_scored}</h4>
            <h4>Assists: ${selectedPlayerObject.assists}</h4>
            <h4>Yellow Cards: ${selectedPlayerObject.yellow_cards}</h4>
            <h4>Red Cards: ${selectedPlayerObject.red_cards}</h4>
            <h4>Team Clean Sheets: ${selectedPlayerObject.clean_sheets}</h4>`)
            $('#fantasy-data-body').html(`
            <h4>Average Points per Match: ${selectedPlayerObject.points_per_game}</h4>
            <h4>Total Points: ${selectedPlayerObject.total_points}</h4>
            <h4>Owned by ${selectedPlayerObject.selected_by_percent}% of fantasy players</h4>
            `)
            $('#fantasy-index-body').html(`
            <h4>Creativity Index: ${selectedPlayerObject.creativity}</h4>
            <p>ranked ${selectedPlayerObject.creativity_rank}th in league</p>
            <h4>Influence Index: ${selectedPlayerObject.influence}</h4>
            <p>ranked ${selectedPlayerObject.influence_rank}th in league</p>
            <h4>Threat Index: ${selectedPlayerObject.threat}</h4>
            <p>ranked ${selectedPlayerObject.threat_rank}th in league</p>
            <h4>Value: ${selectedPlayerObject.ict_index}</h4>
            <p>ranked ${selectedPlayerObject.ict_index_rank}th in league</p>
            
            
            `)
            
            makeChart(params)
        }


    
    
         /* ===============================================
        RENDER TEAM ON LOGO DIV/DROPDOWN LINK CLICK
     ===================================================*/
        const renderTeam = (teamId) => {
            console.log(teamId)
            let selectedID = teamPlayers.findIndex(team => team.fantasyId == teamId)
            let selectedTeam = teamPlayers[selectedID]
           
            


              
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
                   renderPlayer(selectedTeamInfluArray[0].id)
            }


                    $('.logos-team-page').on('click', (event) => {
                        
                        console.log($(event.currentTarget))
                        selectedTeamCall = $(event.currentTarget).attr('id')
                        console.log(selectedTeamCall)
                        $('#hot-team-select-team-name').empty()
                        $('#hot-team-select-team-img').empty()
                        $('#creative-players-list').empty()
                        $('#players-list').empty()
                        $('#goals').empty()
                        renderTeam(selectedTeamCall)

                                /* =======================================
                                PLAYER EVENT HANDLER
                                ===================================*/

                            $('.player-list-item').on('click', (event) => {
                                currentPlayerID = $(event.target).attr("id")
                                console.log($(event.target))
                                console.log($(event.currentTarget))
                                console.log(currentPlayerID)
                                
                                $('#player-headline').empty()
                                $('#player-headline-two').empty()
                                $('.stats-empty').empty()
                                renderPlayer(currentPlayerID)
                                
                            
                            
                            
                            })
                        


                        
                        
                    });
                    
                    
                    
                            
                    
                      
                    



                    // renderTeam(14)








































// =======================================
//              VARIABLES
// =======================================
// let allTeamsFantasy = []
// let allPlayersFantasy = []
// let allEplMatches = []
// let arsenalFantasy = []
// let arsenalMatches = []
// let villaFantasy = []
// let villaMatches = []
// let brightonFantasy = []
// let brightonMatches = []
// let burnelyFantasy = []
// let burnleyMatches = []
// let chelseaFantasy = []
// let chelseaMatches = []
// let palaceFantasy = []
// let palaceMatches = []
// let evertonFantasy = []
// let evertonMatches = []
// let fulhamFantasy = []
// let fulhamMatches = []
// let leicesterFantasy = []
// let leicesterMatches = []
// let leedsFantasy = []
// let leedsMatches = []
// let liverpoolFantasy = []
// let liverpoolMatches = []
// let cityFantasy = []
// let cityMatches = []
// let unitedFantasy = []
// let unitedMatches = []
// let newcastleFantasy = []
// let newcastleMatches = []
// let sheffieldFantasy = []
// let sheffieldMatches = []
// let southamptonFantasy = []
// let southamptonMatches = []
// let spursFantasy = []
// let spursMatches = []
// let westBromFantasy = []
// let westBromMatches = []
// let westHamFantasy = []
// let westhamMatches = []
// let wolvesFantasy = []
// let wolvesMatches = []
// let homeTeamId = 0
// let awayTeamId = 0
// let logoTeamId = 0
// let currentPlayerID = 254
// let selectedPlayer = null
// let selectedPlayerObject = null
// let teamId = null
// let selectedTeamCall = null
// let selectedTeam = null
// let selectedTeamPlayerArray = null
// let playerParam = 0

// let statLabelArray = ['Creativity', 'influence', 'threat', 'value_season', 'selected_by_percent']

// class Team {
//     constructor(fantasyId, name, short_name, strength, played, position, win, loss, draw, form, strength_overall_home, strength_overall_away, strength_attack_home, strength_attack_away, strength_defence_home, strength_defence_away) {
//       this.fantasyId = fantasyId
//       this.name = name
//       this.short_name = short_name
//       this.strength = strength
//       this.played = played
//       this.position = position
//       this.win = win
//       this.loss = loss
//       this.draw = draw
//       this.form = form
//       this.strength_overall_home = strength_overall_home
//       this.strength_overall_away = strength_overall_away
//       this.strength_attack_home = strength_attack_home
//       this.strength_attack_away = strength_attack_away
//       this.strength_defence_home = strength_defence_home
//       this.strength_defence_away = strength_defence_away
//       this.matches = []
//       this.players = []
//       this.matchId = null
      
      
      

//     }
  
//   }
 




// // =======================================
// //       MATCH-DATA AJAX CALL 
// // =======================================

//     var settings = {
//         "url": "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED",
//         "method": "GET",
//         "timeout": 0,
//         "headers": {
//         "X-Auth-Token": "fdf2e3c8a1194516969b6654051e23e2"
//         },
//     };
  
//     $.ajax(settings).done(function (response) {

//         homeTeamId = response.matches[0].homeTeam.id
//         awayTeamId = response.matches[0].awayTeam.id

       
//         $('#next-game-home-name-div').html(`<p>${response.matches[0].homeTeam.name}</p>`)
//         $('#next-game-away-name-div').html(`<p>${response.matches[0].awayTeam.name}</p>`)
//         $('#next-game-match-info-div').html(`<p>${response.matches[0].season.startDate}</p>`)

// {
//             if (response.matches[i].awayTeam.id === 57 || response.matches[i].homeTeam.id === 57 ) {
//                 arsenalMatches.push(response.matches[i])
            
                
//             } else if (response.matches[i].awayTeam.id === 58 || response.matches[i].homeTeam.id === 58 ) {
//                 villaMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 397 || response.matches[i].homeTeam.id === 397 ) {
//                 brightonMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 328 || response.matches[i].homeTeam.id === 328 ) {
//                 burnleyMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 61 || response.matches[i].homeTeam.id === 61 ) {
//                 chelseaMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 354 || response.matches[i].homeTeam.id === 354 ) {
//                 palaceMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 62 || response.matches[i].homeTeam.id === 62 ) {
//                 evertonMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 63 || response.matches[i].homeTeam.id === 63 ) {
//                 fulhamMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 338 || response.matches[i].homeTeam.id === 338 ) {
//                 leicesterMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 341 || response.matches[i].homeTeam.id === 341 ) {
//                 leedsMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 64 || response.matches[i].homeTeam.id === 64 ) {
//                 liverpoolMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 65 || response.matches[i].homeTeam.id === 65 ) {
//                 cityMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 66 || response.matches[i].homeTeam.id === 66 ) {
//                 unitedMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 67 || response.matches[i].homeTeam.id === 67 ) {
//                 newcastleMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 356 || response.matches[i].homeTeam.id === 356 ) {
//                 sheffieldMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 340 || response.matches[i].homeTeam.id === 340 ) {
//                 southamptonMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 73 || response.matches[i].homeTeam.id === 73 ) {
//                spursMatches.push(response.matches[i]) 
//             } else if (response.matches[i].awayTeam.id === 74 || response.matches[i].homeTeam.id === 74 ) {
//                 westBromMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 563 || response.matches[i].homeTeam.id === 563 ) {
//                 westhamMatches.push(response.matches[i])
//             } else if (response.matches[i].awayTeam.id === 76 || response.matches[i].homeTeam.id === 76 ) {
//                 wolvesMatches.push(response.matches[i])
//             } else {

//             }
//         }
//     });
    









//      /* =================================================
   
//                 FANTASY AJAX CALL
//                 ALL PLAYER STATS 

//    ===================================================*/
//         var settings = {
//             "url": "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/",
//             "method": "GET",
//             "timeout": 0,
//         };
  
//         $.ajax(settings).done(function (data) {
//         /* =================================================
//         PUTTING ALL TEAM OBJECTS IN ONE ARRAY
//     ===================================================*/
//         for (let i = 0; i < data.teams.length; i++) {
//             allTeamsFantasy.push(data.teams[i])
//         }
        
//     /* =================================================
//         SORTING TEAMS BY HOME RATING
//     ===================================================*/
//         let teamsByDefHomeIndex = allTeamsFantasy.sort((a, b) => a.strength_defence_home - b.strength_defence_home)


//         //   console.log(teamsByDefHomeIndex)
//         /* =================================================
//         APPENDING TOP 5 HOME TEAMS TO DOM
//     ===================================================*/
//         let $firstHomeTeam = $(`<h4>${teamsByDefHomeIndex[19].name}</h4>`)
//         let $secondHomeTeam = $(`<h4>${teamsByDefHomeIndex[18].name}</h4>`)
//         let $thridHomeTeam = $(`<h4>${teamsByDefHomeIndex[17].name}</h4>`)
//         let $fourthHomeTeam = $(`<h4>${teamsByDefHomeIndex[16].name}</h4>`)
//         let $fiveHomeTeam = $(`<h4>${teamsByDefHomeIndex[15].name}</h4>`)
//         $('#strong-home-teams').append($firstHomeTeam, $secondHomeTeam, $thridHomeTeam, $fourthHomeTeam, $fiveHomeTeam)
//     /* =================================================
//         PUTTING ALL PLAYER OBJECTS IN ONE ARRAY
//     ===================================================*/
//         for (let i = 0; i < data.elements.length; i++) {
//             allPlayersFantasy.push(data.elements[i])
            
//         }

//         //   let playersByCreate = allPlayersFantasy.sort((a, b) => a.yellow_cards - b.yellow_cards)

//         //   console.log(playersByCreate)
//         //   allPlayersFantasy.sort(function (a, b) {
//         //     return a.value - b.value;
//         //   });

//     /* ===============================================================
//         FILTER ALL PLAYER OBJECTS BY TEAM PUT IN SEPERATE TEAM ARRAYS
//     ==============================================================*/
//         for (let i = 0; i < data.elements.length; i++) {
            
//             if (data.elements[i].team == 1) {
//                 arsenalFantasy.push(data.elements[i])
//             } else if (data.elements[i].team == 2) {
//                 villaFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 3) {
//             brightonFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 4) {
//                 burnelyFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 5) {
//                 chelseaFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 6) {
//                 palaceFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 7) {
//                 evertonFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 8) {
//                 fulhamFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 9) {
//                 leicesterFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 10) {
//                 leedsFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 11) {
//                 liverpoolFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 12) {
//                 cityFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 13) {
//                 unitedFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 14) {
//                 newcastleFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 15) {
//                 sheffieldFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 16) {
//                 southamptonFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 17) {
//                 spursFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 18) {
//                 westBromFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 19) {
//                 westHamFantasy.push(data.elements[i])
//             }
//             else if (data.elements[i].team == 20) {
//                 wolvesFantasy.push(data.elements[i])
//             }
                
//             }

//         const grabPlayerStatArray = (param) => {
//             let currentStat = []
//             // event.preventDefault()
//             // event.stopPropagation()
//             // console.log($(event.currentTarget))
//             // console.log($(event.target))
//             // currentPlayerID = $(event.currentTarget).attr("id")
//             selectedPlayer = allPlayersFantasy.find(player => player.id == param)
//             console.log(selectedPlayer)
//             currentStat.push(Math.floor(selectedPlayer.creativity / 10))
//             currentStat.push(Math.floor(selectedPlayer.influence / 10))
//             currentStat.push(Math.floor(selectedPlayer.threat / 10))
//             // currentStat.push(selectedPlayer.ict_index_rank)
//             // currentStat.push(selected_by_percent)
//             return currentStat

//         }


//         const makeChart = (player) => {
//             let ctx = document.getElementById('myChart').getContext('2d');
//             let myChart = new Chart(ctx, {
//                 type: 'bar',
//                 data: {
//                     labels: ['Creativity', 'Influence', 'Threat'],
//                     datasets: [{
//                         label: 'Index',
//                         data: grabPlayerStatArray(player),
//                         backgroundColor: [
//                             'rgba(255, 99, 132, 0.2)',
//                             'rgba(54, 162, 235, 0.2)',
//                             'rgba(255, 206, 86, 0.2)',
//                             'rgba(75, 192, 192, 0.2)',
//                             'rgba(153, 102, 255, 0.2)',
//                             'rgba(255, 159, 64, 0.2)'
//                         ],
//                         borderColor: [
//                             'rgba(255, 99, 132, 1)',
//                             'rgba(54, 162, 235, 1)',
//                             'rgba(255, 206, 86, 1)',
//                             'rgba(75, 192, 192, 1)',
//                             'rgba(153, 102, 255, 1)',
//                             'rgba(255, 159, 64, 1)'
//                         ],
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         yAxes: [{
//                             ticks: {
//                                 beginAtZero: false,
                                
//                             }
//                         }]
//                     }
//                 }
//             });









            
//         }



//         const renderPlayer = (currentPlayerID) => {
  
            
//         }
        
//           const renderTeam = (teamId) => {
//               console.log(teamId)
//               console.log(allTeamsFantasy)
//               let sortAllTeamsFantasy = allTeamsFantasy.sort((a, b) => a.id - b.id)
//               console.log(sortAllTeamsFantasy)

//             if (sortAllTeamsFantasy[0].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[0]
//                     selectedTeamPlayerArray = arsenalFantasy
//                 } else if (sortAllTeamsFantasy[1].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[1]
//                     selectedTeamPlayerArray = villaFantasy
//                 } else if (sortAllTeamsFantasy[2].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[2]
//                     selectedTeamPlayerArray = brightonFantasy
//                 } else if (sortAllTeamsFantasy[3].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[3]
//                     selectedTeamPlayerArray = burnelyFantasy
//                 } else if (sortAllTeamsFantasy[4].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[4]
//                     selectedTeamPlayerArray = chelseaFantasy
//                 } else if (sortAllTeamsFantasy[5].id == teamId) {
//                     selectedTeam = allTeamsFantasy[5]
//                     selectedTeamPlayerArray = palaceFantasy
//                 } else if (sortAllTeamsFantasy[6].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[6]
//                     selectedTeamPlayerArray = evertonFantasy
//                 } else if (sortAllTeamsFantasy[7].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[7]
//                     selectedTeamPlayerArray = fulhamFantasy
//                 } else if (sortAllTeamsFantasy[8].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[8]
//                     selectedTeamPlayerArray = leicesterFantasy
//                 } else if (sortAllTeamsFantasy[9].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[9]
//                     selectedTeamPlayerArray = leedsFantasy
//                 } else if (sortAllTeamsFantasy[10].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[10]
//                     selectedTeamPlayerArray = liverpoolFantasy
//                 } else if (sortAllTeamsFantasy[11].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[11]
//                     selectedTeamPlayerArray = cityFantasy
//                 } else if (sortAllTeamsFantasy[12].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[12]
//                     selectedTeamPlayerArray = unitedFantasy
//                 } else if (sortAllTeamsFantasy[13].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[13]
//                     selectedTeamPlayerArray = newcastleFantasy
//                 } else if (sortAllTeamsFantasy[14].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[14]
//                     selectedTeamPlayerArray = sheffieldFantasy
//                 } else if (sortAllTeamsFantasy[15].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[15]
//                     selectedTeamPlayerArray = southamptonFantasy
//                 } else if (sortAllTeamsFantasy[16].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[16]
//                     selectedTeamPlayerArray = spursFantasy
//                 } else if (sortAllTeamsFantasy[17].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[17]
//                     selectedTeamPlayerArray = westBromFantasy
//                 } else if (sortAllTeamsFantasy[18].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[18]
//                     selectedTeamPlayerArray = westHamFantasy
//                 }
//                 else if (sortAllTeamsFantasy[19].id == teamId) {
//                     selectedTeam = sortAllTeamsFantasy[19]
//                     selectedTeamPlayerArray = wolvesFantasy
//                 } else {
//                     return
//                 }
                
//                 console.log(selectedTeam)
//                 console.log(selectedTeamPlayerArray)
//                 let selectedTeamCreateArray = selectedTeamPlayerArray.sort((a, b) => a.creativity - b.creativity)
//                 let selectedTeamInfluArray = selectedTeamPlayerArray.sort((a, b) => a.influence - b.influence)

//                 let selectedTeamGoalsArray = selectedTeamPlayerArray.sort((a, b) => a.goals_scored - b.goals_scored)

//                 const $hotTeamGoalList = $('<ul>').addClass('no-bullets')
//                 const $hotTeamListGoalItemsOne = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 1].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -1].second_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 1].goals_scored + ' GOALS')
        
//                 const $hotTeamListGoalItemsTwo = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 2].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -2].second_name  + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 2].goals_scored + ' GOALS')
        
//                 const $hotTeamListGoalItemsThree = $('<li>').text(selectedTeamGoalsArray[selectedTeamGoalsArray.length - 3].first_name + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length -3].second_name  + ' ' + selectedTeamGoalsArray[selectedTeamGoalsArray.length - 3].goals_scored + ' GOALS')
        



//                 const $hotTeamName = $(`<h2>${selectedTeam.name}</h2>`)
//                 const $hotTeamList = $('<ul>').addClass('no-bullets')
//                 const $hotTeamListItemsOne = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 1].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -1].second_name)
        
//                 const $hotTeamListItemsTwo = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 2].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -2].second_name)
        
//                 const $hotTeamListItemsThree = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 3].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -3].second_name)
        
//                 const $hotTeamListItemsFour = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 4].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -4].second_name)
        
//                 const $hotTeamListItemsFive = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 5].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -5].second_name)
        
//                 const $hotTeamListItemsSix = $('<li>').text(selectedTeamCreateArray[selectedTeamCreateArray.length - 6].first_name + ' ' + selectedTeamCreateArray[selectedTeamCreateArray.length -6].second_name)


//                 $('#goals').append($hotTeamGoalList)
//                 $hotTeamGoalList.append($hotTeamListGoalItemsOne, $hotTeamListGoalItemsTwo, $hotTeamListGoalItemsThree)
//                 $('#hot-team-select-team-img').attr('class', selectedTeam.short_name + '-img')
//                 $('#hot-team-select-team-name').append($hotTeamName)
//                 $('#creative-players-list').append($hotTeamList)
//                 $hotTeamList.append($hotTeamListItemsOne, $hotTeamListItemsTwo, $hotTeamListItemsThree, $hotTeamListItemsFour, $hotTeamListItemsFive, $hotTeamListItemsSix)

//                 for (let i = selectedTeamInfluArray.length - 1; i >= 0; i--) {
//                     const $player = $(`<button type="button" class="list-group-item list-group-item-action active player-list-item" id='${selectedTeamInfluArray[i].id}' role="tab">${selectedTeamInfluArray[i].first_name} ${selectedTeamInfluArray[i].second_name}</button>`)
//                     $('#players-list').append($player)
              
//                      }

//                      console.log(selectedTeamInfluArray[0])
//                      makeChart(selectedTeamInfluArray[0].id)


//                          /* =======================================
//                         PLAYER EVENT HANDLER
//                         ===================================*/

//                      $('.player-list-item').on('click', (event) => {
//                         currentPlayerID = $(event.target).attr("id")
//                         console.log($(event.target))
//                         console.log($(event.currentTarget))
//                         console.log(currentPlayerID)
//                         // renderPlayer(playerParam)
//                         $('#player-headline').empty()
//                         $('#player-headline-two').empty()
//                         $('.stats-empty').empty()
                       
                        
//                         selectedPlayerObject = allPlayersFantasy.find(player => player.id == currentPlayerID)
//                         makeChart(currentPlayerID)
//                         $('#player-headline').text(selectedPlayerObject.first_name + ' ' + selectedPlayerObject.second_name)
//                         $('#season-total-body').html(`<h4>Goals: ${selectedPlayerObject.goals_scored}</h4>
//                         <h4>Assists: ${selectedPlayerObject.assists}</h4>
//                         <h4>Yellow Cards: ${selectedPlayerObject.yellow_cards}</h4>
//                         <h4>Red Cards: ${selectedPlayerObject.red_cards}</h4>
//                         <h4>Team Clean Sheets: ${selectedPlayerObject.clean_sheets}</h4>`)
//                         $('#fantasy-data-body').html(`
//                         <h4>Average Points per Match: ${selectedPlayerObject.points_per_game}</h4>
//                         <h4>Total Points: ${selectedPlayerObject.total_points}</h4>
//                         <h4>Owned by ${selectedPlayerObject.selected_by_percent}% of fantasy players</h4>
//                         `)
//                         $('#fantasy-index-body').html(`
//                         <h4>Creativity Index: ${selectedPlayerObject.creativity}</h4>
//                         <p>ranked ${selectedPlayerObject.creativity_rank}th in league</p>
//                         <h4>Influence Index: ${selectedPlayerObject.influence}</h4>
//                         <p>ranked ${selectedPlayerObject.influence_rank}th in league</p>
//                         <h4>Threat Index: ${selectedPlayerObject.threat}</h4>
//                         <p>ranked ${selectedPlayerObject.threat_rank}th in league</p>
//                         <h4>Value: ${selectedPlayerObject.ict_index}</h4>
//                         <p>ranked ${selectedPlayerObject.ict_index_rank}th in league</p>
                        
                        
//                         `)
                    
                    
                    
                    
                    
//                     })



//     }



 
    
//     $('.logos-team-page').on('click', (event) => {
        
//         console.log($(event.currentTarget))
//         selectedTeamCall = $(event.currentTarget).attr('id')
//         console.log(selectedTeamCall)
//         $('#hot-team-select-team-name').empty()
//         $('#hot-team-select-team-img').empty()
//         $('#creative-players-list').empty()
//         $('#players-list').empty()
//         $('#goals').empty()
//         renderTeam(selectedTeamCall)


        
        
//      });
    
     
    
             
  
 
    



//     renderTeam(14)

  
       

// })
        


        
  /* =================================================
    UNUSED CODE
   ===================================================*/


        // console.log(arsenalFantasy)
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
        
        // let liverpoolCreateArray = liverpoolFantasy.sort((a, b) => a.creativity - b.creativity)
        // let liverpoolInfluArray = liverpoolFantasy.sort((a, b) => a.influence - b.influence)

        // console.log(liverpoolCreateArray)
        // console.log(liverpoolInfluArray)
                // // console.log(liverpoolMatches)
        // let $nextOpp = null
        // // let $nextOppLocation = null
        // let $nextOppDate = null
        // if (liverpoolMatches[0].awayTeam.id === 64) {
        //     $nextOpp = $(`<p class="next-game-font">@ ${liverpoolMatches[0].homeTeam.name}</p>`)
        //     $nextOppDate = $(`<p class="next-game-font">${liverpoolMatches[0].season.startDate}</p>`)
        // } else {
        //     $nextOpp = $(`<p class="next-game-font">VS ${liverpoolMatches[0].awayTeam.name}</p>`)
        //     $nextOppDate = $(`<p class="next-game-font">${liverpoolMatches[0].season.startDate}</p>`)
        // }
        // $('#next-game').append($nextOpp, $nextOppDate)
        





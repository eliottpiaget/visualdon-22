// https://jsonplaceholder.typicode.com/users
// https://jsonplaceholder.typicode.com/posts

import * as d3 from 'd3';
import { json } from 'd3-fetch';

Promise.all([
    json('https://jsonplaceholder.typicode.com/posts'),
    json('https://jsonplaceholder.typicode.com/users')
])

 
    .then(([postsTab, usersTab]) => {
        let arrayUserPost = [];
        for (let i = 0; i < usersTab.length; i++) {
            let arrayCurrentUser = {};
            arrayCurrentUser["nom_utilisateur"] = usersTab[i].username;
            arrayCurrentUser["ville"] = usersTab[i].address.city;
            arrayCurrentUser["nom_companie"] = usersTab[i].company.name;

            let userPosts = [];
            postsTab.forEach(post => {
                if (post.userId == usersTab[i].id) {
                    userPosts.push(post.title)
                }
            });
            arrayCurrentUser["posts"] = userPosts;
            arrayUserPost.push(arrayCurrentUser);
            // console.log(arrayCurrentUser);
        }
      
        let graphPosts = []; 
      
        d3.select("body")
            .append("div")
            .attr('id', `div-users`)
        usersTab.forEach(user => {
            let compteurParUser = 0;
         

            postsTab.forEach(post => {
               
                if (post.userId == user.id) {
                    compteurParUser++;
                }
            })
            graphPosts.push(compteurParUser);
            d3.select(`#div-users`)
                .append('div')
                .attr('id', user.id)
                .append('p')
                .text(`${user.name} a écrit ${compteurParUser} article(s).`)
        })

        let postLePlusLong = 'abc';
        let postLePlusLongUserId = 0;
        console.log(postsTab);
        postsTab.forEach(post => {
  
            if (postLePlusLong.length < post.body.length) {
                postLePlusLong = post.body;
                postLePlusLongUserId = post.userId
            }
        })
        console.log(postLePlusLong);
        console.log(postLePlusLongUserId);
        let userPostLePlusLong = usersTab[postLePlusLongUserId - 1].name;

        d3.select("body")
            .append("div")
            .attr('id', 'postLePlusLong')
        d3.select('#postLePlusLong')
            .append('p')
            .text(`${userPostLePlusLong} a écrit le plus long post. Ce dernier disait "${postLePlusLong}". :-)`)


        let margin = { top: 20, right: 10, bottom: 60, left: 60 };
        let width = 1500 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        d3.select("body")
            .append("div")
            .attr('id', 'graph')
        let svg = d3.select("#graph")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        let x = d3.scaleBand()
            .domain(arrayUserPost.map(function (d) { return d["nom_utilisateur"]; }))
            .range([1000, 0]);

        let y = d3.scaleLinear()
            .domain([0, 10])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-2,10)")

        svg.selectAll("bars")
            .data(arrayUserPost)
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d["nom_utilisateur"]) + 30; })
            .attr("y", function (d) { return y(d["posts"].length); })
            .attr("width", "40px")
            .attr("height", function (d) { return height - y(d["posts"].length); })
            .attr("fill", `#${Math.floor(Math.random()*16777215).toString(16)}`)
    })
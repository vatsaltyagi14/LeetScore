//console.log("script loaded")

document.addEventListener("DOMContentLoaded",function(){ //jab sara DOM content load hojaega tab isme jaega ye
    const searchbutton = document.getElementById("searchbutton");
    const usernameip = document.getElementById("user-input");
    const statscontainer = document.querySelector(".stats-container");
    const easyprogresscircle = document.querySelector(".easy-progress");
    const mediumprogresscircle = document.querySelector(".medium-progress");
    const hardprogresscircle = document.querySelector(".hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");
    const cardstatscontainer = document.querySelector(".statcard");
    

    function validateusername(username){
        if(username.trim() === ""){
            alert("empty username!")
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const ismatching = regex.test(username);
        if(!ismatching){
            alert("invalid username!");
        }
        return ismatching;
    }


    async function fetchuserdata(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchbutton.textContent = "Searching...";
            searchbutton.disabled = true;

            const response = await fetch(url);
            const parseddata = await response.json();
            //console.log(parseddata);
            if (parseddata.status === "error") {
                throw new Error("User not found or API error");
            }
            displayuserdata(parseddata);
            
        }
        catch{
            console.error("An error occurred during fetch or data processing:", error);
            statscontainer.innerHTML =  "Unable to fetch user data";
        }
        finally{
            searchbutton.textContent = "Search";
            searchbutton.disabled = false;
        }
    }


    function updateprogress(solved,total,label,circle){
        const progressdegree = (solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressdegree}%`);
        label.textContent = `${solved}/${total}`;

    }

    function calculateTotalSubmissions(submissionCalendar) {
        let total = 0; 
        for (const timestamp in submissionCalendar) { 
            if (Object.hasOwnProperty.call(submissionCalendar, timestamp)) { 
                total += submissionCalendar[timestamp]; 
            }
        }
        cardstatscontainer.innerHTML = `<h3 class ="card">Total Submissions: ${total}</h3>`;
    }


    function displayuserdata(parseddata){
        const totalques = parseddata.totalQuestions;
        const totaleasy = parseddata.totalEasy;
        const totalmedium = parseddata.totalMedium;
        const totalhard = parseddata.totalHard;

        const totalsolved = parseddata.totalSolved;
        const totaleasysolved = parseddata.easySolved;
        const totalmediumsolved = parseddata.mediumSolved;
        const totalhardsolved = parseddata.hardSolved;

        updateprogress(totaleasysolved,totaleasy,easylabel,easyprogresscircle);
        updateprogress(totalmediumsolved,totalmedium,mediumlabel,mediumprogresscircle);
        updateprogress(totalhardsolved,totalhard,hardlabel,hardprogresscircle);

        const submissioncalendar = parseddata.submissionCalendar;
        calculateTotalSubmissions(submissioncalendar);

    }


    searchbutton.addEventListener("click",function(){
        const username = usernameip.value;
        //console.log(username);
        if(validateusername(username)){
            fetchuserdata(username)
        }

    })


})
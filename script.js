console.log('Lets write javascript');
let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinuteSeconds(seconds, useDoubleColons = false) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60); // Round to the nearest second

  // Use the specified separator based on the useDoubleColons parameter
  const separator = useDoubleColons ? '::' : ':';

  // Use the padStart() method to ensure that single-digit seconds are displayed with a leading zero
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${minutes}${separator}${formattedSeconds}`;
}



async function getSongs(folder){
  currFolder=folder;
let a=await fetch(`/${folder}/`)
let response=await a.text();

let div=document.createElement("div")
div.innerHTML=response;
let as=div.getElementsByTagName("a")
 songs=[]
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
    
}
let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
songUL.innerHTML = ""
for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML+ `<li>
    
            <img class="invert" src="music.svg"alt="">
            <div class="info">
              <div>${song.replaceAll("%20"," ")}</div>
              <div>Artist</div>
            </div>
            <div class="playnow">
              <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
            </div>
            </li>`;
          }
          //attach an event listener to each song
         Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
          e.addEventListener("click",element=>{
          console.log(e.querySelector(".info").firstElementChild.innerHTML)
          playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
         })  
        }) 
return songs
}
const playMusic = (track,pause=false)=>{
 // let audio=new Audio("/songs/"+track)
 currentSong.src=`/${currFolder}/`+track
 if(!pause){
  currentSong.play()
  play.src="pause.svg"
 }
  document.querySelector(".songInfo").innerHTML=decodeURI(track)
  document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
}





async function main(){
  
 await getSongs("songs")
 
playMusic(songs[0],true)
 

        //attach event listener to play,next and prev
        play.addEventListener("click",()=>{
          if(currentSong.paused){
            currentSong.play()
            play.src="pause.svg"
          }
          else{
            currentSong.pause()
            play.src="play.svg"
          }
        })
        //Listen for time update
      
currentSong.addEventListener("timeupdate", () => {
  const currentTime = secondsToMinuteSeconds(currentSong.currentTime, true);
  const duration = secondsToMinuteSeconds(currentSong.duration, true);

  document.querySelector(".songtime").innerHTML = `${currentTime} / ${duration}`;
document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.
duration)*100+"%";
});
//add an eventlistener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left= percent + "%";
  currentSong.currentTime=((currentSong.duration)*percent)/100
})
//add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left="0"
})
//add an event listener for close
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left="-120%"
})
//add an event listener for previos and next
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%"
})

// Add an event listener to previous
previous.addEventListener("click", () => {
  currentSong.pause()
  console.log("Previous clicked")
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
  }
})

// Add an event listener to next
next.addEventListener("click", () => {
  currentSong.pause()
  console.log("Next clicked")

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
  }
})

//add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log("Setting volume to",e.target.value,"/100")
  currentSong.volume=parseInt(e.target.value)/100
})
//add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",(e)=>{
  console.log(e.target)
  console.log("changing",e.target.src)
  if(e.target.src.includes("volume.svg")){
    e.target.src=e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
  }
  else{
    e.target.src=e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
  }
})
//load the playlist when card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    songs=await getSongs(`songs/${item.currentTarget.dataset.folder
  }`)
   
  })
})






}
main()
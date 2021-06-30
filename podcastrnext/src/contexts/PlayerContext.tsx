import { createContext, ReactNode, useContext, useState } from 'react';

type Episode ={
    title: String,
    members: String,
    thumbanail:String,
    duration: Number,
    url: String
}
type PlayerContextData ={
    playList: (list: Episode[],index: number) => void;
    play: (episode: Episode) => void;
    tooglePlay: () => void
    playNext: () => void
    setPlayeringState: (state: boolean) => void
    playPrevius: ()=> void
    clearPlayerState: ()=> void
    toggleLoop: () => void
    toggleShuffle: () => void
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlayer: boolean;
    hasPrevios: boolean
    isLooping: boolean
    isShuffling: boolean
    hasNext: boolean
    
}
type PlayerContextProvaiderProps= {
    children : ReactNode
}
export const PlayerContext = createContext({}as PlayerContextData);
export function PlayerContextProvaider({children}){
    
    const [episodeList, setepisodeList] = useState([]);
  const [ currentEpisodeIndex,setCurrentEpisodeIndex]= useState(0);
  const [ isPlayer, setIsPlayer] = useState(false);
  const [ isLooping, setIsLooping] = useState(false);
  const [ isShuffling, setIsShuffling] = useState(false);
  
  function play(episode : Episode){
    setepisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlayer(true)
  }  
  
  function playList(list: Episode[], index: number){
      setepisodeList(list);
      setCurrentEpisodeIndex(index);
      setIsPlayer(true);
  }

  function tooglePlay(){
    setIsPlayer(!isPlayer)
  }
  function toggleLoop(){
    setIsLooping(!isLooping)
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }
  function setPlayeringState(state:boolean){
    setIsPlayer(state)
  }
  function clearPlayerState(){
      setEpisodeList([]);
      setCurrentEpisodeIndex(0);
}
const hasPrevios = currentEpisodeIndex >0;
const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext(){
    
    if(isShuffling){
        const nextRandomEpisoddIndex = Math.floor(Math.random()* episodeList.length)
        setCurrentEpisodeIndex(nextRandomEpisoddIndex);
    } else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex +1);

    }

  }

  function playPrevius(){
      if(hasPrevios){
          setCurrentEpisodeIndex(currentEpisodeIndex - 1);
      }
  }

  return (
    <PlayerContext.Provider value={{episodeList,
     playList,
     currentEpisodeIndex,
     play, 
     isPlayer,
     tooglePlay,
     setPlayeringState,
     playNext,
     playPrevius,
     hasNext,
     hasPrevios,
     toggleLoop,
     clearPlayerState,
     toggleShuffle,
     isShuffling,
     isLooping,}}>
        {children}
    </PlayerContext.Provider>
  )
}
export const userPlayer= () =>{
    return useContext(PlayerContext);
}
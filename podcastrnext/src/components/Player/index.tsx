import { useRef,useEffect, useState } from "react";
import { PlayerContext, userPlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss"
import Image from "next/image"
import Slider from 'rc-slider'
import "rc-slider/assets/index.css"
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export default function Player(){
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null)

    const {episodeList,currentEpisodeIndex, isPlayer,tooglePlay,
        setPlayeringState,playPrevius,playNext,
        hasNext,hasPrevios,isLooping,toggleLoop,toggleShuffle, isShuffling,clearPlayerState}
     = userPlayer();
    const episode = episodeList[currentEpisodeIndex]
    useEffect(() => {
        if(!audioRef.current){
            return;
        }
        if (isPlayer) {
            audioRef.current.play()
        }else{
            audioRef.current.pause()

        }
    }, [isPlayer])
    function setupProgressListerner(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor( audioRef.current.currentTime));
        });
    }
    function handleSeek (amount:number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }
    function handleEpisodeEndedSeek(){
        if ( hasNext ){
            playNext()
        }else{
            clearPlayerState();
        }
    }
    return(
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"></img>
                <strong>Tocando agora</strong>
            </header>
            {
                episode ? (
                        <div className={styles.currentEpisode}>
                            <Image width={592} height={592}
                            src={episode.thumbnail}
                             objectFit="cover" />

                             <strong>{episode.title}</strong>
                             <span>{episode.members}</span>
                        </div>
                ):(
                    <div className={styles.emptyPlayer}>
                <strong>Slecione um podcast para ouvir</strong>
            </div>
                )
            }
            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {
                            episode ? (
                                <Slider 
                                    max={episode.duration}
                                    onChange={handleSeek}
                                    trackStyle = {{ backgroundColor: '#04d361'}}
                                    railStyle = {{ backgroundColor: '#9f75ff'}}
                                    handleStyle = {{ backgroundColor: '#04d361', borderWidth:4}}
                                    value={progress}
                                />
                            ):(
                                <div className={styles.emptySlider}/>
                            )
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio src={episode.url} 
                    autoPlay 
                    ref={audioRef}
                    onEnded={handleEpisodeEndedSeek}
                    loop={isLooping}
                    onPlay={()=> setPlayeringState(true)}
                    onPause={()=> setPlayeringState(false)}
                    onLoadedMetadata={setupProgressListerner}
                    />

                )}


                <div className={styles.buttons} >
                    <button type="button" 
                    disabled={!episode || episodeList.length ==1 }
                    onClick={toggleShuffle}
                    className={isShuffling ? styles.isActive:''}
                    >
                        <img src="/shuffle.svg" alt="embaralhar" />    
                    </button>  
                    <button type="button" disabled={!episode || !hasPrevios} onClick={playPrevius}>
                        <img src="/play-previous.svg" alt="embaralhar" />    
                    </button>    
                    <button type="button"className={styles.playButton} disabled={!episode} onClick={tooglePlay}>
                        
                        {isPlayer
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>  
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext }>
                        <img src="/play-next.svg" alt="embaralhar" />    
                    </button>  
                    <button type="button"
                     disabled={!episode} 
                     onClick={toggleLoop}
                     className={isLooping ? styles.isActive: ''}
                     >
                        <img src="/repeat.svg" alt="embaralhar" />    
                    </button>  
                    
                </div>           
            </footer>
        </div>
    );
}
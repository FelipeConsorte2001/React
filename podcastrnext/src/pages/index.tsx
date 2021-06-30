import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import ptBR from "date-fns/locale/pt-BR"
import { GetStaticProps } from "next"
import Image from "next/image"
import Link from "next/link"
import { useContext } from "react"
import { PlayerContext, userPlayer } from "../contexts/PlayerContext"
import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"
import styles from './home.module.scss'


type Episodes={
    id: String,
    title: String,
    members: String,
    thumbnail: String,
    publisheAt:String,
    duration : Number,
    durationAsString: String,
    description: String,
    url:String,
  }


type HomeProps ={
  latesEpisodes: Episodes[];
  allEpisodes: Episodes[];
}

export default function Home({latesEpisodes,allEpisodes}: HomeProps) {
  const {playList} = userPlayer();

  const episodeList = [...latesEpisodes,...allEpisodes];
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
    <h2>Últimmos Lançamentos</h2>

    <ul>
      {latesEpisodes.map((episode, index) =>{
        return(
          <li key={episode.id}>
            <Image width={192} height={192} src={episode.thumbnail} alt={episode.title} objectFit="cover" />
            <div className={styles.episodeDetails}>
              <Link href={`/episodes/${episode.id}`}>
                <a >{episode.title}</a>
                </Link>
              <p>{episode.members}</p>
              <span>{episode.publisheAt}</span>
              <span>{episode.durationAsString}</span>
            </div>
            <button type="button" onClick={() => playList(episodeList,index)}>
              <img src="/play-green.svg" alt="Tocar Episodio"/>
            </button>
          </li>
        );
      })}
    </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Intergrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
        </table>
        <tbody>
          {allEpisodes.map((episode,index) =>{
            return(
              <tr key={episode.id}>
                <td>
                  <Image width={120}
                  height={120}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover" />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{width:100}}>{episode.publisheAt}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => playList(episodeList, index + latesEpisodes.length)}>
                    <img src="/play-green.svg" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </section>

    </div>
  )
}
export  const  getStaticProps: GetStaticProps = async() => {
    const { data } = await api.get("episodes",{
      params:{
        _limit: 12,
        _sort: 'published_at',
        _order: "desc"
      }
    })

    const episodes = data.map(episode =>{
      return{
        id: episode.id,
        title: episode.title,
        thumbnail: episode.thumbnail,
        publisheAt: format(parseISO(episode.published_at),'d MMM yy',{ locale: ptBR}),
        duration : Number(episode.file.duration),
        durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
        description: episode.description,
        url:episode.file.url,
        members: episode.members
      }
    })

    const latesEpisodes = episodes.slice(0,2);
    const allEpisodes =episodes.slice(2,episodes.lenght);
    
    return{
      props:{
        latesEpisodes,
        allEpisodes
      },
      revalidate: 60*60*8,
    }
  }

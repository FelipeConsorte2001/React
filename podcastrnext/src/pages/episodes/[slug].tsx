import  {GetStaticPaths, GetStaticProps } from 'next';
import {useRouter} from 'next/router'
import { api } from '../../services/api';
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import style from './episode.module.scss'
import Image from "next/image"
import Link  from "next/link"
import { userPlayer } from '../../contexts/PlayerContext';


type Episode ={
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
type EpisodeProps ={
    episode : Episode
}
export default function Episode({episode}: EpisodeProps){
    
    const {play}= userPlayer();
    return(
        <div className={style.episode}>
            <div className={style.thmbnailContainer}>
                <Link href="/  ">
                <button type="button">
                    <img src="/arrow-left.svg" />
                </button></Link>
                <Image width={700} height={160} 
                src={episode.thumbnail} objectFit="cover" />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" />
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publisheAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
        <div className={style.description} dangerouslySetInnerHTML={{__html: episode.description}} />

        </div>
    )
}
export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [],
        fallback: 'blocking'
    }
}
export const getStaticProps: GetStaticProps = async (ctx) =>{
    const { slug} = ctx.params;

    const {data} = await api.get(`/episodes/${slug}`)

    const episode ={
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        publisheAt: format(parseISO(data.published_at),'d MMM yy',{ locale: ptBR}),
        duration : Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url:data.file.url,
        members: data.members
      }

    return{
        props:{episode},
        revalidate: 60* 60 *24 ,//24 hours
    }

}
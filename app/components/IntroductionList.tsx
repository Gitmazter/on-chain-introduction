import { FC, useEffect, useState } from "react";
import { Introduction } from "../models/Introduction";
import * as web3 from '@solana/web3.js';
import styles from '../page.module.css'
import { IntroCard } from "./IntroCard";
import { IntroductionController } from "./IntroductionController";

const INTRODUCTION_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";

export const IntroductionList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const [introductions, setIntroductions] = useState<Introduction[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const perPage = 20;
     
    useEffect(() => {
        IntroductionController.paginateAccounts(
            connection,
            page,
            perPage,
            search,
            search !== ''
        ).then(setIntroductions)
    }, [page, search])
    
    return (
        <div>
            <div className={styles.controls}>
                <div className={styles.buttons}>
                    {
                        page > 1 && 
                        <button onClick={() => setPage(page - 1)}>Previous</button>
                    }
                    
                    {
                        IntroductionController.accounts.length > page * perPage &&
                        <button onClick={() => setPage(page + 1)}>Next</button>
                    }
                </div>
                <input 
                    id="search"
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'    
                />
            </div>
            {
                introductions.map((introduction, i) => <IntroCard key={i} introduction={introduction} />)
            }
        </div>
    )
}
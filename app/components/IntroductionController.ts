import * as web3 from '@solana/web3.js'
import { Introduction } from '../models/Introduction'
import bs58 from 'bs58'

const INTRODUCTION_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf";
export class IntroductionController {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts (connection:web3.Connection, search:string) {
        
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(INTRODUCTION_PROGRAM_ID),
            {
                dataSlice: { offset: 2, length: 18 },
                filters: search === '' ? [] : [
                    {
                        memcmp:
                        {
                            offset: 6,
                            bytes: bs58.encode(Buffer.from(search))
                        }
                    }
                ]
            }
        )
        

        accounts.sort( (a, b) => {
            const lengthA = a.account.data.readUInt32LE(0)
            const lengthB = b.account.data.readUInt32LE(0)
            const dataA = a.account.data.slice(4, 4 + lengthA)
            const dataB = b.account.data.slice(4, 4 + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map(accounts => accounts.pubkey)
    }  

    static async paginateAccounts (connection: web3.Connection, page: number, perPage: number, search: string, reload: boolean): Promise<Introduction[]> {
        if(this.accounts.length === 0 || reload) {
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage,
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys);

        const introductions = accounts.reduce((accum: Introduction[], account) => {
            const introduction = Introduction.deserialize(account?.data);
            if (!introduction) {
                return accum
            }
            return [...accum, introduction]
        }, []) 

        return introductions
    }
}
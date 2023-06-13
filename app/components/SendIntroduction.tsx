import { FC, ReactNode, useState } from 'react'
import styles from '../page.module.css'
import { Alert, Box, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';
import { Introduction } from '../models/Introduction';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import * as web3 from '@solana/web3.js'

const INTRODUCTION_PROGRAM_ID = "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf"
export const SendIntroduction:FC = () => {
    const [name, setName] = useState('')
    const [introductionTxt, setIntroductionTxt] = useState('')

    const { connection } = useConnection()
    const { publicKey, sendTransaction } = useWallet()

    const handleSubmit = (e:any) => {
        e.preventDefault()
        const introduction = new Introduction(name, introductionTxt)
        handleTransactionSubmit(introduction)
    }

    const handleTransactionSubmit = async (introduction: Introduction) => {
        if (!publicKey) {
            alert('please connect your wallet')
            return
        }
        const buffer = introduction.serialize()
        const transaction = new Transaction()

        const [pda] = await web3.PublicKey.findProgramAddressSync(
            [publicKey.toBuffer(), Buffer.from(introduction.name)],
            new web3.PublicKey(INTRODUCTION_PROGRAM_ID)
        )

        const instruction = new web3.TransactionInstruction({
            keys : [
                {
                    pubkey: publicKey,
                    isSigner: true,
                    isWritable: false,
                },
                {
                    pubkey: pda,
                    isSigner: false,
                    isWritable: true,
                },
                {
                    pubkey: web3.SystemProgram.programId, 
                    isSigner:false,
                    isWritable: false,
                },
            ],
            data: buffer,
            programId: new web3.PublicKey(INTRODUCTION_PROGRAM_ID)
        })
        transaction.add(instruction)
        try {
            let txid = await sendTransaction(transaction, connection)
            window.open(`https://explorer.solana.com/tx/${txid}?cluster=devnet`, "_blank")
        } catch (e) {
            alert(JSON.stringify(e))
        }
    }

    return (
        <div className={styles.appBody}>
            <h2>Upload an introduction!</h2>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel  color='gray.200'>Your name</FormLabel>
                    <Input id='introName' name='name'  color='gray.400'></Input>
                </FormControl>
                <FormControl isRequired>
                    <FormLabel  color='gray.200'>Introduction</FormLabel>
                    <Textarea id='introduction' name='introduction'  color='gray.400'></Textarea>
                </FormControl>
                <button type='submit'>Submit Introduction</button>
            </form>
        </div>
    )
}
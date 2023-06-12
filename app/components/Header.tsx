import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styles from '../page.module.css'
import { FC } from 'react'


export const Header:FC = () => {

    return (
        <header className={styles.header}>
            <img src="logo.png" alt="logo" className={styles.headerLogo}/>
            <h1>Introductions</h1>
            <WalletMultiButton/>
        </header>
    )
}
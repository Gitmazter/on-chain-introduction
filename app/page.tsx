'use client'
import Image from 'next/image'
import styles from './page.module.css'
import { Header } from './components/Header'
import { SendIntroduction } from './components/SendIntroduction'
import WalletContextProvider from './components/WalletContextProvider'
import { IntroductionList } from './components/IntroductionList'


export default function Home() {
  return (
    <WalletContextProvider>
      <main className={styles.main}>
        <Header/>
        <SendIntroduction/>
        <IntroductionList/>
      </main>
    </WalletContextProvider>
  )
}

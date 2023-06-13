import { FC } from "react";
import { Introduction } from "../models/Introduction";
import styles from '../page.module.css'

export interface CardProps {
    introduction: Introduction
}

export const IntroCard:FC<CardProps> = (props) => {
    const { name, introduction } = props.introduction
    return (
        <div className={styles.IntroCard}>
            <h3>{name}</h3>
            <p>{introduction}</p>
        </div>
    )
}
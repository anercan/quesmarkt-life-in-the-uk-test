import React, {useEffect, useState} from 'react';

import {useTheme, useTranslation} from '../hooks/';
import {Block, BottomMenu} from '../components/';
import QuizCard from "../components/QuizCard";
import {useRoute} from "@react-navigation/native";
import apiCaller from "../config/apiCaller";
import {IQuizCard} from "../constants/types";
import Header from "../components/Header";
import {TouchableOpacity} from "react-native-gesture-handler";

const QuizListScreen = ({navigation}) => {
    const route = useRoute();
    const {quizGroupId, quizGroupTitle} = route.params;
    const {t} = useTranslation();
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();

    useEffect(() => {
        apiCaller('quiz/get-quizzes-with-user-data', 'POST', {pageSize: 25, page: 0, quizGroupId: quizGroupId})
            .then(response => {
                let dataList = response?.quizResponseWithUserDataList;
                setQuizCards(dataList);
                setFilteredQuizCards(dataList?.filter((card: IQuizCard) => card?.solvedCount !== card?.questionCount));
            });
    }, []);

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizCards(quizCards.filter((card: IQuizCard) => card?.solvedCount !== card?.questionCount));
        } else {
            setFilteredQuizCards(quizCards.filter((card: IQuizCard) => card?.solvedCount === card?.questionCount));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    const startQuiz = (card: IQuizCard, quizCardList: IQuizCard[]) => {
        navigation.navigate('QuizScreen', {quizId: card?.id, quizGroupId: quizGroupId, quizCardList: quizCardList,isReviewPage:false})
    }

    return (
        <Block>
            <Header tabOneText={t('home.filter1')} tabTwoText={t('home.filter2')} title={quizGroupTitle}
                    callback={setTabChange}/>

            {/* quizCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizCards.map((card: IQuizCard, index) => (
                        <TouchableOpacity onPress={() => startQuiz(card, filteredQuizCards)}>
                            <QuizCard {...card} key={`card-${card?.id}`}/>
                        </TouchableOpacity>
                    ))}
                </Block>
            </Block>
            <BottomMenu/>
        </Block>
    );
};

export default QuizListScreen;

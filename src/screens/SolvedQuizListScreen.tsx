import React, {useEffect, useState} from 'react';

import {useTheme} from '../hooks/';
import {Block, BottomMenu} from '../components/';
import {useRoute} from "@react-navigation/native";
import apiCaller from "../config/apiCaller";
import {ISolvedQuizCard} from "../constants/types";
import Header from "../components/Header";
import ReportQuizCard from "../components/ReportQuizCard";
import {TouchableOpacity} from "react-native";

const SolvedQuizListScreen = ({navigation}) => {
    const route = useRoute();
    const [tab, setTab] = useState<number>(0);
    const [quizCards, setQuizCards] = useState([{}]);
    const [filteredQuizCards, setFilteredQuizCards] = useState([{}]);
    const {sizes} = useTheme();

    useEffect(() => {
        apiCaller('user-quiz/get-user-quiz-list')
            .then(response => {
                let dataList = response?.userQuizResponseList;
                setQuizCards(dataList);
                let onGoingQuizes = dataList?.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED');
                if (onGoingQuizes.length > 0) {
                    setFilteredQuizCards(onGoingQuizes);
                } else {
                    setTab(1);
                }
            });
    }, []);

    useEffect(() => {
        if (tab === 0) {
            setFilteredQuizCards(quizCards.filter((card: ISolvedQuizCard) => card?.state !== 'COMPLETED'));
        } else {
            setFilteredQuizCards(quizCards.filter((card: ISolvedQuizCard) => card?.state === 'COMPLETED'));
        }
    }, [tab]);

    const setTabChange = (filter: number) => {
        setTab(filter);
    };

    function cardOnPress(card: any) {
        navigation.navigate('QuizScreen', {
            quizId: card.quiz.id,
            quizGroupId: card.quizGroupId,
            quizCardList: [],
            isReviewPage: card?.state === 'COMPLETED'
        });
    }

    return (
        <Block>
            <Header tabOneText={'Ongoing'} tabTwoText={'Completed'} selectedTab={tab} hideSearch={true}
                    title={'Reports'} callback={setTabChange}/>

            {/* quizCards list */}
            <Block
                scroll
                paddingHorizontal={15}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: sizes.l}}>
                <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
                    {filteredQuizCards?.map((card: any) => (
                        <TouchableOpacity onPress={() => cardOnPress(card)}>
                            <ReportQuizCard {...card} key={`card-${card?.id}`}/>
                        </TouchableOpacity>

                    ))}
                </Block>
            </Block>
            <BottomMenu/>
        </Block>
    );
};

export default SolvedQuizListScreen;

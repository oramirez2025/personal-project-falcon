import { Heading, Separator, Container, } from "@chakra-ui/react"
import QuestionCard from "../components/cards/QuestionCard";

export default function QuestionsAnswersPage() {
    return (
        <Container>

            <Heading color='#b91c1c' textDecoration={'underline'}>Frequently Asked Questions</Heading>

            <QuestionCard
            question = "Question:"
            answer = "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
            > 
            </QuestionCard>

                <Separator/>


            <QuestionCard
            question = "Question:"
            answer = "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
            > 
            </QuestionCard>

                <Separator/>

            <QuestionCard
            question = "Question:"
            answer = "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
            > 
            </QuestionCard>

                <Separator/>


            <QuestionCard
            question = "Question:"
            answer = "Answer: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis ex dolorem porro ratione distinctio culpa alias quasi harum, sed obcaecati aut nostrum quam voluptates suscipit veritatis ab, odio molestias at."
            > 
            </QuestionCard>

                <Separator/>
        </Container>
    )
};
import { useOutletContext, useParams } from "react-router-dom"
import CommentSection from "../components/sections/CommentSection";
import { Grid, Heading, Text} from "@chakra-ui/react";

export default function EventForumPage() {
    const {eventId} = useParams();
    const {user} = useOutletContext()
    return (<Grid>
            <Heading> dwadaw </Heading>
            <Text>Time: dwadwa </Text>
            <Text>dwadwa</Text>
            <CommentSection eventId={eventId} user={user}/>
        </Grid>
    )
}
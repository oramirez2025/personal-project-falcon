import { Button } from "react-bootstrap";

export default function CommentCard({
    author, 
    time, 
    likes, 
    text, 
    onClickDelete, 
    onClickUpdate,
    onClickLike,
    onClickReply,
    isOP,
    isAdmin,
    isLoggedIn
}) 
{
    return (<div>
                <h1> Author: {author} </h1>
                <h2> Time: {time} </h2>
                <p> Text: {text}</p>
                <h2> Likes: {likes} </h2>
                {
                    isOP ? (
                        <>
                            <Button onClick={onClickUpdate}>Edit Comment</Button>
                            <Button> Like Button </Button>
                            <Button> Reply? </Button>
                        </>
                    ) : <></>
                }
                {
                    isLoggedIn ? (
                        <>
                            <Button onClick={onClickLike}> Like Button </Button>
                            <Button onClick={onClickReply}> Reply? </Button>
                        </>
                    ) : <></>
                }
                {
                    (isOP || isAdmin) ? <Button onClick={onClickDelete}> Delete Comment </Button> : <></>
                }
            </div>
    )
}
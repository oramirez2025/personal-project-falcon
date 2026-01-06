// TODO
export default function CommentCard({id, author, time, likes, text}) {
    console.log(id, author, time, likes, text)
    return (<div>
                <h1> Author: {author} </h1>
                <h2> Time: {time} </h2>
                <p> Text: {text}</p>
                <h2> Likes: {likes} </h2>
                <button> Like Button</button>
                <button>Reply?</button>
                <button>Delete Comment</button>
            </div>
    )
}
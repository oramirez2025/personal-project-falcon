export default function CommentCard({author, time, likes, text}) {
    return (<div>
                <h1> Author: {author} </h1>
                <h2> Time: {time} </h2>
                <p> Text: {text}</p>
                <h2> Likes: {likes} </h2>
                <button> Like Button</button>
                <button>Reply?</button>
            </div>
    )
}
import React,{useState , useEffect} from 'react'
import "./Post.css";
import { db } from "./firebase"
import Avatar from "@material-ui/core/Avatar"

function Post({username, caption, imageUrl, postId}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")

    useEffect(() =>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
                .collection("users")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((docs) => docs.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    },[postId])

    const postComment = (event) =>{

    }


    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt="User post image"/>

            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>

            <form className="post__commentBox">
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    onChange={(e)=> setComment(e.target.value)}
                    value={comment}
                />
                <button
                    className="post__button"
                    disable={!comment}
                    type="submit"
                    onClick={postComment}
                >
                    Post
                </button>
            </form>
        </div>
    )
}

export default Post
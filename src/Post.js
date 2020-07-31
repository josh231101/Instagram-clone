import React,{useState , useEffect} from 'react'
import "./Post.css";
import {firestore} from "firebase"
import { db } from "./firebase"
import Avatar from "@material-ui/core/Avatar"
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';
import SendOutlinedIcon from '@material-ui/icons/SendOutlined';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';

function Post({username, caption, imageUrl, postId, user}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")

    useEffect(() =>{
        let unsubscribe;
        if(postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp','asc')
                .limitToLast(5)
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe()
        }
    },[postId])

    const postComment = (event) =>{
        event.preventDefault()

        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username :  user.displayName,
            timestamp : firestore.FieldValue.serverTimestamp()
        })
        setComment("")

    }


    return (
        <div className="post">
            <div className="post__header">
                <Avatar 
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h4>{username}</h4>
            </div>
            <img className="post__image" src={imageUrl} alt="User post image"/>
            <div className="post__icons">
                <div className="post__iconsLeft">
                    <FavoriteBorderIcon  className="icon"/>
                    <ModeCommentOutlinedIcon className="icon" />
                    <SendOutlinedIcon  className="icon"/>
                    
                </div>
                <div className="post__iconsRight">
                    <BookmarkBorderOutlinedIcon className="icon"/>
                </div>

            </div>
            

            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>

            <div className="post__comment">
                {comments?.map((comment) =>(
                    <p>
                        <b>{comment.username}</b> {comment.text}
                    </p>))}
            </div>

            {user && (
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
            )}
            
        </div>
    )
}

export default Post
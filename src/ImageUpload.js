import React, { useState } from 'react'
import {firestore} from "firebase"
import {db ,storage,auth} from "./firebase";
import {Button,Input} from "@material-ui/core";
import "./ImageUpload.css"

function ImageUpload({username}) {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        //If the user selected one pic or more get the first one 
        //and set the image hook to the path of the selected img
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }

    }
    /*UPLOADING PIC AND THEN CREATING A NEW DOC ON POSTS */
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
            },
            (error) => {
                alert(error.message)

            },
            () => {
                //complete function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);

                    })

            }
        )

    }


    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <input type="text" placeholder="Enter a caption..." onChange={(event)=> setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange}/>
            <Button className="button__upload" onClick={handleUpload}>
                Upload
            </Button>


            
        </div>
    )
}

export default ImageUpload



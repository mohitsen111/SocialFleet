import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useMakeRequest from "../../hook/useFetch";
import Img from "../Img";
import { uploadImageToCDN } from "../../ImageKit";
const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const makeRequest = useMakeRequest();

  // const upload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("file", file);
  //     const res = await makeRequest.post("/upload", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     return res.data;
  //   } catch (err) {
  //     toast.error(err.response.data.msg);
  //     console.log(err);
  //   }
  // };

  const { currentUser } = useContext(AuthContext);

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    if (!file && !desc) {
      toast.error(
        "please Write a description or choose an image for your Post"
      );
    } else {
      setisLoading(true);
      e.preventDefault();
      let imgUrl = "";
      if (file) imgUrl = await uploadImageToCDN(file);
      mutation.mutate({ desc, img: imgUrl });
      setDesc("");
      setFile(null);
      setisLoading(false);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <Img isDefault={false} src={currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
            <div className="item">
              <button
                disabled={isLoading}
                style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                onClick={handleClick}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

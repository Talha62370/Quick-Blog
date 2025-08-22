import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import moment from "moment";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import DOMPurify from "dompurify"; // For HTML sanitization

const Blog = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
console.log(axios.defaults.baseURL); 


  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogData = async () => {
  try {
    setLoading(true);
    const { data } = await axios.get(`/api/blog/${id}`); 
    data.success ? setData(data.blog) : toast.error(data.message)
     setLoading(false); 
  } catch (error) {
   toast.error(error.message)
    setLoading(false); 
  }
};

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId: id });
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message || "Failed to fetch comments");
      }
    } catch (error) {
      toast.error(error.message || "Error loading comments");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/blog/add-comment',
        { blog: id, 
        name,
        content});
       if(data.success) {
        toast.success(data.message);
        setName('')
        setContent('')
       }else{
        toast.error(data.message);
       }
    } catch (error) {
      toast.error(error.message);
    }
  };

useEffect(() => {
  if (id) {
    fetchBlogData();
    fetchComments();
  }
}, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!data) return <div className="text-center py-20">Blog not found</div>;
  
  return (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt="gradient background"
        className="absolute -top-50 -z-1 opacity-50"
      />

      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {moment(data.createdAt).format("MMMM Do YYYY")}
        </p>

        <h1 className="text-2xl sm:semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>

        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>

        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.author || "Michel Brown"}
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-5 my-10 mt-6">
        <div className="flex justify-center mb-5">
          <img 
            src={data.image} 
            alt={data.title} 
            className="rounded-3xl mb-5 max-h-[500px] object-cover" 
          />
        </div>

        <div
          className="rich-text max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.description) }}
        ></div>

        {/* Comments section */}
        <div className="mt-14 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.map((item) => (
              <div
                key={item._id}
                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={assets.user_icon} alt="user" className="w-6" />
                  <p className="font-medium">{item.name}</p>
                </div>
                <p className="text-sm max-w-md ml-8">{item.content}</p>
                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                  {moment(item.createdAt).fromNow()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add comment Section */}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mt-4 mb-2">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />

            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Comment"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            ></textarea>

            <button
              type="submit"
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
              disabled={!name || !content}
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share buttons */}
        <div className="my-24 max-w-3xl mx-auto">
          <p className="font-semibold my-4">Share this article on social media</p>
          <div className="flex gap-4">
            <img src={assets.facebook_icon} width={40} alt="Share on Facebook" className="cursor-pointer" />
            <img src={assets.twitter_icon} width={40} alt="Share on Twitter" className="cursor-pointer" />
            <img src={assets.googleplus_icon} width={40} alt="Share on Google+" className="cursor-pointer" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;
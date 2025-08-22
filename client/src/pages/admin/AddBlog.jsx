import React, { useEffect, useRef, useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import {parse} from 'marked'
import { data } from 'react-router-dom';

const AddBlog = () => {

  const {axios} = useAppContext()
  const [isAdding, setAdding] = useState(false)
    const [loading, setLoading] = useState(false)

const editorRef = useRef(null)
const quillRef = useRef(null)

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setsubTitle] = useState('');
  const [category, setCategory] = useState('startup')
  const [isPublished, setisPublished] = useState(false);

  const generateContent = async ()=> {
    if(!title) return toast.error('please enter a title')

      try {
        setLoading(true)
        const {data} = await axios.post('/api/blog/generate', {prompt: title})
        if(data.success){
          quillRef.current.root.innerHTML = parse(data.content)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
  }

  const onSubmitHandeler = async (e) => {
    try {
      e.preventDefault();
      setAdding(true)

      const blog = {
        title, subTitle,
        description: quillRef.current.root.innerHTML,
        category, isPublished
      }

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog))
      formData.append('image', image)

       const {data} = await axios.post('/api/blog/add', formData);

       if(data.success){
        toast.success(data.message)
        setImage(false)
        setTitle('')
        quillRef.current.root.innerHTML = ''
        setCategory('startup')
       }else{
        toast.error(data.message)
       }

    } catch (error) {
      toast.error(error.message)
    }finally{
      setAdding(false)
    }
    
  }

  useEffect(()=> {
    // initiate Quill only once
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {theme: 'snow'})
    }
  },[])

  return (
    <form onSubmit={onSubmitHandeler} className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll'>
        <div className='bg-white w-full max-3-xl p-4 md:p-10 sm:m-10 shadow rounded'>
             
             <p>Upload thumnail</p>
             <label htmlFor="image">
              <img src={!image ? assets.upload_area : URL.createObjectURL(image)} 
              alt="" className='mt-2 h-16 rounde cursor-pointer'/>
              <input onChange={(e)=> setImage(e.target.files[0])} type="file" 
              id='image' required/>
             </label>

             <p className='mt-4'>Blog title</p>
             <input type="text" placeholder='Type here' required className='w-full
             max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange=
             {e=> setTitle(e.target.value)} value={title}/>

             <p className='mt-4'>Sub title</p>
             <input type="text" placeholder='Type here' required className='w-full
             max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' onChange=
             {e=> setsubTitle(e.target.value)} value={subTitle}/>

             <p className='mt-4'>Blog Description</p>
            <div className='max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative'>
               <div ref={editorRef}></div>
               {loading && ( 
             <div className='absolute inset-0 flex items-center justify-center bg-black/10 rounded'>
                <div className='w-8 h-8 rounded-full border-2 border-primary border-t-white animate-spin'></div>
             </div>
                )}
              <button disabled={loading} type='button' onClick={generateContent} className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'>
                 Generate with AI
             </button>
            </div>

             <p className='mt-4'>Blog Category</p>
             <select onChange={e => setCategory(e.target.value)} name="category" className='mt-2 px-3 py-2 border text-gray-500
             border-gray-300 outline-none rounded'>
              <option value="">Select category</option>
              {blogCategories.map((item, index)=>{
                return <option key={index} value={item}>{item}</option>
              })}
             </select>

             <div className='mt-4 flex gap-2'>Publish Now
             <input type="checkbox" checked={isPublished} className='scale-125
             cursor-pointer'onChange={e => setisPublished(e.target.checked)}/>
             </div>

             <button disabled={isAdding} type='submit' className='mt-8 w-40 h-10 bg-primary text-white
             rounded cursor-pointer text-sm'>
             {isAdding ? 'Adding...' : 'Add Blog'}
             </button>

        </div>
    </form>
  )
}

export default AddBlog
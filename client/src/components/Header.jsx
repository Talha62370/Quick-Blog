import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    try {
      const searchValue = inputRef.current.value.trim();
      if (searchValue) {
        setInput(searchValue);
        // Navigate to search results or refresh current page with search
        navigate(`/?search=${encodeURIComponent(searchValue)}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fallback to simple search if navigation fails
      setInput(inputRef.current.value);
    }
  };

 const onClear = () => {
    setInput('');
    inputRef.current.value = '';
    navigate('/'); // Optional: Clear the search from URL
  };

  return (
    <div className='mx-8 sm:ma-16 xl:mx-24 relative'>
      <div className='text-center mt-20 mb-8'>
        <div className='inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary'>
          <p>New AI feature integrated</p>
          <img src={assets.star_icon} className='w-2.5' alt="star icon" />
        </div>
        
        <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700'>
          Your own <span className='text-primary'>blogging </span> <br/> platform.
        </h1>

        <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-grey-500'>
          This is your space to think out loud, to share what matters, and to write without filters. 
          Whether it's one word or a thousand, your story right here.
        </p>

        <form 
          onSubmit={onSubmitHandler} 
          className='flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden'
        >
          <input 
            ref={inputRef} 
            type='text' 
            placeholder='search for blog' 
            required 
            className='w-full pl-4 outline-none'
            aria-label='Search for blogs'
          />
          <button 
            type='submit' 
            className='bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer'
          >
            Search
          </button>
        </form>
      </div>

    <div className='text-center'>
        { input &&<button onClick={onClear} className='border font-light text-xs py-1 px-3 rounded-sm
        shadow-custom-sm cursor-pointer'>Clear Search</button>
        }
    </div>

      <img 
        src={assets.gradientBackground} 
        alt='gradient background' 
        className='absolute -top-50 -z-1 opacity-50' 
      />
    </div> 
  );
};

export default Header;
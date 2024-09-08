import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react';

export default function Header() {

    const {currentUser} = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    // console.log(currentUser);

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setSearchTerm(urlParams.get('searchTerm'));
    }, [window.location.search])

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to= '/'>
                    <h1 className='font-bold text-sm sm:xl flex flex-wrap'>
                        <span className='text-slate-500 text-xl'>Rentify</span>
                        <span className='text-slate-700 text-xl'>Estate</span>
                    </h1>
                </Link>
                <form className='bg-slate-100 p-3 rounded-lg flex items-center'  onSubmit={handleSubmit}>
                    <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button>
                        <FaSearch className='text-slate-600'></FaSearch>
                    </button>
                </form>
                <ul className='flex gap-4'>
                    <Link to='/'>
                        <li className='text-slate-700 hidden sm:inline hover:underline'>Home</li>
                    </Link>
                    <Link to='/about'>
                        <li className='text-slate-700 hidden sm:inline hover:underline'>About</li>
                    </Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img src={ currentUser.avatar } className='rounded-full h-7 w-7 object-cover' alt="profile" />
                        ) : (
                            <li className='text-slate-700 hover:underline'>Sign In</li>
                        )} 
                    </Link>
                </ul>
            </div>
        </header> 
    )
}

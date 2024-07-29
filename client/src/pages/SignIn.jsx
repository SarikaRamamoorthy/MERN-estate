import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector }from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice'


export default function SignIn() {

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method : 'POST',
        headers : {
          "Content-Type" : 'application/json'
        },
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      // console.log(data);
      dispatch(signInSuccess(data));
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
    
  }


  return (
    <div className='max-w-lg mx-auto p-3'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-5'>
        <input type="email" placeholder='email' autoComplete='off' className='p-3 border rounded-lg' id = 'email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='p-3 border rounded-lg' id = 'password' onChange={handleChange}/>
        <button disabled = {loading} className='bg-slate-700 p-3 my-5 rounded-lg text-white hover:opacity-95 disabled:opacity-80 uppercase' onClick={handleSubmit}>{loading ? 'loading...' : 'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont an account?</p>
        <Link to='/sign-up'>
          <span  className='text-blue-500'>Sign Up</span>
        </Link>
      </div>
      <div>{error && <p className='text-red-700'>{error}</p>}</div>
    </div>
  )
}

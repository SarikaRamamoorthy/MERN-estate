import { useState, useEffect, useRef } from 'react'
import {useSelector} from 'react-redux'
import {app} from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  console.log(file);
  console.log(filePerc);
  console.log(fileUploadError);
  console.log(formData.avatar);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method : 'POST',
          headers : {
            'Content-Type' : 'application/json'
          },
          body : JSON.stringify(formData)
        })
        const data = await res.json();
        if(data.success === false) {
          setUpdateSuccess(false);
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
      } catch (error) {
        setUpdateSuccess(false);
        dispatch(updateUserFailure(error.message));
    }

  }

  // console.log(formData);

  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  },[file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({...formData, avatar : downloadURL}));
        setFileUploadError(false);
      }
    )
  }

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input 
          onChange={(e) => setFile(e.target.files[0])}
          type="file" 
          ref={fileRef} 
          hidden accept='image/*'/>
        <img 
          onClick={() => fileRef.current.click()} 
          src={ formData.avatar || currentUser.avatar} alt="profile pic" 
          className='rounded-full my-2 w-24 h-24 object-cover self-center cursor-pointer'/>

          <p className='text-center'>{ fileUploadError ? <span className='text-red-700'>Error Image Upload</span> : (
            (filePerc > 0 && filePerc < 100) ?
            <span className='text-slate-700'>Uploading { filePerc } %</span> : (filePerc === 100 ? 
              (<span className='text-green-700'>Image successfully uploaded</span>) : ("")
            )
            
          )  }</p>
          
        <input type="text" placeholder = 'username' onChange={handleChange} defaultValue={currentUser.username} className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder = 'email' onChange={handleChange} defaultValue={currentUser.email} className='p-3 rounded-lg' id='email'/>
        <input type="password" placeholder = 'password' onChange={handleChange} className='p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 uppercase p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80' disabled = {loading} >{loading ? 'Loading...' : 'update'}</button>
        {/* <button className='bg-green-700 uppercase p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80'>create listing</button> */}
      </form>
      <div className='mt-5 flex justify-between'>
        <span className='text-rose-700 cursor-pointer'>Delete Account</span>
        <span className='text-rose-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 mt-5'>{UpdateSuccess ? "Profile is updated successfully!" : ""}</p>
    </div>
  )
}

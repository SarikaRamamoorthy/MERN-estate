import { useState, useEffect, useRef } from 'react'
import {useSelector} from 'react-redux'
import {app} from '../firebase';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice';
import { deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'


export default function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);
  const [deleteListingsError, setDeleteListingsError] = useState(false);
  const dispatch = useDispatch();

  // console.log(file);
  // console.log(filePerc);
  // console.log(fileUploadError);
  // console.log(formData.avatar);
  console.log(userListings)

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('./api/auth/signout');
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(error.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }

  const handleDelete = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method : 'DELETE'
      })
      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(error.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleListingDelete = async (listingId) => {
    setDeleteListingsError(false);
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method : 'DELETE',
      })
      const data = await res.json();
      if(data.success === false) {
        setDeleteListingsError(true);
        return;
      }
      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    } catch (error) {
      setDeleteListingsError(true);
    }
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

  const handleShowListings = async() => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if(data.success === false) {
          setShowListingsError(true);
          return;
        }
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
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
      <h1 className='text-3xl font-semibold text-center my-3'>Profile</h1>
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
          )}</p>
          
        <input type="text" placeholder = 'username' onChange={handleChange} defaultValue={currentUser.username} className='border p-3 rounded-lg' id='username'/>
        <input type="email" placeholder = 'email' onChange={handleChange} defaultValue={currentUser.email} className='p-3 rounded-lg' id='email'/>
        <input type="password" placeholder = 'password' onChange={handleChange} className='p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 uppercase p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80' disabled = {loading} >{loading ? 'Loading...' : 'update'}</button>
        <Link to = {"/create-listing"} className='bg-green-700 uppercase p-3 rounded-lg text-white hover:opacity-95 text-center'>create listing</Link>
      </form>
      <div className='mt-5 flex justify-between'>
        <span className='text-rose-700 cursor-pointer' onClick={handleDelete}>Delete Account</span>
        <span className='text-rose-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ""}</p>
      <p className='text-green-700 font-semibold my-5'>{UpdateSuccess ? "Profile Updated Successfully!" : ""}</p>
      <button onClick={handleShowListings} className='text-green-700 w-full mb-2'>Show Listings</button>
      <p className='text-red-700 mt-5 mx-auto'>{showListingsError ? 'Error showing listings' : ""}</p>
      { userListings && userListings.length > 0 && 
      <div className='flex flex-col gap-5'>
        <h1 className='font-semibold text-2xl text-center mt-8'>Your Listings</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='border rounded-lg p-3 flex items-center justify-between gap-5 mb-3'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
              </Link>
            <Link to={`/listing/${listing._id}`}>
              <p className='font-semibold text-slate-700 hover:underline truncate'>{listing.name}</p>
            </Link>
            <div className='flex flex-col items-center'>
              <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 font-semibold uppercase text-sm'>Delete</button>
              <button className='text-green-700 font-semibold uppercase text-sm'>Edit</button>
            </div>
          </div>
        ))}
        {
          deleteListingsError && <p className='text-red-700 font-semibold text-center my-3'>Error occured during deletion!</p>
        }
      </div>}
    </div>
  )
}

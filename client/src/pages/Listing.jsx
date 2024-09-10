import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair
} from 'react-icons/fa'
import {useSelector} from 'react-redux'
import Contact from '../components/Contact';

export default function Listing() {

    SwiperCore.use(Navigation);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const param = useParams();
    const {currentUser} = useSelector((state) => state.user)
    const [contact, setContact] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
          const listingId = param.listingId;
          try {
            setLoading(true);
            setError(false)
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false) {
                setError(true);
                setLoading(false);
                return;
            }
            setLoading(false);
            setListing(data);
            // console.log(data)
            
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        }
  
        fetchListing();
      }, [param.listingId])

    return (
        <main>
            {loading && (
              <div className='flex flex-row items-center gap-3 m-auto w-fit my-7'>
              <div className='w-6 h-6 border-4 rounded-full animate-spin border-slate-500 border-t-transparent'></div>
              <p className='text-2xl font-semibold text-slate-700'>Loading...</p>
              </div>
              )} 
            { error && (
              <div>
                <p className='text-red-700 text-2xl text-center my-8'><span className='text-red-800 font-semibold'>Error! </span>Please Try again.</p>
                <Link to={"/"}>
                  <div className='text-center text-xl font-semibold underline text-slate-700'>Go to Home Page</div>
                </Link>
              </div>)
            }
            {
              listing && !loading && !error && (
                <div>
                  {/* {console.log(listing)} */}
                  
                  <Swiper navigation loop>
                    {
                      listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                          <div className='h-[500px]' style={{ background : `url(${url}) center no-repeat`, backgroundSize : `cover`}}></div>
                        </SwiperSlide>
                      ))
                    }
                  </Swiper>
                  <div className='bg-slate-100 top-[13%] border rounded-full w-12 h-12 items-center justify-center z-10 right-[3%] cursor-pointer flex fixed' onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => {
                        setCopied(false);
                      }, 2000)
                    }}>
                    <FaShare className='text-slate-500'/>
                  </div>
                  {
                    copied && <div className='text-slate-700 fixed bg-slate-100 z-10 top-[22%] right-[3%] p-2 rounded-md'>Link copied!</div>
                  }
                  <div  className='max-w-4xl mx-auto'>
                    <div className='mx-auto max-w-4xl my-6 p-3'>
                      <p className='text-2xl font-semibold'>
                        {listing.name} - Rs{' '}
                        {listing.offer ?
                        listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
                        {listing.type === 'rent' && ' / month'}
                      </p>
                      <p className='flex text-center gap-2 text-sm mt-5'> <FaMapMarkerAlt className='text-green-700 mt-1'/> { listing.address }
                      </p>
                      <div className='flex gap-4 mt-3  items-center'>
                        <div className='bg-red-900 text-slate-100 px-2 py-1 rounded-md w-[27%] text-center'>For {listing.type === 'sale' ? 'Sale' : 'Rent'}</div>
                        {listing.offer && <div className='bg-green-900 text-slate-100 px-2 py-1 rounded-md w-[27%] text-center'>Rs {(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-In')} discount</div>}
                      </div>
                      <p className='mt-4 text-slate-800'><span className='font-semibold text-black'>Description - </span>{listing.description}</p>
                      <ul className='mt-3 flex flex-row gap-6 font-semibold text-green-900 text-sm flex-wrap'>
                        <li className='flex items-center gap-1 whitespace-nowrap'> <FaBed className='text-lg'/> {listing.bedrooms > 1 ? listing.bedrooms + ' beds' : listing.bedrooms + ' bed' } </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'> <FaBath className='text-lg'/> {listing.bathrooms > 1 ? listing.bathrooms + ' baths' : listing.bathrooms + ' bath' } </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'> <FaParking className='text-lg'/> {listing.parking ? 'Parking spot' : 'No Parking' } </li>
                        <li className='flex items-center gap-1 whitespace-nowrap'> <FaChair className='text-lg'/> {listing.furnished ? 'Furnished' : 'Unfurnished' } </li>
                      </ul>
                    </div>
                    {
                      currentUser && currentUser._id !== listing.userRef && !contact && (<button className='text-slate-100 bg-slate-700 uppercase p-3 rounded-lg w-full mb-8 hover:opacity-90' onClick={() => setContact(true)}>Contact Landlord</button>)
                    }
                    {
                      contact && <Contact listing={listing}/>
                    }
                  </div>
                </div>
              )
            }

        </main>
    )
}

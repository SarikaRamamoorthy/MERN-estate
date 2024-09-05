import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation} from 'swiper/modules'
import 'swiper/css/bundle'

export default function Listing() {

    SwiperCore.use(Navigation);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const param = useParams();

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
            console.log(data)
            
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
                <Swiper navigation>
                  {
                    listing.imageUrls.map((url) => (
                      <SwiperSlide key={url}>
                        <div className='h-[450px]' style={{ background : `url(${url}) center no-repeat`, backgroundSize : `cover`}}></div>
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
              )
            }

        </main>
    )
}

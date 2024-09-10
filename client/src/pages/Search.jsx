import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Search() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [showMore, setShowMore] = useState(false);
    
    // console.log(listing);

    const onShowMoreClick = async () => {
        const numberOfListings = listing.length;
        const urlParams = new URLSearchParams(location.search);
        const startIndex = numberOfListings;
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if(data.length < 9) {
            setShowMore(false);
        }
        setListing([...listing, ...data]);
    }

    const [sidebardata, setSidebardata] = useState({
        searchTerm : '',
        type : 'all',
        parking : false,
        furnished : false,
        offer : false,
        sort : 'created_at',
        order : 'desc'
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebardata.searchTerm);
        urlParams.set('type', sidebardata.type);
        urlParams.set('parking', sidebardata.parking);
        urlParams.set('furnished', sidebardata.furnished);
        urlParams.set('offer', sidebardata.offer);
        urlParams.set('sort', sidebardata.sort);
        urlParams.set('order', sidebardata.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermfromUrl = urlParams.get('searchTerm');
        const typefromUrl = urlParams.get('type');
        const parkingfromUrl = urlParams.get('parking');
        const furnishedfromUrl = urlParams.get('furnished');
        const offerfromUrl = urlParams.get('offer');
        const sortfromUrl = urlParams.get('sort');
        const orderfromUrl = urlParams.get('order');

        if(
            searchTermfromUrl || typefromUrl || parkingfromUrl || furnishedfromUrl || offerfromUrl || sortfromUrl || orderfromUrl
        ) {
            setSidebardata({
                searchTerm : searchTermfromUrl || '',
                type : typefromUrl || 'all',
                parking : parkingfromUrl === 'true' ? true : false,
                furnished : furnishedfromUrl === 'true' ? true : false,
                offer : offerfromUrl === 'true' ? true : false,
                sort : sortfromUrl || 'created_at',
                order : orderfromUrl || 'desc',
            })
        }

        const fetchListing = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`)
            const data = await res.json();
            if(data.length > 8) {
                setShowMore(true);
            }else {
                setShowMore(false);
            }
            setLoading(false);
            setListing(data);
        }

        fetchListing();
        

    }, [window.location.search])

    // console.log(sidebardata);
    

    const handleChange = (e) => {
        if(e.target.id === 'all' || e.target.id === 'sale' || e.target.id === 'rent') {
            setSidebardata({...sidebardata, type : e.target.id})
        }
        else if(e.target.id === 'searchTerm') {
            setSidebardata({...sidebardata, searchTerm : e.target.value})
        }
        else if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSidebardata({...sidebardata, [e.target.id] : e.target.checked || e.target.value === 'true' ? true : false})
        }
        else if(e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebardata({...sidebardata, sort, order});
        }
    };

    return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className="flex items-center gap-2">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <input value={sidebardata.searchTerm} onChange={handleChange} type="text" id='searchTerm' placeholder='search...' autoComplete='off' className='border p-3 rounded-lg w-full'/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold'>Type:</label>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebardata.type === 'all'} type="checkbox" id="all" className='w-5'/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebardata.type === 'rent'}type="checkbox" id="rent" className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={sidebardata.type === 'sale'} type="checkbox" id="sale" className='w-5'/>
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className='w-5' onChange={handleChange} checked={sidebardata.offer}/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold'>Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className='w-5' onChange={handleChange} checked={sidebardata.parking}/>
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className='w-5' onChange={handleChange} checked={sidebardata.furnished}/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <label className='font-semibold'>Sort:</label>
                    <select onChange={handleChange} defaultValue={'createdAt_desc'} id="sort_order" className='border rounded-lg p-3'>
                        <option value='regularPrice_desc'>Price High to Low</option>
                        <option value='regularPrice_asc'>Price Low to High</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-slate-100 uppercase p-3 rounded-lg hover:opacity-95'>Search</button>
            </form>
        </div>
        <div className="w-full">
            <h1 className='text-3xl font-semibold p-3 border text-slate-700 mt-5'>Listing results:</h1>
            <div className="p-7 w-full flex flex-wrap gap-5">
                {!loading && listing.length === 0 &&  <p className='text-xl text-slate-700 font-semibold'>Listing not found!</p> }
                {loading && (
                    <div className='flex flex-row items-center gap-3 m-auto w-fit my-7'>
                        <div className='w-6 h-6 border-4 rounded-full animate-spin border-slate-500 border-t-transparent'></div>
                        <p className='text-2xl font-semibold text-slate-700'>Loading...</p>
                    </div>
                )} 
                { !loading && listing && listing.map((listing) => (
                    <ListingItem key={listing._id} listing={listing}/>
                ))}

                {
                    showMore && (
                        <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 w-full text-center'>Show more</button>
                    )
                }

            </div>
        </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

    const [landlord, setLandlord] = useState(null);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`);
                const data = await res.json();
                if(data.success === false) {
                    setError(true);
                    return;
                }
                setLandlord(data);
                setError(false);
            } catch (error) {
                // console.log(error);
                setError(true);
            }
        }
        fetchLandlord();

    }, [listing.userRef]);

    // console.log(listing);
    
    
    return (
        <div className='w-[97%] mx-auto'>
            {
                landlord &&
                <div className='flex flex-col gap-4 mb-8'>
                    <div>Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></div>
                    <textarea className='w-full border p-3 rounded-lg' name="messsage" id="message" rows="2" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter your message here'/>

                    {/* adds content to default mail application */}
                    {/* <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-slate-100 p-3 rounded-lg text-center uppercase hover:opacity-95' >send Message</Link> */}


                    {/* adds content in gmail application
 */}
                    <Link to={`https://mail.google.com/mail/?view=cm&to=${landlord.email}&su=Regarding ${listing.name}&body=${message}`}  className='bg-slate-700 text-slate-100 p-3 rounded-lg text-center uppercase hover:opacity-95' >send Message</Link>
                </div>
            }
            {
                error && <p className='text-red-800 font-semibold text-sm my-5'>Error occurred in fetching details. Try again!</p>
            }
        </div>
    )
}

import React, { useContext, useState } from 'react'
import { useUser } from "@clerk/clerk-react";
import { SearchContext } from '../SearchContext';

const Categories = () => {
    const categories = ['All', 'Graphics', 'Fonts', 'Mockups', 'Logos', 'Illustrations', 'Videos', 'Tutorials', 'Others']
    const [active, setActive] = useState(0)
    const {category, setCategory } = useContext(SearchContext);
    const { isSignedIn, user, isLoaded } = useUser();
    
    if (!isLoaded) {
        // Handle loading state however you like
        return null;
      }
    
      if (isSignedIn) {
         console.log(user);
      }

  return (
    <div>
        <hr className='my-4' />
        <div className=' cursor-pointer flex gap-4 items-center justify-evenly'>
            <div onClick={() => setCategory('All')} className= {`  ${category === 'All' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold  px-3 py-2 text-black'}`}>
                All
            </div>
            <div onClick={() => setCategory('Graphics')} className= {`  ${category === 'Graphics' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : '  text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Graphics
            </div>
            <div onClick={() => setCategory('Fonts')} className= {`  ${category === 'Fonts' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Fonts
            </div>
            <div onClick={() => setCategory('Mockups')} className= {`  ${category === 'Mockups' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Mockups
            </div>
            <div onClick={() => setCategory('Logos')} className= {`  ${category === 'Logos' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : 'text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Logos
            </div>
            <div onClick={() => setCategory('illustrations')} className= {`  ${category === 'illustrations' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Illustrations
            </div>
            <div onClick={() => setCategory('Videos')} className= {`  ${category === 'Videos' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Videos
            </div>
            <div onClick={() => setCategory('Tutorials')} className={`  ${category=== 'Tutorials'? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-center rounded-md font-bold text-black   px-3 py-2'}`}>
                Tutorials
            </div>
            <div onClick={() => setCategory('Others')} className={`  ${category=== 'Others' ? 'text-black text-center rounded-md font-bold bg-slate-400   px-3 py-2' : ' text-black text-center rounded-md font-bold   px-3 py-2'}`}>
                Others
            </div>
        </div>
        <hr className='my-4  ' />
    </div>
  )
}

export default Categories
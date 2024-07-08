
import {useState,useEffect} from 'react';
import {BiSolidSun,BiSolidMoon} from 'react-icons/bi'



const Darkmode = () => {
    const [theme,setTheme]= useState(
        typeof window !=="undefined" && localStorage.getItem("theme")
        ? localStorage.getItem("theme")
        :"light"
    );

    const element = typeof document != "undefined" ?
     document.documentElement:null;
    useEffect(()=> {
        localStorage.setItem("theme", theme);
        if (theme === 'dark')
            {
                element.classList.add('dark');
            }
            else{
        element.classList.remove('light')
        element.classList.remove('dark')
        }
    });

  return (
    <>
  {theme == 'dark' ? (
    <BiSolidSun onClick={() => setTheme('light')} className='text-2xl' />
) : (
    <BiSolidMoon onClick={() => setTheme('dark')} className='text-2xl' />
)}

    
    </>
  )
    
  
}

export default Darkmode

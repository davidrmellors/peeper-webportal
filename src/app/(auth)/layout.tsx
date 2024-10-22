import { type PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
 return (
   <div className="flex h-screen">
     <div className="w-1/2 bg-gray-100 flex justify-center items-center">
       <div className="w-24 h-24 border-4 border-white transform rotate-45"></div>
     </div>
     <div className="w-1/2 bg-lime-500 p-10 flex flex-col justify-center">
       <div className="flex justify-center">
         <h1 className="text-white text-8xl text-left font-bold mb-8 w-fit">KEEP<br/>MAKING<br/>CHANGE</h1>
       </div>
       {children}
     </div>
   </div>
 );
}
"use client";
import React from "react";
import { useState } from "react"




export const TermsCheckbox = () => {
    const [isSelected, setIsSelected] = useState(false);

    const handleCheckboxChange = () => {
        setIsSelected(!isSelected);
    };

    return(
        <div className='flex gap-4'>               

                <input 
                type="checkbox"
                id="termsCheckbox"
                checked={isSelected}
                onChange={handleCheckboxChange}
                className="border border-black bg-white rounded-sm p-2"
                required                
                />
            </div>
    )

}
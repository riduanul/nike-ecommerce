import React from 'react'
import {ChevronDoubleLeftIcon, XMarkIcon} from '@heroicons/react/24/solid'

const CartCount = () => {
  return (
   <>
    <div>
        <div>
            <div>
                <ChevronDoubleLeftIcon className=""/>
            </div>
            <div> 
                <h1>Your Cart <span>(Items)</span></h1>
            </div>
        </div>
        <div>
            <button type='button' className=''>
                <XMarkIcon className=""/>
            </button>
        </div>
    </div>
   </>
  )
}

export default CartCount
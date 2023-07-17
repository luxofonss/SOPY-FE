'use client'

import { Carousel } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function Slider({ data }) {
  console.log(data)
  return (
    <Carousel>
      {data?.map((img) => (
        <Link key={img.link} to={img.link}>
          <img className='object-cover' alt='bg' src={img.image} />
        </Link>
      ))}
    </Carousel>
  )
}

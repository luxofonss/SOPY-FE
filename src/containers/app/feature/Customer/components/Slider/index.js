'use client'

import { Carousel } from 'flowbite-react'
import { Link } from 'react-router-dom'

export default function Slider({ data }) {
  return (
    <Carousel>
      {data?.map((img) => (
        <Link key={img.link} to={img.link}>
          <img alt='bg' src={img.image} />
        </Link>
      ))}
    </Carousel>
  )
}

import { getEditorDefaults } from '@pqina/pintura'
import { PinturaEditor } from '@pqina/react-pintura'
import { useState } from 'react'
import AppButton from '../AppButton'
import AppModal from '../Modal'

import '@pqina/pintura/pintura.css'

const ImageCrop = ({ image, openRef, handleConfirm, closeModalRef }) => {
  const [viewImage, setViewImage] = useState(image)
  console.log('viewImage:: ', viewImage)
  return (
    <AppModal closeRef={closeModalRef} openRef={openRef}>
      <div className='w-96 h-[400px] bg-neutral-0 p-4 rounded-lg'>
        <PinturaEditor
          imageCropAspectRatio={1}
          {...getEditorDefaults()}
          src={viewImage}
          onProcess={(res) => {
            handleConfirm(res.dest)
            setViewImage(URL.createObjectURL(res.dest))
          }}
        />
        <div className='flex gap-4 justify-center'>
          <AppButton className='py-1 px-2 text-sm' onClick={() => closeModalRef.current.closeModal()}>
            Đóng
          </AppButton>
          <AppButton className='p-0'>
            <label className='py-1 px-2 text-sm' htmlFor='upload-avatar'>
              Tải ảnh lên
            </label>
          </AppButton>
        </div>
        <input
          className='hidden'
          id='upload-avatar'
          type='file'
          onChange={(e) => {
            if (e.target.files[0]) setViewImage(URL.createObjectURL(e.target.files[0]))
            console.log(e.target.files[0])
          }}
        />
      </div>
    </AppModal>
  )
}

export default ImageCrop

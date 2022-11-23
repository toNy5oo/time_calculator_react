import { Button } from 'antd'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DropdownButton = ({icon}) => {
  return (
   <Button shape={'circle'} size='large' className='mx-1'><FontAwesomeIcon icon={icon}></FontAwesomeIcon></Button>
  )
}

export default DropdownButton
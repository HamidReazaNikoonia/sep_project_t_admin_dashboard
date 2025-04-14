import React, { memo, Suspense } from 'react'

import Box from '../../components/Box'
import Spinner from '../../components/Spinner'
import logo from '../../logo.svg'
import Button from '@mui/material/Button';

import Counter from './Counter'
import DocList from './DocList'
import styles from './index.module.css'

interface Props {}

const Index: React.FC<Props> = memo(() => {
  return (
    <>
      <Box>
        
      </Box>
      
      <Box>
        <Suspense fallback={<Spinner size="xl" />}>
          {/* <DocList /> */}
        </Suspense>
      </Box>
    </>
  )
})
Index.displayName = 'Index'

export default Index

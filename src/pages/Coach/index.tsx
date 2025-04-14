import React, { memo, Suspense } from 'react'

import Box from '../../components/Box'
import Spinner from '../../components/Spinner'

import styles from './index.module.css'
import { Button } from '@mui/material'
import { Link } from 'react-router'

interface Props { }

const CoachPage: React.FC<Props> = memo(() => {
  return (
    <>
      <div className='flex justify-end' >
        <div className='flex '>
          <Link to="/coach/coach-course-program">
            <Button variant="contained">
              مدیریت دوره مربیان
            </Button>
          </Link>
        </div>

      </div>

      <Box>
        <Suspense fallback={<Spinner size="xl" />}>
          {/* <DocList /> */}
        </Suspense>
      </Box>
    </>
  )
})
CoachPage.displayName = 'CoachPage'

export default CoachPage

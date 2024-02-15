import Box from '@mui/material/Box'
import ProtectedRoute from 'src/utils/context/protected_context'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const IndexPage = () => {
    return <Box></Box>
}

IndexPage.getLayout = (page: ReactNode) => (
    <ProtectedRoute>
      <BlankLayout>{page}</BlankLayout>
    </ProtectedRoute>
  )
  

export default IndexPage;
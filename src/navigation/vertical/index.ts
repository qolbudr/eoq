// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import PaperRollOutline from 'mdi-material-ui/PaperRollOutline'
import Logout from 'mdi-material-ui/Logout'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import useFirebaseAuth from 'src/utils/firebase/auth'

const navigation = (): VerticalNavItemsType => {
  const auth = useFirebaseAuth();
  return [
    {
      sectionTitle: 'Bahan'
    },
    {
      icon: CubeOutline,
      title: 'Stok Bahan',
      path: '/stok'
    },
    {
      sectionTitle: 'EOQ'
    },
    {
      title: 'Data EOQ',
      icon: Table,
      path: '/eoq'
    },
    {
      title: 'Laporan Hasil EOQ',
      icon: PaperRollOutline,
      path: '/laporan'
    },
    {
      sectionTitle: 'Lainnya'
    },
    {
      icon: Logout,
      title: 'Keluar',
      onClick: () => auth.logout(),
      path: '#'
    }
  ]
}

export default navigation

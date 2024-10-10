import AddNewStaff from "../components/AddNewStaff"
import Layout from "../components/Layout"
import ManageStaff from "../components/ManageStaff"
import TableGrid from "../components/TableGrid"
const BranchStaff = () => {
  return (
    <Layout>
        {/* <ManageStaff/> */}
        <AddNewStaff/>
       <div className='main'>
            <h2>Manage Staff</h2>
            <TableGrid />
        </div>
    </Layout>
  )
}

export default BranchStaff

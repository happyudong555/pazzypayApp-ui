import dynamic from "next/dynamic"
const Inactive_profile = dynamic(()=> import('../components/inactive_profile'), {ssr: false});
const UserInactive = ()=> {
    return (
        <Inactive_profile/>
    )
}
export default UserInactive;
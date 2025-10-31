import { useState } from "react";

import { Check, Plus, Power } from 'lucide-react';
import { ReusableTable } from "../../../input/index.js"
import { useGetuserdetailQuery } from "../../../redux/service/user.js";

const UserDetails =()=>{

    const[form,setForm]=useState(false)
    // const [allData,setallData]=useState("")
    const { data: allData, isLoading, isFetching } = useGetuserdetailQuery();
    console.log("allldata",allData);
    

    const ACTIVE = (
    <div className="bg-gradient-to-r from-green-200 to-green-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-green-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
      <Power size={10} />
    </div>
  );
  const INACTIVE = (
    <div className="bg-gradient-to-r from-red-200 to-red-500 inline-flex items-center justify-center rounded-full border-2 w-6 border-red-500 shadow-lg text-white hover:scale-110 transition-transform duration-300">
      <Power size={10} />
    </div>
  );

    const columns = [
    {
      header: "S.No",
      accessor: (item, index) => index + 1,
      className: "font-medium text-gray-900 w-12  text-center",
    },

    {
      header: "User Name",
      accessor: (item) => item?.username,
      //   cellClass: () => "font-medium  text-gray-900",
      className: "font-medium text-gray-900 text-center uppercase w-96",
    },

    {
      header: "Status",
      accessor: (item) => (item.active ? ACTIVE : INACTIVE),
      //   cellClass: () => "font-medium text-gray-900",
      className: "font-medium text-gray-900 text-center uppercase w-16",
    },

  ];

    const onNew =()=>{
        setForm(true);

    }
const handleView=()=>{

}
const handleEdit=()=>{
    
}
const deleteData=()=>{
    
}
    return(
        <div>
            {/* <div className="w-full flex bg-white p-1 justify-between  items-center">
        <h5 className="text-2xl font-bold text-gray-800">Yarn  Master</h5>
        <div className="flex items-center">
          <button
            onClick={() => {
              setForm(true);
              onNew();
            }}
            className="bg-white border  border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white text-sm px-4 py-1 rounded-md shadow transition-colors duration-200 flex items-center gap-2"
          >
            + Add New Yarn
          </button>
        </div>
      </div> */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-3">
        <ReusableTable
          columns={columns}
          data={allData}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={deleteData}
          itemsPerPage={10}
        />
      </div>
        </div>
    )



}
export default UserDetails
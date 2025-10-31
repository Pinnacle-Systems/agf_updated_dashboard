
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAddRoleMutation } from "../../redux/service/Rolemaster";

const RolePermission = () => {
  const [Role, setRole] = useState({
    
    rolename: '',
    active: true
  });
 
  const [addRole, { isLoading }] = useAddRoleMutation();

  useEffect(()=>{
// console.log("userId");

  },[Role])

  const handleSubmit =async(e)=>{
    e.preventDefault()
    console.log(Role);
    try{

      const response = await addRole(Role).unwrap(); 
      toast.success("Role created successfully!");
      console.log("Response:", response);
      setRole({rolename:"",
        active:true
      })
    }
    catch (err) {
      toast.error(`Error creating role: ${err.message}`);
      console.error("Error:", err);
    }

    
  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRole((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


    return (
        <>
  <form onSubmit={handleSubmit} >
            <div className="w-full p-5 rounded-lg bg-white shadow m-1">
                {/* <h3>ROLE INFO</h3> */}
                  <h2 className="text-xl font-bold border-b pb-2 mb-4  ">New Role</h2>
                <div className=" flex container m-1 gap-10 font-bold">
                   {/* <div>
                    <label className="font-bold">
                       ID
                        <input type="number" name="id" value={Role.id} onChange={handleChange} className="rounded ml-2"/>
                    </label>
                  </div> */}
                  <div>
                    <label className="font-bold">
                        Role Name
                        <input type="text" name="rolename" value={Role.rolename} onChange={handleChange} className="rounded ml-2"/>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="">
                        <input type="checkbox" name="active" value={Role.active} onChange={handleChange} className="" />
                        Active
                    </label>
                  </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-1">Submit</button>
                </div>
            </div>
            {/* <div className="h-[350px] bg-white rounded-lg shadow-md mt-2 p-1">
                <div className="overflow-x-auto h-full">
                    <table className="min-w-full bg-white border border-gray-200 text-xs">
                        <thead className="sticky top-0 bg-gray-50">
                            <tr>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            Pages
                                </th>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            All
                                </th>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            Edit
                                </th>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            Edit
                                </th>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            Edit
                                </th>
                                <th
                                    className="py-1 px-2 border  text-left font-medium text-black uppercase tracking-wider cursor-pointer">
                                            Edit
                                </th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div> */}
            </form>




        </>

    )
}

export default RolePermission


// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Typography
// } from '@mui/material';

// const UserForm = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     employee: '',
//     role: '',
//     branch: '',
//     store: '',
//     active: true
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   return (
//     <Box sx={{ width: 400, p: 3, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
//       <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2, color: '#3f51b5' }}>
//         USER INFO
//       </Typography>

//       <TextField
//         label="USERNAME *"
//         name="username"
//         value={formData.username}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//       />

//       <TextField
//         label="PASSWORD *"
//         type="password"
//         name="password"
//         value={formData.password}
//         onChange={handleChange}
//         fullWidth
//         margin="normal"
//       />

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Employee *</InputLabel>
//         <Select
//           name="employee"
//           value={formData.employee}
//           onChange={handleChange}
//           label="Employee *"
//         >
//           <MenuItem value="KM/1001/RIZWAN BASHA/DOCTOR">KM/1001/RIZWAN BASHA/DOCTOR</MenuItem>
//           {/* Add more employees as needed */}
//         </Select>
//       </FormControl>

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Role *</InputLabel>
//         <Select
//           name="role"
//           value={formData.role}
//           onChange={handleChange}
//           label="Role *"
//         >
//           <MenuItem value="ADMIN">ADMIN</MenuItem>
//           <MenuItem value="USER">USER</MenuItem>
//           {/* Add more roles as needed */}
//         </Select>
//       </FormControl>

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Branch</InputLabel>
//         <Select
//           name="branch"
//           value={formData.branch}
//           onChange={handleChange}
//           label="Branch"
//         >
//           <MenuItem value="">Select...</MenuItem>
//           <MenuItem value="Branch1">Branch 1</MenuItem>
//           <MenuItem value="Branch2">Branch 2</MenuItem>
//         </Select>
//       </FormControl>

//       <FormControl fullWidth margin="normal">
//         <InputLabel>Store</InputLabel>
//         <Select
//           name="store"
//           value={formData.store}
//           onChange={handleChange}
//           label="Store"
//         >
//           <MenuItem value="Store1">Store 1</MenuItem>
//           <MenuItem value="Store2">Store 2</MenuItem>
//         </Select>
//       </FormControl>

//       <FormControlLabel
//         control={
//           <Checkbox
//             checked={formData.active}
//             onChange={handleChange}
//             name="active"
//           />
//         }
//         label="Active"
//       />
//     </Box>
//   );
// };

// export default UserForm;

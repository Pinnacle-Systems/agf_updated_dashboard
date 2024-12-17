import * as React from "react";
import { useEffect } from "react";
import { Modal } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useGetUsersQuery } from "../../redux/service/user";
import Form from "../form";

export default function OutlinedCard() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    refetch();
  };

  const { data: userDt, refetch } = useGetUsersQuery();
  const userData = userDt?.data || [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const groupedUsers = userData.reduce((acc, user) => {
    if (!acc[user.userName]) {
      acc[user.userName] = {
        userName: user.userName,
        roles: [],
      };
    }
    if (user.role && !acc[user.userName].roles.includes(user.role)) {
      acc[user.userName].roles.push(user.role);
    }
    return acc;
  }, {});

  console.log(groupedUsers, 'data');
  const uniqueRoles = [...new Set(userData.map(user => user.role).filter(role => role))];

  return (
    <div className="w-full">
      <div className="flex w-full justify-center items-center">
        <div className="flex w-full justify-center text-white">
          <h2 className="text-lg select-clr rounded">User Details</h2>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleOpen}
            className="flex items-center justify-center h-8 bg-blue-500 text-white rounded hover:bg-blue-700 shadow-md"
          >
            <span className="px-1">Add </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="side-bar uppercase text-sm leading-normal text-white border">
                <th className="py-2 px-6 text-left border border-white">Username</th>
                {uniqueRoles.map((role, index) => (
                  <th key={index} className="py-3 px-6 text-center border border-white">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {Object.values(groupedUsers).map((user, index) => (
                <tr key={index} className={`border border-gray-300 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-3 px-6 text-left whitespace-nowrap">{user.userName}</td>
                  {uniqueRoles.map((role, idx) => (
                    <td key={idx} className="py-3 px-6 text-center border border-gray-300">
                      {user.roles.includes(role) ? "✓" : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded shadow-lg">
            <Form onClose={handleClose} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
